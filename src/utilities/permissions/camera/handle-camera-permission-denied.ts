import { Alert, Linking } from 'react-native';

export const handleCameraPermissionDenied = (t?: (key: string) => string) => {
    Alert.alert(
        t ? t('permissions.cameraTitle') : 'Permission Required',
        t ? t('permissions.cameraMessage') : 'Camera permission is required to take pictures via camera. If you wish to take pictures via camera, please grant camera permission to UpSkin within your device settings.',
        [
            { text: t ? t('common.confirm') : 'Open Settings', onPress: () => Linking.openSettings() },
            { text: t ? t('common.cancel') : 'Cancel', style: 'cancel' }
        ]
    );
};