import { useEffect, useState } from "react"

export default function useSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const openSocket = async () => {
            const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
            const ws = new WebSocket(`${process.env.WS_URL}?token=${token}`);

            if (!ws) {
                return;
            }

            ws.onopen = () => {
                console.log("ws connected");
                setSocket(ws);
                setLoading(false);
            }

            ws.onclose = () => {
                setSocket(null)
                setLoading(true)
            }
        }
        openSocket();
    }, [])




    return { socket, loading }
}