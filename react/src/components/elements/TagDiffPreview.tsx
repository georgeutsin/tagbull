import React, { Component } from "react";
import { IBoundingBox } from "../../interfaces";
import { BoundingBoxCanvas } from "../canvases";
import "./TagPreview.scss";

class TagDiffPreview extends Component<any, any> {
    private canvasDOMRect: DOMRect;
    private canvasStyle: any;
    constructor(props: any) {
        super(props);
        this.canvasDOMRect = new DOMRect(0, 0, 200, 200);
        this.canvasStyle = { width: this.canvasDOMRect.width, height: this.canvasDOMRect.height };
    }

    public dichotomyExtraPreview(metadata: any, tag: any, key: number) {
        const bb: IBoundingBox = metadata.bounding_box;
        const attributes = metadata.attributes.map((t: any) => {
            return <div key={t.attribute_type}> {t.attribute_type}-{t.option} </div>;
        });
        return <div style={{ backgroundColor: "yellow" }} key={key}>
            BB_EXTRA <br></br>
            <div className="tagPreviewOuter">
                <div className="tagPreviewThumb" style={this.canvasStyle}>
                    <BoundingBoxCanvas
                        instructionDims={new DOMRect()}
                        actionDims={new DOMRect()}
                        viewDims={this.canvasDOMRect}
                        media_url={tag.media.url}
                        boundingBox={bb}
                    ></BoundingBoxCanvas>
                </div>
                <div className="tagPreviewDetails">
                    <div>
                        <h5>Category</h5>{metadata.category}
                    </div>
                    <div> <h5>METADATA</h5>{attributes} </div>
                </div>
            </div>
        </div>;
    }

    public dichotomyMissingPreview(metadata: any, tag: any, key: number) {
        const bb: IBoundingBox = metadata.bounding_box;
        const attributes = metadata.attributes.map((t: any) => {
            return <div key={t.attribute_type}> {t.attribute_type}-{t.option} </div>;
        });
        return <div style={{ backgroundColor: "red" }} key={key}>
            BB_MISSING <br></br>
            <div className="tagPreviewOuter">
                <div className="tagPreviewThumb" style={this.canvasStyle}>
                    <BoundingBoxCanvas
                        instructionDims={new DOMRect()}
                        actionDims={new DOMRect()}
                        viewDims={this.canvasDOMRect}
                        media_url={tag.media.url}
                        boundingBox={bb}
                        baseBoundingBox={bb}
                    ></BoundingBoxCanvas>
                </div>
                <div className="tagPreviewDetails">
                    <div>
                        <h5>Category</h5>{metadata.category}
                    </div>
                    <div> <h5>METADATA</h5>{attributes} </div>
                </div>
            </div>
        </div>;
    }

    public dichotomyMatchAttributesPreview(metadata0: any, metadata1: any) {
        return metadata1.attributes.map((t: any) => {
            const baseAttr = metadata0.attributes.find((element: any) => element.attribute_type === t.attribute_type);
            if (!baseAttr) {
                return null;
            }
            const matches: boolean = baseAttr.option === t.option;
            return <div key={t.attribute_type} style={{ backgroundColor: matches ? "green" : "red" }}>
                {t.attribute_type}-{t.option} ({matches ? "DA_C" : "DA_I"})
            </div>;
        });
    }
    public dichotomyMatchPreview(metadata0: any, metadata1: any, tag: any, key: number) {
        const bb0: IBoundingBox = metadata0.bounding_box;
        const bb1: IBoundingBox = metadata1.bounding_box;
        const attributes = this.dichotomyMatchAttributesPreview(metadata0, metadata1);
        return <div style={{ backgroundColor: "green" }} key={key}>
            BB_MATCH <br></br>
            <div className="tagPreviewOuter" >
                <div className="tagPreviewThumb" style={this.canvasStyle}>
                    <BoundingBoxCanvas
                        instructionDims={new DOMRect()}
                        actionDims={new DOMRect()}
                        viewDims={this.canvasDOMRect}
                        media_url={tag.media.url}
                        boundingBox={bb1}
                        baseBoundingBox={bb0}
                    ></BoundingBoxCanvas>
                </div>
                <div className="tagPreviewDetails">
                    <div>
                        <h5>Category</h5>{metadata0.category}
                    </div>
                    <div> <h5>METADATA</h5>{attributes} </div>
                </div>
            </div></div>;
    }

    public withinDelta(bb0: IBoundingBox, bb1: IBoundingBox): boolean {
        const delta = 0.06;
        return Math.abs(bb0.min_x - bb1.min_x) < delta
            && Math.abs(bb0.min_y - bb1.min_y) < delta
            && Math.abs(bb0.max_x - bb1.max_x) < delta
            && Math.abs(bb0.max_y - bb1.max_y) < delta;
    }

    public findDichotomyBBMatch(metadata0: any, set1: Set<any>) {
        const bb0: IBoundingBox = metadata0.bounding_box;
        for (const metadata1 of Array.from(set1)) {
            const bb1: IBoundingBox = metadata1.bounding_box;
            if (this.withinDelta(bb0, bb1)) {
                return metadata1;
            }
        }
        return null;
    }

    public dichotomyPreview(tag0: any, tag1: any) {
        const diffs: any[] = [];
        const set0 = new Set();
        const set1 = new Set();

        tag0.tag.metadata.forEach((metadata: any) => set0.add(metadata));
        tag1.tag.metadata.forEach((metadata: any) => set1.add(metadata));
        let i = 0;
        // Iterate over base (set0) to render bb diffs
        set0.forEach((metadata0) => {
            const metadata1 = this.findDichotomyBBMatch(metadata0, set1);
            if (metadata1 === null) {
                diffs.push(this.dichotomyMissingPreview(metadata0, tag0, i));
            } else {
                diffs.push(this.dichotomyMatchPreview(metadata0, metadata1, tag0, i));
                set1.delete(metadata1);
            }
            i += 1;
        });

        // Iterate over the remaining bbs
        set1.forEach((metadata) => {
            diffs.push(this.dichotomyExtraPreview(metadata, tag1, set0.size + i));
            i += 1;
        });

        return diffs;
    }

    public render() {
        if (this.props.tag0 === null) {
            return <div>EXTRA TAG FOR {this.props.tag1.media.name}</div>;
        }
        if (this.props.tag1 === null) {
            return <div>MISSING TAG FOR {this.props.tag0.media.name}</div>;
        }
        switch (this.props.tag0.type) {
            case "DichotomyTask":
                return this.dichotomyPreview(this.props.tag0, this.props.tag1);
            default:
                return null;
        }
    }
}

export default TagDiffPreview;
