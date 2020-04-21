import React, { Component } from "react";
import { IBoundingBox } from "../../interfaces";
import { BoundingBoxCanvas } from "../canvases";

class TagPreview extends Component<any, any> {
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

    public boundingBoxPreview(tag: any) {
        const bb: IBoundingBox = tag.tag;
        return <div className="tagPreviewOuter" key={tag.media.name}>
            <a href={`/projects/${this.props.project_id}/tags/${tag.task.id}`}>
                <div className="tagPreviewThumb" style={this.canvasStyle}>
                    <BoundingBoxCanvas
                        instructionDims={new DOMRect()}
                        actionDims={new DOMRect()}
                        viewDims={this.canvasDOMRect}
                        media_url={tag.media.url}
                        boundingBox={bb}
                    ></BoundingBoxCanvas>
                </div>
            </a>
            <div className="tagPreviewDetails">
                <div>
                    <h5>Category</h5>{tag.task.category}
                </div>
            </div>
        </div>;
    }

    public dichotomyPreview(tag: any) {
        let key = 0;
        return tag.tag.metadata.map((m: any) => {
            const bb: IBoundingBox = m.bounding_box;
            const attributes = m.attributes.map((t: any) => {
                return <div key={t.attribute_type}> {t.attribute_type}-{t.option} </div>;
            });
            key += 1;
            return <div className="tagPreviewOuter" key={tag.media.name + key}>
                <a href={`/projects/${this.props.project_id}/tags/${tag.task.id}`}>
                    <div className="tagPreviewThumb" style={this.canvasStyle}>
                        <BoundingBoxCanvas
                            instructionDims={new DOMRect()}
                            actionDims={new DOMRect()}
                            viewDims={this.canvasDOMRect}
                            media_url={tag.media.url}
                            boundingBox={bb}
                        ></BoundingBoxCanvas>
                    </div>
                </a>
                <div className="tagPreviewDetails">
                    <div>
                        <h5>Category</h5>{m.category}
                    </div>
                    <div> <h5>METADATA</h5>{attributes} </div>
                </div>
            </div>;
        });
    }

    public render() {
        const tag = this.props.tag;
        switch (tag.type) {
            case "BoundingBoxTask":
                return this.boundingBoxPreview(tag);
            case "DichotomyTask":
                return this.dichotomyPreview(tag);
            default:
                return null;
        }
    }
}

export default TagPreview;
