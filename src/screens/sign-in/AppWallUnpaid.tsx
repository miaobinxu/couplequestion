import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  BackHandler,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import { useNavigation } from "@react-navigation/native";
import ButtonWithFeedback from "@/src/reusable-components/buttons/ButtonWithFeedback";

import VerifiedIcon from "@assets/svg/appWall/verified.svg";
import SkinTypeIcon from "@assets/svg/appWall/skin-type.svg";
import AcneIcon from "@assets/svg/appWall/acne.svg";
import PoresIcon from "@assets/svg/appWall/pores.svg";
import HydrationIcon from "@assets/svg/appWall/hydration.svg";
import InviteCodeModal from "@/src/reusable-components/appWall/InviteCodeModal";
import { useRouter } from "expo-router";
import { generateReferralCode } from "@/src/services/user.service";
import LoadingOverlay from "@/src/reusable-components/misc/LoadingOverlay";
import { useUserStore } from "@/src/global-store/user-store";
import { useScanStore } from "@/src/global-store/scan-store";
import { useTranslation } from "@/src/hooks/use-translation";

const blurImage = require("@assets/images/appWall/small-blur.png");

const AppWallUnpaid: React.FC = () => {
  const router = useRouter();
  const { initialFaceScan } = useScanStore();
  const navigation = useNavigation();
  const [refferalCodeLoading, setRefferalCodeLoading] = useState(false);
  const { t } = useTranslation();

  const [modalVisible, setModalVisible] = useState(false);
  const handleBackPress = () =>
    router.replace("/sign-in/ready-first-face-scan");
  const toggleModalVisible = () => setModalVisible(!modalVisible);
  const { updateUser, referralCode } = useUserStore();

  const skinInfoItems = [
    { icon: <AcneIcon />, label: t("appWallUnpaid.skinInfo.acne") },
    { icon: <PoresIcon />, label: t("appWallUnpaid.skinInfo.pores") },
    { icon: <HydrationIcon />, label: t("appWallUnpaid.skinInfo.hydration") },
  ];

  const handleGetItNow = () => {
    router.replace("/app-wall");
  };

  const handleInvite3Friends = async () => {
    if (referralCode) {
      return toggleModalVisible();
    }
    try {
      setRefferalCodeLoading(true);
      const { data, error } = await generateReferralCode();
      if (!error) {
        updateUser({ referralCode: data?.code });
        toggleModalVisible();
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setRefferalCodeLoading(false);
    }
  };

  useEffect(() => {
    const backAction = () => {
      router.replace("/sign-in/ready-first-face-scan");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.gradient}>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <PageHeader
          showLogo={false}
          onBackPress={handleBackPress}
          showLeftIcon
          showRightIcon={false}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>{t("appWallUnpaid.revealResults")}</Text>
          <Text style={styles.subtitle}>
            {t("appWallUnpaid.inviteMessage")}
          </Text>

          <View style={styles.profileCircle}>
            <Image
              source={{ uri: initialFaceScan[0] }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.row}>
            <View style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>
                  {t("appWallUnpaid.overallScore")}
                </Text>
                <Image source={blurImage} style={styles.blurStyle} />
              </View>
              <VerifiedIcon />
            </View>

            <View style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>
                  {t("appWallUnpaid.skinType")}
                </Text>
                <Image
                  source={require("@assets/images/appWall/blur.png")}
                  style={styles.blurStyle}
                />
              </View>
              <SkinTypeIcon />
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {t("appWallUnpaid.skinInformation")}
          </Text>

          <View style={styles.row}>
            {skinInfoItems.map(({ icon, label }) => (
              <View key={label} style={styles.skinCard}>
                {icon}
                <Text style={styles.cardTitle}>{label}</Text>
                <Image source={blurImage} style={styles.blurStyle} />
              </View>
            ))}
          </View>
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <ButtonWithFeedback
            backgroundColor="#7C8CD8"
            text={t("appWallUnpaid.getItNow")}
            onPress={handleGetItNow}
          />
          <ButtonWithFeedback
            text={t("appWallUnpaid.inviteFriends")}
            onPress={handleInvite3Friends}
          />
        </SafeAreaView>
      </SafeAreaView>
      <InviteCodeModal
        visible={modalVisible}
        onClose={toggleModalVisible}
        inviteCode={referralCode}
      />
      {refferalCodeLoading && (
        <LoadingOverlay text="Generating refferal code..." />
      )}
    </View>
  );
};

export default AppWallUnpaid;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    alignItems: "center",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(32),
    color: "#1C1C1C",
    textAlign: "center",
    marginBottom: hp(1),
  },
  subtitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    textAlign: "center",
    marginBottom: hp(2),
    paddingHorizontal: wp(5),
  },
  profileCircle: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(3),
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(15),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: hp(2),
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: wp(4),
    marginHorizontal: wp(1.5),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skinCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: wp(4),
    marginHorizontal: wp(1.5),
    alignItems: "flex-start",
    flexDirection: "column",
  },
  cardTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#1C1C1C",
    marginBottom: hp(0.5),
  },
  sectionTitle: {
    alignSelf: "flex-start",
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    marginBottom: hp(1),
    marginTop: hp(1),
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#ededed",
    paddingTop: hp(1),
    paddingBottom: hp(2),
  },
  blurStyle: {
    margin: hp(-1),
  },
});
