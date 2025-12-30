import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import {
  FoodData,
  ProductData,
  SkinData,
} from "@/src/blue-prints/global-store/scan/scan";
import { getScoreLabel, parseLocalImage } from "@/src/utilities/common";
import ProductIndicatorIcon from "./ProductIndicatorIcon";
import FaceIndicatorIcon from "./FaceIndicatorIcon";
import FoodIndicatorIcon from "./FoodIndicatorIcon";
import FailedScannedCard from "./FailedScannedCard";
import { useTranslation } from "@/src/hooks/use-translation";

const ScannedCard = ({
  cardData,
}: {
  cardData: SkinData[] | FoodData[] | ProductData[];
}) => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleItemPress = (item: SkinData | FoodData | ProductData) => {
    try {
      const itemData = JSON.stringify(item); // Convert the object to a JSON string
      switch (item.scanType) {
        case "food":
          router.push({
            pathname: "/food-details",
            params: { data: itemData },
          });
          break;
        case "skin":
          router.push({
            pathname: "/skin-details",
            params: { data: itemData },
          });
          break;
        case "product":
          router.push({
            pathname: "/product-details",
            params: { data: itemData },
          });
          break;
        default:
          console.warn("Unknown scan type");
      }
    } catch (error) {
      console.error("Error serializing data for navigation:", error);
    }
  };

  return (
    <>
      {cardData.map((item) => (
        <View key={item?.id}>
          {!item?.name ? (
            <FailedScannedCard
              key={item.id}
              imageUrl={item.photos[0].toString()}
              onRetry={() => console.log("Retry")}
            />
          ) : (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleItemPress(item)}
              style={styles.cardContainer}
            >
              {item?.photos?.[0] && (
                <Image
                  style={{
                    height: 64,
                    width: 64,
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                  source={{ uri: parseLocalImage(item.photos[0].toString()) }}
                />
              )}
              <View style={styles.textContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.scoreContainer}>
                  {item?.scanType === "food" ? (
                    <FoodIndicatorIcon
                      color={getScoreLabel(item?.overallScore?.value, t).color}
                    />
                  ) : item?.scanType === "skin" ? (
                    <FaceIndicatorIcon
                      color={getScoreLabel(item?.overallScore?.value, t).color}
                    />
                  ) : (
                    <ProductIndicatorIcon
                      color={getScoreLabel(item?.overallScore?.value, t).color}
                    />
                  )}

                  <View
                    style={{
                      ...styles.scoreBadge,
                      backgroundColor: getScoreLabel(item?.overallScore?.value, t)
                        .color,
                    }}
                  >
                    <Text style={styles.scoreText}>
                      {item?.overallScore?.value}/100
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </>
  );
};

export default ScannedCard;

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
  textContainer: {
    marginLeft: wp(3),
    justifyContent: "space-between",
    flex: 1,
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  scoreContainer: {
    flexDirection: "row",
    marginTop: hp(1),
    alignItems: "center",
  },
  scoreBadge: {
    backgroundColor: "#FFA63A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(1),
    borderRadius: 15,
    marginLeft: wp(2),
  },
  scoreText: {
    color: "#fff",
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    fontWeight: "bold",
  },
});
