import express from "express"
import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client"

const app = express();

app.post("/signup", (req, res) => {

    const {success} = createUserSchema.safeParse(req.body);
    if(!success){
        res.json({message: "Incorrect inputs"});
        return;
    }

    res.json({
        userId: 1234
    })
})

app.post("/signin", (req, res) => {
    const userId = 1;
    jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        userId: 1234
    })  
})

app.post("/room", middleware, (req: Request, res: Response) => {
    res.json({
        roomId: 123
    })
    return;
})

app.listen(3000, () => {
    console.log("listening the port");
})