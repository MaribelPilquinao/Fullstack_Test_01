import { AppDataSource } from "../config/data-source";
import { Project } from "../entities/Project";
import { Task, TaskStatus } from "../entities/Task";

const projectRepo = AppDataSource.getRepository(Project);
const taskRepo = AppDataSource.getRepository(Task);

export const countProjectsByOwner = async (ownerId: string): Promise<number> => {
  return await projectRepo.count({
    where: { owner: { id: ownerId } },
  });
};

export const countTasksByOwner = async (ownerId: string): Promise<number> => {
  return await taskRepo.count({
    where: { project: { owner: { id: ownerId } } },
  });
};

export const countTasksByStatus = async (
  ownerId: string
): Promise<{ status: TaskStatus; count: number }[]> => {
  const counts = await taskRepo
    .createQueryBuilder("task")
    .select("task.status", "status")
    .addSelect("COUNT(task.id)", "count")
    .leftJoin("task.project", "project")
    .where("project.ownerId = :ownerId", { ownerId })
    .groupBy("task.status")
    .getRawMany();

  return counts.map((item) => ({
    status: item.status,
    count: parseInt(item.count, 10),
  }));
};