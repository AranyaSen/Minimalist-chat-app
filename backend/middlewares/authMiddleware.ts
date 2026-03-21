import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "@/types/user";
import { responseHandler } from "@/utils/responseHandler";

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || req.cookies?.token;

  if (!token) {
    return responseHandler(res, "Access denied", 403);
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return responseHandler(res, "Invalid or expired token", 403);
      }
      req.user = decoded;
      next();
    }
  );
};

export default authMiddleware;
