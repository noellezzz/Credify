import { InferenceClient } from "@huggingface/inference";
import { supabaseAdmin } from "../services/supabase.service.js";
import cloudinary from "cloudinary";
import crypto from "crypto";

const client = new InferenceClient(process.env.HF_TOKEN);

// Configure Cloudinary
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

/**
 * Validate file type and size
 */
const validateFile = (mimeType, buffer) => {
  const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/tiff",
  ];

  const allowedPdfTypes = ["application/pdf"];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!mimeType) {
    throw new Error("Invalid file format: MIME type not detected");
  }

  const isImage = allowedImageTypes.includes(mimeType);
  const isPdf = allowedPdfTypes.includes(mimeType);

  if (!isImage && !isPdf) {
    throw new Error(
      `Unsupported file type: ${mimeType}. Only images (JPEG, PNG, GIF, WebP, BMP, TIFF) and PDF files are allowed.`
    );
  }

  if (buffer.length > maxFileSize) {
    throw new Error(
      `File too large: ${(buffer.length / 1024 / 1024).toFixed(
        2
      )}MB. Maximum size is 10MB.`
    );
  }

  return { isImage, isPdf };
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

export const uploadBase64 = async (req, res) => {
  try {
    const { userId, fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ error: "No file data received" });
    }

    // Convert base64 to Buffer
    const buffer = base64ToBuffer(fileData);
    const fileName = `certificate_${userId || "anonymous"}_${Date.now()}`;

    // Determine file type and mime type from base64 data
    const mimeType = fileData.match(/^data:([A-Za-z-+/]+);base64,/)?.[1];

    // Validate file type and size
    try {
      const { isImage, isPdf } = validateFile(mimeType, buffer);

      // Generate file hash early
      const fileHash = generateFileHash(buffer);

      // Upload to Cloudinary with appropriate settings
      const uploadOptions = {
        public_id: `certificates/${fileName}`,
        folder: "certificates",
        overwrite: false,
      };

      if (isPdf) {
        // Upload PDF as image for automatic conversion to JPG
        uploadOptions.resource_type = "image";
        uploadOptions.format = "jpg";
        uploadOptions.page = 1; // Convert only first page
        uploadOptions.quality = "auto";
      } else {
        uploadOptions.resource_type = "image";
        // Auto-optimize images
        uploadOptions.quality = "auto";
        uploadOptions.fetch_format = "auto";
      }

      const cloudinaryUpload = await cloudinary.v2.uploader.upload(
        fileData,
        uploadOptions
      );

      if (!cloudinaryUpload.secure_url) {
        return res
          .status(500)
          .json({ error: "Failed to upload to Cloudinary" });
      }

      const imageUrl = cloudinaryUpload.secure_url;
      console.log("Cloudinary URL:", imageUrl);

      // For PDFs, create image URL for OCR (convert first page to image)
      let ocrImageUrl = imageUrl;
      if (isPdf) {
        ocrImageUrl = cloudinary.v2.url(cloudinaryUpload.public_id, {
          quality: "auto",
          width: 2000,
          crop: "limit",
        });
      }

      console.log("OCR Image URL:", ocrImageUrl);

      // Extract text content using OCR with improved prompts
      const ocrPrompt = isPdf
        ? `Extract and return only the text content from this PDF document. Preserve the structure and formatting as much as possible. Return the text as plain text without any JSON structure or additional commentary.`
        : `Extract and return only the text content from this image/certificate. Preserve the structure and formatting as much as possible. Return the text as plain text without any JSON structure or additional commentary.`;

      const chatCompletion = await client.chatCompletion({
        provider: "fireworks-ai",
        model: "Qwen/Qwen2.5-VL-32B-Instruct",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: ocrPrompt,
              },
              {
                type: "image_url",
                image_url: { url: ocrImageUrl },
              },
            ],
          },
        ],
      });

      const ocrContent = chatCompletion.choices[0].message.content;
      const contentHash = generateContentHash(ocrContent);

      // Save complete record to certificates table
      const { data: certificate, error: insertError } = await supabaseAdmin
        .from("certificates")
        .insert([
          {
            certificate_hash: fileName,
            certificate_name: fileName,
            user_id: userId || null,
            image_url: imageUrl,
            file_type: isPdf ? "pdf" : "image",
            ocr_content: ocrContent,
            file_hash: fileHash,
            content_hash: contentHash,
            file_size: buffer.length,
            mime_type: mimeType,
            cloudinary_public_id: cloudinaryUpload.public_id,
            verification_status: "verified",
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

      // Also store in hash table for backward compatibility
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
      console.log("- Certificate ID:", certificate.id);
      console.log("- File type:", isPdf ? "PDF" : "Image");
      console.log(
        "- File size:",
        `${(buffer.length / 1024 / 1024).toFixed(2)}MB`
      );
      console.log("- MIME type:", mimeType);
      console.log("- File hash:", fileHash);
      console.log("- Content hash:", contentHash);
      console.log("- OCR content:", ocrContent.substring(0, 100) + "...");

      return res.json({
        message: "File uploaded, processed, and hashes generated successfully",
        certificateId: certificate.id,
        imageUrl,
        fileType: isPdf ? "pdf" : "image",
        mimeType,
        fileSize: buffer.length,
        fileHash,
        contentHash,
        ocrContent,
        hashId: hashRecord?.id,
        certificate: {
          id: certificate.id,
          certificateHash: certificate.certificate_hash,
          imageUrl: certificate.image_url,
          fileType: certificate.file_type,
          fileHash: certificate.file_hash,
          contentHash: certificate.content_hash,
          ocrContent: certificate.ocr_content,
          fileSize: certificate.file_size,
          mimeType: certificate.mime_type,
          verificationStatus: certificate.verification_status,
          createdAt: certificate.created_at,
        },
      });
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }
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
    if (certificate.ocr_content) {
      return res.json({
        message: "OCR content retrieved successfully",
        certificateId: certificate.id,
        ocrContent: certificate.ocr_content,
        imageUrl: certificate.image_url,
        fileType: certificate.file_type,
        mimeType: certificate.mime_type,
        createdAt: certificate.created_at,
        certificate: certificate,
      });
    }

    // If no stored OCR content, re-process the file
    if (!certificate.image_url) {
      return res.status(400).json({
        error: "No image URL found for this certificate",
      });
    }

    // Determine OCR URL based on file type
    let ocrImageUrl = certificate.image_url;
    const isPdf =
      certificate.file_type === "pdf" ||
      certificate.mime_type === "application/pdf";

    if (isPdf && certificate.cloudinary_public_id) {
      // If the PDF was uploaded as image, use direct URL
      ocrImageUrl = cloudinary.v2.url(certificate.cloudinary_public_id, {
        quality: "auto",
        width: 2000,
        crop: "limit",
      });
    }

    // Improved OCR prompt based on file type
    const ocrPrompt = isPdf
      ? `Extract and return only the text content from this PDF document. Preserve the structure and formatting as much as possible. Return the text as plain text without any JSON structure or additional commentary.`
      : `Extract and return only the text content from this image/certificate. Preserve the structure and formatting as much as possible. Return the text as plain text without any JSON structure or additional commentary.`;

    // Call Qwen inference with the appropriate image URL
    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: ocrPrompt,
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

    // Update the certificate record with OCR content
    const { error: updateError } = await supabaseAdmin
      .from("certificates")
      .update({
        ocr_content: ocrContent,
        content_hash: generateContentHash(ocrContent),
        updated_at: new Date().toISOString(),
      })
      .eq("id", certificateId);

    if (updateError) {
      console.error("Failed to update OCR content:", updateError);
    }

    return res.json({
      message: "OCR content extracted and retrieved successfully",
      certificateId: certificate.id,
      ocrContent,
      imageUrl: certificate.image_url,
      fileType: certificate.file_type,
      mimeType: certificate.mime_type,
      createdAt: certificate.created_at,
    });
  } catch (error) {
    console.error("getOcrContent error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
        certificate: certificate,
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
      .update({
        ocr_content: ocrContent,
        content_hash: generateContentHash(ocrContent),
        updated_at: new Date().toISOString(),
      })
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

export const generateHashes = async (req, res) => {
  try {
    const { fileData, ocrContent, userId, certificateId } = req.body;

    if (!fileData || !ocrContent) {
      return res.status(400).json({
        error: "File data and OCR content are required",
      });
    }

    const fileBuffer = base64ToBuffer(fileData);
    const fileHash = generateFileHash(fileBuffer);
    const contentHash = generateContentHash(ocrContent);

    console.log("Generated file hash:", fileHash);
    console.log("Generated content hash:", contentHash);

    // Update certificate table with hashes if certificateId is provided
    if (certificateId) {
      const { error: updateError } = await supabaseAdmin
        .from("certificates")
        .update({
          file_hash: fileHash,
          content_hash: contentHash,
          updated_at: new Date().toISOString(),
        })
        .eq("id", certificateId);

      if (updateError) {
        console.error("Failed to update certificate with hashes:", updateError);
      }
    }

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

export const verifyFileHash = async (req, res) => {
  try {
    const { fileData, hashId, certificateId } = req.body;

    if (!fileData || (!hashId && !certificateId)) {
      return res.status(400).json({
        error: "File data and either hash ID or certificate ID are required",
      });
    }

    let storedHash;
    let certificateInfo = null;

    if (certificateId) {
      // Get hash from certificates table
      const { data: certificate, error: fetchError } = await supabaseAdmin
        .from("certificates")
        .select("*")
        .eq("id", certificateId)
        .single();

      if (fetchError || !certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      storedHash = certificate.file_hash;
      certificateInfo = certificate;
    } else {
      // Get stored hash from hash table
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

      storedHash = hashRecord.file_hash;
    }

    if (!storedHash) {
      return res.status(400).json({ error: "No stored file hash found" });
    }

    const fileBuffer = base64ToBuffer(fileData);
    const currentFileHash = generateFileHash(fileBuffer);

    const isValid = currentFileHash === storedHash;

    // Log verification attempt if certificateId is provided
    if (certificateId) {
      try {
        await supabaseAdmin.from("verification_logs").insert([
          {
            certificate_id: certificateId,
            verification_type: "file",
            is_valid: isValid,
            stored_hash: storedHash,
            provided_hash: currentFileHash,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (logError) {
        console.warn("Failed to log verification:", logError);
      }
    }

    return res.json({
      message: "File verification completed",
      isValid,
      storedHash,
      currentHash: currentFileHash,
      certificate: certificateInfo
        ? {
            id: certificateInfo.id,
            name: certificateInfo.certificate_name,
            createdAt: certificateInfo.created_at,
          }
        : null,
    });
  } catch (error) {
    console.error("verifyFileHash error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyContentHash = async (req, res) => {
  try {
    const { content, hashId, certificateId } = req.body;

    if (!content || (!hashId && !certificateId)) {
      return res.status(400).json({
        error: "Content and either hash ID or certificate ID are required",
      });
    }

    let storedHash;
    let certificateInfo = null;

    if (certificateId) {
      // Get hash from certificates table
      const { data: certificate, error: fetchError } = await supabaseAdmin
        .from("certificates")
        .select("*")
        .eq("id", certificateId)
        .single();

      if (fetchError || !certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      storedHash = certificate.content_hash;
      certificateInfo = certificate;
    } else {
      // Get stored hash from hash table
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

      storedHash = hashRecord.content_hash;
    }

    if (!storedHash) {
      return res.status(400).json({ error: "No stored content hash found" });
    }

    const currentContentHash = generateContentHash(content);

    const isValid = currentContentHash === storedHash;

    // Log verification attempt if certificateId is provided
    if (certificateId) {
      try {
        await supabaseAdmin.from("verification_logs").insert([
          {
            certificate_id: certificateId,
            verification_type: "content",
            is_valid: isValid,
            stored_hash: storedHash,
            provided_hash: currentContentHash,
            created_at: new Date().toISOString(),
          },
        ]);
      } catch (logError) {
        console.warn("Failed to log verification:", logError);
      }
    }

    return res.json({
      message: "Content verification completed",
      isValid,
      storedHash,
      currentHash: currentContentHash,
      certificate: certificateInfo
        ? {
            id: certificateInfo.id,
            name: certificateInfo.certificate_name,
            createdAt: certificateInfo.created_at,
          }
        : null,
    });
  } catch (error) {
    console.error("verifyContentHash error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Additional helper endpoints
export const getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID is required" });
    }

    const { data: certificate, error: fetchError } = await supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("id", certificateId)
      .single();

    if (fetchError || !certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    return res.json({
      message: "Certificate retrieved successfully",
      certificate,
    });
  } catch (error) {
    console.error("getCertificate error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const { data: certificates, error: fetchError } = await supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (fetchError) {
      console.error("Fetch certificates error:", fetchError);
      return res.status(500).json({ error: "Failed to fetch certificates" });
    }

    return res.json({
      message: "Certificates retrieved successfully",
      certificates,
      count: certificates.length,
    });
  } catch (error) {
    console.error("getUserCertificates error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Add this to your certificates.controller.js

export const getAllCertificates = async (req, res) => {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = "created_at",
      sortOrder = "desc",
      fileType,
      verificationStatus,
    } = req.query;

    let query = supabaseAdmin.from("certificates").select("*");

    // Add filters if provided
    if (fileType) {
      query = query.eq("file_type", fileType);
    }

    if (verificationStatus) {
      query = query.eq("verification_status", verificationStatus);
    }

    // Add sorting
    const ascending = sortOrder.toLowerCase() === "asc";
    query = query.order(sortBy, { ascending });

    // Add pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: certificates, error: fetchError } = await query;

    if (fetchError) {
      console.error("Fetch all certificates error:", fetchError);
      return res.status(500).json({ error: "Failed to fetch certificates" });
    }

    // Get total count for pagination
    const { count, error: countError } = await supabaseAdmin
      .from("certificates")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.warn("Failed to get total count:", countError);
    }

    return res.json({
      message: "All certificates retrieved successfully",
      certificates,
      count: certificates.length,
      totalCount: count || 0,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: certificates.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("getAllCertificates error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCertificateStats = async (req, res) => {
  try {
    // Get overall statistics
    const { data: allCerts, error: allError } = await supabaseAdmin
      .from("certificates")
      .select("file_type, verification_status, file_size");

    if (allError) {
      console.error("Get stats error:", allError);
      return res.status(500).json({ error: "Failed to fetch statistics" });
    }

    const stats = {
      total: allCerts.length,
      byFileType: {},
      byVerificationStatus: {},
      totalFileSize: 0,
    };

    allCerts.forEach((cert) => {
      // Count by file type
      stats.byFileType[cert.file_type] =
        (stats.byFileType[cert.file_type] || 0) + 1;

      // Count by verification status
      stats.byVerificationStatus[cert.verification_status] =
        (stats.byVerificationStatus[cert.verification_status] || 0) + 1;

      // Sum file sizes
      stats.totalFileSize += cert.file_size || 0;
    });

    return res.json({
      message: "Certificate statistics retrieved successfully",
      stats,
    });
  } catch (error) {
    console.error("getCertificateStats error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const revokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID is required" });
    }

    // Fetch certificate first
    const { data: certificate, error: fetchError } = await supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("id", certificateId)
      .single();

    if (fetchError || !certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    if (certificate.revoked) {
      return res.status(400).json({ error: "Certificate is already revoked" });
    }

    // Update certificate to set revoked = true
    const { error: updateError } = await supabaseAdmin
      .from("certificates")
      .update({
        revoked: true,
        revoked_at: new Date().toISOString(),
      })
      .eq("id", certificateId);

    if (updateError) {
      console.error("Failed to revoke certificate:", updateError);
      return res.status(500).json({ error: "Failed to revoke certificate" });
    }

    return res.json({
      message: "Certificate revoked successfully",
      certificateId,
      revokedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("revokeCertificate error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const unrevokeCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;

    if (!certificateId) {
      return res.status(400).json({ error: "Certificate ID is required" });
    }

    // Fetch certificate first
    const { data: certificate, error: fetchError } = await supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("id", certificateId)
      .single();

    if (fetchError || !certificate) {
      return res.status(404).json({ error: "Certificate not found" });
    }

    if (!certificate.revoked) {
      return res.status(400).json({ error: "Certificate is not revoked" });
    }

    // Update certificate to set revoked = false
    const { error: updateError } = await supabaseAdmin
      .from("certificates")
      .update({
        revoked: false,
        revoked_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", certificateId);

    if (updateError) {
      console.error("Failed to unrevoke certificate:", updateError);
      return res.status(500).json({ error: "Failed to unrevoke certificate" });
    }

    return res.json({
      message: "Certificate unrevoked successfully",
      certificateId,
      unrevokedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("unrevokeCertificate error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Also add a function to get only revoked certificates
export const getRevokedCertificates = async (req, res) => {
  try {
    const {
      limit = 50,
      offset = 0,
      sortBy = "revoked_at",
      sortOrder = "desc",
      fileType,
    } = req.query;

    let query = supabaseAdmin
      .from("certificates")
      .select("*")
      .eq("revoked", true);

    // Add filters if provided
    if (fileType) {
      query = query.eq("file_type", fileType);
    }

    // Add sorting
    const ascending = sortOrder.toLowerCase() === "asc";
    query = query.order(sortBy, { ascending });

    // Add pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: certificates, error: fetchError } = await query;

    if (fetchError) {
      console.error("Fetch revoked certificates error:", fetchError);
      return res
        .status(500)
        .json({ error: "Failed to fetch revoked certificates" });
    }

    // Get total count for pagination
    const { count, error: countError } = await supabaseAdmin
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("revoked", true);

    if (countError) {
      console.warn("Failed to get total count:", countError);
    }

    return res.json({
      message: "Revoked certificates retrieved successfully",
      certificates,
      count: certificates.length,
      totalCount: count || 0,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: certificates.length === parseInt(limit),
      },
    });
  } catch (error) {
    console.error("getRevokedCertificates error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
