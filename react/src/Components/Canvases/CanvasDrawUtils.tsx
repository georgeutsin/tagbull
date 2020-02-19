import { IPoint, IRect } from "../../Interfaces";

function drawMarker(ctx: CanvasRenderingContext2D, marker: IPoint, imageBounds: IRect) {
    if (ctx === null) {
        return;
    }

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
}

export {
    drawMarker,
};
