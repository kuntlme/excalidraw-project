import { useEffect, useState } from "react"

export default function useSocket(){
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const ws = new WebSocket("");

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