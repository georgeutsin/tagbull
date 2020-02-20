import React, { Component } from "react";
import { IBoundingBox, IRect } from "../../Interfaces";
import { Backend } from "../../Utils";
import { calculateImageDimensions, calculateImageLocation } from "../../Utils/CanvasCalcs";
import { NavBar, ProgressBarComponent } from "../UIElements";

const canvasWidth = 200;
const canvasHeight = 200;

const taskTypes: { [key: string]: string; } = {
    "bounding box": "Bounding Box With Label",
};

class ProjectDetailView extends Component<any, any> {
    private params: any;

    constructor(props: any) {
        super(props);
        const { match: { params } } = this.props;
        this.params = params;
        this.state = {
            project: {
                name: "",
                created_at: "",
                progress: 0,
                task_type: "",
                status: "In Progress",
            },
            tags: [],
        };
    }

    public componentDidMount() {
        Backend.getProject(this.params.projectId).then((resp: any) => {
            const project = resp.data.data;
            const d = new Date(project.created_at.replace(" ", "T"));
            this.setState({
                project: {
                    name: project.name,
                    id: project.id,
                    progress: project.completed_tasks * 100 / project.num_tasks,
                    task_type: taskTypes[project.task_type],
                    created_at: d.toLocaleString("en-us", { month: "long" })
                        + " " + d.getDate() + ", " + d.getFullYear(),
                },
            });
        });

        Backend.getTags(this.params.projectId).then((resp: any) => {
            const samples = resp.data.data;
            this.setState({ tags: samples });
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
        const tags = this.state.tags.map((tag: any) => {
            const myRef = React.createRef<HTMLCanvasElement>();
            const canvas = <canvas height={canvasHeight} width={canvasWidth} ref={myRef}></canvas>;

            const img = new Image();
            img.src = tag.media.url;
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
                        const tagRect = this.rectFromBoundingBox(tag.tag, originalImageDimensions);
                        const rect = this.rectToCanvas(tagRect, imageBounds, img.width);
                        context.rect(rect.x, rect.y, rect.w, rect.h);
                        context.strokeStyle = "#00FF00";
                        context.stroke();
                        context.closePath();
                    }
                }
            };
            return <div className="tagPreviewOuter" key={tag.media.url}>
                <a href={`/projects/${this.state.project.id}/tags/${tag.task.id}`}>
                    <div className="tagPreviewThumb" style={{ width: canvasWidth, height: canvasHeight }}>
                        {canvas}
                    </div>
                </a>
                <div className="tagPreviewDetails">
                    <div>
                        <h5>Label</h5>{tag.task.category}
                    </div>
                    <div>
                        <h5>Confidence</h5> 99%
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
                    <a href="/about">Settings</a>
                </li>
            </NavBar>
            <div className="pageWrapper" style={{ minHeight: "100vh" }}>
                <div className="spaceAfter"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Project: {this.state.project.name}</h1></span>
                    <span className="actions">
                        <a href="/projects"><button className="actionButton greyButton">
                            Back
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className="mainCard">
                    <div className="projectSection">
                        <h2> Details</h2>
                        <div className="projectDetails">
                            <div className="thirds">
                                <h5>Created At</h5> {this.state.project.created_at}
                            </div>
                            <div className="thirds">
                                <h5>Progress</h5>
                                <ProgressBarComponent progress={this.state.project.progress}
                                    height={40}></ProgressBarComponent>
                            </div>
                            <div className="thirds">
                                <h5>Actions</h5>
                                <a href={`/projects/${this.params.projectId}/samples`}>
                                    <button>View Raw Samples</button>
                                </a>
                            </div>
                            <div style={{ clear: "both" }}></div>
                        </div>
                    </div>
                    <div style={{ height: "40px" }}></div>
                    <div className="projectSection">
                        <h2>Tags</h2>
                    </div>
                    <div className="tagPreviews">
                        {tags}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ProjectDetailView;