import { saveAs } from "file-saver";
import Papa from "papaparse";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Backend, getAllInList } from "../../../utils";
import { ActorsHeader, ActorsRow, InfiniteList, PortalWrapper, ProgressBar, TagPreview } from "../../elements";

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
            selectedTab: 0,
        };
        this.pauseButtonClicked = this.pauseButtonClicked.bind(this);
        this.privateButtonClicked = this.privateButtonClicked.bind(this);
        this.tagsTabClicked = this.tagsTabClicked.bind(this);
        this.actorsTabClicked = this.actorsTabClicked.bind(this);
        this.deleteButtonClicked = this.deleteButtonClicked.bind(this);
        this.exportButtonClicked = this.exportButtonClicked.bind(this);

        this.renderTagElement = this.renderTagElement.bind(this);
        this.loadTagElements = this.loadTagElements.bind(this);
        this.renderActorElement = this.renderActorElement.bind(this);
        this.loadActorElements = this.loadActorElements.bind(this);
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

    public deleteButtonClicked() {
        Backend.deleteProject(this.params.projectId).then((resp: any) => {
            this.props.history.push("/projects");
        });
    }

    public tagsTabClicked() {
        this.setState({ selectedTab: 0 });
    }

    public actorsTabClicked() {
        this.setState({ selectedTab: 1 });
    }

    public exportButtonClicked() {
        getAllInList(this.loadTagElements).then((list: any) => {
            // TODO: this is only for locator
            const listForCSV = list.flatMap((e: any) => {
                const res: any = [];
                if (e.tag.too_many) {
                    return {
                        name: e.media.name,
                        url: e.media.url,
                        type: e.type,
                        category: e.task.category,
                        too_many: true,
                        x: 0,
                        y: 0,
                    };
                }
                e.tag.points.forEach((p: any) => {
                    res.push({
                        name: e.media.name,
                        url: e.media.url,
                        type: e.type,
                        category: e.task.category,
                        too_many: false,
                        x: p.x,
                        y: p.y,
                    });
                });
                return res;
            });
            const csv = Papa.unparse(listForCSV);
            const blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "export.csv");
        });
    }

    public setProjectState(resp: any) {
        const project = resp.data ? resp.data.data : null;
        if (project === null) { return; }
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

    public renderTagElement(tag: any) {
        return <TagPreview key={tag.task.id} tag={tag} project_id={this.state.project.id}></TagPreview>;
    }

    public async loadTagElements(meta: { offset: number, timestamp: number }) {
        const projectId = this.params.projectId;
        return await Backend.getTags(projectId, meta);
    }

    public renderActorElement(actor: any) {
        return <ActorsRow actor={actor} project_id={this.params.projectId}></ActorsRow>;
    }

    public async loadActorElements(meta: { offset: number, timestamp: number }) {
        const projectId = this.params.projectId;
        return Backend.getActors(projectId, meta);
    }

    public render() {
        const tagsList = <InfiniteList
            isGrid={true}
            renderElement={this.renderTagElement}
            loadElements={this.loadTagElements}
            listType="complete tags">
        </InfiniteList>;

        const actorsList = <InfiniteList
            listHeader={<ActorsHeader></ActorsHeader>}
            renderElement={this.renderActorElement}
            loadElements={this.loadActorElements}
            listType="actors">
        </InfiniteList>;

        const pauseButtonLabel = this.state.project.paused ? "Resume" : "Pause";
        const privateButtonLabel = this.state.project.is_private ? "Make Public" : "Make Private";
        const activityButton = this.state.project.paused ?
            <button className={portalStyles.disabledButton}>Go To Activities</button>
            :
            <a href={`/activities/turk?project_id=${this.params.projectId}`} target="_blank" rel="noopener noreferrer">
                <button className={portalStyles.actionButton}>Go To Activities</button>
            </a>;

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
                        <ProgressBar
                            progress={this.state.project.progress}
                            height={50}>
                            <div className={portalStyles.centeredProgress}>
                                <span>{this.state.project.completed_tasks} / {this.state.project.num_tasks}</span>
                            </div>
                        </ProgressBar>
                    </div>
                    <div className="thirds">
                        <h5>Actions</h5>
                        <a href={`/projects/${this.params.projectId}/samples`}>
                            <button className={portalStyles.actionButton}>View Raw Samples</button>
                        </a>
                        <button className={portalStyles.actionButton} onClick={this.pauseButtonClicked}>
                            {pauseButtonLabel}
                        </button>
                        <button className={portalStyles.actionButton} onClick={this.privateButtonClicked}>
                            {privateButtonLabel}
                        </button>
                        {activityButton}
                        <button className={`${portalStyles.actionButton} ${portalStyles.dangerButton}`}
                            onClick={this.deleteButtonClicked}>
                            Delete Project
                        </button>
                        <button className={portalStyles.actionButton} onClick={this.exportButtonClicked}>
                            Export as CSV
                        </button>
                    </div>
                    <div style={{ clear: "both" }}></div>
                </div>
            </div>
            <div style={{ height: "40px" }}></div>
            <div className={portalStyles.projectSection}>
                <h2 className={`${styles.firstTab} ${styles.tab} ${this.state.selectedTab === 0 && styles.selectedTab}`}
                    onClick={this.tagsTabClicked}>Tags</h2>
                <h2 className={`${styles.tab} ${this.state.selectedTab === 1 && styles.selectedTab}`}
                    onClick={this.actorsTabClicked}>Actors</h2>
            </div>
            {this.state.selectedTab === 0 && tagsList}
            {this.state.selectedTab === 1 && actorsList}
        </PortalWrapper>;
    }
}

export default withRouter(ProjectView);
