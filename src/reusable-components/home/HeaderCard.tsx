import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import FavouriteOutline from "@assets/svg/home/fav-outline.svg";
import FavouriteFilled from "@assets/svg/home/fav-filled.svg";
import Timer from "@assets/svg/home/timer.svg";

interface HeaderCardProps {
  name: string;
  timestamp: string;
  onPressFavourite?: () => void;
  containerStyle?: ViewStyle;
  nameStyle?: TextStyle;
  isFavourite: boolean;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  name,
  timestamp,
  onPressFavourite,
  containerStyle,
  nameStyle,
  isFavourite,
}) => {
  return (
    <View style={containerStyle}>
      <View style={styles.topRow}>
        <Text style={[styles.nameText, nameStyle]} numberOfLines={2}>
          {name}
        </Text>
        <TouchableOpacity onPress={onPressFavourite}>
          {isFavourite ? <FavouriteFilled /> : <FavouriteOutline />}
        </TouchableOpacity>
      </View>

      <View style={styles.timestampContainer}>
        <Timer />
        <Text style={styles.timestampText}>{timestamp}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(24),
    fontWeight: "bold",
    color: "#1C1C1C",
    flexShrink: 1,
    marginRight: 20,
  },
  timestampContainer: {
    backgroundColor: "#FFA63A",
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingVertical: hp(0.3),
    paddingHorizontal: hp(0.8),
    borderRadius: 39,
    alignItems: "center",
    marginTop: hp(1),
    gap: 4,
  },
  timestampText: {
    color: "#fff",
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    fontWeight: "bold",
    marginLeft: 4,
  },
});

export default HeaderCard;
