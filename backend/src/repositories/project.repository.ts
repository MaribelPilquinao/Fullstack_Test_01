import { AppDataSource } from "../config/data-source";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { DeleteResult } from "typeorm";


const projectRepository = AppDataSource.getRepository(Project);

export const saveProject = async(
    projectData: Partial<Project>,
    owner: User
): Promise<Project> => {
    const newProject = projectRepository.create({
        ...projectData,
        owner: owner,
    });
    return await projectRepository.save(newProject);
}

export const findProjectByOwnerId = async (
  ownerId: string,
  options: { take: number; skip: number }
): Promise<Project[]> => {
  return await projectRepository.find({
    where: {
      owner: {
        id: ownerId,
      },
    },
    order: {
      createdAt: "DESC",
    },
    take: options.take,
    skip: options.skip,
    relations: ["collaborators"],
  });
};

export const findProjectById = async (
  projectId: string
): Promise<Project | null> => {
  return await projectRepository.findOne({
    where: { id: projectId },
    relations: ["owner", "collaborators"],
  });
};

export const updateProject = async (project: Project): Promise<Project> => {
  return await projectRepository.save(project);
};

export const deleteProjectById = async (projectId: string): Promise<DeleteResult> => {
  return await projectRepository.delete(projectId);
};