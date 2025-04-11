import { shapetype, typeColor, TypeShape } from "./canvas";
import { v4 as uuidv4 } from 'uuid';

export class Shape {
    private ctx: CanvasRenderingContext2D | null = null;
    private typeShape: TypeShape = "rectangle";
    private startX: number = 0;
    private startY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;
    private text: string = "";
    private textSize: number = 2;
    private strockColor: typeColor = "#f7f9f9";

    private panOffsetX: number;
    private panOffsetY: number;
    private scale: number = 1;


    constructor(ctx: CanvasRenderingContext2D, panOffsetX: number, panOffsetY: number) {
        this.ctx = ctx;
        this.panOffsetX = panOffsetX;
        this.panOffsetY = panOffsetY;
    }

    setPanOffset(panOffsetX: number, panOffsetY: number) {
        this.panOffsetX = panOffsetX;
        this.panOffsetY = panOffsetY;
    }
    setScale(scale: number) {
        this.scale = scale;
    }

    setShape(shape: TypeShape) {
        this.typeShape = shape;
        console.log(this.typeShape)
    }

    setStrockColor(strockColor: typeColor) {
        this.strockColor = strockColor;
    }

    setStartVertex(vertexX: number, vertexY: number) {
        this.startX = vertexX;
        this.startY = vertexY;
    }

    setCurrentVertex(vertexX: number, vertexY: number) {
        this.currentX = vertexX;
        this.currentY = vertexY;
        // this.clicked = false;
    }

    setText(text: string) {
        this.text = text;
    }

    setTextSize(textSize: number) {
        this.textSize = textSize;
    }

    makeShape() {
        if (this.ctx) {
            this.ctx.strokeStyle = this.strockColor;
        }
        switch (this.typeShape) {
            case "rectangle": {
                this.makeRect();
                break;
            }
            case "circle": {
                this.makeCircle();
                break;
            }
            case "line": {
                this.makeLine();
                break;

            }
            case "pencil": {
                this.makeLine();
                break;
            }
            case "text": {
                this.makeText();
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

    makeLine() {
        this.ctx?.beginPath();
        this.ctx?.moveTo(this.startX, this.startY);
        this.ctx?.lineTo(this.currentX, this.currentY);
        // Draw the Path
        this.ctx?.stroke();
        this.ctx?.closePath();
    }

    makeText() {
        if (this.ctx) {
            this.ctx.font = `${this.textSize * 15}px serif`;
            this.ctx.textBaseline = "top";
        }
        const textOffset = this.textSize * 15 * 0.323;
        this.ctx?.fillText(this.text, this.currentX, this.currentY + textOffset);
    }

    getShape() {
        let shapObject: shapetype | null = null;
        switch (this.typeShape) {
            case "circle": {
                let centerX = ((this.currentX + this.startX) / 2);
                let centerY = (this.currentY + this.startY) / 2;
                let radius = Math.abs(centerX - this.startX) / this.scale;
                shapObject = {
                    messageId: uuidv4(),
                    type: "circle",
                    x: (centerX - this.panOffsetX) / this.scale,
                    y: (centerY - this.panOffsetY) / this.scale,
                    radius: radius,
                    startAngle: 0,
                    endAngle: 2 * Math.PI,
                    clockDirection: true,
                    strockColor: this.strockColor
                }
                break;
            }
            case "rectangle": {
                shapObject = {
                    messageId: uuidv4(),
                    type: "rectangle",
                    x: (this.startX - this.panOffsetX) / this.scale,
                    y: (this.startY - this.panOffsetY) / this.scale,
                    width: (this.currentX - this.startX) / this.scale,
                    height: (this.currentY - this.startY) / this.scale,
                    strockColor: this.strockColor
                }
                break;
            }
            case "line": {
                shapObject = {
                    messageId: uuidv4(),
                    type: "line",
                    movetoX: (this.startX - this.panOffsetX) / this.scale,
                    movetoY: (this.startY - this.panOffsetY) / this.scale,
                    linetoX: (this.currentX - this.panOffsetX) / this.scale,
                    linetoY: (this.currentY - this.panOffsetY) / this.scale,
                    strockColor: this.strockColor
                }
                break;
            }
            case "pencil": {
                shapObject = {
                    messageId: uuidv4(),
                    type: "pencil",
                    movetoX: (this.startX - this.panOffsetX) / this.scale,
                    movetoY: (this.startY - this.panOffsetY) / this.scale,
                    linetoX: (this.currentX - this.panOffsetX) / this.scale,
                    linetoY: (this.currentY - this.panOffsetY) / this.scale,
                    strockColor: this.strockColor
                }
                break;
            }
            case "text": {
                shapObject = {
                    messageId: uuidv4(),
                    type: "text",
                    content: this.text,
                    x: (this.startX - this.panOffsetX) / this.scale,
                    y: (this.startY - this.panOffsetY) / this.scale,
                    size: this.textSize / this.scale,
                    fillColor: this.strockColor
                }
                break;
            }
        }
        return shapObject;

    }

}