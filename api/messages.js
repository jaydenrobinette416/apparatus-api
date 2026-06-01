import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("crewMessages");

    if (req.method === "GET") {
      const messages = await collection
        .find({ active: true })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json({
        ok: true,
        messages
      });
    }

    if (req.method === "POST") {
      const { message, priority } = req.body;

      if (!message) {
        return res.status(400).json({
          ok: false,
          error: "Message is required"
        });
      }

      const result = await collection.insertOne({
        message,
        priority: priority || "Info",
        active: true,
        createdAt: new Date()
      });

      return res.status(200).json({
        ok: true,
        insertedId: result.insertedId
      });
    }

    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
