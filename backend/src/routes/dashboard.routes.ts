import { Router } from "express";
import { handleGetDashboardStats } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", handleGetDashboardStats);

export default router;