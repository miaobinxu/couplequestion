import React, { useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import LottieView from "lottie-react-native";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { useRouter } from "expo-router";
// import BackButton from '@reusable-components/buttons/backButton';
import { isIphoneSE } from "@utilities/check-mobile-device";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import { handleCameraPermissions } from "@utilities/permissions/camera/handle-camera-permission";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import CloseIcon from "@assets/svg/common/close-header.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/src/global-store/user-store";
import { useTranslation } from "@/src/hooks/use-translation";

const ReadyFirstFaceScan: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { isFreeTrialActive, subscriptionStatus, updateUser } = useUserStore();

  const animation = useRef<LottieView>(null);

  const handleContinue = useCallback(async () => {
    const cameraPermissionGranted = await handleCameraPermissions(t);
    if (cameraPermissionGranted) {
      router.push("/sign-in/take-photo");
    }
  }, [t]);

  const handleSkipScan = useCallback(() => {
    updateUser({ hasCompletedFaceScan: true });
    router.replace("/(tabs)/homeTab/home");
  }, []);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <PageHeader
        showLogo={false}
        showLeftIcon={false} // Controls visibility of left icon
        showRightIcon={isFreeTrialActive || subscriptionStatus === "ACTIVE"} // Controls visibility of right icon
        renderRightIcon={
          <TouchableOpacity onPress={handleSkipScan}>
            <CloseIcon />
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <LottieView
            autoPlay
            loop={true}
            ref={animation}
            style={styles.animation}
            source={require("@assets/lottie_animations/sign-in/first-face-scan.json")}
          />
          <Text style={styles.title}>{t("signIn.readyForFirstScan.title")}</Text>
          <Text style={styles.subTitle}>
            {t("signIn.readyForFirstScan.subtitle")}
          </Text>
        </View>
      </View>
      <SafeAreaView edges={["bottom"]} style={styles.footer}>
        <View style={styles.buttonContainer}>
          <ButtonWithFeedback
            text={t("common.continue")}
            marginTop={hp(1.5)}
            backgroundColor={"#698D5F"}
            textColor={"#FFFFFF"}
            viewStyle={{
              alignSelf: "center",
            }}
            onPress={handleContinue}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FCFA",
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  content: {
    flex: 12,
  },
  animationContainer: {
    flex: Platform.OS === "ios" ? (isIphoneSE() ? 6 : 10) : 7.5,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  animation: {
    width: scaleWidth(224),
    height: scaleHeight(269),
    marginTop: Platform.OS === "ios" ? hp(5) : hp(6),
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#1C1C1C",
    marginTop: Platform.OS === "ios" ? hp(1.7) : hp(0),
    textAlign: "center",
  },
  subTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    marginTop: Platform.OS === "ios" ? hp(1.5) : hp(0),
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopColor: "#ededed",
    paddingBottom: hp(2),
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    zIndex: 1000,
  },
});

export default ReadyFirstFaceScan;
