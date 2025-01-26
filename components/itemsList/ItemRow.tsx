import React from "react";
import { Text, View, StyleSheet } from "react-native";

type ItemType = {
  id: number;
  name: string;
  qty: number;
};

function ItemRow({ item }: { item: ItemType }) {
  return (
    <>
      <View style={styles.entryRow}>
        <Text style={styles.entryRowItem}>{item.name}</Text>
        <Text style={styles.entryRowQty}>{item.qty}</Text>
      </View>
    </>
  );
}

export default ItemRow;

const styles = StyleSheet.create({
  entryRow: {
    backgroundColor: "#1b1c1b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 5,
    paddingLeft: 8,
    borderRadius: 10,
  },
  entryRowItem: {
    fontSize: 20,
    color: "#ffffff",
  },
  entryRowQty: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
