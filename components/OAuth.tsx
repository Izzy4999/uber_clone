import { fontSizes, windowWidth } from "@/constants/app.constant";
import { colors, fonts } from "@/constants/colors";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";

export default function OAuth() {
  const handleGoogleSignin = async () => {};

  return (
    <View>
      <View style={styles.innerContaniner}>
        <View
          style={{ flex: 1, height: 1, backgroundColor: colors.general[100] }}
        />
        <Text
          style={{ fontSize: fontSizes.FONT18, fontFamily: fonts.Jakarta[0] }}
        >
          OR
        </Text>
        <View
          style={{ flex: 1, height: 1, backgroundColor: colors.general[100] }}
        />
      </View>
      <CustomButton
        title="Log in with google"
        style={styles.authButton}
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            style={{
              width: windowWidth(25),
              height: windowWidth(25),
              marginHorizontal: windowWidth(10),
            }}
          />
        )}
        textVariant="primary"
        bgVariant="outline"
        onPress={handleGoogleSignin}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  innerContaniner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowWidth(25),
    gap: windowWidth(15),
  },
  authButton: {
    marginTop: windowWidth(25),
    width: "100%",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
});
