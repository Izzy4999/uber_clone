import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import { icons, images, recentRides } from "@/constants";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import { colors, fonts } from "@/constants/colors";
import { LOCATION_TASK_NAME, useSocket } from "@/context/socket";
import useRequestLocation from "@/hooks/useLocationPermission";
import { useDriverStore, useLocationStore } from "@/store";
import { Driver, UserLocation } from "@/types/type";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { LegendList } from "@legendapp/list";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  useRequestLocation();
  const { setDestinationLocation, setUserLocation } = useLocationStore();
  const { setDrivers } = useDriverStore();
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const socket = useSocket();
  const loading = true;

  const handleSignout = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };
  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);

    router.push("/(root)/find-ride");
  };

  useEffect(() => {
    async function getCurrentLocation() {
      // console.log("work")
      // const { status: backgroundStatus } =
      //   await Location.requestBackgroundPermissionsAsync();
      // if (backgroundStatus !== "granted") {
      //   setHasPermission(false);
      //   return;
      // }

      let location = await Location.getCurrentPositionAsync({});

      console.log(location, Platform.OS === "ios");

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
      });

      // console.log(address);

      setUserLocation({
        address: `${address[0].name}, ${address[0].region}`,
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
      });

      const data: UserLocation = {
        userId: user?.id!,
        lat: location.coords?.latitude,
        lon: location.coords?.longitude,
      };
      // console.log(data, "before if");
      console.log(user?.publicMetadata?.role, Platform.OS);

      if (
        user?.publicMetadata?.role &&
        user?.publicMetadata?.role === "driver"
      ) {
        socket.emit("driverLocationUpdate", data);
      }
      socket.emit("userLocation", data);
    }
    getCurrentLocation();
  }, []);
  

  useEffect(() => {
    // Listen for nearby drivers from the server
    socket.on("nearbyDrivers", (drivers) => {
      // console.log(drivers)
      setDrivers(drivers);
      // setNearbyDrivers(drivers);
    });

    return () => {
      socket.off("nearbyDrivers");
    };
  }, [socket]);

  // useEffect(() => {
  //   // let subscription: Location.LocationSubscription;
  //   (async () => {
  //     await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //       accuracy: Location.Accuracy.High,
  //       timeInterval: 5000, // Minimum time interval (in milliseconds) between updates
  //       distanceInterval: 10, // Minimum change (in meters) before an update is triggered
  //       // iOS-specific option: show indicator when location is tracked in background
  //       showsBackgroundLocationIndicator: true,
  //     });
  //   })();
  // }, [socket]);

  return (
    <SafeAreaView style={styles.container}>
      <LegendList
        data={recentRides.slice(0, 5)}
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => String(item.ride_id)}
        estimatedItemSize={100}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {!loading ? (
              <>
                <Image
                  source={images.noResult}
                  style={styles.emptyImage}
                  resizeMode="contain"
                  alt="No recent rides found"
                />
                <Text>No recent rides found</Text>
              </>
            ) : (
              <ActivityIndicator size={"small"} color={"#000"} />
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: windowWidth(20),
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.JakartaBold[0],
                  fontSize: fontSizes?.FONT23,
                }}
              >
                Welcome{", "}
                {user?.firstName ||
                  user?.emailAddresses[0]?.emailAddress?.split("@")[0]}
              </Text>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: windowWidth(45),
                  height: windowWidth(45),
                  borderRadius: 9999,
                  backgroundColor: "white",
                }}
                onPress={handleSignout}
              >
                <Image
                  source={icons.out}
                  style={{ width: windowWidth(18), height: windowWidth(18) }}
                />
              </TouchableOpacity>
            </View>
            <GoogleTextInput
              icon={icons.search}
              containerStyle={{
                backgroundColor: "white",
                shadowColor: "#D1D5DB", // Tailwind's neutral-300
                shadowOffset: { width: 0, height: 4 }, // Tailwind's "md" shadow offset
                shadowOpacity: 0.06, // Slightly stronger shadow than "sm"
                shadowRadius: 6, // Increased blur
                elevation: 3, // Android shadow equivalent
              }}
              handlePress={handleDestinationPress}
            />
            <>
              <Text
                style={{
                  fontSize: fontSizes.FONT24,
                  fontFamily: fonts.JakartaBold[0],
                  marginTop: 10,
                  marginBottom: 5,
                }}
              >
                Your current location
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: windowWidth(320),
                  backgroundColor: "transparent",
                }}
              >
                <Map />
              </View>
            </>
            <Text
              style={{
                fontSize: fontSizes.FONT24,
                fontFamily: fonts.JakartaBold[0],
                marginTop: 10,
                marginBottom: 5,
              }}
            >
              Recent Rides
            </Text>
          </>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.general[300],
    flex: 1,
  },
  list: {
    paddingHorizontal: windowWidth(15),
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImage: {
    width: windowWidth(160),
    height: windowWidth(160),
  },
});
