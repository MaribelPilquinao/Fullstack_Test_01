import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Project } from "./Project";
import { Task } from "./Task";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  fullName!: string;

  @OneToMany(() => Project, (project) => project.owner)
  projects!: Project[];

  @OneToMany(() => Task, (task) => task.assignee)
  assignedTasks!: Task[];
}
