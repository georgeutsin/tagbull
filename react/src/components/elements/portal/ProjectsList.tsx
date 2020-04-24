import React from "react";
import { Backend } from "../../../utils";
import {InfiniteList, ProgressBar} from "../../elements";

import styles from "./ProjectsList.module.scss";

interface IProjectsListState {
    projects: any;
}

// tslint:disable-next-line: no-empty-interface
interface IProjectsListProps {
}

class ProjectsList extends React.Component<IProjectsListProps, IProjectsListState> {

    constructor(props: any) {
        super(props);

        this.state = {
            projects: [],
        };

        this.renderElement = this.renderElement.bind(this);
        this.loadElements = this.loadElements.bind(this);
    }

    public renderElement(project: any) {
        const d = new Date(project.created_at.replace(" ", "T"));
        const createdAt = d.toLocaleString("en-us", { month: "long" })
        + " " + d.getDate() + ", " + d.getFullYear();
        const progress = project.completed_tasks * 100 / project.num_tasks;
        return <div key={project.id}>
            <a href={"/projects/" + project.id}><div className={styles.projectRow}>
                <div className={`${styles.projectName} ${styles.tableBody}`}>
                    {project.name}
                    <span style={{ fontSize: "1.5em" }}>&nbsp;<b>›</b></span>
                </div>
                <div className={`${styles.projectProgress} ${styles.tableBody}`}>
                    <ProgressBar progress={progress} height={40}></ProgressBar>
                </div>
                <div className={`${styles.projectCreated} ${styles.tableBody}`}>
                    {createdAt}
                </div>
            </div></a>
            <div style={{ height: "20px" }}></div>
        </div>;
    }

    public async loadElements(meta: { offset: number, timestamp: number }) {
        return Backend.getProjects(meta);
    }

    public render() {
        const header = <div className={styles.projectTitleRow}>
            <div className={`${styles.projectName} ${styles.tableHeader}`}>Project Name</div>
            <div className={`${styles.projectProgress} ${styles.tableHeader}`}>Progress</div>
            <div className={`${styles.projectCreated} ${styles.tableHeader}`}>Created At</div>
        </div>;

        return <InfiniteList
            renderElement={this.renderElement}
            loadElements={this.loadElements}
            listHeader={header}
            listType="projects">
        </InfiniteList>;
    }
}

export default ProjectsList;
