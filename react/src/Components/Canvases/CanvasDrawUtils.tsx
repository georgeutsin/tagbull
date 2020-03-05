import { IPoint, IRect } from "../../Interfaces";

function drawMarker(ctx: CanvasRenderingContext2D, marker: IPoint, imageBounds: IRect) {
    if (ctx === null) {
        return;
    }
    ctx.save();

    // aiming for ~20px on fullscreen, ~10px on mobile.
    const radius = Math.max(imageBounds.w, imageBounds.h) / 60;
    const x = marker.x * imageBounds.w + imageBounds.x;
    const y = marker.y * imageBounds.h + imageBounds.y;
    // Draw black outer circle
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.ellipse(
        x, y,
        radius, radius, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw white inner circle
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.ellipse(
        x, y,
        radius + 1, radius + 1, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw red lines
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x, y + radius);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.stroke();

    ctx.restore();
}
function drawGreenMarker(ctx: CanvasRenderingContext2D, marker: IPoint, imageBounds: IRect) {
    if (ctx === null) {
        return;
    }
    ctx.save();

    // aiming for ~20px on fullscreen, ~10px on mobile.
    const radius = Math.max(imageBounds.w, imageBounds.h) / 60;

    // Draw green point
    ctx.beginPath();
    ctx.fillStyle = "#00FF00";
    ctx.ellipse(
        marker.x * imageBounds.w + imageBounds.x,
        marker.y * imageBounds.h + imageBounds.y,
        radius, radius, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawGreenRect(ctx: CanvasRenderingContext2D, rect: IRect) {
    if (ctx === null) {
        return;
    }
    ctx.save();

    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.strokeStyle = "#00FF00";
    // ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function drawBlackOverlay(ctx: CanvasRenderingContext2D, bounds: IRect) {
    if (ctx === null) {
        return;
    }
    ctx.save();

    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "black";
    ctx.fillRect(bounds.x, bounds.y, bounds.w, bounds.h);
    ctx.globalAlpha = 1.0;

    ctx.restore();
}

function drawActiveImageOverlay(
    ctx: CanvasRenderingContext2D,
    rect: IRect,
    canvasRect: IRect,
    image?: HTMLImageElement) {
    if (image) {
        ctx.drawImage(image,
            rect.x, rect.y,
            Math.max(1, Math.floor(rect.w)), Math.max(1, Math.floor(rect.h)), // Support firefox
            canvasRect.x, canvasRect.y,
            Math.max(1, Math.floor(canvasRect.w)), Math.max(1, Math.floor(canvasRect.h))); // Support firefoxs
    }
}

function drawVerticalLine(ctx: CanvasRenderingContext2D, x: number, bounds: IRect) {
    if (ctx) {
        ctx.save();
        ctx.strokeStyle = "#00FF00";
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, bounds.y);
        ctx.lineTo(x, bounds.y + bounds.h);
        ctx.stroke();
        ctx.restore();
    }
}

function drawHorizontalLine(ctx: CanvasRenderingContext2D, y: number, bounds: IRect) {
    if (ctx) {
        ctx.save();
        ctx.strokeStyle = "#00FF00";
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bounds.x, y);
        ctx.lineTo(bounds.x + bounds.w, y);
        ctx.stroke();
        ctx.restore();
    }
}

export {
    drawMarker,
    drawGreenMarker,
    drawGreenRect,
    drawBlackOverlay,
    drawActiveImageOverlay,
    drawVerticalLine,
    drawHorizontalLine,
};
