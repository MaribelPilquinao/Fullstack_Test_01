import { Router } from "express";
import { handleCreateProject, handleDeleteProject, handleGetProjects, handleUpdateProject } from "../controllers/project.controller";
import { handleCreateTask, handleGetTasksByProject } from "../controllers/task.controller";

const router = Router();


router.post("/", handleCreateProject);
router.get("/", handleGetProjects);
router.put("/:id", handleUpdateProject)
router.delete("/:id", handleDeleteProject)

//Task routes
router.post("/:projectId/tasks", handleCreateTask);
router.get("/:projectId/tasks", handleGetTasksByProject);
export default router;
