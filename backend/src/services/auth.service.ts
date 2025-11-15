import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { findUserByEmail, saveUser } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

export const loginUser = async (
  loginData: Pick<User, "email" | "passwordHash">
): Promise<{ token: string; user: Omit<User, "passwordHash"> }> => {
  const user = await findUserByEmail(loginData.email);
  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    loginData.passwordHash,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const payload = { userId: user.id };
  const secret = JWT_SECRET;
  const expiresIn = JWT_EXPIRES_IN || "7d";

  if (!secret) {
    throw new AppError(
      "Error de configuración del servidor (JWT_SECRET)",
      500
    );
  }

  const token = jwt.sign(payload, secret, { expiresIn });
  const { passwordHash, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword };
};

export const registerUser = async (
  userData: Pick<User, "email" | "fullName" | "passwordHash">
): Promise<Omit<User, "passwordHash">> => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new AppError("El email ya está en uso", 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.passwordHash, salt);

  const userToSave = {
    email: userData.email,
    fullName: userData.fullName,
    passwordHash: hashedPassword,
  };

  const newUser = await saveUser(userToSave);
  const { passwordHash, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};