import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import InAppReview from "react-native-in-app-review";
import { scaleFont, scaleWidth } from "@utilities/responsive-design";
import { useTranslation } from "@/src/hooks/use-translation";

import reviewRating from "@assets/images/onboarding/review-rating.png";
import ratingAvatars from "@assets/images/onboarding/rating-avatars.png";
import lukeAvatar from "@assets/images/onboarding/luke.png";
import ameliaAvatar from "@assets/images/onboarding/amelia.png";
import fiveStars from "@assets/images/misc/5-stars.png";
import quoteImage from "@assets/images/onboarding/quote.png";
import { SafeAreaView } from "react-native-safe-area-context";
interface EightyPercentContentProps {
  updateProgressBar: (progress: number) => void;
}

const EightyPercentContent: React.FC<EightyPercentContentProps> = React.memo(
  ({ updateProgressBar }) => {
    const { t } = useTranslation();
    const [continueButtonDisabled, setContinueButtonDisabled] =
      useState<boolean>(true);

    const handleContinue = useCallback(() => {
      updateProgressBar(0.7);
    }, []);

    const requestReview = useCallback(async () => {
      try {
        if (InAppReview.isAvailable()) {
          InAppReview.RequestInAppReview();
        }
      } catch (error) {}
    }, []);

    useEffect(() => {
      requestReview();
      const timer = setTimeout(() => {
        setContinueButtonDisabled(false);
      }, 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <>
        <View style={styles.contentPart}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContentContainerStyle}
          >
            <Text style={styles.title}>{t("onboarding.rating.title")}</Text>
            <Image source={reviewRating} style={styles.reviewRating} />
            <Text style={styles.subTitle}>
              {t("onboarding.rating.subtitle")}
            </Text>
            <View style={styles.ratingAvatarsWrapper}>
              <View style={styles.ratingAvatarsContainer}>
                <Image source={ratingAvatars} />
                <Text style={styles.plusTwoMillion}>
                  {t("onboarding.rating.usersCount")}
                </Text>
              </View>
            </View>
            <View style={styles.reviewCard}>
              <View style={styles.picNameStarsPart}>
                <View style={styles.picNamePart}>
                  <Image source={ameliaAvatar} style={styles.avatar} />
                  <Text style={styles.name}>
                    {t("onboarding.rating.reviews.luke.name")}
                  </Text>
                </View>
                <Image source={fiveStars} style={styles.stars} />
              </View>
              <View style={styles.reviewPart}>
                <Text style={styles.reviewText}>
                  {t("onboarding.rating.reviews.luke.text")}
                </Text>
                <Image source={quoteImage} style={styles.quoteMark} />
              </View>
            </View>
            <View
              style={[
                styles.reviewCard,
                {
                  marginTop: hp(3),
                  marginBottom: hp(3),
                },
              ]}
            >
              <View style={styles.picNameStarsPart}>
                <View style={styles.picNamePart}>
                  <Image source={ameliaAvatar} style={styles.avatar} />
                  <Text style={styles.name}>
                    {t("onboarding.rating.reviews.amelia.name")}
                  </Text>
                </View>
                <Image source={fiveStars} style={styles.stars} />
              </View>
              <View style={styles.reviewPart}>
                <Text style={styles.reviewText}>
                  {t("onboarding.rating.reviews.amelia.text")}
                </Text>
                <Image source={quoteImage} style={styles.quoteMark} />
              </View>
            </View>
          </ScrollView>
        </View>
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={t("common.continue")}
              marginTop={hp(1.5)}
              backgroundColor={!continueButtonDisabled ? "#6A4CFF" : "#333333"}
              textColor={!continueButtonDisabled ? "#FFFFFF" : "#666666"}
              viewStyle={{
                alignSelf: "center",
              }}
              onPress={handleContinue}
              disabled={continueButtonDisabled}
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
  scrollViewContentContainerStyle: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#FFFFFF",
    marginTop: hp(0.6),
  },
  reviewRating: {
    marginTop: Platform.OS === "ios" ? hp(3) : hp(2),
  },
  subTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    color: "#FFFFFF",
    marginTop: hp(4.6),
    textAlign: "center",
  },
  ratingAvatarsWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  ratingAvatarsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  plusTwoMillion: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(18),
    color: "#71717A",
    textAlign: "center",
    marginLeft: wp(3),
  },
  reviewCard: {
    width: scaleWidth(362),
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    marginTop: hp(6),
    paddingBottom: hp(2),
  },
  picNameStarsPart: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: hp(1.5),
  },
  picNamePart: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginLeft: wp(3),
    borderColor: "#FFFFFF",
    borderWidth: 1.5,
    width: scaleWidth(50),
    height: scaleWidth(50),
    borderRadius: scaleWidth(25),
  },
  name: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    marginLeft: wp(3),
  },
  stars: {
    resizeMode: "contain",
    marginRight: wp(4),
    height: scaleFont(16),
  },
  reviewPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  reviewText: {
    fontSize: scaleFont(17),
    color: "#FFFFFF",
    lineHeight: Platform.OS === "ios" ? wp(6) : wp(7),
    fontFamily: "HelveticaRegular",
    marginTop: hp(2),
    marginLeft: wp(3),
    marginRight: wp(4),
  },
  quoteMark: {
    marginRight: wp(4),
    alignSelf: "flex-end",
    marginTop: hp(-2.5),
  },
  buttonPart: {
    // flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
});

export default EightyPercentContent;
