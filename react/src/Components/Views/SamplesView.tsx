import React, { Component } from "react";
import { IBoundingBox, IRect } from "../../Interfaces";
import { Backend } from "../../Utils";
import { calculateImageDimensions, calculateImageLocation } from "../../Utils/CanvasCalcs";
import { NavBar } from "../UIElements";

const canvasWidth = 200;
const canvasHeight = 200;

class SamplesView extends Component<any, any> {
    private params: any;

    constructor(props: any) {
        super(props);
        const { match: { params } } = this.props;
        this.params = params;
        this.state = {
            project: {
                name: "",
            },
            samples: [],
        };
    }

    public componentDidMount() {
        Backend.getProject(this.params.projectId).then((resp: any) => {
            const project = resp.data.data;
            this.setState({
                project: {
                    name: project.name,
                },
            });
        });

        Backend.getAllSamples(this.params.projectId).then((resp: any) => {
            const samples = resp.data.data;
            this.setState({ samples });
        });
    }

    public rectToCanvas(rect: IRect, imageBounds: IRect, imageWidth: number) {
        const scale = imageWidth / imageBounds.w;

        return {
            x: imageBounds.x + rect.x / scale,
            y: imageBounds.y + rect.y / scale,
            w: rect.w / scale,
            h: rect.h / scale,
        };
    }

    public rectFromBoundingBox(bb: IBoundingBox, imageDims: any) {
        return {
            x: bb.min_x * imageDims.width,
            y: bb.min_y * imageDims.height,
            w: (bb.max_x - bb.min_x) * imageDims.width,
            h: (bb.max_y - bb.min_y) * imageDims.height,
        };
    }

    public render() {
        const samples = this.state.samples.map((sample: any) => {
            const myRef = React.createRef<HTMLCanvasElement>();
            const canvas = <canvas height={canvasHeight} width={canvasWidth} ref={myRef}></canvas>;

            const img = new Image();
            img.src = sample.media.url;
            img.onload = () => {
                if (myRef.current) {
                    const context = myRef.current.getContext("2d");
                    if (context) {
                        const maxDimensions = { width: canvasWidth, height: canvasHeight };
                        const originalImageDimensions = { width: img.width, height: img.height };
                        const imageDimensions = calculateImageDimensions(maxDimensions, originalImageDimensions);
                        // Center the image on the canvas.
                        const imageLocation = calculateImageLocation(maxDimensions, imageDimensions);
                        context.drawImage(
                            img, imageLocation.x, imageLocation.y,
                            imageDimensions.width, imageDimensions.height);

                        const imageBounds = {
                            x: imageLocation.x,
                            y: imageLocation.y,
                            w: imageDimensions.width,
                            h: imageDimensions.height,
                        };

                        context.beginPath();
                        const tagRect = this.rectFromBoundingBox(sample.sample, originalImageDimensions);
                        const rect = this.rectToCanvas(tagRect, imageBounds, img.width);
                        context.rect(rect.x, rect.y, rect.w, rect.h);
                        context.strokeStyle = "#00FF00";
                        context.stroke();
                        context.closePath();
                    }
                }
            };
            return <div className="tagPreviewOuter" key={sample.media.url}>
                <div className="tagPreviewThumb" style={{ width: canvasWidth, height: canvasHeight }}>
                    {canvas}
                </div>
                <div className="tagPreviewDetails">
                    <div>
                        <h5>Actor</h5>{sample.sample.actor_id}
                    </div>
                    <div>
                        <h5>Time Elapsed</h5> {sample.sample.time_elapsed / 1000 + "s"}
                    </div>
                    <div>
                        <button>✓</button><button style={{ color: "#a81414" }}>✗</button>
                    </div>
                </div>

            </div>;
        });

        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className="pageWrapper" style={{ minHeight: "100vh" }}>
                <div className="spaceAfter"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Project: {this.state.project.name}</h1></span>
                    <span className="actions">
                        <a href={`/projects/${this.params.projectId}`}><button className="actionButton greyButton">
                            Back
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className="mainCard">
                    <div className="projectSection">
                        <h2>Samples</h2>
                    </div>
                    <div className="tagPreviews">
                        {samples}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default SamplesView;
