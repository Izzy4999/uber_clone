import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { GoogleInputProps } from "@/types/type";

export default function GoogleTextInput({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
}: GoogleInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text>Search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
    borderRadius: 30,
    marginBottom: 10,
  },
});
