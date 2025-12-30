import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import hapticFeedback from "@/src/utilities/hapticUtil";

interface InlineDatePickerProps {
  initialDate: Date;
  onDateChange: (date: Date) => void;
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
      <View style={[styles.wheelContainer, style]} onLayout={handleLayout}>
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          snapToInterval={itemHeight}
          snapToAlignment="center"
          decelerationRate={0.9}
          contentContainerStyle={styles.wheelContent}
          onScrollBeginDrag={handleScrollBegin}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
        >
          {data.map((item, index) => (
            <TouchableOpacity
              key={`${item}-${index}`}
              style={styles.wheelItem}
              onPress={() => {
                hapticFeedback.light();
                onSelect(index);
              }}
            >
              <Text
                style={[
                  styles.wheelText,
                  selectedIndex === index && styles.wheelTextSelected,
                ]}
              >
                {typeof item === "string"
                  ? item
                  : item.toString().padStart(2, "0")}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <View style={styles.centerLine} />
      </View>
    );
  }
);

const InlineDatePicker: React.FC<InlineDatePickerProps> = ({
  initialDate,
  onDateChange,
}) => {
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());
  const [isReady, setIsReady] = useState(false);

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

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysData = React.useMemo(
    () =>
      Array.from(
        { length: getDaysInMonth(selectedMonth, selectedYear) },
        (_, i) => i + 1
      ),
    [selectedMonth, selectedYear]
  );

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

  // Update parent when any value changes
  React.useEffect(() => {
    if (isReady) {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay);
      if (newDate.getTime() !== initialDate.getTime()) {
        onDateChange(newDate);
      }
    }
  }, [selectedMonth, selectedDay, selectedYear, isReady]);

  // Update local state when initialDate changes
  React.useEffect(() => {
    setSelectedMonth(initialDate.getMonth());
    setSelectedDay(initialDate.getDate());
    setSelectedYear(initialDate.getFullYear());
    setTimeout(() => setIsReady(true), 100);
  }, [initialDate]);

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6A4CFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.wheelRow}>
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
          selectedIndex={Math.min(selectedDay - 1, daysData.length - 1)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(20),
    width: wp(80),
    marginRight: wp(5),
    justifyContent: "center",
  },
  wheelRow: {
    flexDirection: "row",
    height: hp(20),
    alignItems: "center",
  },
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
  centerLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 40,
    //borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderColor: "#6A4CFF",
    marginTop: -20,
    pointerEvents: "none",
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
});

export default InlineDatePicker;
