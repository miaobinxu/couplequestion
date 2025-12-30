import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";

interface DropdownModalProps {
  visible: boolean;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

const DropdownModal: React.FC<DropdownModalProps> = ({
  visible,
  options,
  selected,
  onSelect,
  onClose,
}) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    selected === item && styles.selectedOption,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected === item && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DropdownModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: wp(10),
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
  },
  option: {
    padding: hp(1.2),
    borderRadius: 5,
  },
  optionText: {
    fontSize: scaleFont(16),
    fontFamily: "HelveticaRegular",
    color: "#1C1C1C",
  },
  selectedOption: {
    backgroundColor: "#F0F0F0",
  },
  selectedOptionText: {
    fontFamily: "HelveticaBold",
    color: "#698D5F",
  },
});
