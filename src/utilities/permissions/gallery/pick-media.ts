import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const pickMedia = async ({ includeBase64 = false, t }: { includeBase64?: boolean; t?: (key: string) => string }) => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.1,
      exif: false,
      base64: includeBase64,
      allowsMultipleSelection: false,
      selectionLimit: 1,
    });
    console.log({ result });
    const { assets, canceled } = result;
    if (canceled) {
      return null;
    } else if (!assets) {
      Alert.alert(t ? t("alerts.error") : "Error", t ? t("alerts.unexpectedError") : "Unexpected error! Please try again later.");
      return null;
    } else {
      const { fileSize, base64, mimeType, uri } = assets[0];
      if (!fileSize || (includeBase64 ? !base64 : false) || !mimeType) {
        Alert.alert(t ? t("alerts.error") : "Error", t ? t("alerts.unexpectedError") : "Unexpected error! Please try again later.");
        return null;
      }
      const fileSizeInMB = fileSize / (1024 * 1024);
      if (fileSizeInMB > 10) {
        Alert.alert(
          t ? t("alerts.error") : "Error",
          "Picked photo size exceeds the 10MB limit. Please upload a smaller file."
        );
        return null;
      }
      return { base64, mimeType, uri };
    }
  } catch (error) {
    Alert.alert(t ? t("alerts.error") : "Error", t ? t("alerts.unexpectedError") : "Unexpected error! Please try again later.");
    return null;
  }
};
