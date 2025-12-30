import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";

import BackHeader from "@assets/svg/common/back-header.svg";
import ShareHeader from "@assets/svg/common/share-header.svg";

interface PageHeaderProps {
  title?: string;
  showLogo?: boolean;
  onBackPress?: () => void;
  onSharePress?: () => void;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  renderLeftIcon?: React.ReactNode;
  renderRightIcon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showLogo = false,
  onBackPress,
  onSharePress,
  showLeftIcon = true,
  showRightIcon = true,
  renderLeftIcon,
  renderRightIcon,
}) => {
  return (
    <View style={styles.headerContainer}>
      {/* Left Section (15%) */}
      <View style={styles.iconContainer}>
        {showLeftIcon ? (
          <TouchableOpacity onPress={onBackPress}>
            {renderLeftIcon || <BackHeader />}
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Center Section (70%) */}
      <View style={styles.titleContainer}>
        {showLogo ? (
          <Text style={styles.logoText}>UPSKIN</Text>
        ) : (
          <Text style={styles.plainTitle}>{title}</Text>
        )}
      </View>

      {/* Right Section (15%) */}
      <View style={[styles.iconContainer, { alignItems: "flex-end" }]}>
        {showRightIcon ? (
          <TouchableOpacity onPress={onSharePress}>
            {renderRightIcon || <ShareHeader />}
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: hp(2),
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: wp(5),
    height: 47,
  },
  iconContainer: {
    width: "15%",
    justifyContent: "center",
  },
  titleContainer: {
    width: "70%",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: "CormorantSCBold",
    fontSize: scaleFont(32),
    color: "#1C1C1C",
  },
  plainTitle: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(24),
    color: "#1C1C1C",
  },
});

export default PageHeader;
