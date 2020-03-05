import React, { Component } from "react";
import { IPoint, IRect } from "../../Interfaces";
import { BaseCanvas, drawGreenMarker } from "../Canvases";

interface IPointCanvasProps {
    media_url: string;
    instructionDims: DOMRect;
    actionDims: DOMRect;
    viewDims: DOMRect;
    markers: IPoint[];
}

class PointCanvas extends Component<IPointCanvasProps, {}> {
    private imageBounds: IRect;

    constructor(props: any) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            currentStage: 0,
        };

        this.imageBounds = { x: 0, y: 0, w: 0, h: 0 };
        this.setImage = this.setImage.bind(this);
        this.draw = this.draw.bind(this);
    }


    public setImage(imageBounds: IRect, image?: HTMLImageElement) {
        this.imageBounds = imageBounds;
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.drawMarkers(ctx);
    }

    public drawMarkers(ctx: CanvasRenderingContext2D) {
        for (const marker of this.props.markers) {
            drawGreenMarker(ctx, marker, this.imageBounds);
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
            handleLeaveCB={() => null}
            setImageCB={this.setImage}
            drawCB={this.draw}
        >
        </BaseCanvas>;
    }
}

export default PointCanvas;
