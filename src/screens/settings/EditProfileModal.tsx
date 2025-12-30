import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import { useTranslation } from "@/src/hooks/use-translation";
import { Ionicons } from "@expo/vector-icons";
import ButtonWithFeedback from "@reusable-components/buttons/ButtonWithFeedback";

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  initialName: string;
  onSave: (name: string) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  initialName,
  onSave,
}) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);

  const handleSave = () => {
    onSave(name.trim());
    onClose();
  };

  const isValid = name.trim() !== "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#666666"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.buttonContainer}>
            <ButtonWithFeedback
              text="Save Changes"
              backgroundColor={isValid ? "#6A4CFF" : "#333333"}
              textColor={isValid ? "#FFFFFF" : "#666666"}
              disabled={!isValid}
              onPress={handleSave}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontFamily: "CormorantGaramondBold",
    fontSize: scaleFont(20),
    color: "#FFFFFF",
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
  },
  label: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    marginBottom: hp(1),
    marginTop: hp(2),
  },
  textInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: scaleFont(16),
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#4C4C4C",
  },
  buttonContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
  },
});

export default EditProfileModal;
