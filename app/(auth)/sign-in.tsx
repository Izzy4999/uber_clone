import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import React, { useCallback } from "react";
import { icons, images } from "@/constants";
import { windowWidth } from "@/constants/app.constant";
import { colors, fonts } from "@/constants/colors";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignIn } from "@clerk/clerk-expo";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, form.email, form.password]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <View
          style={{
            position: "relative",
            width: "100%",
            height: windowWidth(350),
          }}
        >
          <Image source={images.signUpCar} style={styles.image} />
          <Text style={styles.imageText}> Welcome 👋</Text>
        </View>
        <View style={{ padding: windowWidth(20) }}>
          <InputField
            label="Email"
            placeholder="Enter you email"
            icon={icons.email}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            icon={icons.lock}
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
          />

          <CustomButton
            title="Sign In"
            onPress={onSignInPress}
            style={{ marginTop: windowWidth(40) }}
          />

          <OAuth />

          <Link href={"/sign-up"} style={styles.linkStyle}>
            <Text>Don't have an account?</Text>
            <Text style={{ color: colors.primary[500] }}>Sign up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    zIndex: 0,
    width: "100%",
    height: windowWidth(350),
  },
  imageText: {
    position: "absolute",
    fontSize: windowWidth(40),
    fontFamily: fonts.JakartaSemiBold[0],
    bottom: windowWidth(40),
    left: windowWidth(20),
  },
  linkStyle: {
    textAlign: "center",
    color: colors.general[200],
    marginTop: windowWidth(30),
  },
});
