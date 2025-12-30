import * as Haptics from 'expo-haptics';

/**
 * Haptic feedback utility for consistent tactile feedback across the app
 */
export const hapticFeedback = {
  /**
   * Light haptic feedback for subtle interactions (toggles, selections)
   */
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently handle haptic errors
    }
  },

  /**
   * Medium haptic feedback for standard button presses
   */
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently handle haptic errors
    }
  },

  /**
   * Heavy haptic feedback for important actions (submit, delete)
   */
  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently handle haptic errors
    }
  },

  /**
   * Success haptic feedback for positive actions
   */
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently handle haptic errors
    }
  },

  /**
   * Warning haptic feedback for cautionary actions
   */
  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Silently handle haptic errors
    }
  },

  /**
   * Error haptic feedback for negative actions
   */
  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Silently handle haptic errors
    }
  },
};

export default hapticFeedback;