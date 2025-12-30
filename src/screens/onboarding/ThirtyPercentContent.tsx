import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";
import { isIphoneSE } from "@/src/utilities/check-mobile-device";
import { useOnboardingStore } from "@global-store/onboarding-store";
import { scaleFont } from "@utilities/responsive-design";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "@/src/hooks/use-translation";

interface ThirtyPercentContentProps {
  updateProgressBar: (progress: number) => void;
}

const ThirtyPercentContent: React.FC<ThirtyPercentContentProps> = React.memo(
  ({ updateProgressBar }) => {
    const { birthLocation, updateOnboarding } = useOnboardingStore();
    const { t } = useTranslation();

    const [location, setLocation] = useState<string>(birthLocation || "");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const fetchAddressSuggestions = useCallback(async (query: string) => {
      if (query.length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
        const response = await fetch(
          `https://places.googleapis.com/v1/places:autocomplete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": API_KEY,
            },
            body: JSON.stringify({
              input: query,
              includedPrimaryTypes: ["locality", "administrative_area_level_1"],
              languageCode: "en",
            }),
          }
        );
        const data = await response.json();
        // console.log("Google Places API (New) data = ", data);

        if (data.suggestions) {
          const predictions = data.suggestions.map((suggestion: any) => ({
            place_id:
              suggestion.placePrediction?.placeId || Math.random().toString(),
            description:
              suggestion.placePrediction?.text?.text ||
              suggestion.stringPrediction?.text ||
              "Unknown location",
          }));
          setSuggestions(predictions);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, []);

    const selectSuggestion = useCallback(
      (suggestion: any) => {
        setLocation(suggestion.description);
        updateOnboarding({ birthLocation: suggestion.description });
        setSuggestions([]);
        setShowSuggestions(false);
      },
      [updateOnboarding]
    );

    const handleLocationChange = useCallback(
      (text: string) => {
        setLocation(text);
        updateOnboarding({ birthLocation: text });
        fetchAddressSuggestions(text);
      },
      [updateOnboarding, fetchAddressSuggestions]
    );

    const handleContinue = useCallback(() => {
      updateProgressBar(0.4);
    }, [updateProgressBar]);

    return (
      <>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.contentPart}>
            <Text style={styles.title}>{t("onboarding.birthPlace.title")}</Text>

            <TouchableWithoutFeedback>
              <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={handleLocationChange}
                placeholder={t("onboarding.birthPlace.placeholder")}
                placeholderTextColor="#666666"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </TouchableWithoutFeedback>

            {showSuggestions && suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                <FlatList
                  data={suggestions}
                  keyExtractor={(item) => item.place_id}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      style={[
                        styles.suggestionItem,
                        index === suggestions.length - 1 &&
                          styles.lastSuggestionItem,
                      ]}
                      onPress={() => selectSuggestion(item)}
                    >
                      <Text style={styles.suggestionText}>
                        {item.description}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={styles.suggestionsList}
                  nestedScrollEnabled
                />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
        <SafeAreaView edges={["bottom"]}>
          <View style={styles.buttonPart}>
            <ButtonWithFeedback
              text={t("common.continue")}
              marginTop={hp(1.5)}
              backgroundColor={location.trim() !== "" ? "#6A4CFF" : "#333333"}
              textColor={location.trim() !== "" ? "#FFFFFF" : "#666666"}
              viewStyle={{
                alignSelf: "center",
              }}
              disabled={location.trim() === ""}
              onPress={handleContinue}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
);

const styles = StyleSheet.create({
  contentPart: {
    flex: Platform.OS === "ios" ? (isIphoneSE() ? 6 : 10) : 7.5,
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(28),
    color: "#FFFFFF",
    marginLeft: wp(5.5),
    marginTop: hp(0.6),
    marginRight: wp(4),
    lineHeight: scaleFont(36),
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
  suggestionsContainer: {
    marginHorizontal: wp(5.5),
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333333",
    marginTop: hp(2),
    maxHeight: hp(80),
  },
  suggestionsList: {
    maxHeight: hp(80),
  },
  suggestionItem: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
  },
  lastSuggestionItem: {
    borderBottomWidth: 0,
  },
  suggestionText: {
    color: "#FFFFFF",
    fontSize: scaleFont(14),
  },
});

export default ThirtyPercentContent;
