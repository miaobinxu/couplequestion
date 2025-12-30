import { Alert, Linking } from 'react-native';

export const handleMediaPermissionDenied = (t?: (key: string) => string) => {
    Alert.alert(
        t ? t('permissions.photosTitle') : 'Permission Required',
        t ? t('permissions.photosMessage') : 'Media library permission is required to select photos from library. If you wish to select photos from library, please grant media library access to UpSkin within your device settings.',
        [
            { text: t ? t('common.confirm') : 'Open Settings', onPress: () => Linking.openSettings() },
            { text: t ? t('common.cancel') : 'Cancel', style: 'cancel' }
        ]
    );
};