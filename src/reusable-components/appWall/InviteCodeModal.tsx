import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import TicketLogo from "@assets/svg/appWall/ticket.svg";
import CopyLogo from "@assets/svg/appWall/copy.svg";
import CircleDashedLogo from "@assets/svg/appWall/circleDashed.svg";
import { scaleFont } from "@/src/utilities/responsive-design";
import { LinearGradient } from "expo-linear-gradient";
import ButtonWithFeedback from "../buttons/ButtonWithFeedback";
import RotatingLoader from "../misc/RotatingLoader";
import {
  checkFreeTrialEligibility,
} from "@/src/services/user.service";
import showToast from "@/src/utilities/toastUtil";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useTranslation } from "@/src/hooks/use-translation";

type Props = {
  visible: boolean;
  onClose: () => void;
  inviteCode: string;
};

const InviteCodeModal: React.FC<Props> = ({ visible, onClose, inviteCode }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleCopy = () => {
    Clipboard.setString(inviteCode);
    showToast("success", {
      title: t("inviteCode.toast.copied"),
      message: t("inviteCode.toast.copiedMessage"),
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: t("inviteCode.shareMessage").replace("{code}", inviteCode),
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleRedeem = async () => {
    try {
      setLoading(true);
      const { eligible, error, remainingTrials } =
        await checkFreeTrialEligibility(inviteCode);

      if (eligible) {
        router.push(`/app-wall?inviteCode=${inviteCode}`);
        onClose();
      } else if (remainingTrials === 0) {
        showToast("error", {
          title: t("inviteCode.toast.referral"),
          message: t("inviteCode.toast.notEligible"),
        });
      } else {
        showToast("error", {
          title: t("inviteCode.toast.referral"),
          message: error?.message,
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View>
              <LinearGradient
                colors={["#D8E6D9", "#F5FAF6"]}
                style={styles.ticketSection}
              >
                <TicketLogo />
                <TouchableOpacity
                  style={styles.redeemButton}
                  onPress={handleRedeem}
                >
                  <Text style={styles.redeemText}>{t("inviteCode.redeem")}</Text>
                </TouchableOpacity>
              </LinearGradient>

              <View style={styles.container}>
                <Text style={styles.title}>{t("inviteCode.shareTitle")}</Text>
                <Text style={styles.description}>
                  {t("inviteCode.shareDescription")}
                </Text>

                <View style={styles.codeBlock}>
                  <Text style={styles.code}>{inviteCode}</Text>
                  <TouchableOpacity onPress={handleCopy}>
                    <CopyLogo />
                  </TouchableOpacity>
                </View>

                <ButtonWithFeedback text={t("inviteCode.share")} onPress={handleShare} />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <RotatingLoader>
              <CircleDashedLogo />
            </RotatingLoader>
            <Text style={styles.loadingText}>{t("inviteCode.checkingReferrals")}</Text>
          </View>
        </View>
      )}
      <Toast />
    </Modal>
  );
};


export default InviteCodeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    backgroundColor: "#fff",
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
  },
  ticketSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
  },
  redeemButton: {
    backgroundColor: "#7C8CD8",
    paddingVertical: hp(1),
    paddingHorizontal: wp(5),
    borderRadius: 12,
  },
  redeemText: {
    color: "#fff",
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(14),
  },
  title: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(28),
    color: "#1C1C1C",
    textAlign: "center",
    marginBottom: hp(0.5),
  },
  description: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(20),
    color: "#1C1C1C",
    textAlign: "center",
    marginBottom: hp(2),
  },
  codeBlock: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FCFB",
    padding: wp(4),
    borderRadius: 10,
    marginBottom: hp(2),
  },
  code: {
    fontFamily: "HelveticaBold",
    fontSize: scaleFont(24),
    color: "#1C1C1C",
    marginRight: wp(2),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loadingContainer: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(10),
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: scaleFont(24),
    fontFamily: "HelveticaBold",
    marginTop: wp(3),
  },
});
