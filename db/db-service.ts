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
  try {
    await db.withTransactionAsync(async () => {
      // Enable foreign key support
      await db.execAsync("PRAGMA foreign_keys = ON;");

      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ${categoryTable} (
        id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL UNIQUE
      );
    `);

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS ${itemTable} (
          id INTEGER PRIMARY KEY NOT NULL,
          category_id INTEGER,
          name TEXT NOT NULL UNIQUE,
          qty INTEGER NOT NULL,
          qtyAlert INTEGER NOT NULL,
          FOREIGN KEY (category_id)
            REFERENCES ${categoryTable}(id)
            ON DELETE CASCADE
        );
      `);
    });
  } catch (error) {
    console.error("Error creating tables:", error);
    throw new Error("Failed to create database tables");
  }
};

export const dropTable = async (db: SQLiteDatabase) => {
  return await db.execAsync(`
    DROP TABLE IF EXISTS ${itemTable};
  `);
};

export const seedItems = async (db: SQLiteDatabase) => {
  try {
    await db.withTransactionAsync(async () => {
      // Categories to seed
      const categories = [
        "Uncategorized",
        "Fruits",
        "Vegetables",
        "Legumes",
        "Proteins",
        "Treats",
        "Cleaning",
        "Condiments",
        "Non-dairy",
        "Canned food",
        "Pasta & grains",
      ];

      // Insert categories
      for (const categoryName of categories) {
        await db.execAsync(
          `INSERT OR IGNORE INTO ${categoryTable} (name) VALUES ('${categoryName}');`,
        );
      }

      // Get category IDs for our items
      const categoryRows: { name: string; id: number }[] = await db.getAllAsync(
        `SELECT id, name FROM ${categoryTable} WHERE name IN (${categories
          .map((categoryName) => `'${categoryName}'`)
          .join(",")});`,
      );

      // Create a map of category names to IDs
      const categoryMap = new Map(
        categoryRows.map((row) => [row.name, row.id]),
      );

      // Initial items to seed
      const items = [
        { name: "◻️ Tofu", category: "Proteins", qty: 2, qtyAlert: 1 },
        { name: "🫘 Chickpeas", category: "Legumes", qty: 2, qtyAlert: 1 },
        { name: "🍓 Strawberry Jam", category: "Treats", qty: 1, qtyAlert: 0 },
        {
          name: "🧈 Margarine",
          category: "Non-dairy",
          qty: 2,
          qtyAlert: 1,
        },
        { name: "🍌 Bananas", category: "Fruits", qty: 7, qtyAlert: 3 },
        { name: "🥕 Carrots", category: "Vegetables", qty: 7, qtyAlert: 3 },
      ];

      // Insert items safely
      for (const item of items) {
        const categoryId =
          categoryMap.get(item.category) ?? categoryMap.get("Uncategorized");
        if (categoryId === undefined) {
          throw new Error(`Category ID for ${item.category} not found`);
        }
        await db.runAsync(
          `INSERT OR IGNORE INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (?, ?, ?, ?);`,
          [categoryId, item.name, item.qty, item.qtyAlert],
        );
      }
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
};

export const countItems = async (db: SQLiteDatabase): Promise<number> => {
  try {
    const result = await db.getFirstAsync<{ numItems: number }>(`
      SELECT COUNT(i.id) AS numItems
      FROM ${itemTable} AS i
      INNER JOIN ${categoryTable} AS c ON c.id = i.category_id
    `);
    if (!result || typeof result.numItems !== "number") {
      throw new Error("Failed to get items count");
    }
    return result.numItems;
  } catch (error: any) {
    console.error("Error counting items:", error);
    throw Error("Failed to retrieve item count");
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

    return results;
  } catch (error) {
    console.error("Error in getItems:", error);
    throw Error("Failed to get items");
  }
};

export const addNewItem = async (db: SQLiteDatabase, item: AddItem) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO ${itemTable} (category_id, name, qty, qtyAlert) VALUES (?, ?, ?, ?)`,
      [item.category_id, item.name, item.qty, item.qtyAlert],
    );

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
