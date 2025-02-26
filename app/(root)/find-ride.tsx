import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import { fonts } from "@/constants/colors";
import { useLocationStore } from "@/store";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FindRide() {
  const {
    userAddress,
    destinationAddress,
    setUserLocation,
    setDestinationLocation,
  } = useLocationStore();
  return (
    <RideLayout title="Ride" snapPoints={["80%"]}>
      <View style={{ marginVertical: windowWidth(15) }}>
        <Text style={styles.text}>From</Text>
        <GoogleTextInput
          handlePress={(location) => setUserLocation(location)}
          icon={icons.target}
          initialLocation={userAddress!}
          containerStyle={{ backgroundColor: "#f5f5f5" }}
          textInputBackgroundColor="#f5f5f5"
        />
      </View>
      <View style={{ marginVertical: windowWidth(15) }}>
        <Text style={styles.text}>TO</Text>
        <GoogleTextInput
          handlePress={(location) => setDestinationLocation(location)}
          icon={icons.map}
          initialLocation={destinationAddress!}
          containerStyle={{ backgroundColor: "#f5f5f5" }}
          textInputBackgroundColor="transparent"
        />
      </View>
      <CustomButton
        title="Find now"
        onPress={() => router.push("/(root)/confirm-ride")}
        style={{ marginTop: 20 }}
      />
    </RideLayout>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.JakartaSemiBold[0],
    marginBottom: windowWidth(15),
    fontSize: fontSizes.FONT19,
  },
});
