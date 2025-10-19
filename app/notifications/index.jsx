import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import SWText from "../components/SWText";

const API_URL = Constants.expoConfig?.extra?.apiUrl;

const NotificationScreen = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const session = await AsyncStorage.getItem("user_session");
      if (!session) return;
      const user = JSON.parse(session);

      const res = await fetch(`${API_URL}/notifications/readAndGet?userId=${user.user.id}`);
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();

      setNotifications(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderIcon = (type) => {
    switch (type) {
      case "ALERT":
        return <Ionicons name="alert-circle-outline" size={24} color="#e74c3c" />;
      case "REMINDER":
        return <Ionicons name="time-outline" size={24} color="#f1c40f" />;
      case "EMERGENCY":
        return <Ionicons name="warning-outline" size={24} color="#c0392b" />;
      case "PAYMENT":
        return <Ionicons name="card-outline" size={24} color="#27ae60" />;
      case "ATTENDANCE":
        return <Ionicons name="school-outline" size={24} color="#2980b9" />;
      case "ANNOUNCEMENT":
        return <Ionicons name="megaphone-outline" size={24} color="#8e44ad" />;
      default:
        return <Ionicons name="notifications-outline" size={24} color="#555" />;
    }
  };

  const renderItem = (item) => (
    <View
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification,
      ]}
    >
      <View style={styles.iconContainer}>{renderIcon(item.type)}</View>
      <View style={{ flex: 1 }}>
        <SWText uberBold style={styles.title}>{item.title}</SWText>
        <SWText style={styles.message}>{item.message}</SWText>
        <SWText style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </SWText>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0099cc" />

      {/* Header */}
      <LinearGradient
        colors={["#0099cc", "#00bcd4", "#00d4aa"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <SWText uberBold style={styles.headerTitle}>Notifications</SWText>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Notifications list */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => renderItem(item)}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0099cc" style={{ marginTop: 50 }} />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
              <SWText style={styles.emptyText}>No notifications yet</SWText>
            </View>
          )
        }
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    height: 80,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
  },
  listContent: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#939ea184",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: "#0099cc",
  },
  iconContainer: {
    width: 36,
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: "#999",
  },
});
