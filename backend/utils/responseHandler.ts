import { Response } from "express";

export const responseHandler = (
  res: Response,
  message: string,
  statusCode: number = 200,
  data: unknown = null
) => {
  return res.status(statusCode).json({
    success: statusCode < 400,
    statusCode,
    message,
    data,
  });
};
