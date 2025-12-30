import React, { useState, useMemo } from "react";
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
import PageHeader from "@/src/reusable-components/misc/PageHeader";
import { useNavigation } from "@react-navigation/native";
import ArrowDown from "@assets/svg/settings/arrow-down-black.svg";
import ScannedCard from "@/src/reusable-components/home/ScannedCards";
import DropdownModal from "@/src/reusable-components/misc/DropdownModal";
import { useScanStore } from "@/src/global-store/scan-store";
import NotScannedCard from "@/src/reusable-components/home/NotScannedCard";
import { useTranslation } from "@/src/hooks/use-translation";

const ScanHistory = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState<"recents" | "favorites">(
    "recents"
  );
  const [filter, setFilter] = useState("All");
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Fetch scan data from the global store
  const { food, product, skin } = useScanStore();

  // Helper function to translate filter options
  const getFilterLabel = (filterKey: string) => {
    switch (filterKey) {
      case "All":
        return t("scanHistory.filter.all");
      case "Skin":
        return t("scanHistory.filter.skin");
      case "Product":
        return t("scanHistory.filter.product");
      case "Food":
        return t("scanHistory.filter.food");
      default:
        return filterKey;
    }
  };

  // Helper function to get filter key from translated label
  const getFilterKeyFromLabel = (label: string) => {
    if (label === t("scanHistory.filter.all")) return "All";
    if (label === t("scanHistory.filter.skin")) return "Skin";
    if (label === t("scanHistory.filter.product")) return "Product";
    if (label === t("scanHistory.filter.food")) return "Food";
    return label;
  };

  // Create translated options for the dropdown
  const filterOptions = [
    t("scanHistory.filter.all"),
    t("scanHistory.filter.skin"),
    t("scanHistory.filter.product"),
    t("scanHistory.filter.food"),
  ];

  // Helper function to get dynamic title and description
  const getEmptyMessage = (filter: string) => {
    if (selectedTab === "favorites") {
      return {
        title: t("scanHistory.empty.noFavorites.title"),
        description: t("scanHistory.empty.noFavorites.description"),
      };
    }

    switch (filter) {
      case "Food":
        return {
          title: t("scanHistory.empty.noFood.title"),
          description: t("scanHistory.empty.noFood.description"),
        };
      case "Product":
        return {
          title: t("scanHistory.empty.noProduct.title"),
          description: t("scanHistory.empty.noProduct.description"),
        };
      case "Skin":
        return {
          title: t("scanHistory.empty.noSkin.title"),
          description: t("scanHistory.empty.noSkin.description"),
        };
      default:
        return {
          title: t("scanHistory.empty.noScans.title"),
          description: t("scanHistory.empty.noScans.description"),
        };
    }
  };

  // Combine and filter the data based on the selected filter
  const filteredData = useMemo(() => {
    let combinedList: any[] = [];

    // Combine data based on the selected filter
    if (filter === "All") {
      combinedList = [...food, ...product, ...skin];
    } else if (filter === "Food") {
      combinedList = food;
    } else if (filter === "Product") {
      combinedList = product;
    } else if (filter === "Skin") {
      combinedList = skin;
    }

    // Filter favorites if the selected tab is "favorites"
    if (selectedTab === "favorites") {
      combinedList = combinedList.filter((item) => item.isFavourite);
    }

    // Sort by date (assuming 'id' is a timestamp or date string)
    combinedList.sort(
      (a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()
    );

    return combinedList;
  }, [food, product, skin, filter, selectedTab]);

  const handleBackPress = () => navigation.goBack();

  return (
    <View style={styles.gradient}>
      <SafeAreaView edges={["top"]} style={styles.container}>
        <PageHeader
          showLogo={true}
          onBackPress={handleBackPress}
          showLeftIcon={true}
          showRightIcon={false}
        />

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {[
            { key: "recents", label: t("scanHistory.tabs.recents") },
            { key: "favorites", label: t("scanHistory.tabs.favorites") }
          ].map((tab, index) => {
            const isActive = selectedTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  isActive && styles.activeTab,
                  index === 0 && { marginRight: wp(1) },
                ]}
                onPress={() => setSelectedTab(tab.key as any)}
              >
                <Text
                  style={[styles.tabText, isActive && styles.activeTabText]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Filter */}
        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>{t("scanHistory.filter.label")}</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.dropdownText}>
              {getFilterLabel(filter)}
            </Text>
            <ArrowDown />
          </TouchableOpacity>
        </View>

        {/* Scrollable List */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContentContainerStyle}
        >
          {filteredData?.length > 0 ? (
            <ScannedCard cardData={filteredData} />
          ) : (
            <NotScannedCard
              title={getEmptyMessage(filter).title}
              description={getEmptyMessage(filter).description}
            />
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Filter Dropdown Modal */}
      <DropdownModal
        visible={showFilterModal}
        options={filterOptions}
        selected={getFilterLabel(filter)}
        onSelect={(value) => setFilter(getFilterKeyFromLabel(value))}
        onClose={() => setShowFilterModal(false)}
      />
    </View>
  );
};

export default ScanHistory;

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
  scrollViewContentContainerStyle: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: wp(5),
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginTop: hp(2),
    padding: wp(1),
  },
  tab: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#F4F6F5",
  },
  activeTab: {
    backgroundColor: "#698D5F",
  },
  tabText: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(14),
    color: "#1C1C1C",
  },
  activeTabText: {
    color: "#fff",
    fontFamily: "HelveticaBold",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: wp(5),
    marginVertical: hp(2),
    borderWidth: 1,
    borderColor: "#EDEDED",
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: wp(4),
  },
  filterLabel: {
    fontSize: scaleFont(16),
    fontFamily: "HelveticaRegular",
    color: "#1C1C1C",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: scaleFont(16),
    marginRight: 5,
    fontFamily: "HelveticaRegular",
    color: "#1C1C1C",
  },
});
