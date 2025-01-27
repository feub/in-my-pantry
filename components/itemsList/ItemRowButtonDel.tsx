import { View, Pressable, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type Props = {
  onDelete: () => void;
};

export default function ItemRowButtonDel({ onDelete }: Props) {
  return (
    <View style={styles.circleButtonContainer}>
      <Pressable style={styles.circleButton} onPress={onDelete}>
        <MaterialIcons name="delete" size={16} color="red" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 26,
    height: 26,
    marginHorizontal: 10,
    backgroundColor: "#ffffff",
    borderRadius: 13,
  },
  circleButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    backgroundColor: "#ffffff",
  },
});
