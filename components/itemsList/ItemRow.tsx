import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ItemRowButton from "./ItemRowButton";
import ItemRowButtonDel from "./ItemRowButtonDel";

type ItemType = {
  id: number;
  emoji: string;
  name: string;
  qty: number;
};

export default function ItemRow({
  item,
  onPress,
  handleDelete,
}: {
  item: ItemType;
  onPress: (value: number) => void;
  handleDelete: (id: number) => void;
}) {
  return (
    <>
      <View style={styles.entryRow}>
        <View style={styles.entryRowLabel}>
          <Text style={styles.entryRowItem}>{item.emoji}</Text>
          <Text style={styles.entryRowItem}>{item.name}</Text>
        </View>
        <View style={styles.entryRowActions}>
          <ItemRowButtonDel onDelete={() => handleDelete(item.id)} />
          <ItemRowButton mode="minus" onPress={() => onPress(-1)} />
          <Text style={styles.entryRowQty}>{item.qty}</Text>
          <ItemRowButton mode="plus" onPress={() => onPress(+1)} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  entryRow: {
    backgroundColor: "#fcf7ef",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 5,
    paddingLeft: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3, // Elevation for Android
  },
  entryRowItem: {
    fontSize: 20,
    color: "gray",
  },
  entryRowLabel: {
    flexDirection: "row",
  },
  entryRowActions: {
    flexDirection: "row",
  },
  entryRowQty: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
  },
});
