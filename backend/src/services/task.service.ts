import { Project } from "../entities/Project";
import { Task, TaskPriority, TaskStatus } from "../entities/Task";
import { User } from "../entities/User";
import { findProjectById } from "../repositories/project.repository";
import {
  createTask as createTaskRepo,
  deleteTaskById,
  findTaskById,
  findTasksByProjectId,
  saveTask,
} from "../repositories/task.repository";
import { findUserById } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";

type TaskInputData = {
  name: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeIds?: string[] | null;
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

  if (taskData.assigneeIds && taskData.assigneeIds.length > 0) {
    for (const assigneeId of taskData.assigneeIds) {
      const assignee = await findUserById(assigneeId);
      if (!assignee) {
        throw new AppError(`El usuario asignado con ID ${assigneeId} no existe`, 404);
      }

      const isAssigneeOwner = project.owner.id === assigneeId;
      const isAssigneeCollaborator = project.collaborators.some(
        (collab) => collab.id === assigneeId
      );

      if (!isAssigneeOwner && !isAssigneeCollaborator) {
        throw new AppError(
          `El usuario ${assignee.fullName} no es miembro del proyecto y no puede ser asignado.`,
          400
        );
      }
    }
  }

  return await createTaskRepo({
    ...taskData,
    name: taskData.name,
    description: taskData.description || null,
    status: taskData.status || TaskStatus.PENDIENTE,
    priority: taskData.priority || TaskPriority.MEDIA,
    assigneeIds: taskData.assigneeIds || [],
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

  if (updateData.assigneeIds) {
    const newAssignees: User[] = [];
    for (const assigneeId of updateData.assigneeIds) {
      const assignee = await findUserById(assigneeId);
      if (!assignee) {
        throw new AppError(`El usuario asignado con ID ${assigneeId} no existe`, 404);
      }

      const isAssigneeOwner = project.owner.id === assigneeId;
      const isAssigneeCollaborator = project.collaborators.some(
        (collab) => collab.id === assigneeId
      );
      if (!isAssigneeOwner && !isAssigneeCollaborator) {
        throw new AppError(
          `El usuario ${assignee.fullName} no es miembro del proyecto y no puede ser asignado.`,
          400
        );
      }
      newAssignees.push(assignee);
    }
    task.assignees = newAssignees;
    delete updateData.assigneeIds;
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