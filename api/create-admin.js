import { connectDB } from "./db.js";

export default async function handler(req, res) {
  try {
    const db = await connectDB();

    const exists = await db.collection("users").findOne({
      username: "admin"
    });

    if (exists) {
      return res.status(200).json({
        ok: true,
        message: "Admin already exists"
      });
    }

    await db.collection("users").insertOne({
      name: "Admin",
      username: "admin",
      password: "admin123",
      base: "98",
      role: "ADMIN",
      approved: true,
      createdAt: new Date()
    });

    res.status(200).json({
      ok: true,
      message: "Admin created",
      username: "admin",
      password: "admin123"
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message
    });
  }
}
