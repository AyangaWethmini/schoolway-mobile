import Constants from "expo-constants";
import * as Location from "expo-location";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase, ref, update } from "firebase/database";

// ✅ Firebase setup
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey as string,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain as string,
  databaseURL: Constants.expoConfig?.extra?.firebaseDatabaseURL as string,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId as string,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

// Store all active watchers in an array
const locationWatchers: Location.LocationSubscription[] = [];

// Start location tracking
export async function startLocationTracking(sessionId: string) {
  try {
    if (locationWatchers.length > 0) {
      console.log("⚠️ Location tracking already running");
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permission not granted");
      return;
    }

    const watcher = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
        timeInterval: 3000,
      },
      async (location) => {
        const { latitude, longitude } = location.coords;
        console.log("📍 Location update:", latitude, longitude);

        // Update Firebase
        await update(ref(db, `active_sessions/${sessionId}/currentLocation`), {
          latitude,
          longitude,
          updatedAt: Date.now(),
        });
      }
    );

    locationWatchers.push(watcher);
    console.log("✅ Location tracking started");
  } catch (err) {
    console.error("Error starting location tracking:", err);
  }
}

// Stop all location tracking
export async function stopLocationTracking() {
  try {
    console.log("🛑 Stopping location tracking...");
    if (locationWatchers.length === 0) {
      console.log("⚠️ No active location watcher found");
      return;
    }

    for (const watcher of locationWatchers) {
      await watcher.remove();
    }

    locationWatchers.length = 0;
    console.log("🛑 Location tracking stopped");
  } catch (err) {
    console.error("Error stopping location tracking:", err);
  }
}
