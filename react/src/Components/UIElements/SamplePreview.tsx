import React, { Component } from "react";
import { IBoundingBox, IPoint } from "../../Interfaces";
import { BoundingBoxCanvas, PointCanvas } from "../Canvases";

class SamplePreview extends Component<any, any> {
    private canvasDOMRect: DOMRect;
    private canvasStyle: any;

    constructor(props: any) {
        super(props);
        this.canvasDOMRect = new DOMRect(0, 0, 200, 200);
        this.canvasStyle = { width: this.canvasDOMRect.width, height: this.canvasDOMRect.height };
    }

    public dateConvert(date: any) {
        const d = new Date(date.replace(" ", "T"));
        return d.toUTCString();
    }

    public boundingBoxPreview(sample: any) {
        const actorStyle = { backgroundColor: sample.sample.actor_id === 0 ? "beige" : "white", width: 420 };
        const bb: IBoundingBox = sample.sample;
        return <div className="tagPreviewOuter" key={sample.media.name} style={actorStyle}>
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
                <div> <h5>Type</h5> Bounding Box </div>
                <div> <h5>Category</h5> {sample.task.category} </div>
                <div> <h5>Actor Sig</h5> {sample.sample.actor_sig} - {sample.sample.actor_id}</div>
                <div> <h5>Time Spent</h5> {sample.sample.time_elapsed / 1000 || 0}s </div>
                <div> <h5>Created At</h5> {this.dateConvert(sample.sample.created_at)} </div>
            </div>
        </div>;
    }

    public locatorPreview(sample: any) {
        const actorStyle = { backgroundColor: sample.sample.actor_id === 0 ? "beige" : "white", width: 420 };
        const points: IPoint[] = sample.sample.points;
        return <div className="tagPreviewOuter" key={sample.media.name} style={actorStyle}>

            <div className="tagPreviewThumb" style={this.canvasStyle}>
                <PointCanvas
                    instructionDims={new DOMRect()}
                    actionDims={new DOMRect()}
                    viewDims={this.canvasDOMRect}
                    media_url={sample.media.url}
                    markers={points}>
                </PointCanvas>
            </div>

            <div className="tagPreviewDetails">
                <div> <h5>Type</h5> Locator </div>
                <div> <h5>Category</h5> {sample.task.category} </div>
                <div> <h5>Actor Sig</h5> {sample.sample.actor_sig} - {sample.sample.actor_id} </div>
                <div> <h5>Time Spent</h5> {sample.sample.time_elapsed / 1000 || 0}s </div>
                <div> <h5>Created At</h5> {this.dateConvert(sample.sample.created_at)} </div>
            </div>
        </div>;
    }

    public discreteAttributePreview(sample: any) {
        const actorStyle = { backgroundColor: sample.sample.actor_id === 0 ? "beige" : "white", width: 420 };
        const bb: IBoundingBox = sample.task;
        return <div className="tagPreviewOuter" key={sample.media.name} style={actorStyle}>

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
                <div> <h5>Type</h5> Discrete Attribute </div>
                <div> <h5>Category</h5> {sample.task.category} </div>
                <div> <h5>Actor Sig</h5> {sample.sample.actor_sig} - {sample.sample.actor_id}  </div>
                <div> <h5>Attribute</h5> {sample.task.attribute_type}:{sample.sample.option} </div>
                <div> <h5>Time Spent</h5> {sample.sample.time_elapsed / 1000 || 0}s </div>
                <div> <h5>Created At</h5> {this.dateConvert(sample.sample.created_at)} </div>
            </div>
        </div>;
    }

    public render() {
        const sample = this.props.sample;
        switch (sample.type) {
            case "BoundingBoxTask":
                return this.boundingBoxPreview(sample);
            case "LocatorTask":
                return this.locatorPreview(sample);
            case "DiscreteAttributeTask":
                return this.discreteAttributePreview(sample);
            default:
                return null;
        }
    }
}

export default SamplePreview;
