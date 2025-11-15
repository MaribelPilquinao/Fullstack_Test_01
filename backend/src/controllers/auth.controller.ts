import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { successResponse } from "../utils/response";
import { AppError } from "../utils/AppError";

export const handleLogin = async (req: Request, res: Response) => {

  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError("Email y password son requeridos", 400);
  }

  const { token, user } = await loginUser({
    email,
    passwordHash: password,
  });

  return successResponse(res, 200, { token, user });
};

export const handleRegister = async (req: Request, res: Response) => {
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    throw new AppError("Email, fullName y password son requeridos", 400);
  }

  const newUser = await registerUser({
    email,
    fullName,
    passwordHash: password,
  });

  return successResponse(res, 201, newUser);
};

export const getMyProfile = async (req: Request, res: Response) => {
  return successResponse(res, 200, req.user);
}