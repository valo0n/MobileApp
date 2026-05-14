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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const ChatScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E9E6E6" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.phoneCard}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <View style={styles.profileBox}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/12.jpg' }}
                style={styles.avatar}
              />
              <View>
                <Text style={styles.profileName}>Hela Quintin</Text>
                <View style={styles.onlineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.headerIcon}>▭</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton}>
                <Text style={styles.headerIcon}>♧</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.messagesContainer}
          >
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>Hela Quintin</Text>
              <Text style={styles.partnerSub}>Angelina is a partner of QENT.</Text>
            </View>

            <MessageLeft
              text="Ready for your rental adventure? We have a sleek and sporty 2016 red for rent! Reserve your ride now!"
              time="09:10 am"
            />

            <MessageRight
              text="Hi, I'm interested in renting your car. Is it available from [Date] to [Date]?"
              time="09:13 am"
            />

            <MessageLeft
              text="Hello! Yes, the car is available on those dates. Could you please confirm the pickup and drop-off locations?"
              time="09:15 am"
            />

            <MessageRight
              text="Great! I'd like to pick it up from [Pickup Location] and return it to [Drop-off Location]."
              time="09:17 am"
            />

            <VoiceMessage />

            <MessageLeft text="It’s ok no problem" time="09:19 am" />

            <View style={styles.typingRow}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/12.jpg' }}
                style={styles.smallAvatar}
              />
              <Text style={styles.typingText}>Typing...</Text>
            </View>
          </ScrollView>

          {/* Composer */}
          <View style={styles.composerWrapper}>
            <View style={styles.composer}>
              <TouchableOpacity style={styles.plusButton}>
                <Text style={styles.plusText}>›</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder="I'll compare the booking now. Thank you!"
                placeholderTextColor="#444"
              />

              <TouchableOpacity>
                <Text style={styles.emoji}>♡</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sendButton}>
                <Text style={styles.sendText}>➤</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fakeKeyboard}>
              <KeyboardRow letters={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']} />
              <KeyboardRow letters={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']} />
              <KeyboardRow letters={['⇧', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '⌫']} />

              <View style={styles.keyboardBottom}>
                <View style={styles.keySmall}>
                  <Text style={styles.keyText}>?123</Text>
                </View>
                <View style={styles.keySmall}>
                  <Text style={styles.keyText}>⌘</Text>
                </View>
                <View style={styles.spaceKey} />
                <View style={styles.searchKey}>
                  <Text style={styles.searchText}>↵</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const MessageLeft = ({ text, time }) => (
  <View style={styles.leftMessageRow}>
    <Image
      source={{ uri: 'https://randomuser.me/api/portraits/women/12.jpg' }}
      style={styles.smallAvatar}
    />
    <View>
      <View style={styles.leftBubble}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
      <Text style={styles.leftTime}>{time}</Text>
    </View>
  </View>
);

const MessageRight = ({ text, time }) => (
  <View style={styles.rightMessageRow}>
    <View>
      <View style={styles.rightBubble}>
        <Text style={styles.messageText}>{text}</Text>
      </View>
      <Text style={styles.rightTime}>{time}</Text>
    </View>
  </View>
);

const VoiceMessage = () => (
  <View style={styles.voiceRow}>
    <View style={styles.voiceBubble}>
      <View style={styles.playCircle}>
        <Text style={styles.playText}>▷</Text>
      </View>

      <View style={styles.waveBox}>
        {Array.from({ length: 22 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.waveLine,
              { height: 8 + ((index % 5) * 4) },
            ]}
          />
        ))}
      </View>

      <Text style={styles.voiceTime}>0:11</Text>
    </View>

    <View style={styles.blueDot} />
  </View>
);

const KeyboardRow = ({ letters }) => (
  <View style={styles.keyboardRow}>
    {letters.map((letter, index) => (
      <View key={index} style={styles.key}>
        <Text style={styles.keyText}>{letter}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E9E6E6',
  },
  keyboardView: {
    flex: 1,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  phoneCard: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    borderRadius: 26,
    overflow: 'hidden',
  },

  header: {
    height: 70,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  backText: {
    fontSize: 25,
    color: '#1C2526',
    marginTop: -3,
  },
  profileBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 9,
  },
  profileName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111',
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  onlineDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#29C768',
    marginRight: 4,
  },
  onlineText: {
    fontSize: 8,
    color: '#111',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 13,
  },
  headerIcon: {
    fontSize: 17,
    color: '#1F2A2B',
  },

  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  partnerInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  partnerName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111',
  },
  partnerSub: {
    fontSize: 8,
    color: '#9A9A9A',
    marginTop: 6,
  },

  leftMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  leftBubble: {
    maxWidth: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  rightMessageRow: {
    alignItems: 'flex-end',
    marginBottom: 18,
  },
  rightBubble: {
    maxWidth: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 11,
    paddingVertical: 10,
  },
  messageText: {
    fontSize: 9,
    lineHeight: 14,
    color: '#111',
  },
  leftTime: {
    fontSize: 8,
    color: '#9A9A9A',
    marginTop: 6,
    marginLeft: 6,
  },
  rightTime: {
    fontSize: 8,
    color: '#9A9A9A',
    marginTop: 6,
    textAlign: 'right',
  },

  voiceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 18,
  },
  voiceBubble: {
    width: 210,
    height: 42,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
  },
  playCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  playText: {
    fontSize: 10,
    color: '#9A9A9A',
  },
  waveBox: {
    flex: 1,
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  waveLine: {
    width: 2,
    borderRadius: 2,
    backgroundColor: '#D3D3D3',
    marginRight: 4,
  },
  voiceTime: {
    fontSize: 8,
    color: '#9A9A9A',
    marginLeft: 5,
  },
  blueDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2F80ED',
    marginLeft: 5,
  },

  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typingText: {
    fontSize: 9,
    color: '#9A9A9A',
    fontStyle: 'italic',
  },

  composerWrapper: {
    backgroundColor: '#F9F9F9',
  },
  composer: {
    height: 44,
    marginHorizontal: 12,
    marginBottom: 5,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  plusButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  plusText: {
    fontSize: 21,
    color: '#9A9A9A',
    transform: [{ rotate: '180deg' }],
  },
  input: {
    flex: 1,
    fontSize: 9,
    color: '#111',
    paddingVertical: 0,
  },
  emoji: {
    fontSize: 16,
    color: '#9A9A9A',
    marginHorizontal: 8,
  },
  sendButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    fontSize: 15,
    color: '#1F2A2B',
  },

  fakeKeyboard: {
    height: 190,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 5,
    paddingTop: 7,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 7,
  },
  key: {
    flex: 1,
    height: 32,
    marginHorizontal: 2,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 13,
    color: '#111',
  },
  keyboardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  keySmall: {
    width: 44,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#DADADA',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  spaceKey: {
    flex: 1,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
  },
  searchKey: {
    width: 48,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  searchText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default ChatScreen;