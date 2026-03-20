import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] || (req as any).cookies?.token;

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    }
  );
};

export default authenticateUser;
