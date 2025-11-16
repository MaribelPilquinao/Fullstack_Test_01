import { Request, Response } from "express";
import { getDashboardStats } from "../services/dashboard.service";
import { successResponse } from "../utils/response";


export const handleGetDashboardStats = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const stats = await getDashboardStats(userId);

  return successResponse(res, 200, stats);
};