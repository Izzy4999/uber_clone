import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function CustomActivityIndicator({ visible = false }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <View>
          <ActivityIndicator size={"large"} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "black",
    position: "absolute",
    height: "100%",
    opacity: 0.9,
    width: "100%",
    zIndex: 1000,
    flex: 1,
  },
});

export default CustomActivityIndicator;
