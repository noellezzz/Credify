import crypto from "crypto";
import { supabaseAdmin } from "../services/supabase.service.js";

const base64ToBuffer = (base64String) => {
  const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  let data = base64String;
  if (matches) {
    data = matches[2];
  }
  return Buffer.from(data, "base64");
};

const generateFileHash = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

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

export const verifyCertificate = async (req, res) => {
  try {
    const { fileData } = req.body;

    if (!fileData) {
      return res.status(400).json({ 
        success: false,
        error: "No file data received" 
      });
    }

    // Convert base64 to Buffer
    const buffer = base64ToBuffer(fileData);
    
    // Determine file type from base64 data
    const mimeType = fileData.match(/^data:([A-Za-z-+/]+);base64,/)?.[1];

    // Validate file
    try {
      validateFile(mimeType, buffer);
    } catch (validationError) {
      return res.status(400).json({ 
        success: false,
        error: validationError.message 
      });
    }

    // Generate file hash
    const fileHash = generateFileHash(buffer);
    
    console.log("Verifying certificate with hash:", fileHash);

    // Check if certificate exists in database
    const { data: certificate, error: fetchError } = await supabaseAdmin
      .from("certificates")
      .select(`
        id,
        certificate_name,
        file_hash,
        content_hash,
        image_url,
        file_type,
        file_size,
        mime_type,
        verification_status,
        revoked,
        revoked_at,
        created_at,
        user_id
      `)
      .eq("file_hash", fileHash)
      .eq("revoked", false) // Only return non-revoked certificates
      .single();

    if (fetchError || !certificate) {
      console.log("Certificate not found or fetch error:", fetchError);
      return res.json({
        success: false,
        verified: false,
        message: "Certificate not found in database",
        fileHash,
        uploadedFile: {
          size: buffer.length,
          type: mimeType,
          hash: fileHash
        }
      });
    }

    // Certificate found and verified
    console.log("Certificate verified successfully:", certificate.id);
    
    return res.json({
      success: true,
      verified: true,
      message: "Certificate verified successfully",
      certificate: {
        id: certificate.id,
        name: certificate.certificate_name,
        fileHash: certificate.file_hash,
        contentHash: certificate.content_hash,
        imageUrl: certificate.image_url,
        fileType: certificate.file_type,
        fileSize: certificate.file_size,
        mimeType: certificate.mime_type,
        verificationStatus: certificate.verification_status,
        issuedDate: certificate.created_at,
        userId: certificate.user_id
      },
      uploadedFile: {
        size: buffer.length,
        type: mimeType,
        hash: fileHash
      }
    });

  } catch (error) {
    console.error("verifyCertificate error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};

export const getVerificationStats = async (req, res) => {
  try {
    // Get total certificates count
    const { count: totalCertificates, error: totalError } = await supabaseAdmin
      .from("certificates")
      .select("*", { count: "exact", head: true });

    // Get verified certificates count
    const { count: verifiedCertificates, error: verifiedError } = await supabaseAdmin
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "verified")
      .eq("revoked", false);

    // Get revoked certificates count
    const { count: revokedCertificates, error: revokedError } = await supabaseAdmin
      .from("certificates")
      .select("*", { count: "exact", head: true })
      .eq("revoked", true);

    if (totalError || verifiedError || revokedError) {
      console.error("Stats fetch error:", { totalError, verifiedError, revokedError });
      return res.status(500).json({ error: "Failed to fetch verification statistics" });
    }

    return res.json({
      success: true,
      stats: {
        totalCertificates: totalCertificates || 0,
        verifiedCertificates: verifiedCertificates || 0,
        revokedCertificates: revokedCertificates || 0,
        verificationRate: totalCertificates > 0 
          ? ((verifiedCertificates / totalCertificates) * 100).toFixed(1)
          : 0
      }
    });

  } catch (error) {
    console.error("getVerificationStats error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Internal server error" 
    });
  }
};