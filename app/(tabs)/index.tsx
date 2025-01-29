import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import {
  getDBConnection,
  createTable,
  seedItems,
  countItems,
  getItems,
  addNewItem,
  deleteItem,
  ItemWithCategory,
  getCategories,
  AddItem,
} from "@/db/db-service";

import CircleButton from "@/components/CircleButton";
import ItemRow from "@/components/itemsList/ItemRow";
import AddItemModal from "@/components/addItemModal/AddItemModal";
import AddItemForm from "@/components/addItemModal/AddItemForm";

export default function Index() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [items, setItems] = useState<ItemWithCategory[]>([]);

  const loadDataCallback = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const numItems = await countItems(db);

      if (numItems === 0) {
        await seedItems(db);
      }

      const storedItems = await getItems(db);
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
      prevItems.map((item: ItemWithCategory) => {
        if (item.id === id) {
          const newQty = item.qty + value;
          return { ...item, qty: newQty < 0 ? 0 : newQty };
        } else {
          return item;
        }
      }),
    );
  };

  const handleAddItem = async (data: AddItem) => {
    try {
      const db = await getDBConnection();
      const result = await addNewItem(db, data);

      if (!result.lastInsertRowId) {
        throw new Error("Failed to insert item");
      }

      // Get the category name for the selected category_id
      const categories = await getCategories(db);
      const categoryName =
        categories.find((cat) => cat.id === data.category_id)?.name || "";

      setItems((prevItems) => [
        ...prevItems,
        {
          ...data,
          id: Number(result.lastInsertRowId),
          name: data.name,
          qty: data.qty,
          qtyAlert: data.qtyAlert,
          category: categoryName,
        },
      ]);
      setIsModalVisible(false);

      console.log(items);
    } catch (error) {
      console.error("Error in handleAddItem:", error);
    }
  };

  const handleDelete = async (id: number) => {
    const db = await getDBConnection();
    await deleteItem(db, id);
    setItems((prevItems) =>
      prevItems.filter((item: ItemWithCategory) => item.id !== id),
    );
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
        <FlatList<ItemWithCategory>
          data={items}
          renderItem={({ item }) => (
            <ItemRow
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
    backgroundColor: "#c9efe0",
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
