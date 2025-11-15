// Ruta: src/entities/Task.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

// Definimos los Enums (listas de valores permitidos)
// tal como lo pide el README.md
export enum TaskStatus {
  PENDIENTE = "pendiente",
  EN_PROGRESO = "en progreso",
  COMPLETADA = "completada",
}

export enum TaskPriority {
  BAJA = "baja",
  MEDIA = "media",
  ALTA = "alta",
}

@Entity({ name: "tasks" })
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  // --- Campos Especiales (Enums) ---
  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDIENTE, // Valor por defecto
  })
  status!: TaskStatus;

  @Column({
    type: "enum",
    enum: TaskPriority,
    default: TaskPriority.MEDIA, // Valor por defecto
  })
  priority!: TaskPriority;

  // --- Relaciones ---

  // 1. Relación con Proyecto (Muchas tareas pertenecen a UN proyecto)
  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false, // Una tarea DEBE tener un proyecto
    onDelete: "CASCADE", // Si se borra el proyecto, se borran sus tareas
  })
  project!: Project;

  // 2. Relación con Usuario (Muchas tareas pueden ser asignadas a UN usuario)
  @ManyToOne(() => User, (user) => user.assignedTasks, {
    nullable: true, // Una tarea puede no estar asignada
    onDelete: "SET NULL", // Si se borra el usuario, la tarea queda "sin asignar"
  })
  assignee!: User | null; // El 'assignee' (asignado)

  // --- Timestamps ---
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}