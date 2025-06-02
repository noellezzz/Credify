import crypto from "crypto";
import { supabaseAdmin } from "../services/supabase.service.js";

/**
 * Generate SHA-256 hash from buffer data
 */
const generateFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Generate SHA-256 hash from text content
 */
const generateContentHash = (content) => {
  return crypto.createHash('sha256').update(content, 'utf8').digest('hex');
};

/**
 * Generate and store both file hash and content hash
 */
export const generateHashes = async (req, res) => {
  try {
    const { fileData, ocrContent, userId, certificateId } = req.body;

    if (!fileData || !ocrContent) {
      return res.status(400).json({ 
        error: "File data and OCR content are required" 
      });
    }

    // Convert base64 to buffer for file hash
    const base64ToBuffer = (base64String) => {
      const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let data = base64String;
      if (matches) {
        data = matches[2];
      }
      return Buffer.from(data, 'base64');
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
        error: "Failed to save hash records" 
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
        error: "File data and hash ID are required" 
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
        error: "Hash record not found" 
      });
    }

    // Convert base64 to buffer and generate hash
    const base64ToBuffer = (base64String) => {
      const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      let data = base64String;
      if (matches) {
        data = matches[2];
      }
      return Buffer.from(data, 'base64');
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
        error: "Content and hash ID are required" 
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
        error: "Hash record not found" 
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