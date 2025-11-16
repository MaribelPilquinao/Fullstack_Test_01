import { Request, Response } from "express";
import {
  addCollaborator,
  createProject,
  deleteProject,
  getProjectByOwner,
  removeCollaborator,
  updateProject,
  getProjectById, // <-- AÑADIDO
} from "../services/project.service";
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
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const projects = await getProjectByOwner(ownerId, { page, limit });

  return successResponse(res, 200, projects);
};

export const handleGetProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;

  const project = await getProjectById(id, userId);

  return successResponse(res, 200, project);
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

export const handleAddCollaborator = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const currentUserId = req.user!.id;

  if (!userId) {
    throw new AppError("El 'userId' es requerido", 400);
  }

  const updatedProject = await addCollaborator(id, userId, currentUserId);
  return successResponse(res, 200, updatedProject);
};

export const handleRemoveCollaborator = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const currentUserId = req.user!.id;

  const updatedProject = await removeCollaborator(id, userId, currentUserId);
  return successResponse(res, 200, updatedProject);
};