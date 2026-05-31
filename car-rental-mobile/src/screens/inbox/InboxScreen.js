import React, { useState, useCallback } from "react";
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
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Svg, { Path, Circle } from "react-native-svg";
import { SearchIcon, BackIcon, MoreIcon } from "../../components/common/Icons";
import { ChatService } from "../../services";

const PlusIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Stories (mock — dekorative)
const STORIES = [
  { id: "c1", name: "Carolina", avatar: "https://i.pravatar.cc/100?img=45" },
  { id: "c2", name: "Jonathan", avatar: "https://i.pravatar.cc/100?img=33" },
  { id: "c3", name: "Andrew", avatar: "https://i.pravatar.cc/100?img=12" },
  { id: "c4", name: "Pappar", avatar: "https://i.pravatar.cc/100?img=15" },
];

// Mock conversations nese backend bosh
const MOCK = [
  {
    id: 1,
    first_name: "Hela",
    last_name: "Quintin",
    avatar_url: "https://i.pravatar.cc/100?img=47",
    last_message: "Your car is on the way! It will arrive...",
    last_message_at: "09:20 am",
    unread: 2,
  },
  {
    id: 2,
    first_name: "Cameron",
    last_name: "",
    avatar_url: "https://i.pravatar.cc/100?img=68",
    last_message: "Ok, thanks!",
    last_message_at: "09:23 am",
    unread: 1,
  },
  {
    id: 3,
    first_name: "Mr.",
    last_name: "David",
    avatar_url: "https://i.pravatar.cc/100?img=51",
    last_message: "Thank you for booking with us! ...",
    last_message_at: "08:30 am",
    unread: 0,
  },
  {
    id: 4,
    first_name: "Richard",
    last_name: "",
    avatar_url: "https://i.pravatar.cc/100?img=13",
    last_message: "You: A voice message",
    last_message_at: "07:32 am",
    unread: 0,
  },
  {
    id: 5,
    first_name: "Maichel",
    last_name: "",
    avatar_url: "https://i.pravatar.cc/100?img=14",
    last_message: "You: It was an amazing and smooth ...",
    last_message_at: "Yesterday",
    unread: 0,
  },
  {
    id: 6,
    first_name: "Anna",
    last_name: "",
    avatar_url: "https://i.pravatar.cc/100?img=44",
    last_message: "It's OK, thankyou",
    last_message_at: "Yesterday",
    unread: 0,
  },
];

const InboxScreen = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await ChatService.getConversations();
      const data = res.data || [];
      setConversations(data.length > 0 ? data : MOCK);
    } catch (e) {
      setConversations(MOCK);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const filtered = conversations.filter((c) =>
    `${c.first_name || ""} ${c.last_name || ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const formatTime = (t) => {
    if (!t) return "";
    if (
      typeof t === "string" &&
      (t.includes("am") || t.includes("pm") || t === "Yesterday")
    )
      return t;
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
            source={{ uri: "https://i.pravatar.cc/100?img=47" }}
            style={styles.headerAvatar}
          />
          <Text style={styles.headerTitle}>Chats</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBox}>
        <SearchIcon size={18} color="#9CA3AF" />
        <TextInput
          placeholder="Search messages..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Stories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storiesRow}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        <View style={styles.storyItem}>
          <TouchableOpacity style={styles.addStoryCircle}>
            <PlusIcon color="#111" />
          </TouchableOpacity>
          <Text style={styles.storyName}>Add story</Text>
        </View>
        {STORIES.map((s) => (
          <TouchableOpacity key={s.id} style={styles.storyItem}>
            <View style={styles.storyRing}>
              <Image source={{ uri: s.avatar }} style={styles.storyAvatar} />
            </View>
            <Text style={styles.storyName}>{s.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conversations */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 110 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filtered.length === 0 ? (
            <Text style={styles.emptyText}>S'ka mesazhe</Text>
          ) : (
            filtered.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.chatItem}
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate("ChatConversation", {
                    conversationId: c.id,
                    name: `${c.first_name} ${c.last_name}`.trim(),
                    avatar: c.avatar_url,
                  })
                }
              >
                <Image
                  source={{
                    uri: c.avatar_url || `https://i.pravatar.cc/100?u=${c.id}`,
                  }}
                  style={styles.avatar}
                />
                <View style={styles.chatContent}>
                  <View style={styles.chatTop}>
                    <Text style={styles.chatName}>
                      {c.first_name} {c.last_name}
                    </Text>
                    <Text style={styles.chatTime}>
                      {formatTime(c.last_message_at)}
                    </Text>
                  </View>
                  <View style={styles.chatBottom}>
                    <Text style={styles.chatMsg} numberOfLines={1}>
                      {c.last_message || "No messages yet"}
                    </Text>
                    {c.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{c.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
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
  headerAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111", marginLeft: 10 },
  storiesRow: { maxHeight: 100, marginTop: 16 },
  storyItem: { alignItems: "center", marginRight: 16, width: 64 },
  addStoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  storyRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  storyAvatar: { width: 48, height: 48, borderRadius: 24 },
  storyName: { fontSize: 11, color: "#6B7280" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 14 },
  chatContent: { flex: 1 },
  chatTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: { fontSize: 15, fontWeight: "700", color: "#111" },
  chatTime: { fontSize: 12, color: "#9CA3AF" },
  chatBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatMsg: { fontSize: 13, color: "#9CA3AF", flex: 1 },
  unreadBadge: {
    backgroundColor: "#3B82F6",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 40 },
});

export default InboxScreen;
