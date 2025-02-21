import CustomButton from "@/components/CustomButton";
import { onboarding } from "@/constants";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import { fonts } from "@/constants/colors";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const Welcome = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const swiperRef = React.useRef<Swiper>(null);
  const isLastSlide = activeIndex === onboarding.length - 1;

  return (
    <SafeAreaView style={styles.containter}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.replace("/(auth)/sign-in");
        }}
      >
        <Text style={styles.buttonText}>Skip</Text>
      </TouchableOpacity>
      <Swiper
        ref={swiperRef}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={
          <View style={[styles.dot, { backgroundColor: "#0286ff" }]} />
        }
        onIndexChanged={(index) => setActiveIndex(index)}
      >
        {onboarding.map((item) => (
          <View key={item.id} style={styles.onboardingContainer}>
            <Image
              source={item.image}
              style={styles.onboardingImage}
              resizeMode="contain"
            />
            <View style={styles.onboardingTextContainer}>
              <Text style={styles.onboardingTitle}>{item.title}</Text>
            </View>
            <Text style={styles.onboardingText}>{item.description}</Text>
          </View>
        ))}
      </Swiper>
      <CustomButton
        title={isLastSlide ? "Get Started" : "Next"}
        style={{ marginVertical: windowWidth(40), width: "91%" }}
        onPress={() =>
          isLastSlide
            ? router.replace("/(auth)/sign-up")
            : swiperRef.current?.scrollBy(1)
        }
      />
    </SafeAreaView>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: windowWidth(30),
  },
  buttonText: {
    fontFamily: fonts.JakartaBold[0],
    fontSize: windowWidth(18),
    color: "black",
  },
  dot: {
    width: windowWidth(40),
    height: windowWidth(5),
    marginHorizontal: windowWidth(5),
    backgroundColor: "#e2e8f0",
  },
  onboardingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: windowWidth(20),
  },
  onboardingImage: {
    width: "100%",
    height: windowWidth(350),
  },
  onboardingTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: windowWidth(40),
  },
  onboardingTitle: {
    fontSize: fontSizes.FONT35,
    marginHorizontal: windowWidth(10),
    textAlign: "center",
    fontFamily: fonts.JakartaBold[0],
  },
  onboardingText: {
    fontSize: fontSizes.FONT25,
    fontFamily: fonts.JakartaSemiBold[0],
    textAlign: "center",
    color: "#858585",
    marginHorizontal: windowWidth(20),
    marginTop: windowWidth(8),
  },
});
