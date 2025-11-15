import { Project } from "../entities/Project"
import { User } from "../entities/User";
import { deleteProjectById, findProjectById, findProjectByOwnerId, saveProject, updateProject as updateProjectRepo, } from "../repositories/project.repository";
import { AppError } from "../utils/AppError";


type CreateProjectData = Pick<Project, "name" | "description">;
type UpdateProjectData = Partial<Pick<Project, "name" | "description">>;

export const createProject = async(
    projectData: CreateProjectData,
    ownerId: string
): Promise<Project> => {

    const owner = { id: ownerId} as User;
    const newProject = await saveProject(projectData, owner);

    return newProject;
}

export const getProjectByOwner = async (
    ownerId: string
): Promise<Project[]> => {
    const projects = await findProjectByOwnerId(ownerId);

    return projects;
}

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