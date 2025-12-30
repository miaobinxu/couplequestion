import { useSafeAreaInsets } from 'react-native-safe-area-context';

const useInsetsInfo = () => {
    const insets = useSafeAreaInsets();
    return {
        topInsets: insets.top,
        bottomInsets: insets.bottom,
        isBottomInsetZero: insets.bottom === 0,
    };
};

export default useInsetsInfo;
