import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { becomeDriver, updateUserProfile } from "@/api/user";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { windowWidth } from "@/constants/app.constant";
import { colors, fonts } from "@/constants/colors";
import { useAuth, useUser } from "@clerk/clerk-expo";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useMutation } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";
import { AxiosError } from "axios";
import { useDriverStore } from "@/store";
import React from "react";
import CustomActivityIndicator from "@/components/CustomIndicator";

const cloundName = "dmxxcut67";

const cloud = new Cloudinary({
  cloud: {
    cloudName: cloundName,
  },
  url: {
    secure: true,
  },
});

const options = {
  upload_preset: "ml_default",
  unsigned: true,
  // folder: "uber"
};

const Profile = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["78%"], []);
  const { dismiss } = useBottomSheetModal();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { status, setStatus } = useDriverStore();

  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [phoneNumber, setPhoneNumber] = useState(
    user?.unsafeMetadata?.phoneNumber! as string
  );
  const [driverData, setDriverData] = useState({
    carMake: "",
    carModel: "",
    carYear: "",
    plate: "",
    carColor: "",
    carSeats: "",
  });
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  // const [verification, setVerification] = useState({
  //   state: "default",
  //   error: "",
  //   code: "",
  // });

  const { mutate, isPending } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {},
  });
  const { mutate: driverMutate, isPending: driverPending } = useMutation({
    mutationFn: becomeDriver,
    onSuccess: (data) => {
      dismiss();
      setStatus("pending");
    },
    onError: (err) => {
      console.log("Driver Error", (err as AxiosError).response);
    },
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

      const updatedPhone = "+234" + phoneNumber?.slice(1);

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

  // Function to pick an image
  const carImageUpload = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      // result.assets[0].uri contains the local URI
      setImage(result.assets[0]);
    }
  };

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"none"}
        {...props}
      />
    ),
    []
  );
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

  const handleDriverSubmit = async () => {
    try {
      if (Object.values(driverData).some((value) => value.trim() === "")) {
        alert("Please fill in all fields");
        return;
      }
      const token = await getToken();
      await upload(cloud, {
        file: image?.uri,
        options: options,
        callback: (err: any, response: any) => {
          if (err) {
            console.log(err);
            return;
          }

          driverMutate({
            token: token!,
            carImage: response.secure_url,
            ...driverData,
          });
        },
      });
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  useEffect(() => {
    if (user?.publicMetadata?.driverStatus) {
      setStatus(
        user.publicMetadata.driverStatus as
          | "notApplied"
          | "pending"
          | "approved"
          | "denied"
      );
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.title}>My profile</Text>
          {status === "pending" ? (
            <Text style={{ fontFamily: fonts.JakartaSemiBold[0] }}>
              Awating Approval
            </Text>
          ) : status === "notApplied" ? (
            <TouchableOpacity hitSlop={10} onPress={handlePresentModalPress}>
              <Text style={{ fontFamily: fonts.JakartaSemiBold[0] }}>
                Become a driver
              </Text>
            </TouchableOpacity>
          ) : status === "denied" ? (
            <Text style={{ fontFamily: fonts.JakartaSemiBold[0] }}>
              Awating Approval
            </Text>
          ) : (
            <Text style={{ fontFamily: fonts.JakartaSemiBold[0] }}>
              Update Car Details
            </Text>
          )}
        </View>

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
              // value={"0" + phoneNumber?.slice(4)}
              placeholder={
                (user?.unsafeMetadata?.phoneNumber as string) || "Not Found"
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
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        overDragResistanceFactor={0}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ display: "none" }}

        // onChange={handleSheetChanges}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 20 }}>
          <CustomActivityIndicator visible={uploading || driverPending} />
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <TouchableOpacity hitSlop={30} onPress={() => dismiss()}>
              <AntDesign name="closecircleo" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <BottomSheetScrollView showsVerticalScrollIndicator={false}>
            <InputField
              label="Plate Number"
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
              // value={driverData.plate}
              onChangeText={(e) => setDriverData({ ...driverData, plate: e })}
            />
            <InputField
              label="Car Make"
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
              // value={driverData.carMake}
              onChangeText={(e) => setDriverData({ ...driverData, carMake: e })}
            />
            <InputField
              label="Car Model"
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
              // value={driverData.carModel}
              onChangeText={(e) =>
                setDriverData({ ...driverData, carModel: e })
              }
            />
            <InputField
              label="Car Year"
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
              // value={driverData.carYear}
              onChangeText={(e) => setDriverData({ ...driverData, carYear: e })}
            />
            <InputField
              label="Car Seats"
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
              // value={driverData.carSeats}
              onChangeText={(e) =>
                setDriverData({ ...driverData, carSeats: e })
              }
            />
            <InputField
              label="Car Color"
              placeholderTextColor={Platform.OS === "ios" ? "black" : "#3d3d3d"}
              // value={driverData.carColor}
              onChangeText={(e) =>
                setDriverData({ ...driverData, carColor: e })
              }
            />
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={carImageUpload}
            >
              {image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: windowWidth(150), height: windowWidth(150) }}
                />
              ) : (
                <Ionicons
                  name="image"
                  size={windowWidth(150)}
                  color={colors.success[400]}
                />
              )}
            </TouchableOpacity>
            <CustomButton
              title="Submit for review"
              style={{ marginVertical: 15 }}
              onPress={handleDriverSubmit}
            />
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
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
