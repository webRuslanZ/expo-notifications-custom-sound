import React, { useEffect, useRef } from "react";
import { Button, Platform, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import { View } from "@/components/Themed";

export default function TabOneScreen() {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("notif", {
        name: "Notif",
        importance: Notifications.AndroidImportance.MAX,
        sound: "piano_notif",
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    }).then((status) => console.log(status));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        console.log("NOTIF : --->", notification);
        const count = await Notifications.getBadgeCountAsync();
        await Notifications.setBadgeCountAsync(count + 1);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        async (response) => {
          console.log("RESPONSE : --->", response);
          Notifications.setBadgeCountAsync(0);
        }
      );

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  const scheduleNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Here's a title 📬",
        body: "Here's a body",
        data: { data: "Here's a data" },
        vibrate: [0, 255, 255, 255],
      },
      trigger: { seconds: 1, channelId: "notif" },
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Get notification" onPress={scheduleNotification} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
