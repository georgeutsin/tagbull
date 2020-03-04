import { IBoundingBox, IRect } from "../Interfaces";

function calculateImageDimensions(maxDims: any, imageDims: any): any {
    const canvasAspectRatio = maxDims.width / maxDims.height;
    const imageAspectRatio = imageDims.width / imageDims.height;
    let width: number;
    let height: number;
    // if aspect ratio of canvas is greater than image, scale image to max width, otherwise scale image height
    if (canvasAspectRatio < imageAspectRatio) {
        width = maxDims.width;
        height = maxDims.width / imageAspectRatio;
    } else {
        height = maxDims.height;
        width = maxDims.height * imageAspectRatio;
    }
    return {
        width,
        height,
    };
}

function calculateImageLocation(maxDims: any, imageDims: any): any {
    const x = (maxDims.width - imageDims.width) / 2;
    const y = (maxDims.height - imageDims.height) / 2;
    return { x, y };
}

function windowTouchToCanvasCoords(canvasDom: any, touch: any) {
    const rect = canvasDom.getBoundingClientRect();
    return {
        id: touch.identifier,
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
    };
}

function touchToImageCoords(touch: any, imageBounds: IRect, image?: HTMLImageElement) {
    if (image) {
        const scale = image.width / imageBounds.w;

        return {
            x: (touch.x - imageBounds.x) * scale,
            y: (touch.y - imageBounds.y) * scale,
        };
    }

    return { x: 0, y: 0 };
}

function isTouchInBounds(touch: any, rect: IRect) {
    return touch.x >= rect.x &&
        touch.x <= rect.x + rect.w &&
        touch.y >= rect.y &&
        touch.y <= rect.y + rect.h;
}

function isPointInBounds(point: any, bb: IBoundingBox) {
    return point.x >= bb.min_x &&
        point.x <= bb.max_x &&
        point.y >= bb.min_y &&
        point.y <= bb.max_y;
}

function rectToCanvasCoords(rect: IRect, imageBounds: IRect, image?: HTMLImageElement) {
    if (image) {
        const scale = image.width / imageBounds.w;

        return {
            x: imageBounds.x + rect.x / scale,
            y: imageBounds.y + rect.y / scale,
            w: rect.w / scale,
            h: rect.h / scale,
        };
    }

    return { x: 0, y: 0, w: 0, h: 0 };
}

function rectFromBoundingBoxAndImage(objBounds: IBoundingBox, image?: HTMLImageElement) {
    if (image) {
        return {
            x: objBounds.min_x * image.width,
            y: objBounds.min_y * image.height,
            w: (objBounds.max_x - objBounds.min_x) * image.width,
            h: (objBounds.max_y - objBounds.min_y) * image.height,
        };
    }

    return { x: 0, y: 0, w: 0, h: 0 };
}

export {
    calculateImageDimensions,
    calculateImageLocation,
    windowTouchToCanvasCoords,
    touchToImageCoords,
    isTouchInBounds,
    isPointInBounds,
    rectToCanvasCoords,
    rectFromBoundingBoxAndImage,
};
