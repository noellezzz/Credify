import { v4 as uuidv4 } from "uuid";
import { InferenceClient } from "@huggingface/inference";
import { supabaseAdmin } from "../services/supabase.service.js";
import cloudinary from "cloudinary";

const client = new InferenceClient(process.env.HF_TOKEN);
const BUCKET_NAME = "certificates";

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

    // Convert base64 to Buffer (optional, Cloudinary can accept base64 string)
    const buffer = base64ToBuffer(fileData);
    const fileName = `certificate_${userId || "anonymous"}_${Date.now()}`;

    // Upload to Cloudinary
    // Cloudinary accepts base64 data prefixed with `data:image/png;base64,`
    const cloudinaryUpload = await cloudinary.v2.uploader.upload(fileData, {
      public_id: `certificates/${fileName}`, // folder + filename
      folder: "certificates",
      resource_type: "image",
      overwrite: false,
    });

    if (!cloudinaryUpload.secure_url) {
      return res.status(500).json({ error: "Failed to upload to Cloudinary" });
    }

    const imageUrl = cloudinaryUpload.secure_url;
    console.log("Cloudinary URL:", imageUrl);

    // Save record to certificates table in Supabase (still using supabaseAdmin)
    const { error: insertError } = await supabaseAdmin
      .from("certificates")
      .insert([
        {
          certificate_hash: fileName,
          certificate_name: fileName,
          user_id: userId || null,
          image_url: imageUrl,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res
        .status(500)
        .json({ error: "Failed to save certificate record" });
    }

    // Call Qwen inference with the Cloudinary image URL
    const chatCompletion = await client.chatCompletion({
      provider: "fireworks-ai",
      model: "Qwen/Qwen2.5-VL-32B-Instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image and return a JSON object with the following fields:
- description: read the whole image and provide a detailed description (string)
- objects: an array of main objects detected in the image (strings)
- colors: an array of predominant colors (strings)
- confidence: an estimated confidence score (0 to 1)

Example response:
{
  "description": "A scenic mountain of mount Everest with a clear blue lake in the foreground, surrounded by lush green trees and a few white clouds in the sky.",
  "objects": ["mountain", "lake", "trees"],
  "colors": ["blue", "green", "white"],
  "confidence": 0.95
}
`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
    });

    const responseText = chatCompletion.choices[0].message.content;

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      // Fallback: put entire response in description
      parsedData = { description: responseText };
    }

    console.log("Structured data from Qwen:", parsedData);

    console.log(
      "Chat completion response:",
      chatCompletion.choices[0].message.content
    );

    return res.json({
      message: "File uploaded, saved, and processed successfully",
      imageUrl,
      qwenDescription: chatCompletion.choices[0].message.content,
    });
  } catch (error) {
    console.error("uploadBase64 error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
