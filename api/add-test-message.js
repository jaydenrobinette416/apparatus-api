import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();

    const result = await db.collection("crewMessages").insertOne({
      message: "Test crew message from API",
      priority: "Info",
      active: true,
      createdAt: new Date()
    });

    res.status(200).json({
      ok: true,
      insertedId: result.insertedId
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
