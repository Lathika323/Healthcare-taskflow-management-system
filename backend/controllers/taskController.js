import Task from "../models/Task.js";

// Doctor assigns task
export const assignTask = async (req, res) => {
  try {
    const { taskName, description, assignedBy, assignedTo, dueDate } = req.body;
    const task = await Task.create({ taskName, description, assignedBy, assignedTo, dueDate });
    res.status(201).json({ message: "Task assigned", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Nurse fetches pending tasks
export const getTasks = async (req, res) => {
  try {
    const { nurseId } = req.params;
    const tasks = await Task.find({ assignedTo: nurseId, status: "pending" });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Nurse reassigns task
export const reassignTask = async (req, res) => {
  try {
    const { taskId, newNurseId } = req.body;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const hoursLeft = (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60);
    if (hoursLeft > 12) return res.status(400).json({ message: "Reassignment only allowed within 12 hours" });

    task.status = "reassigned";
    task.reassignedTo = newNurseId;
    task.reassignmentStatus = "pending";
    await task.save();

    res.json({ message: "Task reassigned pending acceptance", task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reassigned nurse accepts/rejects
export const respondToReassignment = async (req, res) => {
  try {
    const { taskId, decision } = req.body;
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (decision === "accept") {
      task.assignedTo = task.reassignedTo;
      task.reassignmentStatus = "accepted";
    } else {
      task.reassignmentStatus = "rejected";
    }
    await task.save();
    res.json({ message: `Task ${decision}ed`, task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
