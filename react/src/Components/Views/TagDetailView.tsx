import React, { Component } from "react";
import { IBoundingBox } from "../../Interfaces";
import { Backend } from "../../Utils";
import { BoundingBoxCanvas } from "../Canvases";
import { NavBar } from "../UIElements";

class TagDetailView extends Component<any, any> {
    private params: any;
    private canvasDOMRect: DOMRect;
    private canvasStyle: any;

    constructor(props: any) {
        super(props);
        const { match: { params } } = this.props;
        this.params = params;
        this.state = {
            project: {
                name: "",
            },
            task: {
                type: "",
                task: {},
                media: {},
                samples: [],
            },
        };
        this.canvasDOMRect = new DOMRect(0, 0, 200, 200);
        this.canvasStyle = { width: this.canvasDOMRect.width, height: this.canvasDOMRect.height };
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

        Backend.getSamples(this.params.projectId, this.params.taskId).then((resp: any) => {
            const task = resp.data.data;
            this.setState({ task });
        });
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
        const samples = this.state.task.samples.map((sample: any) => {
            switch (sample.type) {
                case "BoundingBoxTask":
                    return this.boundingBoxPreview(sample);
                default:
                    return null;
            }
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

export default TagDetailView;
