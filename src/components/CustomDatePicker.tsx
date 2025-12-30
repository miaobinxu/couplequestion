import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import DateTimePicker from "@react-native-community/datetimepicker";
import hapticFeedback from "@/src/utilities/hapticUtil";

interface CustomDatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate: Date;
  mode: "date" | "time";
  title: string;
}

const WheelPicker = React.memo(
  ({
    data,
    selectedIndex,
    onSelect,
    style,
  }: {
    data: (string | number)[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    style?: any;
  }) => {
    const scrollViewRef = React.useRef<ScrollView>(null);
    const itemHeight = 40;
    const isScrolling = React.useRef(false);
    const [isLayoutReady, setIsLayoutReady] = React.useState(false);

    React.useEffect(() => {
      if (
        isLayoutReady &&
        !isScrolling.current &&
        scrollViewRef.current &&
        selectedIndex >= 0 &&
        selectedIndex < data.length
      ) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: selectedIndex * itemHeight,
            animated: false,
          });
        }, 100);
      }
    }, [selectedIndex, data.length, isLayoutReady]);

    const handleLayout = () => {
      setIsLayoutReady(true);
    };

    const handleScrollBegin = () => {
      isScrolling.current = true;
    };

    const handleScrollEnd = (event: any) => {
      const y = event.nativeEvent.contentOffset.y;
      const index = Math.round(y / itemHeight);
      if (index >= 0 && index < data.length && index !== selectedIndex) {
        hapticFeedback.light();
        onSelect(index);
      }
      isScrolling.current = false;
    };

    return (
      <View style={[wheelStyles.wheelContainer, style]} onLayout={handleLayout}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          snapToAlignment="center"
          decelerationRate={0.9}
          contentContainerStyle={wheelStyles.wheelContent}
          onScrollBeginDrag={handleScrollBegin}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {data.map((item, index) => (
            <TouchableOpacity
              key={`${item}-${index}`}
              style={wheelStyles.wheelItem}
              onPress={() => {
                hapticFeedback.light();
                onSelect(index);
              }}
            >
              <Text
                style={[
                  wheelStyles.wheelText,
                  selectedIndex === index && wheelStyles.wheelTextSelected,
                ]}
              >
                {typeof item === "string"
                  ? item
                  : item.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
);

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  visible,
  onClose,
  onConfirm,
  initialDate,
  mode,
  title,
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isReady, setIsReady] = useState(false);

  // Android wheel picker states
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [selectedHour, setSelectedHour] = useState(
    initialDate.getHours() % 12 || 12
  );
  const [selectedMinute, setSelectedMinute] = useState(
    initialDate.getMinutes()
  );
  const [selectedAmPm, setSelectedAmPm] = useState(
    initialDate.getHours() >= 12 ? 1 : 0
  );

  // Initialize component when modal becomes visible
  useEffect(() => {
    if (visible) {
      setSelectedDate(initialDate);
      if (Platform.OS === "android") {
        setSelectedMonth(initialDate.getMonth());
        setSelectedDay(initialDate.getDate());
        setSelectedYear(initialDate.getFullYear());
        setSelectedHour(initialDate.getHours() % 12 || 12);
        setSelectedMinute(initialDate.getMinutes());
        setSelectedAmPm(initialDate.getHours() >= 12 ? 1 : 0);
      }
      setTimeout(() => setIsReady(true), 50);
    } else {
      setIsReady(false);
    }
  }, [visible, initialDate]);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    hapticFeedback.success();
    if (Platform.OS === "android") {
      if (mode === "date") {
        const newDate = new Date(selectedYear, selectedMonth, selectedDay);
        onConfirm(newDate);
      } else {
        const hour24 =
          selectedAmPm === 1
            ? selectedHour === 12
              ? 12
              : selectedHour + 12
            : selectedHour === 12
            ? 0
            : selectedHour;
        const newTime = new Date();
        newTime.setHours(hour24, selectedMinute, 0, 0);
        onConfirm(newTime);
      }
    } else {
      onConfirm(selectedDate);
    }
    onClose();
  };

  const handleCancel = () => {
    hapticFeedback.light();
    onClose();
  };

  // Memoized data arrays to prevent recalculation
  const monthsData = React.useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    []
  );

  const yearsData = React.useMemo(
    () => Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i),
    []
  );

  const hoursData = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );

  const minutesData = React.useMemo(
    () => Array.from({ length: 60 }, (_, i) => i),
    []
  );

  const amPmData = React.useMemo(() => ["AM", "PM"], []);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Memoized days data that only changes when month/year changes
  const daysData = React.useMemo(
    () =>
      Array.from(
        { length: getDaysInMonth(selectedMonth, selectedYear) },
        (_, i) => i + 1
      ),
    [selectedMonth, selectedYear]
  );

  // Memoized callbacks to prevent re-renders
  const handleMonthSelect = React.useCallback((index: number) => {
    setSelectedMonth(index);
  }, []);

  const handleDaySelect = React.useCallback((index: number) => {
    setSelectedDay(index + 1);
  }, []);

  const handleYearSelect = React.useCallback(
    (index: number) => {
      setSelectedYear(yearsData[index]);
    },
    [yearsData]
  );

  const handleHourSelect = React.useCallback((index: number) => {
    setSelectedHour(index + 1);
  }, []);

  const handleMinuteSelect = React.useCallback((index: number) => {
    setSelectedMinute(index);
  }, []);

  const handleAmPmSelect = React.useCallback((index: number) => {
    setSelectedAmPm(index);
  }, []);



  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.pickerContainer}>
            {!isReady ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6A4CFF" />
              </View>
            ) : Platform.OS === "ios" ? (
              <DateTimePicker
                value={selectedDate}
                mode={mode}
                display="spinner"
                onChange={handleDateChange}
                maximumDate={mode === "date" ? new Date() : undefined}
                minimumDate={mode === "date" ? new Date(1900, 0, 1) : undefined}
                textColor="#FFFFFF"
                themeVariant="dark"
                style={styles.picker}
                locale="en-US"
              />
            ) : (
              // Android custom wheel pickers
              <View style={styles.androidPickerContainer}>
                {console.log(
                  "Android picker rendering, mode:",
                  mode,
                  "Platform:",
                  Platform.OS
                )}
                {mode === "date" ? (
                  <View style={styles.wheelRow}>
                    {console.log(
                      "Date picker - Month:",
                      selectedMonth,
                      "Day:",
                      selectedDay,
                      "Year:",
                      selectedYear
                    )}
                    <WheelPicker
                      key="month-picker"
                      data={monthsData}
                      selectedIndex={selectedMonth}
                      onSelect={handleMonthSelect}
                      style={styles.monthWheel}
                    />
                    <WheelPicker
                      key="day-picker"
                      data={daysData}
                      selectedIndex={Math.min(
                        selectedDay - 1,
                        daysData.length - 1
                      )}
                      onSelect={handleDaySelect}
                      style={styles.dayWheel}
                    />
                    <WheelPicker
                      key="year-picker"
                      data={yearsData}
                      selectedIndex={yearsData.indexOf(selectedYear)}
                      onSelect={handleYearSelect}
                      style={styles.yearWheel}
                    />
                  </View>
                ) : (
                  <View style={styles.wheelRow}>
                    {console.log(
                      "Time picker - Hour:",
                      selectedHour,
                      "Minute:",
                      selectedMinute,
                      "AM/PM:",
                      selectedAmPm
                    )}
                    <WheelPicker
                      key="hour-picker"
                      data={hoursData}
                      selectedIndex={selectedHour - 1}
                      onSelect={handleHourSelect}
                      style={styles.hourWheel}
                    />
                    <WheelPicker
                      key="minute-picker"
                      data={minutesData}
                      selectedIndex={selectedMinute}
                      onSelect={handleMinuteSelect}
                      style={styles.minuteWheel}
                    />
                    <WheelPicker
                      key="ampm-picker"
                      data={amPmData}
                      selectedIndex={selectedAmPm}
                      onSelect={handleAmPmSelect}
                      style={styles.amPmWheel}
                    />
                  </View>
                )}
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
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const wheelStyles = StyleSheet.create({
  wheelContainer: {
    flex: 1,
    height: hp(20),
    marginHorizontal: wp(0.5),
    position: "relative",
    justifyContent: "center",
  },
  wheelContent: {
    paddingVertical: hp(8),
    alignItems: "center",
  },
  wheelItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(2),
  },
  wheelText: {
    fontSize: scaleFont(18),
    color: "#999999",
    textAlign: "center",
    fontWeight: "400",
  },
  wheelTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: scaleFont(20),
  },
});

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
    width: wp(90),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderColor: "#4C4C4C",
    alignSelf: "center",
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
  pickerContainer: {
    alignItems: "center",
    paddingVertical: hp(2),
    minHeight: hp(30),
  },
  picker: {
    width: wp(70),
    height: hp(20),
  },

  // Android wheel picker styles
  androidPickerContainer: {
    height: hp(30),
    width: wp(70),
    justifyContent: "center",
  },

  wheelRow: {
    flexDirection: "row",
    height: hp(20),
    alignItems: "center",
  },

  monthWheel: {
    flex: 2,
  },

  dayWheel: {
    flex: 1,
  },

  yearWheel: {
    flex: 1.2,
  },

  hourWheel: {
    flex: 1,
  },

  minuteWheel: {
    flex: 1,
  },

  amPmWheel: {
    flex: 1,
  },
  loadingContainer: {
    height: hp(30),
    justifyContent: "center",
    alignItems: "center",
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

export default CustomDatePicker;
