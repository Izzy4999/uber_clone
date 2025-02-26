import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "@/constants";

const Chat = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Chat</Text>
        <View style={styles.centeredView}>
          <Image
            source={images.message}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.noMessagesText}>No Messages Yet</Text>
          <Text style={styles.description}>
            Conversations with drivers are shown here
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "JakartaBold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 160,
  },
  noMessagesText: {
    fontSize: 30,
    fontFamily: "JakartaBold",
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 28,
  },
});

export default Chat;
