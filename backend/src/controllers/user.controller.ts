import { Request, Response } from "express";
import { searchUsers } from "../services/user.service";
import { successResponse } from "../utils/response";
import { AppError } from "../utils/AppError";

export const handleSearchUsers = async (req: Request, res: Response) => {
  const { q } = req.query;
  const currentUserId = req.user!.id;

  if (typeof q !== "string") {
    throw new AppError("El parámetro de búsqueda 'q' es requerido", 400);
  }

  const users = await searchUsers(q, currentUserId);
  return successResponse(res, 200, users);
};