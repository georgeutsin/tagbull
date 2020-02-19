import React, { Component } from "react";
import { IBoundingBox, IPoint, IRect } from "../../Interfaces";
import {
    rectFromBoundingBoxAndImage,
    rectToCanvasCoords,
} from "../../Utils";
import {
    BaseCanvas,
    drawActiveImageOverlay,
    drawBlackOverlay,
    drawGreenRect,
    drawMarker,
} from "../Canvases";

interface IBoundingBoxCanvasProps {
    media_url: string;
    instructionDims: DOMRect;
    actionDims: DOMRect;
    viewDims: DOMRect;

    boundingBox: IBoundingBox;
    targetPoint?: IPoint;
}

class BoundingBoxCanvas extends Component<IBoundingBoxCanvasProps, {}> {
    private image?: HTMLImageElement;
    private imageBounds: IRect;

    constructor(props: any) {
        super(props);

        this.imageBounds = { x: 0, y: 0, w: 0, h: 0 };
        this.setImage = this.setImage.bind(this);
        this.draw = this.draw.bind(this);
    }

    public setImage(imageBounds: IRect, image?: HTMLImageElement) {
        this.image = image;
        this.imageBounds = imageBounds;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (ctx === null) {
            return;
        }
        const rect = rectFromBoundingBoxAndImage(this.props.boundingBox, this.image);
        const canvasRect = rectToCanvasCoords(rect, this.imageBounds, this.image);

        drawBlackOverlay(ctx, this.imageBounds);
        drawActiveImageOverlay(ctx, rect, canvasRect, this.image);
        drawGreenRect(ctx, canvasRect);

        if (this.props.targetPoint && this.props.targetPoint !== null) {
            drawMarker(ctx, this.props.targetPoint, this.imageBounds);
        }
    }

    public render() {
        return <BaseCanvas
            instructionDims={this.props.instructionDims}
            actionDims={this.props.actionDims}
            viewDims={this.props.viewDims}
            media_url={this.props.media_url}
            handleStartCB={() => null}
            handleMoveCB={() => null}
            handleEndCB={() => null}
            setImageCB={this.setImage}
            drawCB={this.draw}
        >
        </BaseCanvas>;
    }
}

export default BoundingBoxCanvas;
