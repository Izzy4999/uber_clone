import { Image, Text, View, StyleSheet } from "react-native";

import { icons } from "@/constants";
import { Ride } from "@/types/type";
import { windowWidth } from "@/constants/app.constant";
import { colors } from "@/constants/colors";
import { formatDate, formatTime } from "@/libs/utils";

const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.contentContainer}>
        <View style={styles.rowBetween}>
          <Image
            source={{
              uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=600&height=400&center=lonlat:${ride.destination_longitude},${ride.destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
            }}
            style={styles.mapImage}
          />

          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <Image source={icons.to} style={styles.icon} />
              <Text style={styles.text} numberOfLines={1}>
                {ride.origin_address}
              </Text>
            </View>

            <View style={styles.row}>
              <Image source={icons.point} style={styles.icon} />
              <Text style={styles.text} numberOfLines={1}>
                {ride.destination_address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.boldText} numberOfLines={1}>
              {formatDate(ride.created_at)}, {formatTime(ride.ride_time)}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Driver</Text>
            <Text style={styles.boldText}>
              {ride.driver.first_name} {ride.driver.last_name}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Car Seats</Text>
            <Text style={styles.boldText}>{ride.driver.car_seats}</Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Payment Status</Text>
            <Text
              style={[
                styles.boldText,
                ride.payment_status === "paid"
                  ? styles.paidText
                  : styles.unpaidText,
              ]}
            >
              {ride.payment_status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#D1D5DB", // Tailwind's neutral-300
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1, // For Android
    marginBottom: 12,
  },
  contentContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: 12,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailsContainer: {
    flexDirection: "column",
    marginLeft: 20,
    flex: 1,
    gap: 10,
  },
  mapImage: {
    width: windowWidth(90),
    height: windowWidth(100),
    borderRadius: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: windowWidth(18),
    fontFamily: "JakartaMedium",
  },
  infoContainer: {
    flexDirection: "column",
    width: "100%",
    marginTop: 10,
    backgroundColor: colors.general[500], // Tailwind's general-500
    borderRadius: 10,
    padding: 12,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  label: {
    fontSize: windowWidth(16),
    fontFamily: "JakartaMedium",
    color: "#6B7280", // Tailwind's gray-500
  },
  boldText: {
    fontSize: windowWidth(16),
    fontFamily: "JakartaBold",
    textTransform: "capitalize",
  },
  paidText: {
    color: "#22C55E", // Tailwind's green-500
  },
  unpaidText: {
    color: "#EF4444", // Tailwind's red-500
  },
});

export default RideCard;
