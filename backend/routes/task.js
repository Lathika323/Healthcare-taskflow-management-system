import express from "express";
import { assignTask, getTasks, reassignTask, respondToReassignment } from "../controllers/taskController.js";

const router = express.Router();

router.post("/assign", assignTask);
router.get("/nurse/:nurseId", getTasks);
router.post("/reassign", reassignTask);
router.post("/respond", respondToReassignment);

export default router;
