import React, { useState, useCallback, Suspense } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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
import CustomAddressPicker from "@/src/components/CustomAddressPicker";
import DateIcon from "@assets/svg/settings/dateicon.svg";
import LocationIcon from "@assets/svg/settings/locationicon.svg";
import TimeIcon from "@assets/svg/settings/timeicon.svg";

const CustomDatePicker = React.lazy(() => import("@/src/components/CustomDatePicker"));

interface EditBirthInfoModalProps {
  visible: boolean;
  onClose: () => void;
  initialBirthDate: string;
  initialBirthPlace: string;
  initialBirthTime: string;
  onSave: (birthDate: string, birthPlace: string, birthTime: string) => void;
}

const EditBirthInfoModal: React.FC<EditBirthInfoModalProps> = ({
  visible,
  onClose,
  initialBirthDate,
  initialBirthPlace,
  initialBirthTime,
  onSave,
}) => {
  const { t } = useTranslation();
  const [birthDate, setBirthDate] = useState(
    new Date(initialBirthDate || new Date())
  );
  const [birthPlace, setBirthPlace] = useState(initialBirthPlace);
  const [birthTime, setBirthTime] = useState(() => {
    if (initialBirthTime) {
      // Parse time string like "11:47 PM" or "23:47"
      const timeStr = initialBirthTime.replace(/\s*(AM|PM)\s*/i, "");
      const [hours, minutes] = timeStr.split(":").map(Number);
      const isPM = /PM/i.test(initialBirthTime);
      const hour24 =
        isPM && hours !== 12 ? hours + 12 : !isPM && hours === 12 ? 0 : hours;
      const date = new Date();
      date.setHours(hour24, minutes || 0, 0, 0);
      return date;
    }
    return new Date();
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  const handleSave = () => {
    const formattedDate = birthDate.toISOString().split("T")[0];
    const hours = birthTime.getHours();
    const minutes = birthTime.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    const formattedTime = `${displayHours}:${displayMinutes} ${ampm}`;
    onSave(formattedDate, birthPlace.trim(), formattedTime);
    onClose();
  };

  const isValid = birthPlace.trim() !== "";

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
            <Text style={styles.headerTitle}>Edit Birth Info</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.label}>Birth Date</Text>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {birthDate.toISOString().split("T")[0]}
              </Text>
              <DateIcon size={20} color="#CCCCCC" />
            </TouchableOpacity>

            <Text style={styles.label}>Birth Place</Text>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowAddressPicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {birthPlace || "Select birth place"}
              </Text>
              <LocationIcon size={20} color="#CCCCCC" />
            </TouchableOpacity>

            <Text style={styles.label}>Birth Time</Text>
            <TouchableOpacity
              style={styles.dateTimeInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {(() => {
                  const hours = birthTime.getHours();
                  const minutes = birthTime.getMinutes();
                  const ampm = hours >= 12 ? "PM" : "AM";
                  const displayHours = hours % 12 || 12;
                  const displayMinutes = minutes.toString().padStart(2, "0");
                  return `${displayHours}:${displayMinutes} ${ampm}`;
                })()}
              </Text>
              <TimeIcon size={20} color="#CCCCCC" />
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <ButtonWithFeedback
              text="Save Changes"
              backgroundColor={isValid ? "#6A4CFF" : "#333333"}
              textColor={isValid ? "#FFFFFF" : "#666666"}
              disabled={!isValid}
              onPress={handleSave}
            />
          </View>

          {showDatePicker && (
            <Suspense fallback={<ActivityIndicator size="large" color="#6A4CFF" />}>
              <CustomDatePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onConfirm={(date) => setBirthDate(date)}
                initialDate={birthDate}
                mode="date"
                title="Select Birth Date"
              />
            </Suspense>
          )}

          {showTimePicker && (
            <Suspense fallback={<ActivityIndicator size="large" color="#6A4CFF" />}>
              <CustomDatePicker
                visible={showTimePicker}
                onClose={() => setShowTimePicker(false)}
                onConfirm={(time) => setBirthTime(time)}
                initialDate={birthTime}
                mode="time"
                title="Select Birth Time"
              />
            </Suspense>
          )}

          <CustomAddressPicker
            visible={showAddressPicker}
            onClose={() => setShowAddressPicker(false)}
            onConfirm={(address) => setBirthPlace(address)}
            initialAddress={birthPlace}
            title="Select Birth Place"
          />
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
  dateTimeInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: scaleFont(16),
    borderWidth: 1,
    borderColor: "#4C4C4C",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateTimeText: {
    color: "#FFFFFF",
    fontSize: scaleFont(16),
  },
  buttonContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(3),
  },
});

export default EditBirthInfoModal;
