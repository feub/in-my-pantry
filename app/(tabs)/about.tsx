import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import icon from "../../assets/images/icon.png";
import MyText from "@/components/MyText";

export default function About() {
  return (
    <View style={styles.container}>
      <Image source={icon} style={{ width: 100, height: 100 }} />
      <Text
        style={{
          marginBottom: 10,
          fontFamily: "Quicksand_700Bold",
          fontSize: 24,
        }}
      >
        About In my pantry
      </Text>
      <MyText style={styles.paragraph}>
        Never run out of your favorite foods again! This pantry management app
        simplifies inventory tracking, helping you organize your pantry, avoid
        duplicates, and reduce food waste.
      </MyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#c9efe0",
    color: "#ffffff",
    alignItems: "center",
    paddingVertical: 10,
  },
  entriesContainer: {
    width: "100%",
    padding: 10,
    maxWidth: 600,
  },
  paragraph: {
    fontSize: 18,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});
