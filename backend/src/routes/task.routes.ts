import { Router } from "express";
import {
  handleUpdateTask,
  handleDeleteTask,
} from "../controllers/task.controller";

const router = Router();

router.put("/:taskId", handleUpdateTask);
router.delete("/:taskId", handleDeleteTask);

export default router;