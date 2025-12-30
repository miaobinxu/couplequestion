import {
  scaleFont,
  scaleHeight,
  scaleWidth,
} from "@/src/utilities/responsive-design";
import { LinearGradient } from "expo-linear-gradient";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

export default function ScanCard({
  title,
  subtitle,
  Icon,
  gradient,
  handleOnScanPress,
  lastIcon = false,
}: {
  title: string;
  subtitle: string;
  Icon: React.FC<any>;
  gradient: string[];
  handleOnScanPress?: () => void;
  lastIcon?: boolean;
}) {
  return (
    <TouchableOpacity onPress={handleOnScanPress} style={styles.cardContainer}>
      <LinearGradient
        colors={gradient}
        locations={[0.3, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={lastIcon ? styles.lastIcon : styles.icon}>
          <Icon />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    shadowColor: "#EAEAEA",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginTop: hp(1.8),
  },
  gradientContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scaleWidth(25),
    paddingRight: scaleHeight(15),
  },
  textContainer: {
    flexShrink: 1,
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(24),
    fontWeight: "bold",
  },
  subtitle: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
  },
  icon: { position: "absolute", height: 75, width: 66, right: 25 },
  lastIcon: {
    position: "absolute",
    height: 75,
    width: 66,
    right: 25,
    bottom: 20,
  },
});
