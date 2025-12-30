import { Alert } from 'react-native';
import { checkMediaPermission } from '@utilities/permissions/gallery/check-media-permission';
import { requestMediaPermission } from '@utilities/permissions/gallery/request-media-permission';
import { handleMediaPermissionDenied } from '@utilities/permissions/gallery/handle-media-permission-denied';

export const handleMediaPermissions = async (t?: (key: string) => string): Promise<boolean> => {
    try {
        // check media permission (whether granted or not granted)
        const permissionStatus = await checkMediaPermission();
        // if media permission has been granted, return true
        if (permissionStatus === 'granted') {
            return true;
        }
        else {
            // if media permission not granted, request the permission
            const requestPermissionStatus = await requestMediaPermission();
            // if media permission granted after request, return true
            if (requestPermissionStatus === 'granted') {
                return true;
            }
            // otherwise, take the user to settings to grant media permission and return false
            else {
                handleMediaPermissionDenied(t);
                return false;
            }
        }
    }
    catch (error) {
        Alert.alert(t ? t('alerts.error') : 'Error', t ? t('alerts.unexpectedError') : 'Unexpected error! Please try again later.');
        return false;
    }
}