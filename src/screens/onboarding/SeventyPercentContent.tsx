import React, { useRef, useCallback } from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@utilities/check-mobile-device";
import { useFocusEffect } from "expo-router";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

interface SeventyPercentContentProps {
  updateProgressBar: (progress: number) => void;
}

const SeventyPercentContent: React.FC<SeventyPercentContentProps> = React.memo(
  ({ updateProgressBar }) => {
    const animation = useRef<LottieView>(null);
    const { t } = useTranslation();

    const handleContinue = useCallback(() => {
      updateProgressBar(0.6);
    }, [updateProgressBar]);

    useFocusEffect(
      useCallback(() => {
        animation.current?.play();
      }, [])
    );

    return (
      <>
        <View style={styles.contentPart}>
          <Text style={styles.title}>
            <Text style={styles.brandName}>inSky</Text> connects you to the
            universe
          </Text>

          <LottieView
            autoPlay={true}
            loop={true}
            ref={animation}
            style={styles.animation}
            resizeMode="contain"
            source={require("@assets/lottie_animations/onboarding/zodiac-sign-table.json")}
          />
        </View>
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={t("common.continue")}
              marginTop={hp(1.5)}
              backgroundColor={"#6A4CFF"}
              textColor={"#FFFFFF"}
              viewStyle={{
                alignSelf: "center",
              }}
              onPress={handleContinue}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
);

const styles = StyleSheet.create({
  contentPart: {
    flex: Platform.OS === "ios" ? (isIphoneSE() ? 6 : 10) : 7.5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(28),
    color: "#FFFFFF",
    marginLeft: wp(5.5),
    marginTop: hp(0.6),
    marginRight: wp(4),
    lineHeight: scaleFont(36),
  },
  brandName: {
    fontFamily: "HelveticaRegular",
    color: "#6A4CFF",
  },
  animation: {
    width: scaleWidth(600),
    height: scaleHeight(600),
    alignSelf: "center",
    marginTop: hp(2),
  },
  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
});

export default SeventyPercentContent;
