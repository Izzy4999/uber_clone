import { icons } from "@/constants";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import { fonts } from "@/constants/colors";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Map from "./Map";

export default function RideLayout({
  children,
  title,
  snapPoints,
}: {
  children: React.ReactNode;
  title?: string;
  snapPoints?: string[];
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ height: "100%", backgroundColor: "blue" }}>
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              zIndex: 10,
              top: windowWidth(60),
              alignItems: "center",
              justifyContent: "flex-start",
              paddingHorizontal: windowWidth(20),
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.button}
            >
              <View style={styles.container}>
                <Image
                  source={icons.backArrow} // Ensure this is a valid image path
                  resizeMode="contain"
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
            <Text
              style={{
                fontFamily: fonts.JakartaSemiBold[0],
                fontSize: fontSizes.FONT19,
                marginLeft: windowWidth(20),
              }}
            >
              {title || "Go Back"}
            </Text>
          </View>
          <Map />
        </View>
        <BottomSheet
          keyboardBehavior="extend"
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["45%", "85%"]}
        >
          <BottomSheetView style={{ flex: 1, padding: 20 }}>
            {children}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start", // Adjust positioning as needed
  },
  container: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
