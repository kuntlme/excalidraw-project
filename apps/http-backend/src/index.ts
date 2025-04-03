import express from "express"
import jwt from "jsonwebtoken"
import { Request, Response } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware";
import { CreateChatSchema, CreateRoomSchema, createUserSchema, GetChatSchema, signinSchema } from "@repo/common/types"
import { prismaClient } from "@repo/db/client"

const app = express();
app.use(express.json())

app.post("/signup", async (req, res) => {

    const { success } = createUserSchema.safeParse(req.body);
    if (!success) {
        res.json({ message: "Incorrect inputs" });
        return;
    }

    const existUser = await prismaClient.user.findFirst({
        where: {
            email: req.body.email
        }
    })

    if(existUser){
        res.json({ message: "user already exist" });
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


    if (!user) {
        res.status(400).json({ message: "user already exist" });
        return;
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({
        token: token
    })
})

app.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body);

    if (!success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            email: req.body.email
        }
    })

    if (!user || user.password != req.body.password) {
        res.status(400).json({ message: "Invalid user or password" });
        return;
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET);

    res.json({
        token: token
    })
})

app.post("/room", middleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "invalid input" });
        return;
    }

    const existRoom = await prismaClient.room.findFirst({
        where: {
            slug: parsedData.data?.name,
            adminId: req.userId
        }
    })

    if (existRoom) {
        res.json({
            message: "room already exist"
        })
        return;
    }


    const room = await prismaClient.room.create({
        data: {
            slug: parsedData.data.name,
            adminId: userId
        }
    })

    res.json({
        roomId: room.id,
        roomName: room.slug,
        message: "room created"
    })
    return;
})

app.get("/room", middleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }

    const rooms = await prismaClient.room.findMany({
        where: {
            adminId: userId
        }
    })

    res.json({
        rooms: rooms
    })
    return;
    
})

app.post("/chat", middleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }

    const parsedData = CreateChatSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "invalid input" });
        return;
    }

    const chat = await prismaClient.chat.create({
        data: {
            roomId: parsedData.data.roomId,
            message: parsedData.data.message,
            userId: userId
        }
    })

    res.json({
        message: "chat created",
        chat: chat
    })
    return;
})

app.get("/chat", middleware, async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "User ID is missing" });
        return;
    }

    const parsedData = GetChatSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({ message: "invalid input" });
        return;
    }

    const chats = await prismaClient.chat.findMany({
        where: {
            roomId: parsedData.data.roomId
        }
    })  

    res.json({
        chats: chats
    })
    return;
    
})

app.listen(8080, () => {
    console.log("listening the port 8080");
})