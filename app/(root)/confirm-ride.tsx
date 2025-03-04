import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useSocket } from "@/context/socket";
import { useDriverStore, useLocationStore } from "@/store";
import { useUser } from "@clerk/clerk-expo";
import { LegendList } from "@legendapp/list";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ConfirmRide() {
  const { user } = useUser();
  const socket = useSocket();
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();
  const {
    destinationLatitude,
    destinationLongitude,
    userLatitude,
    userLongitude,
  } = useLocationStore();

  useEffect(() => {
    const data = {
      passengerId: user?.id,
      destLat: destinationLatitude,
      destLon: destinationLongitude,
      currentLon: userLongitude,
      currentLang: userLatitude,
    };
    socket.emit("rideRequest", data);
    socket.on("rideRequestResponse", (data) => {
      Toast.show({
        type: "info",
        text1: "Failure",
        text2: data?.message,
        visibilityTime: 5000,
      });
    });
  }, [socket]);

  return (
    <RideLayout title="Waiting for Driver" snapPoints={["60%", "85%"]}>
      <LegendList
        data={drivers}
        renderItem={({ item }) => (
          <DriverCard
            item={item}
            selected={selectedDriver!}
            onPressed={() => {
              console.log("pressed");
              setSelectedDriver(Number(item.id));
            }}
          />
        )}
        estimatedItemSize={200}
        keyExtractor={(item) => String(item.id)}
        ListFooterComponent={() => (
          <View style={styles.footer}>
            <CustomButton
              title="Select Ride"
              onPress={() => {
                router.push("/(root)/book-ride");
              }}
            />
          </View>
        )}
        extraData={selectedDriver}
      />
    </RideLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginHorizontal: 20,
    marginTop: 40,
  },
});
