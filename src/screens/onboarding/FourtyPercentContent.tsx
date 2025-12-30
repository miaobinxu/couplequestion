import React, { useState, useCallback, Suspense } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import ButtonWithoutFeedback from "@reusable-components/buttons/ButtonWithoutFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";
import DateTimePicker from "@react-native-community/datetimepicker";

const InlineTimePicker = React.lazy(
  () => import("@/src/components/InlineTimePicker")
);

interface FourtyPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const FourtyPercentContent: React.FC<FourtyPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { birthTime, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    const [selectedTime, setSelectedTime] = useState<Date>(() => {
      if (
        birthTime &&
        birthTime instanceof Date &&
        !isNaN(birthTime.getTime())
      ) {
        return birthTime;
      }
      return new Date(2000, 0, 1, 20, 0, 0);
    });

    const handleTimeChange = useCallback(
      (event: any, time?: Date) => {
        if (time) {
          setSelectedTime(time);
          updateOnboarding({ birthTime: time });
        }
      },
      [updateOnboarding]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.5);
    }, [updateProgressBar]);

    const handleSkipForNow = useCallback(() => {
      updateProgressBar(0.5);
    }, [updateProgressBar]);

    const formatTime = (date: Date) => {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return "08:00 PM";
      }
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");
      return `${displayHours
        .toString()
        .padStart(2, "0")}:${displayMinutes} ${ampm}`;
    };

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{t("onboarding.birthTime.title")}</Text>

            <View style={styles.timeDisplayContainer}>
              <Text style={styles.timeDisplay}>{formatTime(selectedTime)}</Text>
            </View>

            <View style={styles.timePickerContainer}>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={selectedTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                  style={styles.timePicker}
                />
              ) : (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6A4CFF" />}
                >
                  <InlineTimePicker
                    initialTime={selectedTime}
                    onTimeChange={(time) => {
                      setSelectedTime(time);
                      updateOnboarding({ birthTime: time });
                    }}
                  />
                </Suspense>
              )}
            </View>

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
              backgroundColor={"#6A4CFF"}
              textColor={"#FFFFFF"}
              viewStyle={{
                alignSelf: "center",
              }}
              onPress={handleContinue}
            />
            <ButtonWithoutFeedback
              text={t("onboarding.birthTime.skipForNow")}
              marginTop={hp(2)}
              fontSize={16}
              textColor="#999999"
              onPress={handleSkipForNow}
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
  timeDisplayContainer: {
    alignItems: "center",
    marginTop: hp(10),
  },
  timeDisplay: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(48),
    color: "#FFFFFF",
    textAlign: "center",
  },
  timePickerContainer: {
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? hp(10) : hp(5),
    backgroundColor: "transparent",
    marginHorizontal: wp(5.5),
    paddingVertical: hp(2),
  },
  timePicker: {
    width: wp(80),
    height: hp(20),
    backgroundColor: "transparent",
  },
  buttonPart: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
});

export default FourtyPercentContent;
