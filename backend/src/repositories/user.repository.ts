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