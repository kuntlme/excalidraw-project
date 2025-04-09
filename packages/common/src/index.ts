import {z} from "zod"

export const createUserSchema = z.object({
    name: z.string().min(3).max(20),
    password: z.string(),
    email: z.string()
})

export const signinSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})

export const CreateChatSchema = z.object({
    roomId: z.number(),
    message: z.string(),
    messageId: z.string()
})

export const GetChatSchema = z.object({
    roomId: z.number()
})

export const DeleteChatSchema = z.object({
    roomId: z.number(),
    messageId: z.string()
})