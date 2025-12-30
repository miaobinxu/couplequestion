import * as ImagePicker from 'expo-image-picker';

export const checkMediaPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
    return status;
};