import { useEffect, useState } from "react"
import { json } from "stream/consumers";

export default function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5000?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMmEzODEwMi1kYzM4LTQ5ZmMtYmUxZS03Y2U1Y2U2Y2QyMjQiLCJpYXQiOjE3NDE2MTE5NDR9.F-lI4TQ8yTbX9_jLpHbLm3meXyZ5CosGeTsYp2O3x48");

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
    }, [])

    


    return { socket, loading }
}