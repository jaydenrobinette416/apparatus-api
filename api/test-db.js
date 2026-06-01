import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();

    const result = await db.collection("crewMessages").insertOne({
      message: "Database test successful",
      priority: "Info",
      active: "YES",
      createdAt: new Date()
    });

    res.status(200).json({
      ok: true,
      message: "MongoDB connected and test message inserted",
      insertedId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
