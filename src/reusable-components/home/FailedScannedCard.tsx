import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import { useTranslation } from "@/src/hooks/use-translation";

const FailedScannedCard = ({
  imageUrl,
  onRetry,
}: {
  imageUrl: string;
  onRetry?: () => void;
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity disabled onPress={onRetry} style={styles.cardContainer}>
      {imageUrl && <Image style={styles.image} source={{ uri: imageUrl }} />}
      <View style={styles.textContainer}>
        <Text style={styles.errorTitle} numberOfLines={1}>
          {t("errors.unableToProcessImage")}
        </Text>
        <Text style={styles.errorMessage}>{t("errors.pleaseTryAgain")}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default FailedScannedCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    shadowColor: "#EAEAEA",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: hp(1.8),
    padding: wp(3),
    alignItems: "center",
    flexDirection: "row",
  },
  image: {
    height: 64,
    width: 64,
    borderRadius: 12,
    overflow: "hidden",
  },
  textContainer: {
    marginLeft: wp(3),
    justifyContent: "center",
    flex: 1,
  },
  errorTitle: {
    color: "red",
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  errorMessage: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#444",
    marginTop: hp(0.5),
  },
});
