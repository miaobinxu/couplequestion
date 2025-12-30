import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TextInput,
  Keyboard,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { useRouter } from "expo-router";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import * as Device from "expo-device";
import { saveReferralUsage } from "@/src/services/user.service";
import showToast from "@/src/utilities/toastUtil";
import LoadingOverlay from "@/src/reusable-components/misc/LoadingOverlay";
import { useUserStore } from "@/src/global-store/user-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";
interface NinetyPercentContentProps {
  progress: number;
  updateProgressBar: (progress: number) => void;
}

const NinetyPercentContent: React.FC<NinetyPercentContentProps> = React.memo(
  ({ progress, updateProgressBar }) => {
    const router = useRouter();
    const { t } = useTranslation();

    const { referralCode, updateOnboarding } = useOnboardingStore();
    const { setIsFreeTrialActive } = useUserStore();

    const [isRefferalLoading, setRefferalLoading] = useState(false);

    useEffect(() => {
      setWrittenReferralCode(referralCode);
    }, [referralCode]);

    const [writtenReferralCode, setWrittenReferralCode] =
      useState<string>(referralCode);

    const handleNavigation = () => {
      updateProgressBar(1);
      if (progress === 0.7) {
        setTimeout(() => {
          router.push("/custom-plan-generation/setting-up");
        }, 200);
      } else {
        router.push("/custom-plan-generation/setting-up");
      }
    };

    const handleContinue = useCallback(async () => {
      // if (writtenReferralCode?.length === 0) {
      //   return handleNavigation();
      // } else if (writtenReferralCode === "INTERNAL123") {
      //   setIsFreeTrialActive(true);
      //   return handleNavigation();
      // }
      // const deviceId = Device.osBuildId || "unknown-device";

      try {
        // setRefferalLoading(true);
        // const { error } = await saveReferralUsage(
        //   deviceId,
        //   writtenReferralCode
        // );
        // if (!error) {
        //   showToast("success", {
        //     title: t("onboarding.referralCode.toast.title"),
        //     message: t("onboarding.referralCode.toast.success"),
        //   });
        // setTimeout(() => {
        handleNavigation();
        // }, 1000);
        // } else {
        //   showToast("error", {
        //     title: t("onboarding.referralCode.toast.title"),
        //     message: error.message || t("onboarding.referralCode.toast.error"),
        //   });
        // }
      } catch (error) {
      } finally {
        setRefferalLoading(false);
      }

      return;
    }, [progress, referralCode, writtenReferralCode]);

    return (
      <>
        <View
          style={styles.contentPart}
          onStartShouldSetResponder={() => true}
          onResponderRelease={() => Keyboard.dismiss()}
        >
          <Text style={styles.title}>Do you have a{"\n"}referral code?</Text>
          <Text style={styles.subTitle}>You can skip this step.</Text>
          <TextInput
            style={styles.input}
            placeholder="Referral code"
            placeholderTextColor="#666666"
            value={writtenReferralCode}
            onChangeText={(value) => updateOnboarding({ referralCode: value })}
            autoCapitalize="none"
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

        {isRefferalLoading && <LoadingOverlay />}
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
  subTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    marginLeft: wp(5.5),
    marginTop: Platform.OS === "ios" ? hp(2) : hp(0.7),
  },
  input: {
    width: scaleWidth(361),
    height: scaleHeight(54),
    backgroundColor: "#1A1A1A",
    borderWidth: 1.2,
    borderColor: "#7C8CD8",
    paddingHorizontal: wp(4),
    borderRadius: 12,
    alignSelf: "center",
    marginTop: hp(15),
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
  },
  buttonPart: {
    // flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
});

export default NinetyPercentContent;
