import { Response } from "express";

export const successResponse = <T>(
  res: Response,
  statusCode: number,
  data: T
) => {
  return res.status(statusCode).json(data);
};