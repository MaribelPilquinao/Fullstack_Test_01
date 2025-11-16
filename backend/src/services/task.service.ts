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

type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
};

const checkProjectMembership = async (
  projectId: string,
  userId: string
): Promise<Project> => {
  const project = await findProjectById(projectId); 
  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  const isOwner = project.owner.id === userId;
  const isCollaborator = project.collaborators.some(
    (collab) => collab.id === userId
  );

  if (!isOwner && !isCollaborator) {
    throw new AppError(
      "No tienes permiso para acceder a este proyecto",
      403
    );
  }
  return project;
};


export const createTask = async (
  projectId: string,
  taskData: TaskInputData,
  userId: string
): Promise<Task> => {
  const project = await checkProjectMembership(projectId, userId);

  if (taskData.assigneeId) {
    const assignee = await findUserById(taskData.assigneeId);
    if (!assignee) {
      throw new AppError("El usuario asignado no existe", 404);
    }

    const isAssigneeOwner = project.owner.id === taskData.assigneeId;
    const isAssigneeCollaborator = project.collaborators.some(
      (collab) => collab.id === taskData.assigneeId
    );

    if (!isAssigneeOwner && !isAssigneeCollaborator) {
      throw new AppError(
        "Solo puedes asignar tareas a miembros (dueño o colaboradores) del proyecto",
        400
      );
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
  userId: string,
  filters: TaskFilters
): Promise<Task[]> => {
  await checkProjectMembership(projectId, userId);

  return await findTasksByProjectId(projectId, filters);
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

  const project = await checkProjectMembership(task.project.id, userId);

  if (
    updateData.assigneeId &&
    updateData.assigneeId !== (task.assignee?.id || null)
  ) {
    const assignee = await findUserById(updateData.assigneeId);
    if (!assignee) {
      throw new AppError("El nuevo usuario asignado no existe", 404);
    }
    
    const isAssigneeOwner = project.owner.id === updateData.assigneeId;
    const isAssigneeCollaborator = project.collaborators.some(
      (collab) => collab.id === updateData.assigneeId
    );
    if (!isAssigneeOwner && !isAssigneeCollaborator) {
      throw new AppError(
        "Solo puedes asignar tareas a miembros del proyecto",
        400
      );
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

  await checkProjectMembership(task.project.id, userId);

  await deleteTaskById(taskId);
};