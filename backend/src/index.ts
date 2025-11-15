import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/authMiddeware";
//rutas
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running!" });
});

// --- RUTAS ---
app.use("/api/auth", authRoutes);
app.use("/api/projects", authMiddleware, projectRoutes)
app.use("/api/tasks", authMiddleware, taskRoutes);



//manejo de errores
app.use(errorHandler);

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing database", error);
    process.exit(1);
  }
}

main();