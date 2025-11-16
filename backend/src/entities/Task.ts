import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Project } from "./Project";
import { User } from "./User";

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


  @ManyToMany(() => User, (user) => user.assignedTasks)
  @JoinTable({
    name: "task_assignees_users",
    joinColumn: { name: "taskId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" },
  })
  assignees!: User[];


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}