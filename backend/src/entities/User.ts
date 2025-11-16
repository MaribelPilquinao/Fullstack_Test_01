import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToMany(() => Task, (task) => task.assignees)
  assignedTasks!: Task[];

  @ManyToMany(() => Project, (project) => project.collaborators)
  collaboratedProjects!: Project[];
}