import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import hapticFeedback from "@/src/utilities/hapticUtil";

interface CustomAddressPickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (address: string) => void;
  initialAddress: string;
  title: string;
}

const CustomAddressPicker: React.FC<CustomAddressPickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialAddress,
  title,
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset address when modal opens
  useEffect(() => {
    if (visible) {
      setAddress(initialAddress);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [visible, initialAddress]);

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

  const selectSuggestion = useCallback((suggestion: any) => {
    hapticFeedback.light();
    setAddress(suggestion.description);
    setSuggestions([]);
    setShowSuggestions(false);
  }, []);

  const handleAddressChange = useCallback(
    (text: string) => {
      setAddress(text);
      fetchAddressSuggestions(text);
    },
    [fetchAddressSuggestions]
  );

  const handleConfirm = () => {
    hapticFeedback.success();
    onConfirm(address.trim());
    onClose();
  };

  const handleCancel = () => {
    hapticFeedback.light();
    setAddress(initialAddress);
    setSuggestions([]);
    setShowSuggestions(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
              </View>

              <View style={styles.inputContainer}>
                <TouchableWithoutFeedback>
                  <TextInput
                    style={styles.textInput}
                    value={address}
                    onChangeText={handleAddressChange}
                    placeholder="Enter address"
                    placeholderTextColor="#666666"
                    autoCapitalize="words"
                    autoFocus
                  />
                </TouchableWithoutFeedback>

                {showSuggestions && suggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                      data={suggestions}
                      keyExtractor={(item) => item.place_id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.suggestionItem}
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

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    { opacity: address.trim() ? 1 : 0.5 },
                  ]}
                  onPress={handleConfirm}
                  disabled={!address.trim()}
                >
                  <Text style={styles.confirmText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    width: wp(95),
    height: hp(60),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderColor: "#4C4C4C",
  },
  header: {
    alignItems: "center",
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    marginHorizontal: wp(5),
  },
  title: {
    fontFamily: "CormorantGaramondSemiBold",
    fontSize: scaleFont(20),
    color: "#FFFFFF",
  },
  inputContainer: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.5),
    flex: 1,
  },
  textInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#4C4C4C",
  },
  suggestionsContainer: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4C4C4C",
    marginTop: hp(1),
    flex: 1,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 0.5,
    borderBottomColor: "#333333",
  },
  suggestionText: {
    color: "#FFFFFF",
    fontSize: scaleFont(14),
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: hp(2),
    borderTopWidth: 1,
    borderTopColor: "#333333",
    marginHorizontal: wp(5),
  },
  cancelButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    marginHorizontal: wp(1),
    backgroundColor: "#333333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: hp(1.5),
    marginHorizontal: wp(1),
    backgroundColor: "#6A4CFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#CCCCCC",
    fontWeight: "600",
  },
  confirmText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    fontWeight: "600",
  },
});

export default CustomAddressPicker;
