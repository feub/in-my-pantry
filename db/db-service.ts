import * as SQLite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

const itemTable = "item";
const categoryTable = "category";

// Base database entity types
export type Item = {
  id: number;
  category_id: number;
  name: string;
  qty: number;
  qtyAlert: number;
};

export type Category = {
  id: number;
  name: string;
};

// Types for adding new records (omit auto-generated fields)
export type AddItem = {
  category_id: number;
  name: string;
  qty: number;
  qtyAlert: number;
};

export type AddCategory = {
  name: string;
};

// Extended type for joined data
export interface ItemWithCategory extends Item {
  category: string;
}

export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync("my-pantry.db");
};

export const createTable = async (db: SQLiteDatabase) => {
  return await db.execAsync(`
    PRAGMA foreign_keys = ON; --- foreign key constraints enforced
    CREATE TABLE IF NOT EXISTS ${categoryTable} (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS ${itemTable} (
        id INTEGER PRIMARY KEY NOT NULL,
        category_id INTEGER,
        name TEXT NOT NULL UNIQUE,
        qty INTEGER NOT NULL,
        qtyAlert INTEGER NOT NULL,
        FOREIGN KEY (category_id) REFERENCES ${categoryTable}(id) ON DELETE CASCADE
    );
  `);
};

export const dropTable = async (db: SQLiteDatabase) => {
  return await db.execAsync(`
    DROP TABLE IF EXISTS ${itemTable};
  `);
};

export const seedItems = async (db: SQLiteDatabase) => {
  return await db.execAsync(`
    INSERT INTO ${categoryTable} (name) VALUES ('Uncategorized');
    INSERT INTO ${categoryTable} (name) VALUES ('Fruits');
    INSERT INTO ${categoryTable} (name) VALUES ('Vegetables');
    INSERT INTO ${categoryTable} (name) VALUES ('Legumes');
    INSERT INTO ${categoryTable} (name) VALUES ('Cookies');
    INSERT INTO ${categoryTable} (name) VALUES ('Oils & Butters');
    INSERT INTO ${categoryTable} (name) VALUES ('Sweets');
    INSERT INTO ${categoryTable} (name) VALUES ('Vegan Must Have');
    INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (1, '◻️ Tofu', 2, 1);
    INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (4, '🫘 Chickpeas', 2, 1);
    INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (7, '🍓 Strawberry Jam', 1, 0);
    INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (6, '🧈 Margarine', 2, 1);
    INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (2, '🍌 Bananas', 7, 3);
    INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (3, '🥕 Carrots', 7, 3);
  `);
};

export const countItems = async (db: SQLiteDatabase): Promise<number> => {
  try {
    const result = await db.getFirstAsync<{ numItems: number }>(
      `SELECT COUNT(id) AS numItems FROM ${itemTable}`,
    );
    if (!result || result.numItems === undefined) {
      throw new Error("Failed to get items count");
    }
    return result.numItems;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get items count");
  }
};

export const getItems = async (
  db: SQLiteDatabase,
): Promise<ItemWithCategory[]> => {
  try {
    const results: ItemWithCategory[] = await db.getAllAsync(`
      SELECT i.id, i.category_id, c.name AS category, i.name, i.qty, i.qtyAlert 
      FROM ${itemTable} i
      LEFT JOIN ${categoryTable} c ON c.id = i.category_id
    `);

    console.log("Retrieved items from database:", results);
    return results;
  } catch (error) {
    console.error("Error in getItems:", error);
    throw Error("Failed to get items");
  }
};

export const addNewItem = async (db: SQLiteDatabase, item: AddItem) => {
  console.log("Adding item to database:", item);

  try {
    const result = await db.runAsync(
      `INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (?, ?, ?, ?)`,
      [item.category_id, item.name, item.qty, item.qtyAlert],
    );

    console.log("Database operation result:", result);
    return result;
  } catch (error) {
    console.error("Database error in addNewItem:", error);
    throw error;
  }
};

export const deleteItem = async (db: SQLiteDatabase, id: number) => {
  return await db.runAsync(`DELETE from ${itemTable} where id = ?`, [id]);
};

export const getCategories = async (
  db: SQLiteDatabase,
): Promise<Category[]> => {
  try {
    const results: Category[] = await db.getAllAsync(`
      SELECT id, name FROM ${categoryTable} ORDER BY name;
    `);
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get categories");
  }
};
