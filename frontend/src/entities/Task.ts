export const TaskStatus = {
  PENDIENTE: "pendiente",
  EN_PROGRESO: "en progreso",
  COMPLETADA: "completada",
} as const;

export const TaskPriority = {
  BAJA: "baja",
  MEDIA: "media",
  ALTA: "alta",
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];