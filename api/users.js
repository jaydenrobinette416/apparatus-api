import { connectDB } from "./db.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const db = await connectDB();
    const users = db.collection("users");

    if (req.method === "POST") {
      const { action, name, username, password, base } = req.body;

      if (action === "signup") {
        if (!name || !username || !password || !base) {
          return res.status(400).json({ ok:false, success:false, message:"Fill out all fields." });
        }

        const exists = await users.findOne({ username: username.toLowerCase() });

        if (exists) {
          return res.status(400).json({ ok:false, success:false, message:"Username already exists." });
        }

        await users.insertOne({
          name,
          username: username.toLowerCase(),
          password,
          base,
          role: "USER",
          approved: false,
          createdAt: new Date()
        });

        return res.status(200).json({
          ok:true,
          success:true,
          message:"Account created. Waiting for admin approval."
        });
      }

      if (action === "login") {
        const user = await users.findOne({
          username: username.toLowerCase(),
          password
        });

        if (!user) {
          return res.status(401).json({
            ok:false,
            success:false,
            message:"Invalid username or password."
          });
        }

        if (!user.approved) {
          return res.status(403).json({
            ok:false,
            success:false,
            message:"Account is waiting for approval."
          });
        }

        return res.status(200).json({
          ok:true,
          success:true,
          name:user.name,
          username:user.username,
          base:user.base,
          role:user.role
        });
      }
    }

    return res.status(405).json({ ok:false, success:false, message:"Method not allowed." });

  } catch (error) {
    return res.status(500).json({ ok:false, success:false, message:error.message });
  }
}
