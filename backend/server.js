import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import "./config/firebase.js"; // ✅ initializes Firebase

// ✅ Initialize app *before* using routes
const app = express();

app.use(cors());
app.use(express.json());

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api", authRoutes);

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
