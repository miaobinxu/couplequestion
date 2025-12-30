import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import i18n, { getCurrentLanguage, LANGUAGES } from "@/src/localization/i18n";

export const getExtensionFromMimeType = (mimeType: string) => {
  // Split the MIME type by the slash and take the second part as the extension
  return mimeType.split("/")[1];
};

export const parseAssistantJSON = (content: string, t?: (key: string) => string) => {
  // Remove ```json and ``` code block markers
  const cleaned = content
    .replace(/```json\s*/, "") // remove starting ```json with possible trailing spaces
    .replace(/\s*```$/, ""); // remove trailing ```

  try {
    const data = JSON.parse(cleaned);
    return {
      success: true,
      error: null,
      data,
    };
  } catch (err) {
    // console.error("Failed to parse JSON:", err);
    return {
      success: false,
      error: t ? t("errors.imageProcessError") : "Unable to process the image. Please try again!",
      data: null,
    };
  }
};

export const capitalizeFirstChar = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const getScoreLabel = (score: number, t?: (key: string) => string) => {
  if (score >= 1 && score <= 29) return { label: t ? t("scoreLabels.bad") : "Bad", color: "#EB4335" }; // Red
  if (score >= 30 && score <= 59) return { label: t ? t("scoreLabels.poor") : "Poor", color: "#FE9E1D" }; // Orange
  if (score >= 60 && score <= 90) return { label: t ? t("scoreLabels.good") : "Good", color: "#4FBB31" }; // Light Green
  if (score >= 91 && score <= 100)
    return { label: t ? t("scoreLabels.excellent") : "Excellent", color: "#2B641A" }; // Dark Green
  return { label: t ? t("scoreLabels.invalid") : "Invalid", color: "#808080" };
};

export const getFitScoreLabel = (score: number, t?: (key: string) => string) => {
  if (score >= 1 && score <= 29)
    return { label: t ? t("scoreLabels.incompatible") : "Incompatible", color: "#EB4335" }; // Red
  if (score >= 30 && score <= 59) return { label: t ? t("scoreLabels.minimal") : "Minimal", color: "#FE9E1D" }; // Orange
  if (score >= 60 && score <= 90) return { label: t ? t("scoreLabels.good") : "Good", color: "#4FBB31" }; // Light Green
  if (score >= 91 && score <= 100)
    return { label: t ? t("scoreLabels.perfect") : "Perfect", color: "#2B641A" }; // Dark Green
  return { label: t ? t("scoreLabels.invalid") : "Invalid", color: "#808080" };
};

export const getRiskLevelLabel = (level: string, t?: (key: string) => string) => {
  switch (level.toLowerCase()) {
    case "no risk":
      return { label: t ? t("scoreLabels.noRisk") : "No Risk", color: "#2B641A" }; // Dark Green
    case "low risk":
      return { label: t ? t("scoreLabels.lowRisk") : "Low Risk", color: "#FFD700" }; // Yellow
    case "moderate risk":
    case "medium risk":
      return { label: t ? t("scoreLabels.moderateRisk") : "Moderate Risk", color: "#FE9E1D" }; // Orange
    case "high risk":
      return { label: t ? t("scoreLabels.highRisk") : "High Risk", color: "#EB4335" }; // Red
    default:
      return { label: t ? t("scoreLabels.unknown") : "Unknown", color: "#808080" }; // Gray fallback
  }
};

export const parseLocalImage = (url: string) => {
  if (Platform.OS === "android") {
    return url;
  } else {
    const filename = url.split("/").pop();
    const directory = `${FileSystem.documentDirectory}scanned_images/`;
    return `${directory}${filename}`;
  }
};

export const deleteScannedImagesFolder = async () => {
  try {
    const directory = `${FileSystem.documentDirectory}scanned_images/`;

    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (dirInfo.exists) {
      await FileSystem.deleteAsync(directory, { idempotent: true });
      console.log("scanned_images folder deleted successfully.");
    } else {
      console.log("scanned_images folder does not exist.");
    }
  } catch (error) {
    console.error("Error deleting scanned_images folder:", error);
  }
};

export const generateFaceScanPayload = async (photos: string[]) => {
  const base64Images = await Promise.all(
    photos.map(async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    })
  );

  const imageContent = base64Images.map((image) => ({
    type: "image_url" as const,
    image_url: { url: image },
  }));

  const currentLanguage = getCurrentLanguage();
  const languageName = LANGUAGES[currentLanguage];
  const dailySelfieName = currentLanguage === 'es' ? 'Selfie Diaria' : 'Daily Selfie';
  const overallScoreLabel = i18n.t('appWallUnpaid.overallScore');
  const languageInstruction = currentLanguage !== 'en' 
    ? `\n\nIMPORTANT: Please respond in ${languageName}. All text fields including the name, keyTakeaway items, and descriptions should be in ${languageName}.`
    : '';

  return {
    messages: [
      {
        role: "user",
        content: [
          { type: "text" as const, text: "Here is the picture of my face." },
          ...imageContent,
          {
            type: "text" as const,
            text: `I want to know the following information from the photos:
            
- skin type: Take best guess for my skin type. Choose from: normal, dry, oily, combination.
- acne, pores, hydration, redness, wrinkles, eye bag: Give each a score out of 100 (0 = bad, 100 = excellent. Make the score as extreme as possible).
- overall score: An overall skin health score out of 100 (Make the score as extreme as possible).
- key takeaways: 3 insights about my skin.${languageInstruction}

Respond in the following JSON format exactly:

{
  "name": "${dailySelfieName}",
  "overallScore": {
    "name": "${overallScoreLabel}",
    "value": <OVERALL_SCORE>,
    "description": "<Description such as Excellent, Great, Average, etc.>"
  },
  "skinType": "<SKIN_TYPE>",
  "information": [
    { "name": "Acne", "value": <ACNE_SCORE> },
    { "name": "Pores", "value": <PORES_SCORE> },
    { "name": "Hydration", "value": <HYDRATION_SCORE> },
    { "name": "Redness", "value": <REDNESS_SCORE> },
    { "name": "Wrinkles", "value": <WRINKLES_SCORE> },
    { "name": "Eye Bag", "value": <EYE_BAG_SCORE> }
  ],
  "keyTakeaway": [
    "<TAKEAWAY_1>",
    "<TAKEAWAY_2>",
    "<TAKEAWAY_3>"
  ]
}`,
          },
        ],
      },
    ],
  };
};

export const generateProductScanPayload = async (
  photos: string[],
  skinType: string
) => {
  const base64 = await FileSystem.readAsStringAsync(photos[0], {
    encoding: FileSystem.EncodingType.Base64,
  });

  const image = `data:image/jpeg;base64,${base64}`;

  const currentLanguage = getCurrentLanguage();
  const languageName = LANGUAGES[currentLanguage];
  const overallScoreLabel = i18n.t('appWallUnpaid.overallScore');
  const compatibilityLabel = i18n.t('appWallUnpaid.compatibility');
  const languageInstruction = currentLanguage !== 'en' 
    ? `\n\nIMPORTANT: Please respond in ${languageName}. All text fields (ingredient names, keyTakeaway items, descriptions) should be in ${languageName}. However, riskLevel values must use these EXACT English codes: "No Risk", "Low Risk", "Moderate Risk", or "High Risk" (these are technical identifiers - do not translate them).`
    : '';

  return {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text" as const,
            text: `I'm ${skinType} skin type. Here is the picture of the skin product I'm currently using.`,
          },
          {
            type: "image_url" as const,
            image_url: { url: image },
          },
          {
            type: "text" as const,
            text: `Recognize the product and analyze its ingredients. Respond strictly in the following **JSON format**:
- product name: The product's name.
- overall score: A score out of 100 with a brief quality description (Make the score as extreme as possible).
- fit score: A fit score out of 100 for my skin type, with a description (Make the score as extreme as possible).
- penalty ingredients: 2 bad ingredients with a risk level. Use EXACTLY one of these riskLevel codes: "No Risk", "Low Risk", "Moderate Risk", "High Risk".
- star ingredients: 2 good ingredients with a risk level. Use EXACTLY one of these riskLevel codes: "No Risk", "Low Risk", "Moderate Risk", "High Risk".
- key takeaways: 3 insights or advice about this product. Include the compatibility with my skin type if skin type is specified.${languageInstruction}

{
  "name": "<PRODUCT_NAME>",
  "overallScore": {
    "name": "${overallScoreLabel}",
    "value": <OVERALL_SCORE>,
    "description": "<Excellent | Great | Average | Poor>"
  },
  "fitScore": {
    "name": "${compatibilityLabel}",
    "value": <FIT_SCORE>,
    "description": "<Excellent | Great | Average | Poor>"
  },
  "penaltyIngredients": [
    { "name": "<BAD_INGREDIENT_1>", "riskLevel": "<RISK_LEVEL>" },
    { "name": "<BAD_INGREDIENT_2>", "riskLevel": "<RISK_LEVEL>" }
  ],
  "starIngredients": [
    { "name": "<GOOD_INGREDIENT_1>", "riskLevel": "<RISK_LEVEL>" },
    { "name": "<GOOD_INGREDIENT_2>", "riskLevel": "<RISK_LEVEL>" }
  ],
  "keyTakeaway": [
    "<TAKEAWAY_1>",
    "<TAKEAWAY_2>",
    "<TAKEAWAY_3>"
  ]
}`,
          },
        ],
      },
    ],
  };
};

export const generateFoodScanPayload = async (photos: string[]) => {
  const base64 = await FileSystem.readAsStringAsync(photos[0], {
    encoding: FileSystem.EncodingType.Base64,
  });

  const image = `data:image/jpeg;base64,${base64}`;

  const currentLanguage = getCurrentLanguage();
  const languageName = LANGUAGES[currentLanguage];
  const overallScoreLabel = i18n.t('appWallUnpaid.overallScore');
  const compatibilityLabel = i18n.t('appWallUnpaid.compatibility');
  const languagePrefix = currentLanguage !== 'en' 
    ? `LANGUAGE: Respond entirely in ${languageName}. The food name MUST be in ${languageName} (e.g., "Ensalada César" not "Caesar Salad").\n\n`
    : '';
  const languageInstruction = currentLanguage !== 'en' 
    ? `\n\nREMINDER: ALL text must be in ${languageName}, including the food name and keyTakeaway items.`
    : '';

  return {
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text" as const,
            text: `Here is the picture of the food. Recognize the food and analyze its impact on skin. Give me the following information:`,
          },
          {
            type: "image_url" as const,
            image_url: { url: image },
          },
          {
            type: "text" as const,
            text: `${languagePrefix}Recognize the food and analyze its impact on skin. Give me the following information:

- name: The food's name IN ${languageName || 'English'}.
- overall score: A score out of 100 with a brief quality description (Make the score as extreme as possible).
- fit score: A fit score out of 100 with a brief description for my skin (Make the score as extreme as possible).
- containsDairy: Return true if it contains dairy, false otherwise.
- information: 6 risk scores out of 100 for bloat, puffiness, sensitivity, acne, dryness, and oiliness impact (0 means very high risk, 100 means no risk. Make the score as extreme as possible).
- keyTakeaway: 3 insights or advice about this food IN ${languageName || 'English'}.${languageInstruction}

Respond in the following **JSON** format exactly:

{
  "name": "<FOOD NAME>",
  "overallScore": {
    "name": "${overallScoreLabel}",
    "value": <OVERALL_SCORE>,
    "description": "<Excellent | Great | Average | Poor>"
  },
  "fitScore": {
    "name": "${compatibilityLabel}",
    "value": <FIT_SCORE>,
    "description": "<Excellent | Great | Average | Poor>"
  },
  "containsDairy": <true | false>,
  "information": [
    { "name": "Bloat Risk", "value": <BLOAT_RISK_SCORE> },
    { "name": "Puffiness Risk", "value": <PUFFINESS_RISK_SCORE> },
    { "name": "Sensitivity Risk", "value": <SENSITIVITY_RISK_SCORE> },
    { "name": "Acne Risk", "value": <ACNE_RISK_SCORE> },
    { "name": "Dryness Risk", "value": <DRYNESS_RISK_SCORE> },
    { "name": "Oiliness Impact", "value": <OILINESS_RISK_SCORE> }
  ],
  "keyTakeaway": [
    "<TAKEAWAY_1>",
    "<TAKEAWAY_2>",
    "<TAKEAWAY_3>"
  ]
}`,
          },
        ],
      },
    ],
  };
};
