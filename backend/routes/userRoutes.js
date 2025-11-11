import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router();

// Fetch nurses only
router.get("/", async (req, res) => {
  try {
    const { nursesOnly } = req.query;
    let query = db.collection("users");

    if (nursesOnly === "true") {
      query = query.where("role", "==", "nurse");
    }

    const snapshot = await query.get();
    const nurses = snapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() }));

    res.json({ success: true, nurses });
  } catch (err) {
    console.error("Error fetching nurses:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
