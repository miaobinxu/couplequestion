import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";

interface ButtonWithFeedbackProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  text: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  marginTop?: number;
  borderRadius?: number;
  onPress?: () => void;
  viewStyle?: ViewStyle;
  disabled?: boolean;
  textStyle?: TextStyle;
}

const ButtonWithFeedback: React.FC<ButtonWithFeedbackProps> = React.memo(
  ({
    width = scaleWidth(362),
    height = scaleHeight(50),
    backgroundColor = "#6A4CFF",
    text,
    textColor = "#FFFFFF",
    fontFamily = "HelveticaBold",
    fontSize = scaleFont(17),
    marginTop = hp(2),
    borderRadius = 12,
    onPress,
    viewStyle,
    disabled = false,
    textStyle,
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          {
            width,
            height,
            backgroundColor,
            marginTop,
            borderRadius,
          },
          viewStyle,
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontFamily,
              fontSize,
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
  },
});

export default ButtonWithFeedback;
