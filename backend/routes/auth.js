// backend/routes/auth.js
import express from "express";
import { admin } from "../config/firebase.js";

const router = express.Router();

router.post("/verifyToken", async (req, res) => {
  try {
    const { token, role, userId } = req.body;
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    // Role validation logic
    if (
      (role === "doctor" && !userId.toUpperCase().startsWith("D")) ||
      (role === "nurse" && !userId.toUpperCase().startsWith("N"))
    ) {
      return res.status(403).json({ success: false, error: "Role mismatch" });
    }

    res.json({ success: true, uid: decoded.uid });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
});

export default router;
