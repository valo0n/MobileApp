import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const notifications = [
  {
    id: 1,
    section: 'Today',
    title: 'Car Booking Successful',
    message: 'Your car is ready! Check your email for the booking and pickup instructions. Safe travels!',
    time: '10:00 am',
    unread: true,
    icon: '✿',
  },
  {
    id: 2,
    section: 'Today',
    title: 'Payment Notification',
    message: 'Your payment was processed successfully! Enjoy your ride.',
    time: '10:00 am',
    unread: true,
    icon: '▣',
  },
  {
    id: 3,
    section: 'Today',
    title: 'Car Pickup/Drop-off time',
    message: 'Pickup time confirmed! See you at [Time] for your car rental. Drop-off Time Confirmed! Please',
    time: '09:00 am',
    icon: '◌',
  },
  {
    id: 4,
    section: 'Previous',
    title: 'Late Return Warning',
    message: 'Late Return Alert! Please return the car as soon as possible to avoid extra charges.',
    time: 'Yesterday',
    icon: '✿',
  },
  {
    id: 5,
    section: 'Previous',
    title: 'Cancellation Notice',
    message: 'Your Reservation Has Been Canceled or Booking Cancelled Successfully.',
    time: 'Yesterday',
    icon: '▢',
  },
  {
    id: 6,
    section: 'Previous',
    title: 'Discount Notification',
    message: 'Congratulations! You’ve unlocked a 10% discount on your next rental.',
    time: 'Yesterday',
    icon: '✧',
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState([2, 4, 5]);

  const toggleSelect = (id) => {
    if (!selectMode) return;

    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const todayNotifications = notifications.filter((item) => item.section === 'Today');
  const previousNotifications = notifications.filter((item) => item.section === 'Previous');

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

            <Text style={styles.headerTitle}>Notification</Text>

            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => setSelectMode(!selectMode)}
            >
              <Text style={styles.moreText}>•••</Text>
            </TouchableOpacity>
          </View>

          {selectMode && (
            <View style={styles.selectBar}>
              <View style={styles.selectLeft}>
                <TouchableOpacity style={styles.emptyCircle} />
                <Text style={styles.allText}>All</Text>
                <Text style={styles.selectedText}>{selected.length} Selected</Text>
              </View>

              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteIcon}>♲</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Today */}
          <SectionHeader
            title="Today"
            rightText={!selectMode ? '2 Unread Notification' : null}
          />

          {todayNotifications.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              selectMode={selectMode}
              selected={selected.includes(item.id)}
              onPress={() => toggleSelect(item.id)}
            />
          ))}

          {/* Previous */}
          <SectionHeader title="Previous" />

          {previousNotifications.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              selectMode={selectMode}
              selected={selected.includes(item.id)}
              onPress={() => toggleSelect(item.id)}
            />
          ))}

          <View style={{ flex: 1 }} />

          {/* Bottom nav */}
          <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navIcon}>⌂</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navIcon}>⌕</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItem}>
              <Text style={styles.navIcon}>✉</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navItemActive}>
              <Text style={styles.navIconActive}>♧</Text>
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

const SectionHeader = ({ title, rightText }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {rightText && <Text style={styles.sectionRight}>{rightText}</Text>}
  </View>
);

const NotificationRow = ({ item, selectMode, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={[styles.notificationRow, selectMode && selected && styles.selectedRow]}
    onPress={onPress}
  >
    {selectMode && (
      <View style={[styles.checkCircle, selected && styles.checkCircleActive]}>
        {selected && <Text style={styles.checkText}>✓</Text>}
      </View>
    )}

    <View style={styles.iconCircle}>
      <Text style={styles.notificationIcon}>{item.icon}</Text>
    </View>

    <View style={styles.notificationContent}>
      <View style={styles.notificationTop}>
        <Text style={styles.notificationTitle}>{item.title}</Text>

        <View style={styles.timeBox}>
          <Text style={styles.timeText}>{item.time}</Text>
          {item.unread && <View style={styles.blueDot} />}
        </View>
      </View>

      <Text numberOfLines={2} style={styles.notificationMessage}>
        {item.message}
      </Text>
    </View>
  </TouchableOpacity>
);

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
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
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
  headerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
  },

  selectBar: {
    height: 54,
    paddingHorizontal: 18,
    backgroundColor: '#F9F9F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D7D7D7',
    marginRight: 10,
  },
  allText: {
    fontSize: 10,
    color: '#111',
    marginRight: 12,
  },
  selectedText: {
    fontSize: 10,
    color: '#111',
    fontWeight: '600',
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    fontSize: 16,
    color: '#1F2A2B',
  },

  sectionHeader: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#111',
  },
  sectionRight: {
    fontSize: 10,
    color: '#111',
  },

  notificationRow: {
    minHeight: 72,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedRow: {
    backgroundColor: '#ECECEC',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DADADA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkCircleActive: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  checkText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIcon: {
    fontSize: 15,
    color: '#1F2A2B',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: '900',
    color: '#111',
    marginRight: 8,
  },
  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 8,
    color: '#9A9A9A',
  },
  blueDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2F80ED',
    marginLeft: 7,
  },
  notificationMessage: {
    fontSize: 9,
    color: '#8A8A8A',
    lineHeight: 13,
    marginTop: 4,
  },

  bottomNav: {
    height: 58,
    marginHorizontal: 18,
    marginTop: 18,
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

export default NotificationsScreen;