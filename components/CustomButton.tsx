import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { ButtonProps } from "@/types/type";
import { fonts } from "@/constants/colors";
import { windowWidth } from "@/constants/app.constant";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return styles.bgSecondary;
    case "danger":
      return styles.bgDanger;
    case "success":
      return styles.bgSuccess;
    case "outline":
      return styles.bgOutline;
    default:
      return styles.bgPrimary;
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
  switch (variant) {
    case "primary":
      return styles.textPrimary;
    case "secondary":
      return styles.textSecondary;
    case "danger":
      return styles.textDanger;
    case "success":
      return styles.textSuccess;
    default:
      return styles.textDefault;
  }
};

const CustomButton = ({
  onPress,
  title,
  bgVariant = "primary",
  textVariant = "default",
  IconLeft,
  IconRight,
  style,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, getBgVariantStyle(bgVariant), style]}
      {...props}
    >
      {IconLeft && <IconLeft />}
      <Text style={[styles.text, getTextVariantStyle(textVariant)]}>
        {title}
      </Text>
      {IconRight && <IconRight />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    borderRadius: 999,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#aaa",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  text: {
    fontSize: windowWidth(20),
    fontFamily: fonts.JakartaBold[0],
  },
  // Background Variants
  bgPrimary: { backgroundColor: "#0286FF" },
  bgSecondary: { backgroundColor: "#6B7280" }, // gray-500
  bgDanger: { backgroundColor: "#EF4444" }, // red-500
  bgSuccess: { backgroundColor: "#10B981" }, // green-500
  bgOutline: {
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderColor: "#D1D5DB", // neutral-300
  },
  // Text Variants
  textDefault: { color: "#FFFFFF" },
  textPrimary: { color: "#000000" },
  textSecondary: { color: "#F3F4F6" }, // gray-100
  textDanger: { color: "#FEE2E2" }, // red-100
  textSuccess: { color: "#D1FAE5" }, // green-100
});

export default CustomButton;
