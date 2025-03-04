import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSocket } from "@/context/socket";
import { useLocationStore } from "@/store";
import * as Location from "expo-location";
import { PassengerRequest, UserLocation } from "@/types/type";
import { useUser } from "@clerk/clerk-expo";
import { windowWidth } from "@/constants/app.constant";
import { LegendList } from "@legendapp/list";
import RequestCard from "@/components/RequestCard";
import { images } from "@/constants";
import { fonts } from "@/constants/colors";

export default function ViewRequests() {
  const socket = useSocket();
  const { user } = useUser();
  const [requestsList, setRequestList] = useState<PassengerRequest[]>([]);
  const [isLoading, setisloading] = useState(true);
  const { userLatitude, userLongitude, setUserLocation } = useLocationStore();

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

      if (
        user?.publicMetadata?.role &&
        user?.publicMetadata?.role === "driver"
      ) {
        socket.emit("driverLocationUpdate", data);
      }
      socket.emit("userLocation", data);
      setisloading(false);
    }
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const data = {
      lat: userLatitude,
      long: userLongitude,
      socketId: socket.id,
    };
    socket.emit("get-ride-requests", data);
    socket.on("requestList", (data) => {
      setRequestList(data);
    });
    socket.on("request-cancelled", (data) => {
      const newRequest = requestsList.filter(
        (req) => req.passengerId !== data.id
      );
      setRequestList(newRequest);
    });

    socket.on("update-ride-request", (data) => {
      const newRequest = [...requestsList, data?.request];
      setRequestList(newRequest);
    });
    return () => {
      socket.off("request");
    };
  }, [socket]);
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.laoder}>
          <ActivityIndicator size={"large"} />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            paddingHorizontal: windowWidth(20),
            paddingVertical: 10,
          }}
        >
          <LegendList
            data={requestsList}
            renderItem={({ item }) => {
              console.log(item);
              return <RequestCard item={item} />;
            }}
            estimatedItemSize={250}
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1 }}
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  source={images.noResult}
                  style={{ height: windowWidth(300), width: windowWidth(300) }}
                />
                <Text
                  style={{
                    fontFamily: fonts.JakartaBold[0],
                    fontSize: windowWidth(20),
                  }}
                >
                  No ride request in your location
                </Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  laoder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
