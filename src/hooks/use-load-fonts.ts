import { useFonts } from "expo-font";

const useLoadFonts = () => {
  const [fontsLoaded] = useFonts({
    // Helvetica
    HelveticaBold: require("../assets/fonts/HelveticaBold.ttf"),
    HelveticaBoldOblique: require("../assets/fonts/HelveticaBoldOblique.ttf"),
    HelveticaCompressed: require("../assets/fonts/HelveticaCompressed.otf"),
    HelveticaLight: require("../assets/fonts/HelveticaLight.ttf"),
    HelveticaOblique: require("../assets/fonts/HelveticaOblique.ttf"),
    HelveticaRegular: require("../assets/fonts/HelveticaRegular.ttf"),
    HelveticaRoundedBold: require("../assets/fonts/HelveticaRoundedBold.otf"),

    // Cormorant SC
    CormorantSCBold: require("../assets/fonts/CormorantSCBold.ttf"),

    // Cormorant Garamond
    CormorantGaramondBold: require("../assets/fonts/CormorantGaramond-Bold.ttf"),
    CormorantGaramondBoldItalic: require("../assets/fonts/CormorantGaramond-BoldItalic.ttf"),
    CormorantGaramondItalic: require("../assets/fonts/CormorantGaramond-Italic.ttf"),
    CormorantGaramondLight: require("../assets/fonts/CormorantGaramond-Light.ttf"),
    CormorantGaramondLightItalic: require("../assets/fonts/CormorantGaramond-LightItalic.ttf"),
    CormorantGaramondMedium: require("../assets/fonts/CormorantGaramond-Medium.ttf"),
    CormorantGaramondMediumItalic: require("../assets/fonts/CormorantGaramond-MediumItalic.ttf"),
    CormorantGaramondRegular: require("../assets/fonts/CormorantGaramond-Regular.ttf"),
    CormorantGaramondSemiBold: require("../assets/fonts/CormorantGaramond-SemiBold.ttf"),
    CormorantGaramondSemiBoldItalic: require("../assets/fonts/CormorantGaramond-SemiBoldItalic.ttf"),
  });

  return fontsLoaded;
};

export default useLoadFonts;
