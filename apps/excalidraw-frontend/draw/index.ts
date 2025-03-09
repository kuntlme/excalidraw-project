

export default function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

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

    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            let width = e.clientX - vertexX;
            let height = e.clientY - vertexY;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(vertexX, vertexY, width, height)
        }
        console.log("move " + e.clientX + "," + e.clientY);
    })
}