import React from "react";
import { StyleSheet, Image, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

import backArrowIcon from "@assets/images/misc/backArrow.png";

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={backArrowIcon} style={styles.backArrowIcon} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  backArrowIcon: {
    marginLeft: wp(5),
    tintColor: "#000000",
  },
});

export default BackButton;
