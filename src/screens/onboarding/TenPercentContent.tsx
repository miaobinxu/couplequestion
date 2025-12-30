import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
  Dimensions,
  Animated,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont } from "@utilities/responsive-design";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

interface TenPercentContentProps {
  updateProgressBar: (progress: number) => void;
  continueLabel?: string;
}

const TenPercentContent: React.FC<TenPercentContentProps> = React.memo(
  ({ updateProgressBar, continueLabel = "Continue" }) => {
    const { name, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const [userName, setUserName] = useState<string>(name || "");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const buttonAnimation = useRef(new Animated.Value(0)).current;
    const opacityAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        (event) => {
          const height = event.endCoordinates.height;
          setKeyboardHeight(height);
          
          Animated.parallel([
            Animated.timing(buttonAnimation, {
              toValue: height,
              duration: event.duration || 250,
              useNativeDriver: false,
            }),
            Animated.timing(opacityAnimation, {
              toValue: 1,
              duration: event.duration || 250,
              useNativeDriver: false,
            })
          ]).start();
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        (event) => {
          Animated.parallel([
            Animated.timing(buttonAnimation, {
              toValue: 0,
              duration: event.duration || 250,
              useNativeDriver: false,
            }),
            Animated.timing(opacityAnimation, {
              toValue: 0,
              duration: event.duration || 250,
              useNativeDriver: false,
            })
          ]).start(() => {
            setKeyboardHeight(0);
          });
        }
      );

      return () => {
        keyboardDidHideListener?.remove();
        keyboardDidShowListener?.remove();
      };
    }, []);

    const handleNameChange = useCallback(
      (text: string) => {
        setUserName(text);
        updateOnboarding({ name: text });
      },
      [updateOnboarding]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.2);
    }, [updateProgressBar]);

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.contentPart}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>
              Hey, I'm <Text style={styles.brandName}>inSky</Text>, what is your
              name?
            </Text>
            <TextInput
              style={styles.textInput}
              value={userName}
              onChangeText={handleNameChange}
              placeholder={t("onboarding.name.placeholder")}
              placeholderTextColor="#666666"
              autoCapitalize="words"
              autoCorrect={false}
            />
            <View style={{ marginTop: hp(2) }}></View>
          </ScrollView>
        </View>

        <Animated.View
          style={[
            styles.keyboardButtonContainer,
            {
              bottom: buttonAnimation,
              opacity: opacityAnimation,
            },
          ]}
        >
          <ButtonWithFeedback
            text={
              continueLabel === "Continue"
                ? t("onboarding.continue")
                : continueLabel
            }
            backgroundColor={userName.trim() !== "" ? "#6A4CFF" : "#333333"}
            textColor={userName.trim() !== "" ? "#FFFFFF" : "#666666"}
            viewStyle={{
              alignSelf: "center",
            }}
            disabled={userName.trim() === ""}
            onPress={handleContinue}
          />
        </Animated.View>

        {keyboardHeight === 0 && (
          <SafeAreaView edges={["bottom"]}>
            <View style={styles.buttonPart}>
              <ButtonWithFeedback
                text={
                  continueLabel === "Continue"
                    ? t("onboarding.continue")
                    : continueLabel
                }
                marginTop={hp(1.5)}
                backgroundColor={userName.trim() !== "" ? "#6A4CFF" : "#333333"}
                textColor={userName.trim() !== "" ? "#FFFFFF" : "#666666"}
                viewStyle={{
                  alignSelf: "center",
                }}
                disabled={userName.trim() === ""}
                onPress={handleContinue}
              />
            </View>
          </SafeAreaView>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  contentPart: {
    flex: Platform.OS === "ios" ? (isIphoneSE() ? 6 : 10) : 7.5,
    backgroundColor: "#000000",
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(28),
    color: "#FFFFFF",
    marginLeft: wp(5.5),
    marginTop: hp(0.6),
    lineHeight: scaleFont(36),
  },
  brandName: {
    fontFamily: "HelveticaRegular",
    color: "#6A4CFF",
  },
  textInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    marginHorizontal: wp(5.5),
    marginTop: hp(4),
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#6A4CFF",
  },
  buttonPart: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderTopWidth: 1.5,
    paddingBottom: hp(2),
  },
  keyboardButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#000000",
    paddingVertical: hp(2),
    paddingHorizontal: wp(5.5),
  },
});

export default TenPercentContent;
