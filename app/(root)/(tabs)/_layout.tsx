import { icons } from "@/constants";
import { colors } from "@/constants/colors";
import { Tabs } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  View,
} from "react-native";

const TabIcon = ({
  focused,
  source,
}: {
  focused: boolean;
  source: ImageSourcePropType;
}) => (
  <View
    style={[
      styles.iconContainer,
      focused && { backgroundColor: colors.general[300] },
    ]}
  >
    <View
      style={[
        styles.imageContainer,
        focused && { backgroundColor: colors.general[400] },
      ]}
    >
      <Image
        source={source}
        tintColor={"white"}
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  </View>
);

export default function Layout() {
  return (
    <Tabs
      // initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#333333",
          borderRadius: 50,
          position: "absolute",
          height: 78,
          marginHorizontal: 20,
          ...Platform.select({
            ios: {
              marginBottom: 20,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center", // Ensure contents are centered
              alignItems: "center", // Ensure contents are centered
              overflow: "hidden",
            },
            android: {
              paddingTop: 20,
              marginBottom: 10,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.home} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="rides"
        options={{
          title: "Rides",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.list} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.chat} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon source={icons.profile} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center", // Center contents
    alignItems: "center", // Center contents
    borderRadius: 9999, // Keep rounded
  },
  imageContainer: {
    width: 48, // Ensure it remains circular
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
  },
  image: {
    width: 28,
    height: 28,
  },
});
