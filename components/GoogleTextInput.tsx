import { View, Text, StyleSheet, Platform, Image } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import React from "react";
import { GoogleInputProps } from "@/types/type";
import { icons } from "@/constants";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

export default function GoogleTextInput({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Where do you want to go?"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor || "white",
            fontSize: 16,
            fontWeight: 600,
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor || "white",
            position: "relative",
            top: 0,
            width: "100%",
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
          },
        }}
        onPress={(data, details) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
        }}
        renderLeftButton={() => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: 20,
              height: 20,
            }}
          >
            <Image
              source={icon ? icon : icons.search}
              style={{
                width: 20,
                height: 20,
              }}
              resizeMode="contain"
            />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do yo want to go?",
        }}
        disableScroll
      />
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
