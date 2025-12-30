import React, { useMemo } from "react";
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import moment from "moment";
import DottedCircle from "./DottedCircle";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = (SCREEN_WIDTH - wp(5)) / 7;

interface DateSliderProps {
  currentDate?: string; // Optional prop to pass the current date
  onChangeDate?: (date: string) => void; // Callback when date is clicked
}

const DateSlider: React.FC<DateSliderProps> = ({
  currentDate = moment().format("YYYY-MM-DD"),
  onChangeDate,
}) => {
  const today = moment().format("YYYY-MM-DD");

  // Generate 7 dates starting from 5 days before the current date
  const weekDates = useMemo(() => {
    const startDate = moment().subtract(5, "days");
    return Array.from({ length: 7 }, (_, i) =>
      moment(startDate).add(i, "days").format("YYYY-MM-DD")
    );
  }, []);

  const handleDatePress = (date: string) => {
    onChangeDate?.(date); // Call the callback if provided
  };

  return (
    <View style={styles.container}>
      {weekDates.map((item) => {
        const isSelected = item === currentDate;
        const isFuture = moment(item).isAfter(today);

        return (
          <TouchableOpacity
            key={item}
            style={styles.itemContainer}
            onPress={() => handleDatePress(item)}
            disabled={isFuture} // Disable future dates
          >
            <DottedCircle
              date={moment(item).format("D")}
              text={moment(item).format("dddd").charAt(0).toUpperCase()}
              selected={isSelected}
              disabled={isFuture}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(2),
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between", // Space out items
  },
  itemContainer: {
    width: ITEM_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DateSlider;
