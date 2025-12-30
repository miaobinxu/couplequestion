import * as ImagePicker from 'expo-image-picker';

export const checkCameraPermission = async () => {
    const { status } = await ImagePicker.getCameraPermissionsAsync();
    return status;
};