import { Text, View, StyleSheet } from "react-native";

export default function About() {
  return (
    <View style={styles.container}>
      <Text>Hello bananas!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9ead1",
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
