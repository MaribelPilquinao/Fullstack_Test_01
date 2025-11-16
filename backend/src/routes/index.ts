import { Router } from "express";
import authRoutes from "./auth.routes";
import dashboardRoutes from "./dashboard.routes";
import projectRoutes from "./project.routes";
import taskRoutes from "./task.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use(
  "/auth",
  // #swagger.tags = ['Autenticación']
  authRoutes
);
router.use(
  "/users",
  // #swagger.tags = ['Usuarios']
  userRoutes
);
router.use(
  "/projects",
  // #swagger.tags = ['Proyectos']
  projectRoutes
);
router.use(
  "/tasks",
  // #swagger.tags = ['Tareas']
  taskRoutes
);
router.use(
  "/dashboard",
  // #swagger.tags = ['Dashboard']
  dashboardRoutes
);

export default router;