import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Project } from "../entities/Project";
import { Task } from "../entities/Task";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  
  synchronize: true,
  logging: true,
  
  entities: [User, Project, Task],
  
  migrations: [],
  subscribers: [],
});