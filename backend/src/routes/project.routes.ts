import { Router } from "express";
import { handleCreateProject, handleDeleteProject, handleGetProjects, handleUpdateProject } from "../controllers/project.controller";

const router = Router();


router.post("/", handleCreateProject);
router.get("/", handleGetProjects);
router.put("/:id", handleUpdateProject)
router.delete("/:id", handleDeleteProject)

export default router;
