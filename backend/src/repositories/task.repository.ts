import { AppDataSource } from "../config/data-source";
import { Task, TaskPriority, TaskStatus } from "../entities/Task";
import { Project } from "../entities/Project";
import { User } from "../entities/User";
import { DeleteResult } from "typeorm";

const taskRepository = AppDataSource.getRepository(Task);

type CreateTaskInput = Pick<
  Task,
  "name" | "description" | "status" | "priority"
> & {
  projectId: string;
  assigneeId?: string;
};

type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
};

export const createTask = async (
  taskData: CreateTaskInput
): Promise<Task> => {
  const { projectId, assigneeId, ...rest } = taskData;

  const project = { id: projectId } as Project;
  const assignee = assigneeId ? ({ id: assigneeId } as User) : null;

  const newTask = taskRepository.create({
    ...rest,
    project: project,
    assignee: assignee,
  });

  return await taskRepository.save(newTask);
};

export const findTasksByProjectId = async (
  projectId: string,
  filters: TaskFilters
): Promise<Task[]> => {
  const qb = taskRepository.createQueryBuilder("task");

  qb.where("task.projectId = :projectId", { projectId });

  if (filters.status) {
    qb.andWhere("task.status = :status", { status: filters.status });
  }

  if (filters.priority) {
    qb.andWhere("task.priority = :priority", { priority: filters.priority });
  }

  if (filters.assigneeId) {
    if (filters.assigneeId === "null") {
      qb.andWhere("task.assigneeId IS NULL");
    } else {
      qb.andWhere("task.assigneeId = :assigneeId", {
        assigneeId: filters.assigneeId,
      });
    }
  }

  qb.leftJoinAndSelect("task.assignee", "assignee");
  qb.orderBy("task.createdAt", "ASC");

  return await qb.getMany();
};

export const findTaskById = async (taskId: string): Promise<Task | null> => {
  return await taskRepository.findOne({
    where: { id: taskId },
    relations: ["project", "project.owner", "assignee"],
  });
};

export const saveTask = async (task: Task): Promise<Task> => {
  return await taskRepository.save(task);
};

export const deleteTaskById = async (taskId: string): Promise<DeleteResult> => {
  return await taskRepository.delete(taskId);
};