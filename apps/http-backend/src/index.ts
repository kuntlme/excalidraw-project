import express from "express"
import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import {createUserSchema, signinSchema} from "@repo/common/types"
import { prismaClient } from "@repo/db/client"

const app = express();
app.use(express.json())

app.post("/signup", async (req, res) => {

    const {success} = createUserSchema.safeParse(req.body);
    if(!success){
        res.json({message: "Incorrect inputs"});
        return;
    }

    const user = await prismaClient.user.create({
        data: {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            photo: "https://unsplash.com/photos/a-man-wearing-glasses-and-a-black-shirt-iEEBWgY_6lA",
        }
    })
    

    if(!user){
        res.status(400).json({message: "user already exist"});
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({
        token: token
    })
})

app.post("/signin", async (req, res) => {
    const {success} = signinSchema.safeParse(req.body);

    if(!success){
        res.status(400).json({message: "Incorrect inputs"});
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: req.body.email
        }
    })

    if(!user || user.password != req.body.password){
        res.status(400).json({message: "Invalid user or password"});
        return;
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    res.json({
        token: token
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