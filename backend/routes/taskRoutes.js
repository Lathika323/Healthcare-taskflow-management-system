import express from "express";
import { db } from "../config/firebase.js";

const router = express.Router(); // ✅ Define router before using it

// ✅ Create a new task
router.post("/", async (req, res) => {
  try {
    const { taskText, nurseId, doctorId, deadline } = req.body;

    if (!taskText || !nurseId || !doctorId || !deadline) {
      return res.status(400).json({ success: false, error: "All fields required" });
    }

    const newTask = {
      taskText,
      nurseId: nurseId.toString(),
      doctorId: doctorId.toString(),
      deadline,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    await db.collection("tasks").add(newTask);
    res.json({ success: true, message: "Task assigned successfully" });
  } catch (err) {
    console.error("❌ Error adding task:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


// ✅ Fetch tasks for doctor or nurse
router.get("/", async (req, res) => {
  try {
    const { role, userId } = req.query;
    console.log("📥 Fetching tasks for:", role, userId);

    if (!role || !userId) {
      return res.status(400).json({ success: false, error: "Missing query parameters" });
    }

    let query;
    if (role === "doctor") {
      query = db.collection("tasks").where("doctorId", "==", userId.toString());
    } else if (role === "nurse") {
      query = db.collection("tasks").where("nurseId", "==", userId.toString());
    } else {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    const snapshot = await query.get();
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    console.log(`✅ Found ${tasks.length} tasks for ${role} ${userId}`);
    res.json({ success: true, tasks });
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});


// ✅ Reassign a task to another nurse
router.put("/:id/reassign", async (req, res) => {
  try {
    const { id } = req.params;
    const { newNurseId } = req.body;

    if (!newNurseId) {
      return res.status(400).json({ success: false, error: "New nurse ID is required" });
    }

    const taskRef = db.collection("tasks").doc(id);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }

    await taskRef.update({
      nurseId: newNurseId.toString(),
      reassignedAt: new Date().toISOString(),
    });

    console.log(`🔄 Task ${id} reassigned to Nurse ${newNurseId}`);
    res.json({ success: true, message: "Task reassigned successfully" });
  } catch (err) {
    console.error("❌ Error reassigning task:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;
