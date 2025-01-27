import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  getDBConnection,
  createTable,
  seedItems,
  getItems,
  addItem,
  deleteItem,
  Item,
  AddItem,
} from "@/db/db-service";

import CircleButton from "@/components/CircleButton";
import ItemRow from "@/components/itemsList/ItemRow";
import AddItemModal from "@/components/addItemModal/AddItemModal";
import AddItemForm from "@/components/addItemModal/AddItemForm";

const itemsData = [
  {
    id: 1,
    emoji: "🍌",
    name: "Banana",
    qty: 7,
    qtyAlert: 3,
  },
  {
    id: 2,
    emoji: "◻️",
    name: "Tofu",
    qty: 2,
    qtyAlert: 1,
  },
  {
    id: 3,
    emoji: "🫘",
    name: "Chickpeas",
    qty: 2,
    qtyAlert: 1,
  },
  {
    id: 4,
    emoji: "🍓",
    name: "Strawberry Jam",
    qty: 1,
    qtyAlert: 0,
  },
  {
    id: 5,
    emoji: "🧈",
    name: "Margarine",
    qty: 2,
    qtyAlert: 1,
  },
];

export default function Index() {
  const [showAddEntry, setShowAddEntry] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [items, setItems] = useState<Item[]>([]);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedItems = await getItems(db);
      if (storedItems.length === 0) {
        await seedItems(db);
      }
      setItems(storedItems);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const handlePress = (id: number, value: number) => {
    setItems((prevItems) =>
      prevItems.map((item: Item) =>
        item.id === id ? { ...item, qty: item.qty + value } : item,
      ),
    );
  };

  const handleAddItem = async (data: AddItem) => {
    const db = await getDBConnection();
    const result = await addItem(db, data);
    setItems((prevItems) => [
      ...prevItems,
      { ...data, id: result.lastInsertRowId },
    ]);
    setIsModalVisible(false);
  };

  const handleDelete = async (id: number) => {
    const db = await getDBConnection();
    await deleteItem(db, id);
    setItems((prevItems) => items.filter((item: Item) => item.id !== id));
  };

  const showEntryForm = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text>{items && items.length} items</Text>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <ItemRow
              key={item.id}
              item={item}
              onPress={(value) => handlePress(item.id, value)}
              handleDelete={(id) => handleDelete(item.id)}
            />
          )}
          keyExtractor={(items) => items.id.toString()}
          style={styles.entriesContainer}
        />
        <View style={styles.addEntryContainer}>
          <View style={styles.addEntryRow}>
            <CircleButton onPress={showEntryForm} />
          </View>
        </View>
      </View>
      <AddItemModal isVisible={isModalVisible} handleClose={onModalClose}>
        <AddItemForm onSubmit={(data) => handleAddItem(data)} />
      </AddItemModal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9ead1",
    alignItems: "center",
    paddingTop: 10,
  },
  entriesContainer: {
    width: "100%",
    padding: 10,
    maxWidth: 600,
  },
  addEntryContainer: {
    position: "absolute",
    bottom: 20,
  },
  addEntryRow: {
    alignItems: "center",
    flexDirection: "row",
  },
});
