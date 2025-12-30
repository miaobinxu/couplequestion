import { scaleFont } from "@/src/utilities/responsive-design";
import { Text, StyleSheet, View, TouchableOpacity, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";
import InSkyLogo from "@assets/svg/home/inSky.svg";
import askMeAnythingImage from "@assets/images/home/ask-me-anything.png";
import dailyHoroscopeImage from "@assets/images/home/daily-horoscope.png";
import romanticAdviceImage from "@assets/images/home/romantic-advice.png";
import { useRouter } from "expo-router";

interface HomeProps {
  scanType?: "product" | "food" | "skin" | undefined;
  data?: string[] | undefined;
}

export default function Home({ data, scanType }: HomeProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleCardPress = (cardType: string) => {
    console.log(`${cardType} card pressed`);
    if (cardType === "askMeAnything") {
      router.push("/spiritual-cleanse");
    } else if (cardType === "dailyHoroscope") {
      router.push("/daily-horoscope");
    } else if (cardType === "romanticAdvice") {
      router.push("/romantic-advice");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View style={styles.mainContent}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <InSkyLogo width={200} height={80} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Ask Me Anything Card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleCardPress("askMeAnything")}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>
                    {t("home.cards.askMeAnything.title")}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {t("home.cards.askMeAnything.subtitle")}
                  </Text>
                  <View style={styles.seeMoreContainer}>
                    <Text style={styles.seeMoreText}>
                      {t("home.cards.seeMore")}
                    </Text>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </View>
                <View style={styles.cardImageContainer}>
                  <Image source={askMeAnythingImage} style={styles.cardImage} />
                </View>
              </View>
            </TouchableOpacity>

            {/* Daily Horoscope Card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleCardPress("dailyHoroscope")}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>
                    {t("home.cards.dailyHoroscope.title")}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {t("home.cards.dailyHoroscope.subtitle")}
                  </Text>
                  <View style={styles.seeMoreContainer}>
                    <Text style={styles.seeMoreText}>
                      {t("home.cards.seeMore")}
                    </Text>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </View>
                <View style={styles.cardImageContainer}>
                  <Image
                    source={dailyHoroscopeImage}
                    style={styles.cardImage}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* Romantic Advice Card */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleCardPress("romanticAdvice")}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>
                    {t("home.cards.romanticAdvice.title")}
                  </Text>
                  <Text style={styles.cardSubtitle}>
                    {t("home.cards.romanticAdvice.subtitle")}
                  </Text>
                  <View style={styles.seeMoreContainer}>
                    <Text style={styles.seeMoreText}>
                      {t("home.cards.seeMore")}
                    </Text>
                    <Text style={styles.arrow}>›</Text>
                  </View>
                </View>
                <View style={styles.cardImageContainer}>
                  <Image
                    source={romanticAdviceImage}
                    style={styles.cardImage}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  header: {
    alignItems: "center",
    paddingVertical: hp(4),
  },
  content: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
  },
  card: {
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    marginBottom: hp(2),
    overflow: "hidden",
    borderColor: "#4C4C4C",
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: "row",
    paddingLeft: wp(5),
    paddingRight: wp(2),
    paddingTop: wp(2),
    paddingBottom: wp(2),
    alignItems: "center",
  },
  cardTextContainer: {
    flex: 1,
    paddingRight: wp(1),
    paddingVertical: hp(1),
  },
  cardTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    fontWeight: "condensed",
    marginBottom: hp(0.5),
  },
  cardSubtitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#A5A5A5",
    lineHeight: scaleFont(20),
    marginBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  seeMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeMoreText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(12),
    color: "#FFFFFF",
    marginRight: wp(1),
  },
  arrow: {
    fontSize: scaleFont(16),
    color: "#FFFFFF",
  },
  cardImageContainer: {
    width: wp(20),
    height: wp(28),
    //borderRadius: wp(10),
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});
