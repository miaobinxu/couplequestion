import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  TextInput,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

interface TenPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const TenPercentContent: React.FC<TenPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { name, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    const [userName, setUserName] = useState<string>(name || "");

    const handleNameChange = useCallback(
      (text: string) => {
        setUserName(text);
        updateOnboarding({ name: text });
      },
      [updateOnboarding]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.2);
    }, [updateProgressBar]);

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              Hey, I'm <Text style={styles.brandName}>inSky</Text>, what is your
              name?
            </Text>
            <View style={{ marginTop: hp(20) }}></View>
            <TextInput
              style={styles.textInput}
              value={userName}
              onChangeText={handleNameChange}
              placeholder={t("onboarding.name.placeholder")}
              placeholderTextColor="#666666"
              autoCapitalize="words"
              autoCorrect={false}
            />

            <View style={{ marginTop: hp(2) }}></View>
          </ScrollView>
        </View>
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={
                continueLabel === "Continue"
                  ? t("onboarding.continue")
                  : continueLabel
              }
              marginTop={hp(1.5)}
              backgroundColor={userName.trim() !== "" ? "#6A4CFF" : "#333333"}
              textColor={userName.trim() !== "" ? "#FFFFFF" : "#666666"}
              viewStyle={{
                alignSelf: "center",
              }}
              disabled={userName.trim() === ""}
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
    backgroundColor: "#000000",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(28),
    color: "#FFFFFF",
    marginLeft: wp(5.5),
    marginTop: hp(0.6),
    lineHeight: scaleFont(36),
  },
  brandName: {
    fontFamily: "HelveticaRegular",
    color: "#6A4CFF",
  },
  textInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    marginHorizontal: wp(5.5),
    marginTop: hp(8),
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#6A4CFF",
  },
  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,

    paddingBottom: hp(2),
  },
});

export default TenPercentContent;
