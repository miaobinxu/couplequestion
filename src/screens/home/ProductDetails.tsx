import { SCREEN_HEIGHT } from "@/src/utilities/responsive-design";
import React, { useEffect, useRef, useState } from "react";
import { Alert, View, StyleSheet, ScrollView, Platform } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ProductPlacholder from "@assets/svg/home/product-placeholder.svg";
import Verified from "@assets/svg/home/verified.svg";
import Fit from "@assets/svg/home/fit.svg";
import ButtonWithFeedback from "@/src/reusable-components/buttons/ButtonWithFeedback";
import ScoreCard from "@/src/reusable-components/home/ScoreCard";
import IngredientCard from "@/src/reusable-components/home/IngredientCard";
import KeyTakeawayCard from "@/src/reusable-components/home/KeyTakeawayCard";
import SectionContainer from "@/src/reusable-components/home/SectionContainer";
import HeaderCard from "@/src/reusable-components/home/HeaderCard";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import moment from "moment";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useScanStore } from "@/src/global-store/scan-store";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { getRiskLevelLabel, getScoreLabel } from "@/src/utilities/common";
import ImageSlider from "@/src/reusable-components/misc/ImageSlider";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "@/src/hooks/use-translation";

const ProductDetails: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const viewShotRef = useRef(null);
  const { data } = route.params as { data: string };
  const { toggleFavorite } = useScanStore();
  const { t } = useTranslation();

  const productData = JSON.parse(data);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [isFavourite, setIsFavourite] = useState(productData?.isFavourite);
  const [isCapturing, setIsCapturing] = useState(false);

  const formattedDate = moment(productData.id).format("MMM D, HH:mm");

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleFavPress = () => {
    setIsFavourite(!isFavourite);
    toggleFavorite(productData?.id, "product", !productData?.isFavourite);
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
          Alert.alert(t("details.sharing.notAvailable"));
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
      {productData.photos?.[0] ? (
        <ImageSlider images={productData.photos} />
      ) : (
        <ProductPlacholder />
      )}
    </>
  );

  const renderBottomSheetContent = () => (
    <View style={styles.sheetContent}>
      <HeaderCard
        name={productData.name}
        timestamp={formattedDate}
        onPressFavourite={handleFavPress}
        isFavourite={isFavourite}
      />

      <View style={styles.scoreRow}>
        <ScoreCard
          icon={<Verified />}
          title={productData.overallScore?.name}
          score={productData.overallScore?.value}
          scoreText={productData.overallScore?.description}
          color={getScoreLabel(productData.overallScore?.value, t).color}
        />
        <ScoreCard
          icon={<Fit />}
          title={productData.fitScore?.name}
          score={productData.fitScore?.value}
          scoreText={productData.fitScore?.description}
          color={getScoreLabel(productData.fitScore?.value, t).color}
        />
      </View>

      <SectionContainer title={t("details.sections.flaggedIngredients")}>
        {productData.penaltyIngredients?.map((ingredient, index) => (
          <IngredientCard
            key={index}
            title={ingredient.name}
            riskLabel={getRiskLevelLabel(ingredient.riskLevel, t).label}
            riskColor={getRiskLevelLabel(ingredient.riskLevel, t).color}
          />
        ))}
      </SectionContainer>

      <SectionContainer title={t("details.sections.keyIngredients")}>
        {productData.starIngredients?.map((ingredient, index) => (
          <IngredientCard
            key={index}
            title={ingredient.name}
            riskLabel={getRiskLevelLabel(ingredient.riskLevel, t).label}
            riskColor={getRiskLevelLabel(ingredient.riskLevel, t).color}
          />
        ))}
      </SectionContainer>

      <SectionContainer title={t("details.sections.keyTakeaway")}>
        {productData?.keyTakeaway?.map((item: string, index: number) => (
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
};

export default ProductDetails;

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
