import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import CircleButton from "@/components/CircleButton";
import ItemRow from "@/components/itemsList/ItemRow";

const itemsData = [
  {
    id: 1,
    name: "Banana",
    qty: 7,
    qtyAlert: 3,
  },
  {
    id: 2,
    name: "Tofu",
    qty: 2,
    qtyAlert: 1,
  },
  {
    id: 3,
    name: "Chickpeas",
    qty: 2,
    qtyAlert: 1,
  },
  {
    id: 4,
    name: "Strawberry Jam",
    qty: 1,
    qtyAlert: 0,
  },
  {
    id: 5,
    name: "Margarine",
    qty: 2,
    qtyAlert: 1,
  },
];

export default function Index() {
  const [showAddEntry, setShowAddEntry] = useState<boolean>(true);
  const [items, setItems] = useState(itemsData);

  const showEntryForm = () => {
    alert("Hello");
  };

  return (
    <View style={styles.container}>
      <View style={styles.entriesContainer}>
        {items && items.map((item) => <ItemRow key={item.id} item={item} />)}
      </View>
      <View style={styles.addEntryContainer}>
        <View style={styles.addEntryRow}>
          <CircleButton onPress={showEntryForm} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    color: "#ffffff",
    alignItems: "center",
  },
  addEntryContainer: {
    position: "absolute",
    bottom: 80,
  },
  entriesContainer: {
    width: "100%",
    padding: 10,
  },
  addEntryRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
