import { Project } from "../entities/Project";
import { User } from "../entities/User";
import {
  deleteProjectById,
  findProjectById,
  findProjectByOwnerId,
  saveProject,
  updateProject as updateProjectRepo,
} from "../repositories/project.repository";
import { findUserById } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";

type CreateProjectData = Pick<Project, "name" | "description">;
type UpdateProjectData = Partial<Pick<Project, "name" | "description">>;
type PaginationOptions = {
  page: number;
  limit: number;
};

// --- IMPORTANTE: Añadimos esta función de seguridad aquí ---
// (Copiada de task.service.ts para reutilizar la lógica de permisos)
const checkProjectMembership = async (
  projectId: string,
  userId: string
): Promise<Project> => {
  const project = await findProjectById(projectId); // findProjectById carga 'owner' y 'collaborators'
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

export const createProject = async (
  projectData: CreateProjectData,
  ownerId: string
): Promise<Project> => {
  const owner = { id: ownerId } as User;
  const newProject = await saveProject(projectData, owner);

  return newProject;
};

export const getProjectByOwner = async (
  ownerId: string,
  options: PaginationOptions
): Promise<Project[]> => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const projects = await findProjectByOwnerId(ownerId, {
    take: limit,
    skip: skip,
  });

  return projects;
};

export const updateProject = async (
  projectId: string,
  updateData: UpdateProjectData,
  userId: string
): Promise<Project> => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (project.owner.id !== userId) {
    throw new AppError("No tienes permiso para editar este proyecto", 403);
  }

  Object.assign(project, updateData);

  const updatedProject = await updateProjectRepo(project);

  return updatedProject;
};

export const deleteProject = async (
  projectId: string,
  userId: string
): Promise<void> => {
  const project = await findProjectById(projectId);

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (project.owner.id !== userId) {
    throw new AppError("No tienes permiso para eliminar este proyecto", 403);
  }

  await deleteProjectById(projectId);
};

export const addCollaborator = async (
  projectId: string,
  userIdToAdd: string,
  currentUserId: string
): Promise<Project> => {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (project.owner.id !== currentUserId) {
    throw new AppError("No tienes permiso para añadir colaboradores", 403);
  }

  if (project.owner.id === userIdToAdd) {
    throw new AppError("No puedes añadir al dueño como colaborador", 400);
  }

  const userToAdd = await findUserById(userIdToAdd);
  if (!userToAdd) {
    throw new AppError("El usuario a añadir no existe", 404);
  }

  const isAlreadyCollaborator = project.collaborators.some(
    (collab) => collab.id === userIdToAdd
  );
  if (isAlreadyCollaborator) {
    throw new AppError("Este usuario ya es un colaborador", 409);
  }

  project.collaborators.push(userToAdd);
  await updateProjectRepo(project);
  return project;
};

export const removeCollaborator = async (
  projectId: string,
  userIdToRemove: string,
  currentUserId: string
): Promise<Project> => {
  const project = await findProjectById(projectId);
  if (!project) {
    throw new AppError("Proyecto no encontrado", 404);
  }

  if (project.owner.id !== currentUserId) {
    throw new AppError("No tienes permiso para quitar colaboradores", 403);
  }

  project.collaborators = project.collaborators.filter(
    (collab) => collab.id !== userIdToRemove
  );

  await updateProjectRepo(project);
  return project;
};

export const getProjectById = async (
  projectId: string,
  userId: string
): Promise<Project> => {
  const project = await checkProjectMembership(projectId, userId);
  return project;
};