import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import InputField from "@/components/InputField";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import { colors, fonts } from "@/constants/colors";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/user";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import ReactNativeModal from "react-native-modal";
import { icons } from "@/constants";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [phoneNumber, setPhoneNumber] = useState(
    user?.unsafeMetadata?.phoneNumber! as string
  );
  // const [phoneId, setPhoneId] = useState();
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {},
  });

  const handleImageUpload = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const base64 = result.assets[0].base64;
        const mimeType = result.assets[0].mimeType;

        const image = `data:${mimeType};base64,${base64}`;
        await user?.setProfileImage({
          file: image,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      if (firstName === "" || lastName === "") {
        alert("Please fill in all fields");
        return;
      }

      const token = await getToken();

      const updatedPhone = "+234" + phoneNumber.slice(1);

      // const phone = await user?.createPhoneNumber({
      //   phoneNumber: updatedPhone,
      // });

      // setPhoneId(phone?.id!);

      // await phone!.prepareVerification();
      // setVerification({ ...verification, state: "pending" });
      await user?.update({
        firstName: firstName!,
        lastName: lastName!,
        unsafeMetadata: {
          phoneNumber: updatedPhone,
        },
      });
      mutate({
        token: token!,
        id: user?.id!,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle submission of verification form
  // const onVerifyPress = async () => {
  //   if (!isLoaded) return;

  //   try {
  //     const phone = user!.phoneNumbers.find((p) => p.id === phoneId);
  //     if (!phone) Alert.alert("Phone number not found");

  //     await phone?.attemptVerification({ code: verification.code });

  //     await user!.update({ primaryPhoneNumberId: phoneId });
  //   } catch (err: any) {
  //     setVerification({
  //       ...verification,
  //       state: "failed",
  //       error: err.errors[0].longMessage,
  //     });
  //     console.error(JSON.stringify(err, null, 2));
  //   }
  // };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>My profile</Text>

        <View style={[styles.imageContainer, { position: "relative" }]}>
          <Image
            source={{
              uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              backgroundColor: "white",
              borderRadius: 20,
              position: "absolute",
              zIndex: 100,
              right: windowWidth(155),
              bottom: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleImageUpload}
          >
            <MaterialCommunityIcons
              name="image-edit"
              size={24}
              color={colors.success[400]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.inputGroup}>
            <InputField
              label="First name"
              placeholder={user?.firstName || "Not Found"}
              containerStyle={{ width: "100%" }}
              inputStyle={{ padding: 14 }}
              value={firstName || ""}
              onChangeText={(e) => setFirstName(e)}
              // editable={false}
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
            />

            <InputField
              label="Last name"
              placeholder={user?.lastName || "Not Found"}
              containerStyle={{ width: "100%" }}
              inputStyle={{ padding: 14 }}
              onChangeText={(e) => setLastName(e)}
              // editable={false}
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
            />

            <InputField
              label="Email"
              placeholder={
                user?.primaryEmailAddress?.emailAddress || "Not Found"
              }
              containerStyle={{ width: "100%" }}
              inputStyle={{ padding: 14 }}
              editable={false}
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
            />

            <InputField
              label="Phone"
              value={"0" + phoneNumber.slice(4)}
              placeholder={
                (user?.unsafeMetadata?.phoneNumbera as string) || "Not Found"
              }
              containerStyle={{ width: "100%" }}
              inputStyle={{ padding: 14 }}
              onChangeText={(e) => setPhoneNumber(e)}
              // editable={false}
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
            />
          </View>
        </View>

        <CustomButton
          title="Update"
          onPress={isPending ? undefined : handleUpdate}
          style={{ marginTop: 30 }}
        />
      </ScrollView>
      {/* <ReactNativeModal
        isVisible={verification.state === "pending"}
        onModalHide={() => {
          // if (verification.state === "success") setShowSuccessModal(true);
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
            We've sent a verification code to {phoneNumber}
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
      </ReactNativeModal> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.JakartaBold[0],
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: windowWidth(130),
    height: windowWidth(130),
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "white",
    shadowColor: "#D3D3D3",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#D3D3D3",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  inputGroup: {
    width: "100%",
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

export default Profile;
