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

interface InlineTimePickerProps {
  initialTime: Date;
  onTimeChange: (time: Date) => void;
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

const InlineTimePicker: React.FC<InlineTimePickerProps> = ({
  initialTime,
  onTimeChange,
}) => {
  const [selectedHour, setSelectedHour] = useState(
    initialTime.getHours() % 12 || 12
  );
  const [selectedMinute, setSelectedMinute] = useState(
    initialTime.getMinutes()
  );
  const [selectedAmPm, setSelectedAmPm] = useState(
    initialTime.getHours() >= 12 ? 1 : 0
  );
  const [isReady, setIsReady] = useState(false);

  const hoursData = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    []
  );

  const minutesData = React.useMemo(
    () => Array.from({ length: 60 }, (_, i) => i),
    []
  );

  const amPmData = React.useMemo(() => ["AM", "PM"], []);

  const handleHourSelect = React.useCallback((index: number) => {
    setSelectedHour(index + 1);
  }, []);

  const handleMinuteSelect = React.useCallback((index: number) => {
    setSelectedMinute(index);
  }, []);

  const handleAmPmSelect = React.useCallback((index: number) => {
    setSelectedAmPm(index);
  }, []);

  // Update parent when any value changes
  React.useEffect(() => {
    if (isReady) {
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

      if (newTime.getTime() !== initialTime.getTime()) {
        onTimeChange(newTime);
      }
    }
  }, [selectedHour, selectedMinute, selectedAmPm, isReady]);

  // Update local state when initialTime changes
  React.useEffect(() => {
    setSelectedHour(initialTime.getHours() % 12 || 12);
    setSelectedMinute(initialTime.getMinutes());
    setSelectedAmPm(initialTime.getHours() >= 12 ? 1 : 0);
    setTimeout(() => setIsReady(true), 100);
  }, [initialTime]);

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: hp(20),
    width: wp(80),
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

    marginTop: -20,
    pointerEvents: "none",
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
});

export default InlineTimePicker;
