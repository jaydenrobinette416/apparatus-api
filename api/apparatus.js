import { connectDB } from "./db.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const db = await connectDB();
    const collection = db.collection("apparatus");

    if (req.method === "GET") {
      const units = await collection
        .find({ active: true })
        .sort({ name: 1 })
        .toArray();

      return res.status(200).json({
        ok: true,
        units
      });
    }

    if (req.method === "POST") {
      const { name, base } = req.body;

      await collection.insertOne({
        name,
        base,
        active: true,
        createdAt: new Date()
      });

      return res.status(200).json({
        ok: true
      });
    }

    return res.status(405).json({
      ok: false
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
