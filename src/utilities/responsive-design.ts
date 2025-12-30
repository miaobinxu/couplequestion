import { Dimensions } from 'react-native';

// as per Figma design (iPhone 16 Pro)
export const BASE_WIDTH = 402;
export const BASE_HEIGHT = 874

// get the current screen dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const scaleFont = (size: number, min: number = 2, max: number = 2): number => {
    // we take ratio of the smaller dimension to scale the font size
    const scaleDimension = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / Math.min(BASE_WIDTH, BASE_HEIGHT);
    const scaledSize = size * scaleDimension;
    // clamp the scaled size
    const scaledSizeWithClamp = Math.max(size - min, Math.min(size + max, scaledSize));
    return scaledSizeWithClamp;
}

export const scaleWidth = (value: number): number => {
    return (value * SCREEN_WIDTH) / BASE_WIDTH;
};

export const scaleHeight = (value: number): number => {
    return (value * SCREEN_HEIGHT) / BASE_HEIGHT;
};
