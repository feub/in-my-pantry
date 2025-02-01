import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View, StyleSheet } from "react-native";
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
import { SQLiteAnyDatabase } from "expo-sqlite/build/NativeStatement";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Quicksand_700Bold } from "@expo-google-fonts/quicksand";

import CircleButton from "@/components/CircleButton";
import ItemRow from "@/components/itemsList/ItemRow";
import AddItemModal from "@/components/addItemModal/AddItemModal";
import AddItemForm from "@/components/addItemModal/AddItemForm";
import MyText from "@/components/MyText";

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from hiding

const initializeDatabase = async (db: SQLiteAnyDatabase) => {
  try {
    await createTable(db);
    const itemCount = await countItems(db);

    if (itemCount === 0) {
      await seedItems(db);
    }

    return true;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
};

export default function Index() {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [items, setItems] = useState<ItemWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    VarelaRound_400Regular,
    Quicksand_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  const loadDataCallback = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const db = await getDBConnection();
      await initializeDatabase(db);
      const storedItems = await getItems(db);
      setItems(storedItems);
    } catch (error) {
      console.error("Failed to load data:", error);
      setError("Failed to load data. Please restart the app.");
    } finally {
      setIsLoading(false);
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

  if (!fontsLoaded) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <MyText>Loading...</MyText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <MyText style={styles.errorText}>{error}</MyText>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <MyText style={{ fontFamily: "VarelaRound_400Regular" }}>
          {items && items.length} items
        </MyText>
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
    fontFamily: "VarelaRound_400Regular",
    flex: 1,
    backgroundColor: "#c9efe0",
    alignItems: "center",
    paddingTop: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    padding: 20,
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
