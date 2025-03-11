type TypeShape = "circle" | "rectrangle";

export class Shape {
    private ctx: CanvasRenderingContext2D | null = null;
    private typeShape: TypeShape = "rectrangle";
    private startX: number = 0;
    private startY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;



    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    setStartVertex(vertexX: number, vertexY: number) {
        this.startX = vertexX;
        this.startY = vertexY;
        console.log(this.startX + " , " + this.startY);

    }

    setCurrentVertex(vertexX: number, vertexY: number) {
        this.currentX = vertexX;
        this.currentY = vertexY;
        // this.clicked = false;
    }

    makeRect() {
            let width = this.currentX - this.startX;
            let height = this.currentY - this.startY;
            this.ctx?.strokeRect(this.startX, this.startY, width, height);
    }

}