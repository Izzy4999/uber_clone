import React from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { icons } from "@/constants";
import { DriverCardProps, MarkerData } from "@/types/type";
import { formatTime } from "@/libs/utils";
import { colors, fonts } from "@/constants/colors";
import { useDriverStore } from "@/store";

interface Props  {
    item: MarkerData;
    selected: number;
    setSelected?: () => void;
    onPressed?: () => void;
}
export default function DriverCard({
  item,
  selected,
  setSelected,
  onPressed,
}: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        if (onPressed) {
          onPressed();
        }
      }}
      style={[
        styles.card,
        String(selected) === item.id ? styles.selectedCard : styles.defaultCard,
      ]}
    >
      <Image
        source={{ uri: item.profile_image_url }}
        style={styles.profileImage}
      />

      <View style={styles.infoContainer}>
        {/* Title & Rating */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.ratingRow}>
            <Image source={icons.star} style={styles.iconSmall} />
            <Text style={styles.textSmall}>4</Text>
          </View>
        </View>

        {/* Price, Time, and Seats */}
        <View style={styles.detailsRow}>
          <View style={styles.inlineRow}>
            <Image source={icons.dollar} style={styles.iconMedium} />
            <Text style={styles.textSmall}>${item.price}</Text>
          </View>

          <Text style={[styles.separator, { color: colors.general[800] }]}>
            |
          </Text>

          <Text style={[styles.textSmall, { color: colors.general[800] }]}>
            {formatTime(10!)}
          </Text>

          <Text style={[styles.separator, { color: colors.general[800] }]}>
            |
          </Text>

          <Text style={[styles.textSmall, { color: colors.general[800] }]}>
            {item.car_seats} seats
          </Text>
        </View>
      </View>

      <Image
        source={{ uri: item.car_image_url }}
        style={styles.carImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  selectedCard: {
    backgroundColor: colors.general[600], // Equivalent to bg-general-600
  },
  defaultCard: {
    backgroundColor: "#ffffff",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.Jakarta[0],
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  iconSmall: {
    width: 14,
    height: 14,
  },
  textSmall: {
    fontSize: 14,
    fontFamily: fonts.Jakarta[0],
    // color: colors.general[600], // Equivalent to text-general-800
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMedium: {
    width: 16,
    height: 16,
  },
  separator: {
    fontSize: 14,
    fontFamily: fonts.Jakarta[0],
    color: colors.general[800],
    marginHorizontal: 8,
  },
  carImage: {
    width: 56,
    height: 56,
  },
});
