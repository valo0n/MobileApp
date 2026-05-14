import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';

const stories = [
  { id: 1, name: 'Add story', plus: true },
  { id: 2, name: 'Carolina', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'Jonathan', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 4, name: 'Andrew', image: 'https://randomuser.me/api/portraits/men/35.jpg' },
  { id: 5, name: 'Pappar', image: 'https://randomuser.me/api/portraits/women/55.jpg' },
];

const chats = [
  {
    id: 1,
    name: 'Hela Quintin',
    message: 'Your car is on the way! It will arrive...',
    time: '09:20 am',
    unread: 2,
    image: 'https://randomuser.me/api/portraits/women/12.jpg',
  },
  {
    id: 2,
    name: 'Cameron',
    message: 'Ok, thanks!',
    time: '09:23 am',
    unread: 1,
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    id: 3,
    name: 'Mr. David',
    message: 'Thank you for booking with us! ...',
    time: '08:30 am',
    image: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    id: 4,
    name: 'Richard',
    message: 'You: A voice message',
    time: '07:32 am',
    image: 'https://randomuser.me/api/portraits/men/18.jpg',
  },
  {
    id: 5,
    name: 'Maichel',
    message: 'You: It was an amazing and smooth ...',
    time: 'Yesterday',
    image: 'https://randomuser.me/api/portraits/men/50.jpg',
  },
  {
    id: 6,
    name: 'Anna',
    message: 'It’s OK, thankyou',
    time: 'Yesterday',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
  },
];

const InboxScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E9E6E6" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.phoneCard}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.titleWrapper}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/15.jpg' }}
                style={styles.headerAvatar}
              />
              <Text style={styles.headerTitle}>Chats</Text>
            </View>

            <TouchableOpacity style={styles.circleButton}>
              <Text style={styles.moreText}>•••</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              placeholder="Search your dream car..."
              placeholderTextColor="#B8B8B8"
              style={styles.searchInput}
            />
          </View>

          {/* Stories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storyList}
          >
            {stories.map((item) => (
              <TouchableOpacity key={item.id} style={styles.storyItem}>
                {item.plus ? (
                  <View style={styles.addStoryCircle}>
                    <Text style={styles.plusText}>+</Text>
                  </View>
                ) : (
                  <View style={styles.storyImageWrapper}>
                    <Image source={{ uri: item.image }} style={styles.storyImage} />
                  </View>
                )}
                <Text style={styles.storyName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Chat list */}
          <View style={styles.chatList}>
            {chats.map((chat) => (
              <TouchableOpacity key={chat.id} style={styles.chatRow}>
                <Image source={{ uri: chat.image }} style={styles.chatAvatar} />

                <View style={styles.chatContent}>
                  <View style={styles.chatTop}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.chatTime}>{chat.time}</Text>
                  </View>

                  <View style={styles.chatBottom}>
                    <Text numberOfLines={1} style={styles.chatMessage}>
                      {chat.message}
                    </Text>

                    {chat.unread && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadText}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom nav */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navIcon}>⌂</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navIcon}>⌕</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItemActive}>
              <Text style={styles.navIconActive}>✉</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navIcon}>♢</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navIcon}>♙</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E9E6E6',
  },
  page: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  phoneCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 26,
    overflow: 'hidden',
    paddingBottom: 18,
    minHeight: 720,
  },

  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#1C2526',
    marginTop: -3,
  },
  moreText: {
    fontSize: 15,
    color: '#1C2526',
    letterSpacing: -2,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
  },

  searchBox: {
    marginHorizontal: 18,
    height: 38,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon: {
    fontSize: 15,
    color: '#B8B8B8',
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    fontSize: 10,
    color: '#111',
    paddingVertical: 0,
  },

  storyList: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 48,
  },
  addStoryCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 22,
    color: '#1F2A2B',
    marginTop: -2,
  },
  storyImageWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  storyName: {
    fontSize: 8,
    color: '#111',
    marginTop: 6,
    textAlign: 'center',
  },

  chatList: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  chatAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    borderBottomWidth: 0,
    borderBottomColor: '#EFEFEF',
    paddingBottom: 2,
  },
  chatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111',
  },
  chatTime: {
    fontSize: 8,
    color: '#9A9A9A',
  },
  chatBottom: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatMessage: {
    flex: 1,
    fontSize: 9,
    color: '#9A9A9A',
    marginRight: 10,
  },
  unreadBadge: {
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  bottomNav: {
    height: 58,
    marginHorizontal: 18,
    marginTop: 4,
    backgroundColor: '#1F2A2B',
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navItem: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemActive: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2A3637',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#8E999A',
  },
  navIconActive: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default InboxScreen;