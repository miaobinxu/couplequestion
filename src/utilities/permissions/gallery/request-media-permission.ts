import * as ImagePicker from 'expo-image-picker';

export const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status;
};