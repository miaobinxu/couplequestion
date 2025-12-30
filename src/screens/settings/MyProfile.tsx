import React, { useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import { useTranslation } from "@/src/hooks/use-translation";
import { useProfileData } from "@/src/hooks/use-profile-data";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SettingIcon from "@assets/svg/settings/profile-settings.svg";
import EditProfileModal from "./EditProfileModal";
import EditBirthInfoModal from "./EditBirthInfoModal";
import hapticFeedback from "@/src/utilities/hapticUtil";

import BirthInfoEdit from "@assets/svg/settings/birthinfo-edit.svg";
import ProfileNameEdit from "@assets/svg/settings/profile-name-edit.svg";
import DateIcon from "@assets/svg/settings/dateicon.svg";
import LocationIcon from "@assets/svg/settings/locationicon.svg";
import TimeIcon from "@assets/svg/settings/timeicon.svg";

const MyProfile: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isChartExpanded, setIsChartExpanded] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEditBirthInfo, setShowEditBirthInfo] = useState(false);

  const { updateOnboarding } = useOnboardingStore();
  const { profileData } = useProfileData();

  const chartData = [
    { planet: "Sun", sign: "Sagittarius", house: "3" },
    { planet: "Moon", sign: "Pisces", house: "7" },
    { planet: "Mercury", sign: "Capricorn", house: "4" },
    { planet: "Venus", sign: "Scorpio", house: "3" },
    { planet: "Mars", sign: "Libra", house: "2" },
    { planet: "Jupiter", sign: "Scorpio", house: "3" },
    { planet: "Saturn", sign: "Taurus", house: "9" },
    { planet: "Uranus", sign: "Libra", house: "2" },
    { planet: "Neptune", sign: "Sagittarius", house: "3" },
    { planet: "True Node", sign: "Aquarius", house: "6" },
  ];

  const handleEditProfile = () => {
    hapticFeedback.light();
    setShowEditProfile(true);
  };

  const handleEditBirthInfo = () => {
    hapticFeedback.light();
    setShowEditBirthInfo(true);
  };

  const handleSaveProfile = (name: string) => {
    hapticFeedback.success();
    updateOnboarding({ name });
  };

  const handleSaveBirthInfo = (
    birthDate: string,
    birthPlace: string,
    birthTime: string
  ) => {
    hapticFeedback.success();
    console.log("Birth Time ", birthTime);

    // Parse time string like "11:47 PM" to create proper Date object
    const parseTimeString = (timeStr: string): Date => {
      const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/i;
      const match = timeStr.match(timeRegex);
      
      if (match) {
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const isPM = match[3].toUpperCase() === 'PM';
        
        // Convert to 24-hour format
        if (isPM && hours !== 12) {
          hours += 12;
        } else if (!isPM && hours === 12) {
          hours = 0;
        }
        
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
      }
      
      // Fallback to current time if parsing fails
      return new Date();
    };

    updateOnboarding({
      birthDate: new Date(birthDate),
      birthLocation: birthPlace,
      birthTime: parseTimeString(birthTime),
    });
  };

  const handleSettings = () => {
    hapticFeedback.light();
    router.back();
  };

  const toggleChart = () => {
    hapticFeedback.light();
    setIsChartExpanded(!isChartExpanded);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={handleSettings} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity> */}
          <Text style={styles.headerTitle}>{t("settings.profile.title")}</Text>
          <TouchableOpacity
            onPress={handleSettings}
            style={styles.settingsButton}
          >
            <SettingIcon size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profileData.name}</Text>
              <Text style={styles.profileUsername}>{profileData.username}</Text>
            </View>
            <TouchableOpacity
              onPress={handleEditProfile}
              style={styles.editButton}
            >
              <ProfileNameEdit size={20} color="#241b1bff" />
            </TouchableOpacity>
          </View>

          {/* Birth Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={{ ...styles.cardTitle, paddingTop: hp("1%") }}>
                {t("settings.profile.birthInfo")}
              </Text>
              <TouchableOpacity onPress={handleEditBirthInfo}>
                <BirthInfoEdit size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.birthInfoRow}>
              <DateIcon size={20} color="#CCCCCC" />
              <Text style={styles.birthInfoLabel}>
                {t("settings.profile.birthDate")}
              </Text>
              <Text style={styles.birthInfoValue}>{profileData.birthDate}</Text>
            </View>

            <View style={styles.birthInfoRow}>
              <LocationIcon size={20} color="#CCCCCC" />
              <Text style={styles.birthInfoLabel}>
                {t("settings.profile.birthPlace")}
              </Text>
              <Text style={styles.birthInfoValue}>
                {profileData.birthPlace}
              </Text>
            </View>

            <View style={[styles.birthInfoRow, { borderBottomWidth: 0 }]}>
              <TimeIcon size={20} color="#CCCCCC" />
              <Text style={styles.birthInfoLabel}>
                {t("settings.profile.birthTime")}
              </Text>
              <Text style={styles.birthInfoValue}>{profileData.birthTime}</Text>
            </View>
          </View>

          {/* Darlene's Chart Dropdown */}
          <View style={styles.cardTable}>
            <TouchableOpacity
              onPress={toggleChart}
              style={{
                ...styles.cardTableHeader,
                padding: hp(1.5),
                borderBottomColor: "#333333",
                borderBottomWidth: 2,
              }}
            >
              <Text style={styles.cardTitle}>
                {profileData.name}'s {t("settings.profile.chart")}
              </Text>
              <Ionicons
                name={isChartExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <View
              style={{
                ...styles.signsPreview,
                padding: hp(1.5),
              }}
            >
              <Text style={styles.signText}>{profileData.signs.sun}, </Text>
              <Text style={styles.signText}>{profileData.signs.moon}, </Text>
              <Text style={styles.signText}>{profileData.signs.rising}</Text>
            </View>

            {isChartExpanded && (
              <View style={styles.chartTable}>
                <View style={styles.chartGrid}>
                  {chartData.map((item, index) => (
                    <View key={index} style={styles.chartRow}>
                      <View style={styles.chartCell}>
                        <Text style={styles.planetText}>{item.planet}</Text>
                      </View>
                      <View style={styles.chartCell}>
                        <Text style={[styles.signText]}>{item.sign}</Text>
                      </View>
                      <View style={[styles.chartCell, styles.lastCell]}>
                        <Text style={styles.houseText}>{item.house}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        initialName={profileData.name}
        onSave={handleSaveProfile}
      />

      <EditBirthInfoModal
        visible={showEditBirthInfo}
        onClose={() => setShowEditBirthInfo(false)}
        initialBirthDate={profileData.birthDate}
        initialBirthPlace={profileData.birthPlace}
        initialBirthTime={profileData.birthTime}
        onSave={handleSaveBirthInfo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "CormorantGaramondBold",
    fontSize: scaleFont(24),
    color: "#FFFFFF",
    flex: 1,
    textAlign: "center",
  },
  settingsButton: {
    width: wp(10),
    height: wp(10),
    position: "absolute",
    right: wp(5),
    backgroundColor: "#1F1F1F",
    borderRadius: wp(5),
    borderColor: "#4C4C4C",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    marginTop: hp(10),
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(10),
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: hp(4),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileInfo: {
    flex: 1,
    alignItems: "center",
  },
  profileName: {
    fontFamily: "CormorantGaramondBold",
    fontSize: scaleFont(32),
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: hp(0.5),
  },
  profileUsername: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "rgba(255, 255, 255, 0.6)",
  },
  editButton: {
    position: "absolute",
    right: wp(23),
    top: 10,
    padding: 8,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: wp(3),
    marginBottom: hp(2),
    borderColor: "#4C4C4C",
    borderWidth: 1,
  },
  cardTable: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: hp(2),
    borderColor: "#4C4C4C",
    borderWidth: 1,
    overflow: "hidden",
    borderRadius: 16,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },

  cardTableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
  },
  birthInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(1.5),
    backgroundColor: "#303030",
    padding: wp(3),
    borderRadius: 8,
    marginVertical: hp(0.7),
  },
  birthInfoLabel: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: wp(3),
    flex: 1,
  },
  birthInfoValue: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
  },
  signsPreview: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  signText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  chartTable: {
    borderTopColor: "#333333",
    borderTopWidth: 1,
  },
  chartGrid: {
    overflow: "hidden",
  },
  chartRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  chartCell: {
    flex: 1,
    //paddingVertical: hp(1.2),
    paddingHorizontal: wp(2),
    borderRightWidth: 1,
    borderRightColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    minHeight: hp(5),
  },
  lastCell: {
    borderRightWidth: 0,
    borderBottomWidth: 0,
    alignItems: "center",
  },
  planetText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(13),
    color: "#ffffff",
  },
  highlightedSign: {
    color: "#6A4CFF",
  },
  houseText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(13),
    color: "#ffffff",
    textAlign: "center",
  },
});

export default MyProfile;
