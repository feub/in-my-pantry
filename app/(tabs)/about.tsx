import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import icon from "../../assets/images/icon.png";

export default function About() {
  return (
    <View style={styles.container}>
      <Image source={icon} style={{ width: 100, height: 100 }} />
      <Text style={{ marginBottom: 10, fontSize: 20, fontWeight: "bold" }}>
        In my pantry
      </Text>
      <Text style={styles.paragraph}>
        Never run out of your favorite foods again! This pantry management app
        simplifies inventory tracking, helping you organize your pantry, avoid
        duplicates, and reduce food waste.
      </Text>
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
    paddingHorizontal: 15,
  },
});
