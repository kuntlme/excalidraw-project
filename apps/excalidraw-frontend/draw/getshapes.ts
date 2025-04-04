import axios from "axios";
import Cookies from "js-cookie";
export const getChats = async (roomId: string) => {
    try {
        const token = Cookies.get("token");
        if (!token) {
            console.error("No auth token found");
            return;
        }
        const response = await axios.get(`${process.env.BACKEND_URL}/chat`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                roomId: Number(roomId)
            }
        });
        console.log(response.data);
        const chats = response.data.chats;
        const existingShapes = chats.map((chat: any) => {
            const messageData = JSON.parse(chat.message);
            return messageData;
        });
        return existingShapes;
    } catch (error) {
        console.error("Error fetching chats:", error);
        return [];
    }
}
