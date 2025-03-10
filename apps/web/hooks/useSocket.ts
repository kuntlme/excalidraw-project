import { useEffect, useState } from "react";

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5000?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMmEzODEwMi1kYzM4LTQ5ZmMtYmUxZS03Y2U1Y2U2Y2QyMjQiLCJpYXQiOjE3NDE2MTE5NDR9.F-lI4TQ8yTbX9_jLpHbLm3meXyZ5CosGeTsYp2O3x48");
        ws.onopen = () => {
            console.log("connected");
            setLoading(false);
            setSocket(ws)
        }


        ws.onclose = () => {
            setSocket(null)
        }
    }, [])
    return {
        socket,
        loading
    }
}