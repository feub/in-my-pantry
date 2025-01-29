import { Text, View, StyleSheet } from "react-native";
import { Image } from "react-native";
import icon from "../../assets/images/icon.png";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 10 }}>Hello bananas!</Text>
      <Image source={icon} style={{ width: 100, height: 100 }} />
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
});
