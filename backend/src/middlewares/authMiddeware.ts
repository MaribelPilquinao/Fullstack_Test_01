import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { AppError } from "../utils/AppError";
import { findUserById } from "../repositories/user.repository";
import { User } from "../entities/User";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "passwordHash">;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("No estás autorizado. Token no proporcionado.", 401);
  }

  let decoded: JwtPayload & { userId: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { userId: string };
  } catch (error) {
    throw new AppError("Token inválido.", 401);
  }

  const user = await findUserById(decoded.userId);

  if (!user) {
    throw new AppError(
      "El usuario perteneciente a este token ya no existe.",
      401
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutPassword } = user;
  req.user = userWithoutPassword;

  next();
};