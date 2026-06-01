import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDB() {
  if (db) return db;

  if (!process.env.MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();

  db = client.db("apparatus_system");
  return db;
}
