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
  projectId: string
): Promise<Task[]> => {
  return await taskRepository.find({
    where: { project: { id: projectId } },
    relations: ["assignee"],
    order: { createdAt: "ASC" },
  });
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