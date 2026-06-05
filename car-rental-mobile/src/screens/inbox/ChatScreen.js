import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { BackIcon, MoreIcon } from "../../components/common/Icons";
import { ChatService, AuthService } from "../../services";

const SendIcon = ({ color = "#fff" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const PhoneIcon = ({ color = "#111" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22 20.4 21.6 21 21 21C10 21 3 14 3 3C3 2.4 3.6 2 4.08 2H7.08C7.66 2 8.18 2.35 8.32 2.9C8.6 4.4 9.05 5.86 9.65 7.26C9.85 7.7 9.74 8.22 9.4 8.56L7.83 10.13C9.45 13.42 12.58 16.55 15.87 18.17L17.44 16.6C17.78 16.26 18.3 16.15 18.74 16.35C20.14 16.95 21.6 17.4 23.1 17.68C23.65 17.82 24 18.34 24 18.92"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      transform="translate(-1 0)"
    />
  </Svg>
);

const MOCK_MESSAGES = [
  {
    id: 1,
    content: "Hi! Is the car still available?",
    sender_id: 99,
    created_at: "09:10",
  },
  {
    id: 2,
    content: "Yes, it is available for your dates!",
    sender_id: 1,
    created_at: "09:12",
  },
  {
    id: 3,
    content: "Great, what time can I pick it up?",
    sender_id: 99,
    created_at: "09:15",
  },
  {
    id: 4,
    content: "Your car is on the way! It will arrive soon.",
    sender_id: 1,
    created_at: "09:20",
  },
];

const ChatScreen = ({ navigation, route }) => {
  const { conversationId, name, avatar } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    AuthService.getProfile()
      .then((res) => setMyId(res.data?.id))
      .catch(() => {});
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const res = await ChatService.getMessages(conversationId);
      const data = res.data || [];
      setMessages(data.length > 0 ? data : MOCK_MESSAGES);
    } catch (e) {
      setMessages(MOCK_MESSAGES);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;
    const newMsg = {
      id: Date.now(),
      content: text.trim(),
      sender_id: myId,
      created_at: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setText("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      await ChatService.sendMessage(conversationId, newMsg.content);
    } catch (e) {
      // mesazhi mbetet ne UI edhe nese backend deshton
    }
  };

  const formatTime = (t) => {
    if (!t) return "";
    if (typeof t === "string" && t.length <= 8) return t;
    try {
      return new Date(t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={20} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image
            source={{ uri: avatar || "https://i.pravatar.cc/100?img=47" }}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerName}>{name || "Chat"}</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <PhoneIcon color="#111" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#111" />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.messagesArea}
            contentContainerStyle={{ padding: 16 }}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: false })
            }
          >
            {messages.map((m) => {
              const isMe = m.sender_id === myId;
              return (
                <View
                  key={m.id}
                  style={[
                    styles.msgRow,
                    isMe ? styles.msgRight : styles.msgLeft,
                  ]}
                >
                  <View
                    style={[
                      styles.bubble,
                      isMe ? styles.bubbleMe : styles.bubbleOther,
                    ]}
                  >
                    <Text style={[styles.msgText, isMe && { color: "#fff" }]}>
                      {m.content}
                    </Text>
                  </View>
                  <Text style={styles.msgTime}>{formatTime(m.created_at)}</Text>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={text}
            onChangeText={setText}
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <SendIcon color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: { flexDirection: "row", alignItems: "center" },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, marginRight: 10 },
  headerName: { fontSize: 15, fontWeight: "700", color: "#111" },
  headerStatus: { fontSize: 11, color: "#10B981" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  messagesArea: { flex: 1 },
  msgRow: { marginBottom: 14, maxWidth: "80%" },
  msgLeft: { alignSelf: "flex-start", alignItems: "flex-start" },
  msgRight: { alignSelf: "flex-end", alignItems: "flex-end" },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMe: { backgroundColor: "#2D2D2D", borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: "#fff", borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, color: "#111", lineHeight: 20 },
  msgTime: {
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
    marginHorizontal: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111",
    maxHeight: 100,
    marginRight: 10,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#2D2D2D",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;
