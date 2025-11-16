import { User } from "../entities/User";
import { searchUsers as searchUsersRepo } from "../repositories/user.repository";

export const searchUsers = async (
  query: string,
  currentUserId: string
): Promise<Omit<User, "passwordHash">[]> => {
  if (!query) {
    return [];
  }
  return await searchUsersRepo(query, currentUserId);
};