import React, { useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { scaleFont } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";

// Import the new SVG
// @ts-ignore
import InLovePana1 from "@assets/svg/In-love-pana-1.svg";
import HeartBroken1 from "@assets/svg/Heartbroken-amico-1.svg";

interface SixtyPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const SixtyPercentContent: React.FC<SixtyPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const handleContinue = useCallback(() => {
      updateProgressBar(0.7);
    }, [updateProgressBar]);

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              Paired helps couples stay in love
            </Text>

            <View style={{ marginTop: hp(6) }} />

            {/* CARD STACK */}
            <View style={styles.stackContainer}>
              {/* WITHOUT PAIRED (BACK CARD) */}
              <View style={styles.withoutCard}>
                <Text style={styles.withoutTitle}>Without Paired</Text>

                {[
                  "Stuck in the day to day routine",
                  "Feeling detached",
                  "Avoiding deeper conversations",
                  "Not sure what steps to take to improve your relationship",
                ].map((text) => (
                  <View key={text} style={styles.bulletRow}>
                    <View style={styles.minusCircle}>
                      <Text style={styles.minus}>−</Text>
                    </View>
                    <Text style={styles.withoutText}>{text}</Text>
                  </View>
                ))}

               <View style={styles.illustrationContainer}>
                  <HeartBroken1 width="100%" height="100%" />
                </View>
              </View>

              {/* WITH PAIRED (FRONT CARD) */}
              <View style={styles.withCard}>
                <Text style={styles.withTitle}>With Paired</Text>

                {[
                  "Getting to know each other on a deeper level",
                  "Feeling connected every day",
                  "Talking openly about sex, finances, conflict",
                  "Reaching your relationship goals together",
                ].map((text) => (
                  <View key={text} style={styles.bulletRow}>
                    <View style={styles.checkCircle}>
                      <Text style={styles.check}>✓</Text>
                    </View>
                    <Text style={styles.withText}>{text}</Text>
                  </View>
                ))}

                {/* SVG Illustration Replaces Placeholder */}
                <View style={styles.illustrationContainer}>
                  <InLovePana1 width="100%" height="100%" />
                </View>
              </View>
            </View>

            <View style={{ marginTop: hp(4) }} />
          </ScrollView>
        </View>

        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={continueLabel}
              marginTop={hp(1.5)}
              backgroundColor="#6A4CFF"
              textColor="#FFFFFF"
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
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(28),
    color: "#111111",
    marginLeft: wp(5.5),
    marginTop: hp(0.6),
    marginRight: wp(6),
    lineHeight: scaleFont(36),
  },

  /* STACK */
  stackContainer: {
    height: hp(55),
    marginHorizontal: wp(5.5),
  },

  /* WITHOUT CARD */
  withoutCard: {
    position: "absolute",
    top: hp(4),
    left: 0,
    width: "55%",
    backgroundColor: "#6C4EFF0D",
    borderRadius: 20,
    padding: wp(4),
    borderWidth: 1,
    borderColor: "#6C4EFF33",
    zIndex: 1,
  },
  withoutTitle: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(16),
    color: "#111111",
    marginBottom: hp(2),
  },

  /* WITH CARD */
  withCard: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "55%",
    backgroundColor: "#E2DCFF",
    borderRadius: 20,
    padding: wp(4),
    zIndex: 2,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  withTitle: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(16),
    color: "#111111",
    marginBottom: hp(2),
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(1.6),
  },

  minusCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "#B0B0B0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },
  minus: {
    color: "#B0B0B0",
    fontSize: 14,
    fontWeight: "bold",
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#6C4EFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(2),
  },
  check: {
    color: "#6C4EFF",
    fontSize: 14,
    fontWeight: "bold",
  },

  withoutText: {
    color: "#666666",
    fontSize: scaleFont(13),
    flex: 1,
  },
  withText: {
    color: "#111111",
    fontSize: scaleFont(13),
    flex: 1,
  },

  /* SVG / Illustration */
  illustrationContainer: {
    height: hp(14),
    marginTop: hp(2),
    borderRadius: 12,
    overflow: "hidden",
  },
  
  illustrationPlaceholderMuted: {
    height: hp(14),
    marginTop: hp(2),
    borderRadius: 12,
    backgroundColor: "#EFEFEF",
  },

  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    borderTopColor: "#E5E5E5",
    paddingBottom: hp(2),
  },
});

export default SixtyPercentContent;