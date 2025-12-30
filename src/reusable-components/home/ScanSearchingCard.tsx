import React, { useRef, useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import ImagePlacholder from "@assets/svg/home/image-placeholder.svg";
import ShimmerPlaceholder from "@/src/reusable-components/misc/ShimmerPlaceholder";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import { useTranslation } from "@/src/hooks/use-translation";

type Props = {
  scanType: "product" | "food" | "skin";
};

export default function ScanSearchingCard({ scanType }: Props) {
  const [messageIndex, setMessageIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  
  const scanMessagesMap = {
    product: [
      t("scanning.product.message1"),
      t("scanning.product.message2"),
      t("scanning.product.message3"),
      t("scanning.product.message4"),
    ],
    food: [
      t("scanning.food.message1"),
      t("scanning.food.message2"),
      t("scanning.food.message3"),
      t("scanning.food.message4"),
    ],
    skin: [
      t("scanning.skin.message1"),
      t("scanning.skin.message2"),
      t("scanning.skin.message3"),
      t("scanning.skin.message4"),
    ],
  };
  
  const messages = scanMessagesMap[scanType];

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageIndex < messages.length - 1) {
        Animated.timing(slideAnim, {
          toValue: -wp(60),
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setMessageIndex((prev) => prev + 1);
          slideAnim.setValue(wp(60));
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [messageIndex, messages]);

  return (
    <View style={styles.cardContainer}>
      <ImagePlacholder />
      <View style={styles.textContainer}>
        <View style={styles.textWrapper}>
          <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
            <Text style={styles.title}>{messages[messageIndex]}</Text>
          </Animated.View>
        </View>
        <ShimmerPlaceholder
          width="50%"
          height={12}
          style={styles.shimmerSpacing}
        />
        <ShimmerPlaceholder width="70%" height={12} />
      </View>
    </View>
  );
}

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
  },
  textWrapper: {
    width: wp(60),
    height: scaleFont(22),
    overflow: "hidden",
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    fontWeight: "bold",
  },
  shimmerSpacing: {
    marginVertical: 7,
  },
});
