import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import RotatingLoader from "./RotatingLoader";
import CircleDashedLogo from "@assets/svg/appWall/circleDashed.svg";

type Props = {
  text?: string | null;
};

const LoadingOverlay: React.FC<Props> = ({ text = "Loading..." }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <RotatingLoader>
          <CircleDashedLogo />
        </RotatingLoader>
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </View>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  container: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(10),
    borderRadius: 12,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: scaleFont(20),
    fontFamily: "HelveticaBold",
    marginTop: wp(3),
    textAlign: "center",
  },
});
