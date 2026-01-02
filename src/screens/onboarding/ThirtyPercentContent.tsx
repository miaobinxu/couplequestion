import React, { useState, useCallback, Suspense } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont, scaleHeight, scaleWidth } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";
import DateTimePicker from "@react-native-community/datetimepicker";

import SterlitziaPlant from "@assets/svg/strelitzia-plant-pana.svg";

const InlineDatePicker = React.lazy(
  () => import("@/src/components/InlineDatePicker")
);

interface ThirtyPercentContentProps {
  updateProgressBar: (progress: number) => void;
}

const ThirtyPercentContent: React.FC<ThirtyPercentContentProps> = React.memo(
  ({ updateProgressBar }) => {
    const { relationshipDuration, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    console.log("relationship", relationshipDuration);

    const [selectedDate, setSelectedDate] = useState<Date>(() => {
      if (
        relationshipDuration &&
        relationshipDuration instanceof Date &&
        !isNaN(relationshipDuration.getTime())
      ) {
        return relationshipDuration;
      }
      return new Date();
    });

    const handleDateChange = useCallback(
      (_event: any, date?: Date) => {
        if (!date) return;
        setSelectedDate(date);
        updateOnboarding({ relationshipDuration: date });
      },
      [updateOnboarding]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.4);
    }, [updateProgressBar]);

    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              How long have you been together for as a couple?
            </Text>

            <Text style={styles.subtitle}>
              We’ll add this to your relationship timeline and send you
              reminders on your anniversary.
            </Text>

            <View style={{ marginTop: hp(4) }} />

            <Text style={styles.sectionLabel}>We’ve been together since</Text>

            <View style={styles.dateCard}>
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            </View>

            <View style={{ marginTop: hp(5) }} />

            <View style={styles.datePickerContainer}>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                  themeVariant="dark"
                  textColor="#FFFFFF"
                />
              ) : (
                <Suspense
                  fallback={<ActivityIndicator size="large" color="#6A4CFF" />}
                >
                  <InlineDatePicker
                    initialDate={selectedDate}
                    onDateChange={(date) => {
                      setSelectedDate(date);
                      updateOnboarding({ relationshipDuration: date });
                    }}
                  />
                </Suspense>
              )}
            </View>

            <View style={{ marginTop: hp(5) }} />

            

            <View style={styles.infoContainer}>
              <View style={styles.illustrationContainer}>
              <SterlitziaPlant width="100%" height="100%" />
            </View>
              <Text style={styles.infoTitle}>
                Going strong well beyond the early years.
              </Text>
              <Text style={styles.infoText}>
                Here’s to you. Beyond the honeymoon stage, you’re developing a
                deeper partnership where shared goals will guide your next
                steps.
              </Text>
            </View>

            <View style={{ marginTop: hp(2) }} />
          </ScrollView>
        </View>

        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={t("onboarding.continue")}
              marginTop={hp(1.5)}
              backgroundColor={"#6A4CFF"}
              textColor={"#FFFFFF"}
              viewStyle={{ alignSelf: "center" }}
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
    marginRight: wp(6),
    lineHeight: scaleFont(36),
  },
  subtitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#AAAAAA",
    marginLeft: wp(5.5),
    marginTop: hp(2),
    marginRight: wp(6),
    lineHeight: scaleFont(20),
  },
  sectionLabel: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    marginLeft: wp(5.5),
  },
  dateCard: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: wp(5.5),
    marginTop: hp(2),
    borderRadius: 14,
    paddingVertical: hp(2.5),
    paddingHorizontal: wp(4),
    borderWidth: 1,
    borderColor: "#6A4CFF",
  },
  dateText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
  },
  datePickerContainer: {
    marginTop: hp(2),
    alignItems: "center",
  },
  infoContainer: {
    alignItems: "center",
    marginHorizontal: wp(8),
  },
  infoTitle: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    textAlign: "center",
  },
  infoText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#AAAAAA",
    marginTop: hp(1.5),
    textAlign: "center",
    lineHeight: scaleFont(20),
  },
  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
  illustrationContainer: {
    width: scaleWidth(300),
    height: scaleHeight(300),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ThirtyPercentContent;
