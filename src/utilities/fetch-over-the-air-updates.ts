import * as Updates from 'expo-updates';

export const fetchOverTheAirUpdates = async () => {
    try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        }
    }
    catch (err: any) {}
}