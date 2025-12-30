import * as ImagePicker from 'expo-image-picker';

export const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status;
};