import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

interface ToastOptions {
  title: string;
  message?: string;
  duration?: number;
  position?: "top" | "bottom";
}

/**
 * Display a toast message with custom black/blue theme
 * @param {ToastType} type - Type of toast ('success', 'error', 'info')
 * @param {ToastOptions} options - Options for the toast message
 */
const showToast = (
  type: ToastType,
  { title, message = "", duration = 3000, position = "top" }: ToastOptions
): void => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: duration,
    position,
    topOffset: 50,
    props: {
      style: {
        backgroundColor: "#000000",
        borderLeftColor:
          type === "error"
            ? "#FF4444"
            : type === "success"
            ? "#6A4CFF"
            : "#6A4CFF",
        borderLeftWidth: 4,
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginHorizontal: 16,
      },
      text1Style: {
        fontSize: 16,
        fontWeight: "600",
        color: "#FFFFFF",
      },
      text2Style: {
        fontSize: 14,
        color: "#999999",
      },
    },
  });
};

export default showToast;
