import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { scaleFont } from "@/src/utilities/responsive-design";
import { useRouter } from "expo-router";
import { useTranslation } from "@/src/hooks/use-translation";
import { Ionicons } from "@expo/vector-icons";
import { callAskAiFunction } from "@/src/services/scan.service";
import InSkyLogo from "@assets/svg/home/inSky.svg";
import SendMessage from "@assets/svg/home/send-message.svg";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SpiritualCleanse: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t("spiritualCleanse.welcomeMessage"),
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const suggestedQuestions = [
    t("spiritualCleanse.suggestedQuestions.morningRoutine"),
    t("spiritualCleanse.suggestedQuestions.protection"),
    t("spiritualCleanse.suggestedQuestions.sanctuary"),
  ];

  useEffect(() => {
    // Auto scroll to bottom when new messages are added
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Create payload for spiritual/astrology questions
      const payload = {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are a spiritual guide and astrology expert. Provide helpful, insightful, and compassionate responses about spirituality, astrology, energy cleansing, and personal growth. Keep responses concise but meaningful.",
          },
          {
            role: "user",
            content: inputText.trim(),
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      };

      const response = await callAskAiFunction(payload);
      const aiResponse = response?.data?.choices?.[0]?.message?.content;
      //console.log("Ai response = ", aiResponse);

      if (aiResponse) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error("No response received");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t("spiritualCleanse.errorMessage"),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!item.isUser ? (
        <View style={styles.aiAvatarContainer}>
          <View style={styles.aiAvatar}>
            <InSkyLogo width={15} height={15} />
          </View>

          <Text style={styles.aiAvatarText}>
            {t("spiritualCleanse.avatarText.ai")}
          </Text>
        </View>
      ) : (
        <View style={styles.userAvatarContainer}>
          <Text style={styles.aiAvatarText}>
            {t("spiritualCleanse.avatarText.user")}{" "}
          </Text>
          <View style={styles.aiAvatar}>
            {/* <InSkyLogo width={15} height={15} /> */}
          </View>
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            item.isUser ? styles.userText : styles.aiText,
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );

  const renderSuggestedQuestions = () => (
    <View style={styles.suggestionsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {suggestedQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionButton}
            onPress={() => handleSuggestedQuestion(question)}
          >
            <Text style={styles.suggestionText}>{question}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("spiritualCleanse.title")}</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Suggested Questions */}
        {messages.length <= 1 && renderSuggestedQuestions()}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={t("spiritualCleanse.placeholder")}
              placeholderTextColor="#666666"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              {isLoading ? (
                <Ionicons name="hourglass" size={20} color="#FFFFFF" />
              ) : (
                <SendMessage size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(1),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: wp(3),
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(18),
    color: "#FFFFFF",
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
  messageContainer: {
    flexDirection: "column",
    marginBottom: hp(2),
  },
  userMessage: {
    justifyContent: "flex-end",
  },
  aiMessage: {
    justifyContent: "flex-start",
  },
  aiAvatarContainer: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginRight: wp(2),
    marginBottom: hp(0.5),
    flexDirection: "row",
  },
  aiAvatar: {
    width: wp(5),
    height: wp(5),
    borderRadius: wp(4),
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(2),
  },
  aiAvatarText: {
    fontFamily: "HelveticaRegular",
    fontSize: scaleFont(14),
    color: "#FFFFFF",
  },
  avatarText: {
    fontSize: scaleFont(10),
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  userAvatarContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginBottom: hp(0.5),
    flexDirection: "row",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  userBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    marginLeft: "30%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 16,
  },
  aiBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.12)",
  },
  messageText: {
    fontSize: scaleFont(14),
    lineHeight: scaleFont(20),
  },
  userText: {
    color: "#FFFFFF",
  },
  aiText: {
    color: "#FFFFFF",
  },
  suggestionsContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    flexDirection: "row",
  },
  suggestionButton: {
    width: 150,
    backgroundColor: "#1A1A1A",
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderTopLeftRadius: 16,
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ffffff",
    marginHorizontal: wp(1),
  },
  suggestionText: {
    fontSize: scaleFont(12),
    color: "#CCCCCC",
  },
  inputContainer: {
    paddingHorizontal: wp(5),

    marginBottom: hp(3),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 30,
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.5),
  },
  textInput: {
    flex: 1,
    fontSize: scaleFont(14),
    color: "#FFFFFF",
    maxHeight: hp(12),
    paddingVertical: hp(1),
  },
  sendButton: {
    // backgroundColor: "#6A4CFF",
    // borderRadius: 16,
    padding: wp(2),
    marginLeft: wp(2),
  },
  sendButtonDisabled: {
    // backgroundColor: "#333333",
  },
});

export default SpiritualCleanse;
