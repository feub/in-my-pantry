import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { ItemWithCategory } from "@/db/db-service";
import ItemRowButton from "./ItemRowButton";
import ItemRowButtonDel from "./ItemRowButtonDel";
import MyText from "../MyText";

export default function ItemRow({
  item,
  onPress,
  handleDelete,
}: {
  item: ItemWithCategory;
  onPress: (value: number) => void;
  handleDelete: (id: number) => void;
}) {
  let rowBgColor = "#ffffff";
  let qtyColor = "gray";

  if (item.qty < item.qtyAlert) {
    rowBgColor = "#fcbdbd";
    qtyColor = "red";
  } else if (item.qty === item.qtyAlert) {
    rowBgColor = "#fcdcb3";
    qtyColor = "orange";
  }

  return (
    <>
      <View style={[styles.entryRow, { backgroundColor: rowBgColor }]}>
        <View style={styles.entryRowLabel}>
          <MyText style={styles.entryRowItem}>{item.name}</MyText>
          <MyText style={{ fontSize: 10 }}>{item.category}</MyText>
        </View>
        <View style={styles.entryRowActions}>
          <ItemRowButtonDel onDelete={() => handleDelete(item.id)} />
          <ItemRowButton mode="minus" onPress={() => onPress(-1)} />
          <MyText style={[styles.entryRowQty, { color: qtyColor }]}>
            {item.qty}
          </MyText>
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
    alignItems: "center",
    justifyContent: "flex-end",
  },
  entryRowQty: {
    fontFamily: "Quicksand_700Bold",
    fontSize: 20,
    color: "gray",
  },
});
