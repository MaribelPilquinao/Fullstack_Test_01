import { TaskStatus } from "../entities/Task";
import {
  countProjectsByOwner,
  countTasksByOwner,
  countTasksByStatus,
} from "../repositories/dashboard.repository";

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  tasksByStatus: {
    pendiente: number;
    en_progreso: number;
    completada: number;
  };
}

export const getDashboardStats = async (
  userId: string
): Promise<DashboardStats> => {
  const [totalProjects, totalTasks, statusCounts] = await Promise.all([
    countProjectsByOwner(userId),
    countTasksByOwner(userId),
    countTasksByStatus(userId),
  ]);

  const tasksByStatus = {
    pendiente: 0,
    en_progreso: 0,
    completada: 0,
  };

  for (const item of statusCounts) {
    if (item.status === TaskStatus.PENDIENTE) {
      tasksByStatus.pendiente = item.count;
    } else if (item.status === TaskStatus.EN_PROGRESO) {
      tasksByStatus.en_progreso = item.count;
    } else if (item.status === TaskStatus.COMPLETADA) {
      tasksByStatus.completada = item.count;
    }
  }

  return {
    totalProjects,
    totalTasks,
    tasksByStatus,
  };
};