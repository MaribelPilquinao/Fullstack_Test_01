import { Router } from "express";
import { handleSearchUsers } from "../controllers/user.controller";

const router = Router();

router.get("/search", handleSearchUsers);

export default router;