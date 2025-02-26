import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useDriverStore } from "@/store";
import { LegendList } from "@legendapp/list";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ConfirmRide() {
  const { drivers, selectedDriver, setSelectedDriver } = useDriverStore();

  return (
    <RideLayout title="Choose a driver" snapPoints={["60%", "85%"]}>
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
