import { supabase } from "../utilities/supabase";
import { decode } from "base64-arraybuffer";
import axios from "axios";
import { getCurrentLanguage } from "@/src/localization/i18n";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_BASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

export const getFileExtension = (uri: string) => {
  return uri.split(".").pop() || "jpg"; // Default to 'jpg' if no extension
};

export const uploadImage = async (
  base64Data: string,
  uri: string,
  folder: string
) => {
  try {
    // Fetch the file from the URI
    const fileExtension = getFileExtension(uri);
    const fileName = `${Date.now()}.${fileExtension}`;

    // Upload the image to the specified folder in Supabase Storage
    const { data, error } = await supabase.storage
      .from("files") // Change to your bucket name
      .upload(`${folder}/${fileName}`, decode(base64Data), {
        contentType: `image/${fileExtension}`, // Dynamic content type
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return null;
    }

    return data.path;
  } catch (err) {
    console.error("Error uploading image:", err);
    return null;
  }
};

export const callAskAiFunction = async (payload: Record<string, any>) => {
  try {
    // Add language to payload
    const currentLanguage = getCurrentLanguage();
    const payloadWithLanguage = {
      ...payload,
      language: currentLanguage,
    };

    const response = await axios.post(
      `${supabaseUrl}/functions/v1/ask-ai-v2`,
      payloadWithLanguage,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        timeout: 60000, // 1 minute in milliseconds
      }
    );

    return { data: response.data, error: null };
  } catch (error: any) {
    console.error(
      "Edge function call error:",
      error.response?.data || error.message
    );
    return {
      data: null,
      error: error.response?.data || {
        message: error.message || "Unknown error",
      },
    };
  }
};
