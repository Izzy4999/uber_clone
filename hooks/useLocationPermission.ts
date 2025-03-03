import React, { useEffect, useState } from "react";
import { Alert, Linking } from "react-native";
import * as Location from "expo-location";

const useRequestLocation = () => {
  const [locationGranted, setLocationGranted] = useState(false);

  const requestLocationPermission = async () => {
    let granted = false;

    while (!granted) {
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        granted = true;
        setLocationGranted(true);
        return;
      }

      if (status === "denied" && canAskAgain) {
        Alert.alert(
          "Location Required",
          "You need to grant location access to use this feature.",
          [{ text: "Try Again", onPress: () => {} }]
        );
      }

      if (status === "denied" && !canAskAgain) {
        Alert.alert(
          "Location Access Required",
          "Please enable location access from settings.",
          [
            { text: "Go to Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return locationGranted;
};

export default useRequestLocation;
