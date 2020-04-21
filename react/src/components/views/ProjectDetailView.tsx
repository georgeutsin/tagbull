import React, { Component } from "react";
import { Backend } from "../../utils";
import { NavBar, ProgressBarComponent, TagPreview } from "../elements";


const taskTypes: { [key: string]: string; } = {
    BoundingBoxTask: "Bounding Box Given A Label",
    DichotomyTask: "Bounding Box and Metadata Given a Choice of Two Labels",
    MetadataTask: "Metadata Given a Bounding Box",
    LocatorTask: "Points Given a Label",
    DiscreteAttributeTask: "A Label Given a Bounding Box",
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
                paused: false,
                is_private: false,
            },
            tags: [],
            tagOffset: 0,
            tagTimestamp: null,
        };
        this.pauseButtonClicked = this.pauseButtonClicked.bind(this);
        this.privateButtonClicked = this.privateButtonClicked.bind(this);
        this.loadMoreButtonClicked = this.loadMoreButtonClicked.bind(this);
        this.loadAllButtonClicked = this.loadAllButtonClicked.bind(this);
    }

    public componentDidMount() {
        Backend.getProject(this.params.projectId).then((resp: any) => {
            this.setProjectState(resp);
        });

        this.loadMoreTags();
    }

    public async loadTags() {
        const projectId = this.params.projectId;
        const meta = { offset: this.state.tagOffset, timestamp: this.state.tagTimestamp };
        return await Backend.getTags(projectId, meta);
    }

    public async loadMoreTags(loadAll: boolean = false) {
        let tags = this.state.tags;
        let tagOffset = this.state.tagOffset;
        let tagTimestamp = this.state.tagTimestamp;

        if (this.state.tagOffset !== -1) {
            const resp = await this.loadTags();
            tags = tags.concat(resp.data.data);
            tagOffset = resp.data.data.length === 0 ? -1 : resp.data.meta.offset;
            tagTimestamp = resp.data.meta.timestamp;
        }

        this.setState({ tags, tagOffset, tagTimestamp }, () => {
            if (loadAll && this.state.tagOffset !== -1) {
                this.loadMoreTags(true);
            }
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

    public loadMoreButtonClicked() {
        this.loadMoreTags(false);
    }

    public loadAllButtonClicked() {
        this.loadMoreTags(true);
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

    public render() {
        const tags = this.state.tags.map((tag: any) => {
            return <TagPreview key={tag.task.id} tag={tag} project_id={this.state.project.id}></TagPreview>;
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
                    {this.state.tagOffset !== -1 && <div style={{ textAlign: "center" }}>
                        <button className="actionButton greyButton" onClick={this.loadMoreButtonClicked}>
                            Load More
                        </button>
                        <div style={{width: 20, display: "inline-block"}}></div>
                        <button className="actionButton greyButton" onClick={this.loadAllButtonClicked}>
                            Load All
                        </button>
                    </div>}
                </div>
            </div>
        </div>;
    }
}

export default ProjectDetailView;
