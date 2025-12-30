import {
  scaleFont,
  scaleHeight,
  SCREEN_HEIGHT,
} from "@/src/utilities/responsive-design";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ProductPlacholder from "@assets/svg/home/product-placeholder.svg";
import Verified from "@assets/svg/home/verified.svg";
import Dairy from "@assets/svg/home/dairy.svg";
import BloatRisk from "@assets/svg/home/bloat-risk.svg";
import PuffinessRisk from "@assets/svg/home/puffiness-risk.svg";
import SensitivityRisk from "@assets/svg/home/sensitivity-risk.svg";
import AcneRisk from "@assets/svg/home/acne-risk.svg";
import DrynessRisk from "@assets/svg/home/dryness-risk.svg";
import OilinessImpact from "@assets/svg/home/oiliness-impact.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import ButtonWithFeedback from "@/src/reusable-components/buttons/ButtonWithFeedback";
import ScoreCard from "@/src/reusable-components/home/ScoreCard";
import KeyTakeawayCard from "@/src/reusable-components/home/KeyTakeawayCard";
import SectionContainer from "@/src/reusable-components/home/SectionContainer";
import HeaderCard from "@/src/reusable-components/home/HeaderCard";
import ThreeColumnGrid from "@/src/reusable-components/misc/ThreeColumnGrid";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import moment from "moment";
import { useScanStore } from "@/src/global-store/scan-store";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { getScoreLabel } from "@/src/utilities/common";
import ImageSlider from "@/src/reusable-components/misc/ImageSlider";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "@/src/hooks/use-translation";

export default function FoodDetails() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const viewShotRef = useRef(null);
  const { data } = route.params as { data: string };
  const { toggleFavorite } = useScanStore();

  // Parse the received data
  const foodData = JSON.parse(data);
  const [sheetIndex, setSheetIndex] = useState(0);
  const formattedDate = moment(foodData.date).format("MMM D, HH:mm");
  const [isFavourite, setIsFavourite] = useState(foodData?.isFavourite);
  const [isCapturing, setIsCapturing] = useState(false);
  const { t } = useTranslation();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavPress = () => {
    setIsFavourite(!isFavourite);
    toggleFavorite(foodData?.id, "food", !foodData?.isFavourite);
  };

  const captureAndShare = async () => {
    try {
      setIsCapturing(true);
      setTimeout(async () => {
        const uri = await captureRef(viewShotRef, {
          quality: 0.9,
          format: "png",
        });
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert("Sharing not available on this device");
        }
      }, 500);
    } catch (error) {
      console.error("Error capturing and sharing screenshot:", error);
    } finally {
      setTimeout(() => {
        setIsCapturing(false);
      }, 1000);
    }
  };

  const getFoodImpactTranslation = (name: string) => {
    const keyMap: Record<string, string> = {
      'Bloat Risk': 'bloatRisk',
      'Puffiness Risk': 'puffinessRisk',
      'Sensitivity Risk': 'sensitivityRisk',
      'Acne Risk': 'acneRisk',
      'Dryness Risk': 'drynessRisk',
      'Oiliness Impact': 'oilinessImpact',
    };
    const key = keyMap[name] || name.toLowerCase().replace(/ /g, '');
    return t(`details.foodImpacts.${key}`, { defaultValue: name });
  };

  const renderRiskIcon = (name: string) => {
    switch (name) {
      case "Bloat Risk":
        return <BloatRisk />;
      case "Puffiness Risk":
        return <PuffinessRisk />;
      case "Sensitivity Risk":
        return <SensitivityRisk />;
      case "Acne Risk":
        return <AcneRisk />;
      case "Dryness Risk":
        return <DrynessRisk />;
      case "Oiliness Impact":
        return <OilinessImpact />;
      default:
        return null;
    }
  };

  const renderContent = () => (
    <>
      <View style={styles.headerContainer}>
        <PageHeader
          showLogo
          onBackPress={handleBackPress}
          onSharePress={captureAndShare}
          showLeftIcon
          showRightIcon
        />
      </View>
      {foodData.photos?.[0] ? (
        <ImageSlider images={foodData.photos} />
      ) : (
        <ProductPlacholder />
      )}
    </>
  );

  const renderBottomSheetContent = () => (
    <View style={styles.sheetContent}>
      <HeaderCard
        name={foodData.name}
        timestamp={formattedDate}
        onPressFavourite={handleFavPress}
        isFavourite={isFavourite}
      />

      <View style={styles.scoreRow}>
        <ScoreCard
          icon={<Verified />}
          title={foodData.overallScore.name}
          score={foodData.overallScore.value.toString()}
          scoreText={getScoreLabel(foodData.overallScore.value, t).label}
          color={getScoreLabel(foodData.overallScore.value, t).color}
        />
        <ScoreCard
          icon={<Dairy />}
          title={t("details.sections.containsDairy")}
          score={foodData.containsDairy ? t("common.yes") : t("common.no")}
          color={foodData.containsDairy ? "#EB4335" : "#1C1C1C"}
        />
      </View>

      <SectionContainer title={t("details.sections.foodInformation")}>
        <View style={styles.sectionMarginTop}>
          <ThreeColumnGrid
            data={foodData.information}
            renderItem={(item: { name: string; value: string }) => (
              <TouchableOpacity style={styles.riskCard} key={item.name}>
                {renderRiskIcon(item.name)}
                <Text
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={styles.riskTitle}
                >
                  {getFoodImpactTranslation(item.name)}
                </Text>
                <Text
                  style={{
                    ...styles.riskScore,
                    color: getScoreLabel(Number(item.value)).color,
                  }}
                >
                  {item.value}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </SectionContainer>

      <SectionContainer title={t("details.sections.keyTakeaway")}>
        {foodData?.keyTakeaway?.map((item: string, index: number) => (
          <KeyTakeawayCard key={index} text={item} />
        ))}
      </SectionContainer>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <LinearGradient colors={["#F5FAF6", "#D8E6D9"]} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          {isCapturing ? (
            <ScrollView style={styles.container}>
              <View
                style={styles.container}
                collapsable={false}
                ref={viewShotRef}
              >
                <LinearGradient
                  colors={["#F5FAF6", "#D8E6D9"]}
                  style={styles.gradient}
                >
                  {renderContent()}
                  <View style={{ top: hp(-1.5) }}>
                    <LinearGradient
                      colors={["#F5FAF6", "#D8E6D9"]}
                      style={styles.gradient}
                    >
                      {renderBottomSheetContent()}
                    </LinearGradient>
                  </View>
                </LinearGradient>
              </View>
            </ScrollView>
          ) : (
            <>
              {renderContent()}
              <BottomSheet
                animateOnMount
                index={0}
                onChange={(index) => setSheetIndex(index)}
                snapPoints={[SCREEN_HEIGHT - insets.top - 47 - hp(36.5)]}
                enablePanDownToClose={false}
                topInset={insets.top + 47 + hp(3)}
                enableOverDrag={false}
                handleComponent={null}
              >
                <LinearGradient
                  colors={["#F5FAF6", "#D8E6D9"]}
                  style={sheetIndex === 1 ? styles.container : styles.gradient}
                >
                  <BottomSheetScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={styles.scrollViewContentContainerStyle}
                    style={styles.container}
                  >
                    {renderBottomSheetContent()}
                  </BottomSheetScrollView>
                </LinearGradient>
              </BottomSheet>
            </>
          )}
        </SafeAreaView>
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerContainer: { marginBottom: hp(1) },
  gradient: { flex: 1, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  container: {
    flex: 1,
  },
  productWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1),
    // marginVertical: hp(3),
  },
  productImage: {
    height: 200,
    width: "100%",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FCFA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollViewContentContainerStyle: {
    padding: wp(5),
  },
  scoreRow: {
    marginTop: hp(2),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionMarginTop: {
    marginTop: hp(2),
  },
  riskCard: {
    height: scaleHeight(120),
    backgroundColor: "#FFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(3),
  },
  riskTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(13),
    color: "#1C1C1C",
  },
  riskScore: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(20),
    color: "#FFB900",
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    zIndex: 1000,
  },
  sheetContent: {
    padding: wp(5),
  },
});
