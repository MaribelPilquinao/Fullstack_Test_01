import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity({ name: "projects" })
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @ManyToOne(() => User, (user) => user.projects, {
    nullable: false,
    onDelete: "CASCADE",
  })
  owner!: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];


  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}