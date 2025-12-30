import { Alert } from 'react-native';
import { checkCameraPermission } from '@utilities/permissions/camera/check-camera-permission';
import { requestCameraPermission } from '@utilities/permissions/camera/request-camera-permission';
import { handleCameraPermissionDenied } from '@utilities/permissions/camera/handle-camera-permission-denied';

export const handleCameraPermissions = async (t?: (key: string) => string): Promise<boolean> => {
    try {
        // check camera permission (whether granted or not granted)
        const permissionStatus = await checkCameraPermission();
        // if camera permission has been granted, return true
        if (permissionStatus === 'granted') {
            return true;
        }
        else {
            // if camera permission not granted, request the permission
            const requestPermissionStatus = await requestCameraPermission();
            // if camera permission granted after request, return true
            if (requestPermissionStatus === 'granted') {
                return true;
            }
            // otherwise, prompt the user to grant camera permission and return false
            else {
                handleCameraPermissionDenied(t);
                return false;
            }
        }
    }
    catch (error) {
        Alert.alert(t ? t('alerts.error') : 'Error', t ? t('alerts.unexpectedError') : 'Unexpected error! Please try again later.');
        return false;
    }
}