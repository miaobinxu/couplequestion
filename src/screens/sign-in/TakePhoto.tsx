import React, {
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  scaleFont,
  scaleWidth,
  scaleHeight,
} from "@utilities/responsive-design";
import { useNavigation, useRouter } from "expo-router";
import { CameraView, CameraType } from "expo-camera";
import * as FileSystem from "expo-file-system";
import useInsetsInfo from "@hooks/use-insets-info";
import { handleMediaPermissions } from "@utilities/permissions/gallery/handle-media-permission";
import { pickMedia } from "@utilities/permissions/gallery/pick-media";
import { getFileExtension, uploadImage } from "@/src/services/scan.service";
import { useUserStore } from "@/src/global-store/user-store";
import { getExtensionFromMimeType } from "@/src/utilities/common";
import { useScanStore } from "@/src/global-store/scan-store";
import LoadingOverlay from "@/src/reusable-components/misc/LoadingOverlay";
import { useTranslation } from "@/src/hooks/use-translation";

const cameraCrossImage = require("@assets/images/misc/camera-cross.png");
const switchCameraImage = require("@assets/images/misc/switch-camera.png");
const faceOverlayImage = require("@assets/images/misc/face-overlay.png");
const faceOverlayLeftImage = require("@assets/images/misc/face-overlay-left.png");
const faceOverlayRightImage = require("@assets/images/misc/face-overlay-right.png");
const productOverlayImage = require("@assets/images/misc/product-overlay.png");
const captureButton = require("@assets/images/misc/capture-button.png");

interface TakePhotoProps {
  scanType?: "product" | "food" | "skin";
  firstScan?: boolean;
}

const TakePhoto: React.FC<TakePhotoProps> = ({
  scanType = "skin",
  firstScan = false,
}) => {
  const { t } = useTranslation();
  const [isImageUploading, setImageUploading] = useState(false);
  const [fakeProcessing, setFakeProcessing] = useState(false);
  const [savedImageUris, setSavedImageUris] = useState<string[]>([]);

  const { setInitialFaceScan } = useScanStore();
  const router = useRouter();
  const navigation = useNavigation();
  const { updateUser, subscriptionStatus, isFreeTrialActive } = useUserStore();

  const { topInsets, bottomInsets, isBottomInsetZero } = useInsetsInfo();

  const cameraRef = useRef<CameraView>(null);

  const [facing, setFacing] = useState<CameraType>(
    scanType === "skin" ? "front" : "back"
  );

  const [cameraOrGallery, setCameraOrGallery] = useState<string>("camera");
  const [photoCount, setPhotoCount] = useState(0);
  const [photos, setPhotos] = useState<
    { uri: string; imageId: string; fileName: string }[]
  >([]);

  const handleCrossButtonPress = useCallback(() => {
    router.back();
  }, []);

  const changeCameraPosition = useCallback(() => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }, []);

  const handleSuccessNavigation = useCallback(
    (results: string[]) => {
      if (firstScan) {
        // Update the user data or perform any necessary actions here
        updateUser({ hasCompletedFaceScan: true });

        if (subscriptionStatus !== "ACTIVE" && !isFreeTrialActive) {
          setInitialFaceScan(results);
          setFakeProcessing(true);
          setTimeout(() => {
            setFakeProcessing(false);
            return router.replace("/sign-in/app-wall-unpaid");
          }, 4000);
        } else {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "(tabs)",
                state: {
                  routes: [
                    {
                      name: "homeTab",
                      state: {
                        routes: [
                          {
                            name: "home",
                            params: { data: results, scanType: "skin" },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          });
        }
      } else {
        navigation.navigate("(tabs)", {
          screen: "homeTab",
          params: {
            screen: "home",
            params: { data: results, scanType },
          },
        });

        // navigation.setParams({ data: results, type: scanType });
        // navigation.goBack();
      }
    },
    [firstScan, navigation, subscriptionStatus, isFreeTrialActive]
  );

  const onSuccessImageSelection = async (uploadedPhotos = photos) => {
    if (uploadedPhotos && uploadedPhotos.length > 0) {
      setImageUploading(true); // Start uploading

      try {
        // Create the custom directory if it doesn't exist
        const directory = `${FileSystem.documentDirectory}scanned_images/`;
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

        // Prepare all copy operations as promises
        const copyPromises = uploadedPhotos.map(async (photo) => {
          const newPath = `${directory}${photo?.fileName}`;

          await FileSystem.copyAsync({
            from: photo.uri,
            to: newPath,
          });

          console.log(`Image copied to: ${newPath}`);
          return newPath;
        });

        // Execute all promises concurrently
        const results = await Promise.all(copyPromises);
        // Update state to display images
        setSavedImageUris(results);

        handleSuccessNavigation(results);

        console.log("All images copied successfully:", results);
      } catch (error) {
        console.error("Error copying images:", error);
        Alert.alert(t("alerts.error"), t("alerts.failedToCopyImages"));
      } finally {
        setImageUploading(false); // Stop uploading
      }
    } else {
      console.log("No photos selected.");
    }
  };

  const capturePhoto = useCallback(async () => {
    try {
      const photo = await cameraRef.current?.takePictureAsync({
        quality: 0.1,
        base64: false,
      });
      if (photo) {
        const imageId = Date.now().toString();
        const fileExtension = getFileExtension(photo?.uri);
        const fileName = `${imageId}.${fileExtension}`;
        const payload = {
          uri: photo?.uri,
          imageId,
          fileName,
        };
        setPhotos((prevPhotos) => [...prevPhotos, payload]);
        setPhotoCount((prevCount) => prevCount + 1);

        // Finish capture for non-skin types or after 3 photos for skin
        if (scanType !== "skin") {
          onSuccessImageSelection([...photos, payload]);
        }
      }
    } catch (error) {
      Alert.alert(t("alerts.error"), t("alerts.failedToCapturePhoto"));
    }
  }, [scanType, photoCount, photos]);

  useEffect(() => {
    if (scanType === "skin" && photos?.length === 3) {
      onSuccessImageSelection([...photos]);
    }
  }, [photos, scanType]);

  const selectPhotoFromGallery = useCallback(async () => {
    try {
      const mediaPermissionGranted = await handleMediaPermissions(t);
      if (mediaPermissionGranted) {
        setCameraOrGallery("gallery");
        const photo = await pickMedia({ includeBase64: false, t });
        setCameraOrGallery("camera");
        if (photo) {
          const imageId = Date.now().toString();
          const fileExtension = getExtensionFromMimeType(photo.mimeType);
          const fileName = `${imageId}.${fileExtension}`;
          const payload = {
            uri: photo?.uri,
            imageId,
            fileName,
          };
          // const payload = {
          //   // base64: photo?.base64!,
          //   uri: `${Date.now()}.${getExtensionFromMimeType(photo.mimeType)}`,
          //   id: user?.user?.id,
          // };
          setPhotos((prevPhotos) => [...prevPhotos, payload]);
          setPhotoCount((prevCount) => prevCount + 1);

          // Finish capture for non-skin types or after 3 photos for skin
          if (scanType !== "skin") {
            onSuccessImageSelection([...photos, payload]);
          }
        }
      }
    } catch (error) {
      setCameraOrGallery("camera");
      Alert.alert(t("alerts.error"), t("alerts.failedToSelectPhoto"));
    }
  }, [scanType, photoCount, photos]);

  const caption = useMemo(() => {
    if (scanType === "skin") {
      if (photoCount === 0) {
        return t("signIn.takePhoto.captions.alignFace");
      } else if (photoCount === 1) {
        return t("signIn.takePhoto.captions.slightlyRight");
      } else if (photoCount === 2) {
        return t("signIn.takePhoto.captions.slightlyLeft");
      }
      return "";
    } else if (scanType === "product") {
      return t("signIn.takePhoto.captions.placeProduct");
    } else if (scanType === "food") {
      return t("signIn.takePhoto.captions.placeFood");
    }
    return "";
  }, [scanType, photoCount, t]);

  const frame = useMemo(() => {
    if (scanType === "skin") {
      if (photoCount === 0) {
        return faceOverlayImage;
      } else if (photoCount === 1) {
        return faceOverlayLeftImage;
      } else if (photoCount === 2) {
        return faceOverlayRightImage;
      }
    } else if (scanType === "product") {
      return productOverlayImage;
    } else if (scanType === "food") {
      return productOverlayImage;
    }
  }, [scanType, photoCount]);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        mode="picture"
        animateShutter={scanType == "skin" && photoCount <= 1}
      />
      <View
        style={[
          styles.overlay,
          {
            marginTop: topInsets,
            marginBottom: isBottomInsetZero ? hp(1.5) : bottomInsets,
          },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCrossButtonPress}>
            <Image source={cameraCrossImage} style={styles.cameraCrossImage} />
          </TouchableOpacity>
          <Text style={styles.title}>UPSKIN</Text>
          <TouchableOpacity onPress={changeCameraPosition}>
            <Image
              source={switchCameraImage}
              style={styles.switchCameraImage}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.overlayContainer}>
          <Image source={frame} style={styles.faceOverlayImage} />
          <Text style={styles.alignFaceText}>{caption}</Text>
        </View>
        <View style={styles.footer}>
          {/* <View style={styles.imageContainer}>
            {photos.map((photo, index) => (
              <Image
                key={index}
                source={{ uri: photo?.uri }}
                style={styles.savedImage}
              />
            ))}
          </View> */}

          <View style={styles.footerContainer}>
            <TouchableOpacity
              style={[
                styles.cameraSelectorButton,
                {
                  backgroundColor:
                    cameraOrGallery === "camera" ? "#698D5F" : undefined,
                },
              ]}
            >
              <Text style={styles.cameraSelectorText}>{t("signIn.takePhoto.camera")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={capturePhoto}>
              <Image source={captureButton} style={styles.captureButton} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.cameraSelectorButton,
                {
                  backgroundColor:
                    cameraOrGallery === "gallery" ? "#698D5F" : undefined,
                },
              ]}
              onPress={selectPhotoFromGallery}
            >
              <Text style={styles.cameraSelectorText}>{t("signIn.takePhoto.gallery")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {fakeProcessing && (
        <LoadingOverlay text={t("signIn.takePhoto.analyzingSkin")} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FCFA",
  },
  overlay: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingTop: hp(2.5),
  },
  cameraCrossImage: {
    marginLeft: wp(6),
  },
  title: {
    fontFamily: "CormorantSCBold",
    fontSize: scaleFont(32),
    color: "#FFFFFF",
  },
  switchCameraImage: {
    marginRight: wp(6),
  },
  overlayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  faceOverlayImage: {
    marginTop: hp(4),
    resizeMode: "contain",
    width: scaleWidth(283.8),
    height: scaleHeight(435.24),
  },
  alignFaceText: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(24),
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: hp(5),
  },
  footer: {
    alignItems: "center",
    justifyContent: "flex-end",
    paddingTop: hp(0.5),
  },
  footerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 99,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp(0.7),
    paddingBottom: hp(0.7),
  },
  cameraSelectorButton: {
    width: scaleWidth(103),
    height: scaleHeight(50),
    borderRadius: 39,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: wp(3),
    marginRight: wp(3),
  },
  cameraSelectorText: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(17),
    color: "#FFFFFF",
  },
  captureButton: {
    minWidth: scaleWidth(70),
    minHeight: scaleHeight(70),
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 10,
    justifyContent: "center",
  },
  savedImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
});

export default TakePhoto;
