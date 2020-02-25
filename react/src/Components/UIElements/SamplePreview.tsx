import React, { Component } from "react";
import { IBoundingBox } from "../../Interfaces";
import { BoundingBoxCanvas } from "../Canvases";

class SamplePreview extends Component<any, any> {
    private canvasDOMRect: DOMRect;
    private canvasStyle: any;

    constructor(props: any) {
        super(props);
        this.canvasDOMRect = new DOMRect(0, 0, 200, 200);
        this.canvasStyle = { width: this.canvasDOMRect.width, height: this.canvasDOMRect.height };
    }

    public boundingBoxPreview(sample: any) {
        const bb: IBoundingBox = sample.sample;
        return <div className="tagPreviewOuter" key={sample.media.name}>

            <div className="tagPreviewThumb" style={this.canvasStyle}>
                <BoundingBoxCanvas
                    instructionDims={new DOMRect()}
                    actionDims={new DOMRect()}
                    viewDims={this.canvasDOMRect}
                    media_url={sample.media.url}
                    boundingBox={bb}
                ></BoundingBoxCanvas>
            </div>

            <div className="tagPreviewDetails">
                <div>
                    <h5>Label</h5>{sample.task.category}
                </div>
                <div>
                    <h5>Confidence</h5> 99%
                    </div>
                <div>
                    <button>✓</button><button style={{ color: "#a81414" }}>✗</button>
                </div>
            </div>
        </div>;
    }

    public render() {
        const sample = this.props.sample;
        switch (sample.type) {
            case "BoundingBoxTask":
                return this.boundingBoxPreview(sample);
            default:
                return null;
        }
    }
}

export default SamplePreview;
