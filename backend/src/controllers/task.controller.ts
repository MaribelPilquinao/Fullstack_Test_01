import { Request, Response } from "express";
import {
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
} from "../services/task.service";
import { successResponse } from "../utils/response";
import { AppError } from "../utils/AppError";
import { TaskPriority, TaskStatus } from "../entities/Task";

export const handleCreateTask = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { name, description, status, priority, assigneeId } = req.body;
  const userId = req.user!.id;

  if (!name) {
    throw new AppError("El nombre (name) es requerido", 400);
  }

  const taskData = { name, description, status, priority, assigneeId };
  const newTask = await createTask(projectId, taskData, userId);

  return successResponse(res, 201, newTask);
};

export const handleGetTasksByProject = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user!.id;

  const tasks = await getTasksByProject(projectId, userId);
  return successResponse(res, 200, tasks);
};

export const handleUpdateTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user!.id;
  const { name, description, status, priority, assigneeId } = req.body;

  const updateData: any = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;
  if (assigneeId !== undefined) updateData.assigneeId = assigneeId;

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No se proporcionaron datos para actualizar", 400);
  }

  const updatedTask = await updateTask(taskId, updateData, userId);
  return successResponse(res, 200, updatedTask);
};

export const handleDeleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.user!.id;

  await deleteTask(taskId, userId);
  return res.status(204).send();
};