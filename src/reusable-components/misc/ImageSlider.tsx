import { parseLocalImage } from "@/src/utilities/common";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface ImageSliderProps {
  images: string[];
  onImagePress?: (index: number) => void;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onImagePress }) => {
  const { width: screenWidth } = useWindowDimensions();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems?.length > 0) {
        setSelectedIndex(viewableItems[0].index ?? 0);
      }
    },
    []
  );

  const renderImage = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onImagePress?.(index)}
      >
        <Image
          source={{ uri: parseLocalImage(item) }}
          style={[styles.image, { width: screenWidth }]}
          resizeMode="cover"
        />
      </TouchableOpacity>
    ),
    [screenWidth, onImagePress]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(url) => url}
        renderItem={renderImage}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
      />
      {images.length > 1 && (
        <View style={styles.indicatorContainer}>
          <Text style={styles.indicatorText}>
            {`${selectedIndex + 1}/${images.length}`}
          </Text>
        </View>
      )}
    </View>
  );
};

export default ImageSlider;

const styles = StyleSheet.create({
  container: { height: hp(36.5), width: "100%" },
  image: {
    height: "100%",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: hp(4),
    alignSelf: "center",
    backgroundColor: "#00000070",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 32,
  },
  indicatorText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 12,
  },
  innerContent: {
    alignSelf: "flex-start",
    justifyContent: "center",
    position: "absolute",
  },
});
