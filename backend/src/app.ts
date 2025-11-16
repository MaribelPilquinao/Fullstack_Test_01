import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/authMiddeware";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger-output.json";

// rutas
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// --- RUTAS ---
app.use("/api/auth", authRoutes);
app.use("/api/projects", authMiddleware, projectRoutes);
app.use("/api/tasks", authMiddleware, taskRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/users", authMiddleware, userRoutes);

// Manejo de errores
app.use(errorHandler);

export default app;