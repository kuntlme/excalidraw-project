
interface shape {
    type: "rectrangle" | "circle";
    x: number;
    y: number;
    width: number;
    heigh: number;
}

interface InitDrowProps {
    canvas: HTMLCanvasElement;
    roomId: string
}

export default function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");

    const existingShape: shape[] = [];

    if (!ctx) {
        return;
    }

    let clicked = false;
    let vertexX = 0;
    let vertexY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        vertexX = e.clientX;
        vertexY = e.clientY;
        console.log("down " + e.clientX + "," + e.clientY);
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        console.log("up " + e.clientX + "," + e.clientY);
        let width = e.clientX - vertexX;
        let height = e.clientY - vertexY;
        existingShape.push({
            type: "rectrangle",
            x: vertexX,
            y: vertexY,
            width: width,
            heigh: height
        })
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            let width = e.clientX - vertexX;
            let height = e.clientY - vertexY;
            getClear(canvas, ctx, existingShape)
            ctx.strokeRect(vertexX, vertexY, width, height)
        }
        console.log("move " + e.clientX + "," + e.clientY);
    })
}


function getClear(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, existingShape: shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShape.map((shape) => {
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.heigh);
    })
}