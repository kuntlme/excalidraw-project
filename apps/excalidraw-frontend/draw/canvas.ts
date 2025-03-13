import { Shape } from "./shape";

export type shapetype = {
    type: "rectangle";
    x: number;
    y: number;
    width: number;
    height: number;
    strockColor: typeColor
} | {
    type: "circle";
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    clockDirection: boolean;
    strockColor: typeColor
} | {
    type: "line",
    movetoX: number,
    movetoY: number,
    linetoX: number,
    linetoY: number,
    strockColor: typeColor
} | {
    type: "pencil",
    movetoX: number,
    movetoY: number,
    linetoX: number,
    linetoY: number,
    strockColor: typeColor
}

export type TypeShape = "circle" | "rectangle" | "line" | "pencil";

export type typeColor = "#f7f9f9" | "#cb4335" | "#a569bd" | "#58d68d";

export class MakeCanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShape: shapetype[];
    private roomId: string;
    private socket: WebSocket;
    private shape: Shape;
    private clicked: boolean = false;
    private selectedShape: TypeShape;
    private strokeColor: typeColor = "#f7f9f9";

    private clientId: string = Math.random().toString(36).substr(2, 9);

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.strokeStyle = this.strokeColor;
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.selectedShape = "rectangle";
        this.shape = new Shape(this.ctx);
        this.shape.setShape(this.selectedShape);

        // this.init();
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
                    this.redrawCanvas();
                }
            }
        }
    }

    setTool = (tool: TypeShape) => {
        this.selectedShape = tool;
        this.shape.setShape(this.selectedShape);
    }

    setStrockColor = (strokeColor: typeColor) => {
        this.strokeColor = strokeColor;
        this.ctx.strokeStyle = this.strokeColor;
        this.shape.setStrockColor(this.strokeColor);
    }

    handleMouseDown = (event: MouseEvent) => {
        this.clicked = true;
        this.shape.setStartVertex(event.clientX, event.clientY);
    }

    handleMouseUp = (event: MouseEvent) => {
        this.clicked = false;
        this.shape.setCurrentVertex(event.clientX, event.clientY);
        const currentShape = this.shape.getShape() as shapetype;
        console.log("currentShape ", currentShape);
        this.existingShape.push(currentShape);
        this.redrawCanvas()
        this.socket.send(JSON.stringify({
            type: "CHAT",
            message: currentShape,
            roomId: this.roomId
        }))
    }

    handleMouseMove = (event: MouseEvent) => {
        if (this.clicked) {
            this.shape.setCurrentVertex(event.clientX, event.clientY);
            this.redrawCanvas();
            this.shape.makeShape();
            if (this.selectedShape === "pencil") {
                const currentShape = this.shape.getShape() as shapetype;
                console.log("currentShape ", currentShape);
                this.existingShape.push(currentShape);
                this.redrawCanvas()
                this.socket.send(JSON.stringify({
                    type: "CHAT",
                    message: currentShape,
                    roomId: this.roomId
                }))
            }
        }
    }

    mousehandler() {
        this.canvas.addEventListener("mousedown", this.handleMouseDown);
        this.canvas.addEventListener("mouseup", this.handleMouseUp);
        this.canvas.addEventListener("mousemove", this.handleMouseMove);
    }

    redrawCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        console.log(this.existingShape)
        this.existingShape.map((s) => {
            this.ctx.strokeStyle = s.strockColor;
            switch (s.type) {
                case "circle": {
                    this.ctx?.beginPath();
                    this.ctx?.arc(s.x, s.y, s.radius, 0, 2 * Math.PI, true);
                    this.ctx?.stroke();
                    this.ctx.closePath();
                    break;
                }
                case "rectangle": {
                    this.ctx.strokeRect(s.x, s.y, s.width, s.height);
                    break;
                }
                case "line": {
                    this.ctx.beginPath();
                    this.ctx.moveTo(s.movetoX, s.movetoY);
                    this.ctx.lineTo(s.linetoX, s.linetoY);
                    // Draw the Path
                    this.ctx.stroke();
                    this.ctx.closePath();

                }
                case "pencil": {
                    this.ctx.beginPath();
                    this.ctx.moveTo(s.movetoX, s.movetoY);
                    this.ctx.lineTo(s.linetoX, s.linetoY);
                    // Draw the Path
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            }
        })
    }

}