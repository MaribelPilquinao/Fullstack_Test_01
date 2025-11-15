import {
  createTask as createTaskRepo,
  deleteTaskById,
  findTaskById,
  findTasksByProjectId,
  saveTask,
} from "../repositories/task.repository";
import { findProjectById } from "../repositories/project.repository";
import { AppError } from "../utils/AppError";
import { Task, TaskPriority, TaskStatus } from "../entities/Task";
import { findUserById } from "../repositories/user.repository";
import { Project } from "../entities/Project";


type TaskInputData = {
  name: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
};


const checkProjectOwnership = async (
  projectId: string,
  userId: string
): Promise<Project> => {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }
  if (project.owner.id !== userId) {
    throw new AppError("No tienes permiso para acceder a este proyecto", 403);
  }
  return project;
};

export const createTask = async (
  projectId: string,
  taskData: TaskInputData,
  userId: string
): Promise<Task> => {
  await checkProjectOwnership(projectId, userId);

  if (taskData.assigneeId) {
    const assignee = await findUserById(taskData.assigneeId);
    if (!assignee) {
      throw new AppError("El usuario asignado no existe", 404);
    }

  }


  return await createTaskRepo({
    ...taskData,
    name: taskData.name,
    description: taskData.description || null,
    status: taskData.status || TaskStatus.PENDIENTE,
    priority: taskData.priority || TaskPriority.MEDIA,
    assigneeId: taskData.assigneeId || undefined,
    projectId: projectId,
  });
};

export const getTasksByProject = async (
  projectId: string,
  userId: string
): Promise<Task[]> => {
  await checkProjectOwnership(projectId, userId);

  return await findTasksByProjectId(projectId);
};

export const updateTask = async (
  taskId: string,
  updateData: TaskInputData,
  userId: string
): Promise<Task> => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new AppError("Tarea no encontrada", 404);
  }

  if (task.project.owner.id !== userId) {
    throw new AppError("No tienes permiso para editar esta tarea", 403);
  }

  if (updateData.assigneeId && updateData.assigneeId !== (task.assignee?.id || null)) {
    const assignee = await findUserById(updateData.assigneeId);
    if (!assignee) {
      throw new AppError("El nuevo usuario asignado no existe", 404);
    }
  }

  Object.assign(task, updateData);
  return await saveTask(task);
};

export const deleteTask = async (taskId: string, userId: string): Promise<void> => {
  const task = await findTaskById(taskId);
  if (!task) {
    throw new AppError("Tarea no encontrada", 404);
  }

  if (task.project.owner.id !== userId) {
    throw new AppError("No tienes permiso para eliminar esta tarea", 403);
  }

  await deleteTaskById(taskId);
};