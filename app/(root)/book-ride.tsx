import { useUser } from "@clerk/clerk-expo";
import { Image, Text, View, StyleSheet } from "react-native";

import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants";
import { useDriverStore, useLocationStore } from "@/store";
import React from "react";
import { formatTime } from "@/libs/utils";
import { colors, fonts } from "@/constants/colors";
import Payment from "@/components/Payment";

const BookRide = () => {
  const { user } = useUser();
  const { userAddress, destinationAddress } = useLocationStore();
  const { drivers, selectedDriver } = useDriverStore();

  const driverDetails = drivers?.find(
    (driver) => +driver.id === selectedDriver
  );

  return (
    <RideLayout title="Book Ride" snapPoints={["80%"]}>
      <>
        <Text style={styles.title}>Ride Information</Text>

        <View style={styles.driverContainer}>
          <Image
            source={{ uri: driverDetails?.profile_image_url }}
            style={styles.driverImage}
          />

          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>
              {driverDetails?.first_name + " " + driverDetails?.last_name}
            </Text>
            <View style={styles.ratingContainer}>
              <Image
                source={icons.star}
                style={styles.starIcon}
                resizeMode="contain"
              />
              <Text style={styles.ratingText}>{driverDetails?.rating}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ride Price</Text>
            <Text style={styles.priceText}>${driverDetails?.price}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pickup Time</Text>
            <Text style={styles.infoValue}>
              {formatTime(driverDetails?.time! || 5)}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.infoLabel}>Car Seats</Text>
            <Text style={styles.infoValue}>{driverDetails?.car_seats}</Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <View
            style={[
              styles.addressRow,
              { borderTopWidth: 1, borderColor: colors.general[700] },
            ]}
          >
            <Image source={icons.to} style={styles.icon} />
            <Text style={styles.addressText}>{userAddress}</Text>
          </View>

          <View style={styles.addressRow}>
            <Image source={icons.point} style={styles.icon} />
            <Text style={styles.addressText}>{destinationAddress}</Text>
          </View>
        </View>
        <Payment amount={Number(driverDetails?.price)} />
      </>
    </RideLayout>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: fonts.JakartaSemiBold[0],
    marginBottom: 12,
  },
  driverContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  driverImage: {
    width: 112,
    height: 112,
    borderRadius: 9999, // Fully rounded
  },
  driverInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  driverName: {
    fontSize: 18,
    fontFamily: fonts.JakartaSemiBold[0],
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starIcon: {
    width: 20,
    height: 20,
  },
  ratingText: {
    fontSize: 18,
    fontFamily: fonts.Jakarta[0],
  },
  infoBox: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: colors.general[600], // Adjust based on theme
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 18,
    fontFamily: fonts.Jakarta[0],
  },
  infoValue: {
    fontSize: 18,
    fontFamily: fonts.Jakarta[0],
  },
  priceText: {
    fontSize: 18,
    fontFamily: fonts.Jakarta[0],
    color: "#0CC25F",
  },
  addressContainer: {
    width: "100%",
    marginTop: 20,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.general[700], // Adjust border color
    paddingVertical: 20,
  },
  addressText: {
    fontSize: 18,
    fontFamily: fonts.Jakarta[0],
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default BookRide;
