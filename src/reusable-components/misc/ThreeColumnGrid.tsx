import React from "react";
import { View, StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type ThreeColumnGridProps<T> = {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactElement;
  itemSpacing?: number;
  rowSpacing?: number;
};

function ThreeColumnGrid<T>({
  data,
  renderItem,
  itemSpacing = 12,
  rowSpacing = 12,
}: ThreeColumnGridProps<T>) {
  const rows = [];
  for (let i = 0; i < data.length; i += 3) {
    rows.push(data.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={[
            styles.row,
            { marginBottom: rowIndex < rows.length - 1 ? rowSpacing : 0 },
          ]}
        >
          {row.map((item, colIndex) => (
            <View
              key={`item-${colIndex}`}
              style={{ flex: 1, marginRight: colIndex < 2 ? itemSpacing : 0 }}
            >
              {renderItem(item, rowIndex * 3 + colIndex)}
            </View>
          ))}
          {/* Fill empty spaces if row has less than 3 items */}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: wp(3),
  },
  row: {
    flexDirection: "row",
  },
});

export default ThreeColumnGrid;
