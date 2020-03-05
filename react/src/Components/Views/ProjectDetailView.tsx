import React, { Component } from "react";
import { IBoundingBox } from "../../Interfaces";
import { Backend } from "../../Utils";
import { BoundingBoxCanvas } from "../Canvases";
import { NavBar, ProgressBarComponent } from "../UIElements";


const taskTypes: { [key: string]: string; } = {
    BoundingBoxTask: "Bounding Box Given A Label",
    DichotomyTask: "Bounding Box and Metadata Given a Choice of Two Labels",
    MetadataTask: "Metadata Given a Bounding Box",
    LocatorTask: "Points Given a Label",
    DiscreteAttributeTask: "A Label Given a Bounding Box",
};

class ProjectDetailView extends Component<any, any> {
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
                created_at: "",
                progress: 0,
                task_type: "",
                status: "In Progress",
                paused: false,
                is_private: false,
            },
            tags: [],
        };
        this.canvasDOMRect = new DOMRect(0, 0, 200, 200);
        this.canvasStyle = { width: this.canvasDOMRect.width, height: this.canvasDOMRect.height };
        this.pauseButtonClicked = this.pauseButtonClicked.bind(this);
        this.privateButtonClicked = this.privateButtonClicked.bind(this);
    }

    public componentDidMount() {
        Backend.getProject(this.params.projectId).then((resp: any) => {
            this.setProjectState(resp);
        });

        Backend.getTags(this.params.projectId).then((resp: any) => {
            this.setState({ tags: resp.data.data });
        });
    }

    public pauseButtonClicked() {
        const data = { paused: !this.state.project.paused };
        Backend.patchProject(this.params.projectId, data).then((resp: any) => {
            this.setProjectState(resp);
        });
    }

    public privateButtonClicked() {
        const data = { is_private: !this.state.project.is_private };
        Backend.patchProject(this.params.projectId, data).then((resp: any) => {
            this.setProjectState(resp);
        });
    }

    public setProjectState(resp: any) {
        const project = resp.data.data;
        const d = new Date(project.created_at.replace(" ", "T"));
        this.setState({
            project: {
                name: project.name,
                id: project.id,
                paused: project.paused,
                is_private: project.is_private,
                status: project.paused ? "Paused" : "In Progress",
                progress: project.completed_tasks * 100 / project.num_tasks,
                task_type: taskTypes[project.task_type],
                created_at: d.toLocaleString("en-us", { month: "long" })
                    + " " + d.getDate() + ", " + d.getFullYear(),
            },
        });
    }

    public boundingBoxPreview(tag: any) {
        const bb: IBoundingBox = tag.tag;
        return <div className="tagPreviewOuter" key={tag.media.name}>
            <a href={`/projects/${this.state.project.id}/tags/${tag.task.id}`}>
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
        return tag.tag.metadata.map((m: any) => {
            const bb: IBoundingBox = m.bounding_box;
            const attributes = m.attributes.map((t: any) => {
                return <div> {t.attribute_type}-{t.option} </div>;
            });
            return <div className="tagPreviewOuter" key={tag.media.name}>
                <a href={`/projects/${this.state.project.id}/tags/${tag.task.id}`}>
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
        const tags = this.state.tags.map((tag: any) => {
            switch (tag.type) {
                case "BoundingBoxTask":
                    return this.boundingBoxPreview(tag);
                case "DichotomyTask":
                    return this.dichotomyPreview(tag);
                default:
                    return null;
            }
        });

        const pauseButtonLabel = this.state.project.paused ? "Resume" : "Pause";
        const privateButtonLabel = this.state.project.is_private ? "Make Public" : "Make Private";
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
                                <h5>Status</h5> {this.state.project.status}, {this.state.project.is_private ? "is private" : "is public"}
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
                                <button onClick={this.pauseButtonClicked}>{pauseButtonLabel}</button>
                                <button onClick={this.privateButtonClicked}>{privateButtonLabel}</button>
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
