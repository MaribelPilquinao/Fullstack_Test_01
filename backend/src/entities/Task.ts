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

  @Column({
    type: "enum",
    enum: TaskStatus,
    default: TaskStatus.PENDIENTE,
  })
  status!: TaskStatus;

  @Column({
    type: "enum",
    enum: TaskPriority,
    default: TaskPriority.MEDIA,
  })
  priority!: TaskPriority;

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false,
    onDelete: "CASCADE",
  })
  project!: Project;

  @ManyToOne(() => User, (user) => user.assignedTasks, {
    nullable: true,
    onDelete: "SET NULL",
  })
  assignee!: User | null; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}