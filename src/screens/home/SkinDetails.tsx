import React, { useEffect, useRef, useState } from "react";
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
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import moment from "moment";

import {
  scaleFont,
  scaleHeight,
  SCREEN_HEIGHT,
} from "@/src/utilities/responsive-design";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import ProductPlacholder from "@assets/svg/home/product-placeholder.svg";
import Verified from "@assets/svg/home/verified.svg";
import Pores from "@assets/svg/home/pores.svg";
import Redness from "@assets/svg/home/redness.svg";
import AcneRisk from "@assets/svg/home/acne-risk.svg";
import Wrinkles from "@assets/svg/home/wrinkles.svg";
import EyeBag from "@assets/svg/home/eye-bag.svg";
import OilinessImpact from "@assets/svg/home/oiliness-impact.svg";
import SkinType from "@assets/svg/home/skin-type.svg";

import ButtonWithFeedback from "@/src/reusable-components/buttons/ButtonWithFeedback";
import ScoreCard from "@/src/reusable-components/home/ScoreCard";
import KeyTakeawayCard from "@/src/reusable-components/home/KeyTakeawayCard";
import SectionContainer from "@/src/reusable-components/home/SectionContainer";
import HeaderCard from "@/src/reusable-components/home/HeaderCard";
import ThreeColumnGrid from "@/src/reusable-components/misc/ThreeColumnGrid";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import { useScanStore } from "@/src/global-store/scan-store";
import { getScoreLabel } from "@/src/utilities/common";
import ImageSlider from "@/src/reusable-components/misc/ImageSlider";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "@/src/hooks/use-translation";

export default function SkinDetails() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const viewShotRef = useRef(null);

  const { data } = route.params as { data: string };
  const { toggleFavorite } = useScanStore();

  const skinData = JSON.parse(data);
  const formattedDate = moment(skinData.date).format("MMM D, HH:mm");
  const [sheetIndex, setSheetIndex] = useState(0);
  const [showScanningCard, setShowScanningCard] = useState(true);
  const [isCapturing, setCapturing] = useState(false);
  const [isFavourite, setIsFavourite] = useState(skinData?.isFavourite);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setShowScanningCard(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleBackPress = () => navigation.goBack();

  const handleFavPress = () => {
    const newFavStatus = !isFavourite;
    setIsFavourite(newFavStatus);
    toggleFavorite(skinData?.id, "skin", newFavStatus);
  };

  const captureAndShare = async () => {
    try {
      setCapturing(true);
      setTimeout(async () => {
        const uri = await captureRef(viewShotRef, {
          quality: 0.9,
          format: "png",
        });
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri);
        } else {
          Alert.alert(t("details.sharing.notAvailable"));
        }
      }, 500);
    } catch (error) {
      console.error("Error capturing and sharing screenshot:", error);
    } finally {
      setTimeout(() => {
        setCapturing(false);
      }, 1000);
    }
  };

  const getSkinConditionTranslation = (name: string) => {
    const keyMap: Record<string, string> = {
      'Acne': 'acne',
      'Pores': 'pores',
      'Hydration': 'hydration',
      'Redness': 'redness',
      'Wrinkles': 'wrinkles',
      'Eye Bag': 'eyeBag',
    };
    const key = keyMap[name] || name.toLowerCase();
    return t(`details.skinConditions.${key}`, { defaultValue: name });
  };

  const renderRiskIcon = (name: string) => {
    switch (name) {
      case "Acne":
        return <AcneRisk />;
      case "Pores":
        return <Pores />;
      case "Hydration":
        return <OilinessImpact />;
      case "Redness":
        return <Redness />;
      case "Wrinkles":
        return <Wrinkles />;
      case "Eye Bag":
        return <EyeBag />;
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
      {skinData.photos?.[0] ? (
        <ImageSlider images={skinData.photos} />
      ) : (
        <ProductPlacholder />
      )}
    </>
  );

  const renderBottomSheetContent = () => (
    <View style={styles.sheetContent}>
      <HeaderCard
        name={skinData.name}
        timestamp={formattedDate}
        onPressFavourite={handleFavPress}
        isFavourite={isFavourite}
      />

      <View style={styles.scoreCardRow}>
        <ScoreCard
          icon={<Verified />}
          title={skinData.overallScore.name}
          score={skinData.overallScore.value.toString()}
          scoreText={skinData.overallScore.description}
          color={getScoreLabel(skinData.overallScore.value, t).color}
        />
        <ScoreCard
          icon={<SkinType />}
          title={t("details.sections.skinType")}
          score={skinData.skinType}
        />
      </View>

      <SectionContainer title={t("details.sections.skinInformation")}>
        <View style={styles.threeGridWrapper}>
          <ThreeColumnGrid
            data={skinData.information}
            renderItem={(item: { name: string; value: string }) => (
              <TouchableOpacity style={styles.riskCard} key={item.name}>
                {renderRiskIcon(item.name)}
                <Text style={styles.riskTitle}>{getSkinConditionTranslation(item.name?.trim())}</Text>
                <Text
                  style={{
                    ...styles.riskScore,
                    color: getScoreLabel(Number(item.value), t).color,
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
        {skinData.keyTakeaway?.map((item: string, index: number) => (
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
  container: { flex: 1 },
  productWrapper: {
    alignItems: "center",
    justifyContent: "center",
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
  scoreCardRow: {
    marginTop: hp(2),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  threeGridWrapper: {
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
    fontSize: scaleFont(14),
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
