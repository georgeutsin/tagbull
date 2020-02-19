import { IPoint, IRect } from "../../Interfaces";

function drawMarker(ctx: CanvasRenderingContext2D, marker: IPoint, imageBounds: IRect) {
    if (ctx === null) {
        return;
    }
    ctx.save();

    // aiming for ~20px on fullscreen, ~10px on mobile.
    const radius = Math.max(imageBounds.w, imageBounds.h) / 60;

    // Draw black outer circle
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.ellipse(
        marker.x * imageBounds.w + imageBounds.x,
        marker.y * imageBounds.h + imageBounds.y,
        radius, radius, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Draw white inner circle
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.ellipse(
        marker.x * imageBounds.w + imageBounds.x,
        marker.y * imageBounds.h + imageBounds.y,
        radius + 1, radius + 1, 0, 0, Math.PI * 2);
    ctx.stroke();

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
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function drawBlackOverlay(ctx: CanvasRenderingContext2D, bounds: IRect) {
    if (ctx === null) {
        return;
    }
    ctx.save();

    ctx.globalAlpha = 0.3;
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

export {
    drawMarker,
    drawGreenRect,
    drawBlackOverlay,
    drawActiveImageOverlay,
};
