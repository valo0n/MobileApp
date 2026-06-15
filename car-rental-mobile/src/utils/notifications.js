import * as Notifications from "expo-notifications";

// Si shfaqen njoftimet kur app-i eshte hapur
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Kerko leje (nje here mjafton)
export async function ensureNotificationPermission() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const res = await Notifications.requestPermissionsAsync();
      return res.status === "granted";
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Shfaq nje njoftim lokal menjehere
export async function notifyLocal(title, body) {
  try {
    const ok = await ensureNotificationPermission();
    if (!ok) return;
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null, // menjehere
    });
  } catch (e) {
    // injoro ne heshtje
  }
}
