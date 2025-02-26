import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

export const middleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"] ?? "";
    const decoded = jwt.verify(token, JWT_SECRET) as {userId: string};
    if (!decoded) {
        res.status(403).json({ message: "unauthorized" });
    }
    req.userId = decoded.userId;
    next();
}