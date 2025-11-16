import { Like, Not } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await userRepository.findOneBy({ email: email });
};

export const saveUser = async (userData: Partial<User>): Promise<User> => {
  const newUser = userRepository.create(userData);
  return await userRepository.save(newUser);
};

export const findUserById = async (id: string): Promise<User | null> => {
  return await userRepository.findOneBy({ id: id});
}

export const searchUsers = async (
  query: string,
  currentUserId: string
): Promise<Omit<User, "passwordHash">[]> => {
  return await userRepository.find({
    where: [
      { email: Like(`%${query}%`), id: Not(currentUserId) },
      { fullName: Like(`%${query}%`), id: Not(currentUserId) },
    ],
    select: ["id", "email", "fullName"],
  });
};