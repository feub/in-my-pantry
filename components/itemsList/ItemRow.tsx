import React from "react";
import { Text, View, StyleSheet } from "react-native";
import ItemRowButton from "./ItemRowButton";
import ItemRowButtonDel from "./ItemRowButtonDel";
import { ItemWithCategory } from "@/db/db-service";

export default function ItemRow({
  item,
  onPress,
  handleDelete,
}: {
  item: ItemWithCategory;
  onPress: (value: number) => void;
  handleDelete: (id: number) => void;
}) {
  return (
    <>
      <View style={styles.entryRow}>
        <View style={styles.entryRowLabel}>
          <Text style={styles.entryRowItem}>{item.name}</Text>
          <Text style={{ fontSize: 10 }}>{item.category}</Text>
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
    flexShrink: 1,
    fontSize: 16,
    color: "gray",
  },
  entryRowLabel: {
    flex: 1,
    flexDirection: "column",
    minWidth: 0,
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
