import { Router } from "express";
import {
  handleCreateProject,
  handleDeleteProject,
  handleGetProjects,
  handleUpdateProject,
  handleAddCollaborator,
  handleRemoveCollaborator,
  handleGetProjectById,
} from "../controllers/project.controller";
import {
  handleCreateTask,
  handleGetTasksByProject,
} from "../controllers/task.controller";

const router = Router();

// --- Rutas de Proyectos ---
router.post("/", handleCreateProject);
router.get("/", handleGetProjects);
router.put("/:id", handleUpdateProject);
router.delete("/:id", handleDeleteProject);
router.get("/:id", handleGetProjectById);

// --- Rutas de Colaboradores ---
router.post("/:id/collaborators", handleAddCollaborator);
router.delete("/:id/collaborators/:userId", handleRemoveCollaborator);

// --- Rutas Anidadas de Tareas ---
router.post("/:projectId/tasks", handleCreateTask);
router.get("/:projectId/tasks", handleGetTasksByProject);

export default router;