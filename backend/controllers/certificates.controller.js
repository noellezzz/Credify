import { InferenceClient } from "@huggingface/inference";
import { supabaseAdmin } from "../services/supabase.service.js";
import cloudinary from "cloudinary";
import crypto from "crypto";

const client = new InferenceClient(process.env.HF_TOKEN);

// Configure Cloudinary - put your cloud name, api key, secret in env vars
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const base64ToBuffer = (base64String) => {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  let data = base64String;
  if (matches) {
    data = matches[2];
  }
  return Buffer.from(data, "base64");
};

export const uploadBase64 = async (req, res) => {
  try {
    const { userId, fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "No file data received" });
    }

    // Convert base64 to Buffer
    const buffer = base64ToBuffer(fileData);
    const fileName = `certificate_${userId || "anonymous"}_${Date.now()}`;

    // Determine file type from base64 data
    const mimeType = fileData.match(/^data:([A-Za-z-+/]+);base64,/)?.[1];
    const isPdf = mimeType === "application/pdf";

    // Upload to Cloudinary
    const cloudinaryUpload = await cloudinary.v2.uploader.upload(fileData, {
      public_id: `certificates/${fileName}`,
      folder: "certificates",
      resource_type: isPdf ? "raw" : "image", // Use 'raw' for PDFs
      overwrite: false,
    });

    if (!cloudinaryUpload.secure_url) {
      return res.status(500).json({ error: "Failed to upload to Cloudinary" });
    }

    const imageUrl = cloudinaryUpload.secure_url;
    console.log("Cloudinary URL:", imageUrl);

    // For PDFs, we need to convert to image first for OCR
    let ocrImageUrl = imageUrl;
    if (isPdf) {
      // Convert PDF to image using Cloudinary transformation
      ocrImageUrl = cloudinary.v2.url(cloudinaryUpload.public_id, {
        format: "jpg",
        page: 1, // First page
        resource_type: "image",
      });
    }

    // Save record to certificates table
    const { data: certificate, error: insertError } = await supabaseAdmin
      .from("certificates")
      .insert([
        {
          certificate_hash: fileName,
          certificate_name: fileName,
          user_id: userId || null,
          image_url: imageUrl,
          file_type: isPdf ? "pdf" : "image",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res
        .status(500)
        .json({ error: "Failed to save certificate record" });
    }

    // Extract text content using OCR
    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract and return only the text content from this ${
                isPdf ? "PDF document" : "image"
              }. Return the text as plain text without any formatting, JSON structure, or additional commentary. Just the raw text content.`,
            },
            {
              type: "image_url",
              image_url: {
                url: ocrImageUrl,
              },
            },
          ],
        },
      ],
    });

    const ocrContent = chatCompletion.choices[0].message.content;

    // Update certificate with OCR content
    const { error: updateError } = await supabaseAdmin
      .from("certificates")
      .update({ ocr_content: ocrContent })
      .eq("id", certificate.id);

    if (updateError) {
      console.error("Failed to update OCR content:", updateError);
    }

    // Generate both hashes
    const crypto = await import("crypto");

    // File hash (hash of the actual file buffer)
    const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Content hash (hash of OCR extracted content)
    const contentHash = crypto
      .createHash("sha256")
      .update(ocrContent, "utf8")
      .digest("hex");

    // Store both hashes in the hash table
    const { data: hashRecord, error: hashInsertError } = await supabaseAdmin
      .from("hash")
      .insert([
        {
          file_hash: fileHash,
          content_hash: contentHash,
          user_id: userId || null,
          certificate_id: certificate.id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (hashInsertError) {
      console.error("Hash insert error:", hashInsertError);
      // Don't fail the whole request, just log the error
    }

    console.log("File uploaded and processed:");
    console.log("- File hash:", fileHash);
    console.log("- Content hash:", contentHash);
    console.log("- OCR content:", ocrContent.substring(0, 100) + "...");

    return res.json({
      message: "File uploaded, processed, and hashes generated successfully",
      certificateId: certificate.id,
      imageUrl,
      fileType: isPdf ? "pdf" : "image",
      fileHash,
      contentHash,
      ocrContent,
      hashId: hashRecord?.id,
    });
  } catch (error) {
    console.error("uploadBase64 error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getOcrContent = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({
        error: "Certificate ID is required",
      });
    }

    // Get certificate record from database
    const { data: certificate, error: fetchError } = await supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("id", certificateId)
      .single();

    if (fetchError || !certificate) {
      return res.status(404).json({
        error: "Certificate not found",
      });
    }

    // If you have stored OCR content in the certificates table, return it
    // Otherwise, re-process the image to get OCR content
    if (certificate.ocr_content) {
      return res.json({
        message: "OCR content retrieved successfully",
        certificateId: certificate.id,
        ocrContent: certificate.ocr_content,
        imageUrl: certificate.image_url,
        createdAt: certificate.created_at,
      });
    }

    // If no stored OCR content, re-process the image
    if (!certificate.image_url) {
      return res.status(400).json({
        error: "No image URL found for this certificate",
      });
    }

    // Call Qwen inference with the stored image URL
    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract and return only the text content from this image. Return the text as plain text without any formatting or JSON structure.`,
            },
            {
              type: "image_url",
              image_url: {
                url: certificate.image_url,
              },
            },
          ],
        },
      ],
    });

    const ocrContent = chatCompletion.choices[0].message.content;

    // Update the certificate record with OCR content
    const { error: updateError } = await supabaseAdmin
      .from("certificates")
      .update({ ocr_content: ocrContent })
      .eq("id", certificateId);

    if (updateError) {
      console.error("Failed to update OCR content:", updateError);
    }

    return res.json({
      message: "OCR content extracted and retrieved successfully",
      certificateId: certificate.id,
      ocrContent,
      imageUrl: certificate.image_url,
      createdAt: certificate.created_at,
    });
  } catch (error) {
    console.error("getOcrContent error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get OCR content by certificate hash
 */
export const getOcrContentByHash = async (req, res) => {
  try {
    const { certificateHash } = req.params;

    if (!certificateHash) {
      return res.status(400).json({
        error: "Certificate hash is required",
      });
    }

    // Get certificate record by hash
    const { data: certificate, error: fetchError } = await supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("certificate_hash", certificateHash)
      .single();

    if (fetchError || !certificate) {
      return res.status(404).json({
        error: "Certificate not found",
      });
    }

    // If you have stored OCR content, return it
    if (certificate.ocr_content) {
      return res.json({
        message: "OCR content retrieved successfully",
        certificateId: certificate.id,
        certificateHash: certificate.certificate_hash,
        ocrContent: certificate.ocr_content,
        imageUrl: certificate.image_url,
        createdAt: certificate.created_at,
      });
    }

    // If no stored OCR content, re-process the image
    if (!certificate.image_url) {
      return res.status(400).json({
        error: "No image URL found for this certificate",
      });
    }

    // Call Qwen inference with the stored image URL
    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract and return only the text content from this image. Return the text as plain text without any formatting or JSON structure.`,
            },
            {
              type: "image_url",
              image_url: {
                url: certificate.image_url,
              },
            },
          ],
        },
      ],
    });

    const ocrContent = chatCompletion.choices[0].message.content;

    // Update the certificate record with OCR content
    const { error: updateError } = await supabaseAdmin
      .from("certificates")
      .update({ ocr_content: ocrContent })
      .eq("id", certificate.id);

    if (updateError) {
      console.error("Failed to update OCR content:", updateError);
    }

    return res.json({
      message: "OCR content extracted and retrieved successfully",
      certificateId: certificate.id,
      certificateHash: certificate.certificate_hash,
      ocrContent,
      imageUrl: certificate.image_url,
      createdAt: certificate.created_at,
    });
  } catch (error) {
    console.error("getOcrContentByHash error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Generate SHA-256 hash from buffer data
 */
const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

/**
 * Generate SHA-256 hash from text content
 */
const generateContentHash = (content) => {
  return crypto.createHash("sha256").update(content, "utf8").digest("hex");
};

/**
 * Generate and store both file hash and content hash
 */
export const generateHashes = async (req, res) => {
  try {
    const { fileData, ocrContent, userId, certificateId } = req.body;

    if (!fileData || !ocrContent) {
      return res.status(400).json({
        error: "File data and OCR content are required",
      });
    }

    // Convert base64 to buffer for file hash
    const base64ToBuffer = (base64String) => {
      const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let data = base64String;
      if (matches) {
        data = matches[2];
      }
      return Buffer.from(data, "base64");
    };

    const fileBuffer = base64ToBuffer(fileData);

    // Generate file hash (hash of the actual file)
    const fileHash = generateFileHash(fileBuffer);

    // Generate content hash (hash of OCR extracted content)
    const contentHash = generateContentHash(ocrContent);

    console.log("Generated file hash:", fileHash);
    console.log("Generated content hash:", contentHash);

    // Store both hashes in the hash table
    const { data: hashRecord, error: insertError } = await supabaseAdmin
      .from("hash")
      .insert([
        {
          file_hash: fileHash,
          content_hash: contentHash,
          user_id: userId || null,
          certificate_id: certificateId || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (insertError) {
      console.error("Supabase hash insert error:", insertError);
      return res.status(500).json({
        error: "Failed to save hash records",
      });
    }

    return res.json({
      message: "Hashes generated and stored successfully",
      fileHash,
      contentHash,
      hashRecord: hashRecord[0],
    });
  } catch (error) {
    console.error("generateHashes error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Verify file integrity by comparing with stored hash
 */
export const verifyFileHash = async (req, res) => {
  try {
    const { fileData, hashId } = req.body;

    if (!fileData || !hashId) {
      return res.status(400).json({
        error: "File data and hash ID are required",
      });
    }

    // Get stored hash from database
    const { data: hashRecord, error: fetchError } = await supabaseAdmin
      .from("hash")
      .select("*")
      .eq("id", hashId)
      .single();

    if (fetchError || !hashRecord) {
      return res.status(404).json({
        error: "Hash record not found",
      });
    }

    // Convert base64 to buffer and generate hash
    const base64ToBuffer = (base64String) => {
      const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let data = base64String;
      if (matches) {
        data = matches[2];
      }
      return Buffer.from(data, "base64");
    };

    const fileBuffer = base64ToBuffer(fileData);
    const currentFileHash = generateFileHash(fileBuffer);

    const isValid = currentFileHash === hashRecord.file_hash;

    return res.json({
      message: "File verification completed",
      isValid,
      storedHash: hashRecord.file_hash,
      currentHash: currentFileHash,
    });
  } catch (error) {
    console.error("verifyFileHash error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Verify content integrity by comparing with stored hash
 */
export const verifyContentHash = async (req, res) => {
  try {
    const { content, hashId } = req.body;

    if (!content || !hashId) {
      return res.status(400).json({
        error: "Content and hash ID are required",
      });
    }

    // Get stored hash from database
    const { data: hashRecord, error: fetchError } = await supabaseAdmin
      .from("hash")
      .select("*")
      .eq("id", hashId)
      .single();

    if (fetchError || !hashRecord) {
      return res.status(404).json({
        error: "Hash record not found",
      });
    }

    // Generate hash from current content
    const currentContentHash = generateContentHash(content);

    const isValid = currentContentHash === hashRecord.content_hash;

    return res.json({
      message: "Content verification completed",
      isValid,
      storedHash: hashRecord.content_hash,
      currentHash: currentContentHash,
    });
  } catch (error) {
    console.error("verifyContentHash error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
