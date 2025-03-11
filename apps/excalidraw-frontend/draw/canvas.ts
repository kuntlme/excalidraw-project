import { Shape } from "./shape";

type shapetype = {
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    clockDirection: number;

}

type TypeShape = "circle" | "rectangle";

interface InitDrowProps {
    canvas: HTMLCanvasElement;
    roomId: string;
}

export class MakeCanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShape: shapetype[];
    private roomId: string;
    private socket: WebSocket;
    private shape: Shape;
    private clicked: boolean = false;
    private selectedShape: TypeShape = "rectangle";

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.shape = new Shape(this.ctx);
        this.shape.setShape(this.selectedShape);
        this.init();
        this.initSocket();
        this.mousehandler();
    }

    init() {
        //get the existingShape from backend
    }

    initSocket() {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                if (parsedData.type === "CHAT") {
                    this.existingShape.push(parsedData.message);
                    this.clearCanvas();
                }
            }
        }
    }

    setTool(tool: TypeShape) {
        this.selectedShape = tool;
        console.log(this.selectedShape);
        this.shape.setShape(this.selectedShape);
    }

    handleMouseDown = (event: MouseEvent) => {
        this.clicked = true;
        this.shape.setStartVertex(event.clientX, event.clientY);
    }

    handleMouseUp = (event: MouseEvent) => {
        this.clicked = false;
        this.shape.setCurrentVertex(event.clientX, event.clientY);
        const currentShape = this.shape.getShape() as shapetype;
        this.existingShape.push(currentShape);
        this.socket.send(JSON.stringify({
            type: "CHAT",
            message: currentShape,
            roomId: this.roomId
        }))
    }

    handleMouseMove = (event: MouseEvent) => {
        if (this.clicked) {
            this.shape.setCurrentVertex(event.clientX, event.clientY);
            this.clearCanvas();
            this.shape.makeShape();
        }
    }

    mousehandler() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.existingShape.map((s) => {
            switch (s.type) {
                case "circle": {
                    this.ctx?.beginPath();
                    this.ctx?.arc(s.x, s.y, s.radius, 0, 2 * Math.PI, true);
                    this.ctx?.stroke();
                    break;
                }
                case "rectangle": {
                    this.ctx.strokeRect(s.x, s.y, s.width, s.height);
                    break;
                }
            }
        })
    }

}