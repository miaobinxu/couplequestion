import React, { useState, useEffect, useCallback, Suspense } from "react";
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
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";
import DateTimePicker from "@react-native-community/datetimepicker";

const InlineDatePicker = React.lazy(
  () => import("@/src/components/InlineDatePicker")
);

interface TwentyPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const TwentyPercentContent: React.FC<TwentyPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { birthDate, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    const [selectedDate, setSelectedDate] = useState<Date>(() => {
      if (
        birthDate &&
        birthDate instanceof Date &&
        !isNaN(birthDate.getTime())
      ) {
        return birthDate;
      }
      return new Date(2000, 0, 1);
    });
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    const handleDateChange = useCallback(
      (event: any, date?: Date) => {
        if (date) {
          setSelectedDate(date);
          updateOnboarding({ birthDate: date });
        }
      },
      [updateOnboarding]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.3);
    }, [updateProgressBar]);

    const formatDate = (date: Date) => {
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return "JAN 1, 2000";
      }
      const day = date.getDate();
      const month = date
        .toLocaleString("default", { month: "short" })
        .toUpperCase();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
    };

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>{t("onboarding.birthDate.title")}</Text>

            <View style={styles.dateDisplayContainer}>
              <Text style={styles.dateDisplay}>{formatDate(selectedDate)}</Text>
            </View>

            <View style={{ marginTop: hp(10) }}></View>
            <View style={styles.datePickerContainer}>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                  textColor="#FFFFFF"
                  themeVariant="dark"
                  style={styles.datePicker}
                  locale="en-US"
                />
              ) : (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6A4CFF" />}
                >
                  <InlineDatePicker
                    initialDate={selectedDate}
                    onDateChange={(date) => {
                      setSelectedDate(date);
                      updateOnboarding({ birthDate: date });
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
  dateDisplayContainer: {
    alignItems: "center",
    marginTop: hp(6),
  },
  dateDisplay: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(32),
    color: "#FFFFFF",
    textAlign: "center",
  },
  datePickerContainer: {
    alignItems: "center",
    marginTop: Platform.OS == "ios" ? hp(4) : hp(0),
    backgroundColor: "transparent",
    marginHorizontal: wp(5.5),
    paddingVertical: hp(2),
  },
  datePicker: {
    width: wp(80),
    height: hp(20),
    backgroundColor: "transparent",
  },
  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
});

export default TwentyPercentContent;
