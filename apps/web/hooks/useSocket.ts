import { useEffect, useState } from "react";

export function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5000?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMmEzODEwMi1kYzM4LTQ5ZmMtYmUxZS03Y2U1Y2U2Y2QyMjQiLCJpYXQiOjE3NDE0MzE0OTV9.Zc38b8tjO081XeGgC3i3rvRZrle2eCF9pIp4S1eIqNI");
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