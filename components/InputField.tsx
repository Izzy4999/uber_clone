import {
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
} from "react-native";

import { InputFieldProps } from "@/types/type";
import { fontSizes, windowWidth } from "@/constants/app.constant";
import { fonts } from "@/constants/colors";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  iconRight,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[styles.wrapper]}>
          <Text style={[styles.label, labelStyle]}>{label}</Text>
          <View style={[styles.inputContainer, containerStyle]}>
            {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
            <TextInput
              style={[styles.input, inputStyle]}
              secureTextEntry={secureTextEntry}
              {...props}
            />
            {iconRight && (
              <Image source={iconRight} style={[styles.icon, iconStyle]} />
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: windowWidth(10), // Equivalent to my-2
    width: "100%",
  },
  label: {
    fontSize: fontSizes.FONT20, // Equivalent to text-lg
    fontFamily: fonts.JakartaSemiBold[0],
    marginBottom: windowWidth(12), // Equivalent to mb-3
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Equivalent to bg-neutral-100
    borderRadius: 999, // Equivalent to rounded-full
    borderWidth: 1,
    borderColor: "#F5F5F5", // Equivalent to border-neutral-100
  },
  icon: {
    width: windowWidth(24), // Equivalent to w-6
    height: windowWidth(24), // Equivalent to h-6
    marginLeft: windowWidth(16), // Equivalent to ml-4
  },
  input: {
    flex: 1,
    borderRadius: 999, // Equivalent to rounded-full
    padding: windowWidth(16), // Equivalent to p-4
    fontFamily: fonts.JakartaSemiBold[0],
    fontSize: fontSizes.FONT16, // Equivalent to text-[15px]
    textAlign: "left", // Equivalent to text-left
  },
});

export default InputField;
