import { Request, Response } from "express";
import { createProject, deleteProject, getProjectByOwner, updateProject } from "../services/project.service";
import { AppError } from "../utils/AppError";
import { successResponse } from "../utils/response";

export const handleCreateProject = async (req: Request, res: Response) => {
  const { name } = req.body;
  const description = req.body.description || null;

  if (!name) {
    throw new AppError("El nombre (name) del proyecto es requerido", 400);
  }

  const ownerId = req.user!.id; 
  const newProject = await createProject({ name, description }, ownerId);

  return successResponse(res, 201, newProject);
};

export const handleGetProjects = async (req: Request, res: Response) => {
  const ownerId = req.user!.id;
  const projects = await getProjectByOwner(ownerId);

  return successResponse(res, 200, projects);
};

export const handleUpdateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const { name, description } = req.body;
  const updateData = { name, description };
  const updatedProject = await updateProject(id, updateData, userId);

  return successResponse(res, 200, updatedProject);
};

export const handleDeleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  await deleteProject(id, userId);

  return res.status(204).send();
};