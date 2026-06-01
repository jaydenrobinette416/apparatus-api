import { connectDB } from "./db.js";

export default async function handler(req, res) {

  const db = await connectDB();

  const collection = db.collection("apparatus");

  const units = [
    { name: "Rescue 2", base: "98" },
    { name: "Medic 1", base: "98" },
    { name: "Medic 2", base: "98" },
    { name: "Truck 1", base: "98" },
    { name: "UTV 1", base: "98" }
  ];

  for (const unit of units) {
    const exists = await collection.findOne({
      name: unit.name
    });

    if (!exists) {
      await collection.insertOne({
        ...unit,
        active: true,
        createdAt: new Date()
      });
    }
  }

  res.status(200).json({
    ok: true,
    message: "Units loaded"
  });
}
