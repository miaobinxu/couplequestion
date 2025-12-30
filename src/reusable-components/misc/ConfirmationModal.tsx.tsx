import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import { useTranslation } from "@/src/hooks/use-translation";

type ConfirmationModalProps = {
  visible: boolean;
  title?: string;
  message: string;
  confirmButtonText: string;
  confirmButtonIcon?: React.ReactNode;
  confirmButtonColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title = "Please Confirm",
  message,
  confirmButtonText,
  confirmButtonIcon,
  confirmButtonColor = "#D30000",
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const modalTitle = title === "Please Confirm" ? t("modal.pleaseConfirm") : title;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <Text style={styles.title}>{modalTitle}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                { backgroundColor: confirmButtonColor },
              ]}
              onPress={onConfirm}
            >
              {confirmButtonIcon && (
                <View style={{ marginRight: wp(1.5) }}>
                  {confirmButtonIcon}
                </View>
              )}
              <Text style={styles.confirmText}>{confirmButtonText}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>{t("modal.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: wp(85),
    backgroundColor: "#fff",
    borderRadius: wp(4),
    padding: wp(5),
    alignItems: "center",
  },
  title: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    color: "#1C1C1C",
    marginBottom: hp(1),
  },
  message: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(17),
    color: "#1C1C1C",
    textAlign: "center",
    marginBottom: hp(3),
  },
  buttonContainer: {
    flexDirection: "row",
    gap: wp(3),
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    borderRadius: 12,
  },
  confirmText: {
    color: "#fff",
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(14),
    // marginLeft: wp(1.5),
  },
  cancelButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: wp(5),
    paddingVertical: hp(1.2),
    borderRadius: 12,
    justifyContent: "center",
  },
  cancelText: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(14),
    color: "#404040",
  },
});
