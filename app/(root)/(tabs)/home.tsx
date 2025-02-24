import { colors, fonts } from "@/constants/colors";
import { useUser } from "@clerk/clerk-expo";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { LegendList } from "@legendapp/list";
import { icons, images, recentRides } from "@/constants";
import RideCard from "@/components/RideCard";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import React, { useEffect, useState } from "react";
import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import { useLocationStore } from "@/store";

export default function Page() {
  const { setDestinationLocation, setUserLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useUser();
  const loading = true;

  const handleSignout = () => {};
  const handleDestinationPress = () => {};

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
      });

      setUserLocation({
        address: `${address[0].name}, ${address[0].region}`,
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
      });
    }

    getCurrentLocation();
  }, []);

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
