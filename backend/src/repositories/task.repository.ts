import { DeleteResult } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Project } from "../entities/Project";
import { Task, TaskPriority, TaskStatus } from "../entities/Task";
import { User } from "../entities/User";

const taskRepository = AppDataSource.getRepository(Task);

type CreateTaskInput = Pick<
  Task,
  "name" | "description" | "status" | "priority"
> & {
  projectId: string;
  assigneeIds?: string[];
};

type TaskFilters = {
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
};

export const createTask = async (
  taskData: CreateTaskInput
): Promise<Task> => {
  const { projectId, assigneeIds, ...rest } = taskData;

  const project = { id: projectId } as Project;
  const assignees = assigneeIds ? assigneeIds.map(id => ({ id } as User)) : [];

  const newTask = taskRepository.create({
    ...rest,
    project: project,
    assignees: assignees,
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
      qb.leftJoin("task.assignees", "assignee_filter_null");
      qb.andWhere("assignee_filter_null.id IS NULL");
    } else {
      qb.innerJoin("task.assignees", "assignee_filter", "assignee_filter.id = :assigneeId", {
        assigneeId: filters.assigneeId,
      });
    }
  }

  qb.leftJoinAndSelect("task.assignees", "assignees");
  qb.orderBy("task.createdAt", "ASC");

  return await qb.getMany();
};

export const findTaskById = async (taskId: string): Promise<Task | null> => {
  return await taskRepository.findOne({
    where: { id: taskId },
    relations: [
      "project",
      "project.owner",
      "assignees",
    ],
  });
};

export const saveTask = async (task: Task): Promise<Task> => {
  return await taskRepository.save(task);
};

export const deleteTaskById = async (taskId: string): Promise<DeleteResult> => {
  return await taskRepository.delete(taskId);
};