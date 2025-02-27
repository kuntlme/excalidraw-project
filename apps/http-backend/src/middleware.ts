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
    const bearerToken = req.header("authorization");
    if(!bearerToken || bearerToken.startsWith("bearer")){
        res.json("token not found");
        return;
    }
    const token = bearerToken.split(" ")[1];
    if(!token){
        res.json("invalid token");
        return;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as {userId: string};
    if (!decoded) {
        res.status(403).json({ message: "unauthorized" });
    }
    req.userId = decoded.userId;
    next();
}