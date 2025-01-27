import * as SQLite from "expo-sqlite";
import { SQLiteDatabase } from "expo-sqlite";

const tableName = "item";

export type Item = {
  id: number;
  emoji: string;
  name: string;
  qty: number;
  qtyAlert: number;
};

export type AddItem = {
  emoji: string;
  name: string;
  qty: number;
  qtyAlert: number;
};

export const getDBConnection = async () => {
  return await SQLite.openDatabaseAsync("my-pantry.db");
};

export const createTable = async (db: SQLiteDatabase) => {
  return await db.execAsync(`CREATE TABLE IF NOT EXISTS ${tableName} (
        id INTEGER PRIMARY KEY NOT NULL,
        emoji TEXT NOT NULL,
        name TEXT NOT NULL,
        qty INTEGER,
        qtyAlert INTEGER
    );
  `);
};

export const seedItems = async (db: SQLiteDatabase) => {
  return await db.execAsync(`
    INSERT INTO item (emoji, name, qty, qtyAlert) VALUES ('◻️', 'Tofu', 2, 1);
    INSERT INTO item (emoji, name, qty, qtyAlert) VALUES ('🫘', 'Chickpeas', 2, 1);
    INSERT INTO item (emoji, name, qty, qtyAlert) VALUES ('🍓', 'Strawberry Jam', 1, 0);
    INSERT INTO item (emoji, name, qty, qtyAlert) VALUES ('🧈', 'Margarine', 2, 1);
    INSERT INTO item (emoji, name, qty, qtyAlert) VALUES ('🍌', 'Banana', 7, 3);
  `);
};

export const getItems = async (db: SQLiteDatabase): Promise<Item[]> => {
  try {
    const results: Item[] = await db.getAllAsync(
      `SELECT id, emoji, name, qty, qtyAlert FROM ${tableName}`,
    );
    return results;
  } catch (error) {
    console.error(error);
    throw Error("Failed to get items");
  }
};

export const addItem = async (db: SQLiteDatabase, item: AddItem) => {
  const result = await db.runAsync(
    `INSERT OR REPLACE INTO ${tableName} (emoji, name, qty, qtyAlert) VALUES (?, ?, ?, ?)`,
    item.emoji,
    item.name,
    item.qty,
    item.qtyAlert,
  );

  return result;
};

export const deleteItem = async (db: SQLiteDatabase, id: number) => {
  return await db.runAsync(`DELETE from ${tableName} where id = ?`, [id]);
};
