import React from "react";
import {
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { scaleFont, scaleWidth } from "@utilities/responsive-design";

interface ButtonWithoutFeedbackProps {
  width?: number;
  backgroundColor?: string;
  text: string;
  textColor?: string;
  fontFamily?: string;
  fontSize?: number;
  marginTop?: number;
  onPress?: () => void;
  viewStyle?: ViewStyle;
  textStyle?: TextStyle;
}

const ButtonWithoutFeedback: React.FC<ButtonWithoutFeedbackProps> = React.memo(
  ({
    width = scaleWidth(362),
    backgroundColor = "#000000",
    text,
    textColor = "#121212",
    fontFamily = "HelveticaRegular",
    fontSize = scaleFont(17),
    marginTop = hp(2),
    onPress,
    viewStyle,
    textStyle,
  }) => {
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={[
            styles.button,
            {
              width,
              backgroundColor,
              marginTop,
            },
            viewStyle,
          ]}
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
        </View>
      </TouchableWithoutFeedback>
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

export default ButtonWithoutFeedback;
