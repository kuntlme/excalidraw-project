import { Shape } from "./shape";

export type shapetype = {
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
    clockDirection: boolean;

}

type TypeShape = "circle" | "rectangle";

export class MakeCanvas {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private existingShape: shapetype[];
    private roomId: string;
    private socket: WebSocket;
    // private shape: Shape;
    private clicked: boolean = false;
    private selectedShape: TypeShape;

    private startX: number;
    private startY: number;
    private currentX: number;
    private currentY: number;

    private clientId: string = Math.random().toString(36).substr(2, 9);

    constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.existingShape = [];
        this.roomId = roomId;
        this.socket = socket;
        this.selectedShape = "circle";
        // this.shape = new Shape(this.ctx);
        // this.shape.setShape(this.selectedShape);

        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;

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

    setTool = (tool: TypeShape)  => {
        this.selectedShape = tool;
    }

    handleMouseDown = (event: MouseEvent) => {
        if (this.clicked) return;
        this.clicked = true;
        this.setStartVertex(event.clientX, event.clientY);
    }

    handleMouseUp = (event: MouseEvent) => {
        this.clicked = false;
        this.setCurrentVertex(event.clientX, event.clientY);
        const currentShape = this.getShape() as shapetype;  
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
            this.setCurrentVertex(event.clientX, event.clientY);
            this.redrawCanvas();
            this.makeShape();
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
            }
        })
    }

    setStartVertex(vertexX: number, vertexY: number) {
        this.startX = vertexX;
        this.startY = vertexY;
    }

    setCurrentVertex(vertexX: number, vertexY: number) {
        this.currentX = vertexX;
        this.currentY = vertexY;
    }

    makeShape() {
        switch (this.selectedShape) {
            case "rectangle": {
                this.makeRect();
                break;
            }
            case "circle": {
                this.makeCircle();
                break;
            }
        }
    }

    makeRect() {
        let width = this.currentX - this.startX;
        let height = this.currentY - this.startY;
        this.ctx?.strokeRect(this.startX, this.startY, width, height);
    }

    makeCircle() {
        let centerX = (this.currentX + this.startX) / 2;
        let centerY = (this.currentY + this.startY) / 2;
        let radius = Math.abs(centerX - this.startX);
        this.ctx?.beginPath();
        this.ctx?.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
        this.ctx?.stroke();
        this.ctx?.closePath();
    }

    getShape() {
        let shapObject: shapetype | null = null; 
        switch (this.selectedShape) {
            case "circle": {
                let centerX = (this.currentX + this.startX) / 2;
                let centerY = (this.currentY + this.startY) / 2;
                let radius = Math.abs(centerX - this.startX);
                shapObject = {
                    type: "circle",
                    x: centerX,
                    y: centerY,
                    radius: radius,
                    startAngle: 0,
                    endAngle: 2 * Math.PI,
                    clockDirection: true
                }
                break;
            }
            case "rectangle": {
                shapObject = {
                    type: "rectangle",
                    x: this.startX,
                    y: this.startY,
                    width: this.currentX - this.startX,
                    height: this.currentY - this.startY
                }
                break;
            }
        }
        return shapObject;

    }

}