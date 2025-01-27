import { View, Pressable, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  mode: string;
  onPress: () => void;
};

export default function ItemRowButton({ mode = "minus", onPress }: Props) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onPress}>
        {mode === "minus" ? (
          <MaterialIcons name="remove" size={16} color="#25292e" />
        ) : (
          <MaterialIcons name="add" size={16} color="#25292e" />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 26,
    height: 26,
    marginHorizontal: 10,
    backgroundColor: "#e5cfac",
    borderRadius: 13,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: "#e5cfac",
  },
});
