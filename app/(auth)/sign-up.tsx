import { View, Text, ScrollView, StyleSheet, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons, images } from "@/constants";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import { colors, fonts } from "@/constants/colors";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import OAuth from "@/components/OAuth";
import { useSignUp } from "@clerk/clerk-expo";
import ReactNativeModal from "react-native-modal";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setVerification({ ...verification, state: "pending" });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      Alert.alert("Error", err.errors[0].longMessage);
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        // TODO: Create a database user!
        await setActive({ session: signUpAttempt.createdSessionId });
        setVerification({ ...verification, state: "success", error: "" });
        // router.replace("/");
      } else {
        setVerification({
          ...verification,
          state: "failed",
          error: "Verification Failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        state: "failed",
        error: err.errors[0].longMessage,
      });
      console.error(JSON.stringify(err, null, 2));
    }
  };

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
          <Text style={styles.imageText}>Create your account</Text>
        </View>
        <View style={{ padding: windowWidth(20) }}>
          <InputField
            label="Name"
            placeholder="Enter your name"
            icon={icons.person}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <InputField
            label="Email"
            placeholder="Enter you email"
            icon={icons.email}
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
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
            title="Sign Up"
            onPress={onSignUpPress}
            style={{ marginTop: windowWidth(40) }}
          />

          <OAuth />

          <Link href={"/(auth)/sign-in"} style={styles.linkStyle}>
            <Text>Already have an account?</Text>
            <Text style={{ color: colors.primary[500] }}>Log in</Text>
          </Link>
        </View>

        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") setShowSuccessModal(true);
          }}
        >
          <View style={styles.modal}>
            <Text
              style={[
                styles.modalText,
                {
                  fontSize: fontSizes.FONT30,
                  fontFamily: fonts.JakartaExtraBold[0],
                  marginBottom: windowWidth(10),
                  textAlign: "left",
                },
              ]}
            >
              Verification
            </Text>
            <Text
              style={[
                styles.modalText,
                {
                  fontSize: fontSizes.FONT18,
                  marginBottom: windowWidth(10),
                  textAlign: "left",
                  fontFamily: fonts.Jakarta[0],
                },
              ]}
            >
              We've sent a verification code to {form.email}
            </Text>
            <InputField
              label="Code"
              icon={icons.lock}
              placeholder="12345"
              value={verification.code}
              keyboardType="number-pad"
              onChangeText={(text) =>
                setVerification({ ...verification, code: text })
              }
            />
            {verification.error && (
              <Text
                style={{
                  color: colors.danger[500],
                  fontSize: fontSizes.FONT14,
                  marginTop: windowWidth(5),
                  fontFamily: fonts.Jakarta[0],
                }}
              >
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onVerifyPress}
              style={{
                backgroundColor: colors.success[500],
                marginTop: windowWidth(30),
              }}
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View style={styles.modal}>
            <Image source={images.check} style={styles.modalImage} />
            <Text
              style={[styles.modalText, { fontFamily: fonts.JakartaBold[0] }]}
            >
              Verified
            </Text>
            <Text
              style={[
                styles.modalText,
                {
                  fontFamily: fonts.Jakarta[0],
                  fontSize: fontSizes.FONT20,
                  marginTop: 3,
                },
              ]}
            >
              You have successfully verified your account
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                setShowSuccessModal(false);
                router.replace("/(root)/(tabs)/home");
              }}
              style={{ marginTop: windowWidth(30) }}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;

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
  modal: {
    backgroundColor: "white",
    paddingHorizontal: windowWidth(30),
    paddingVertical: windowWidth(40),
    borderRadius: 20,
    minHeight: windowWidth(350),
  },
  modalImage: {
    width: windowWidth(130),
    height: windowWidth(130),
    marginHorizontal: "auto",
    marginVertical: windowWidth(15),
  },
  modalText: {
    textAlign: "center",
    fontSize: windowWidth(50),
  },
});
