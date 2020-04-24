import React, { Component } from "react";
import { Backend } from "../../../utils";
import { InfiniteList, PortalWrapper, ProgressBar, TagPreview } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";
import styles from "./ProjectView.module.scss";

const taskTypes: { [key: string]: string; } = {
    BoundingBoxTask: "Bounding Box Given A Label",
    DichotomyTask: "Bounding Box and Metadata Given a Choice of Two Labels",
    MetadataTask: "Metadata Given a Bounding Box",
    LocatorTask: "Points Given a Label",
    DiscreteAttributeTask: "A Label Given a Bounding Box",
};

class ProjectView extends Component<any, any> {
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
                completed_tasks: 0,
                num_tasks: 0,
            },
        };
        this.pauseButtonClicked = this.pauseButtonClicked.bind(this);
        this.privateButtonClicked = this.privateButtonClicked.bind(this);

        this.renderElement = this.renderElement.bind(this);
        this.loadElements = this.loadElements.bind(this);
    }

    public componentDidMount() {
        Backend.getProject(this.params.projectId).then((resp: any) => {
            this.setProjectState(resp);
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
                completed_tasks: project.completed_tasks,
                num_tasks: project.num_tasks,
                task_type: taskTypes[project.task_type],
                created_at: d.toLocaleString("en-us", { month: "long" })
                    + " " + d.getDate() + ", " + d.getFullYear(),
            },
        });
    }

    public renderElement(tag: any) {
        return <TagPreview key={tag.task.id} tag={tag} project_id={this.state.project.id}></TagPreview>;
    }

    public async loadElements(meta: { offset: number, timestamp: number }) {
        const projectId = this.params.projectId;
        return await Backend.getTags(projectId, meta);
    }

    public render() {
        const tagsList = <InfiniteList
            isGrid={true}
            renderElement={this.renderElement}
            loadElements={this.loadElements}
            listType="complete tags">
        </InfiniteList>;

        const pauseButtonLabel = this.state.project.paused ? "Resume" : "Pause";
        const privateButtonLabel = this.state.project.is_private ? "Make Public" : "Make Private";

        const actions = <span className={portalStyles.actions}>
            <a href={`/projects`}>
                <button className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}>
                    Back
                </button>
            </a>
        </span>;

        return <PortalWrapper
            title={`Project: ${this.state.project.name}`}
            actions={actions}>
            <div className={portalStyles.projectSection}>
                <h2> Details</h2>
                <div className={styles.projectDetails}>
                    <div className="thirds">
                        <h5>Created At</h5> {this.state.project.created_at}
                        <h5>Status</h5> {this.state.project.status}, {this.state.project.is_private ? "is private" : "is public"}
                    </div>
                    <div className="thirds">
                        <h5>Progress</h5>
                        <ProgressBar progress={this.state.project.progress}
                            height={40}></ProgressBar>
                        {this.state.project.completed_tasks}/{this.state.project.num_tasks}
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
            <div className={portalStyles.projectSection}>
                <h2>Tags</h2>
            </div>
            {tagsList}
        </PortalWrapper>;
    }
}

export default ProjectView;
