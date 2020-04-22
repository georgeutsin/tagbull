import React from "react";
import { Backend } from "../../utils";
import ProgressBar from "./ProgressBar";

import portalStyles from "../../styles/portal.module.scss";
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


        Backend.getProjects().then((response: any) => {
            const newprojects: any[] = [];
            response.data.data.forEach((project: any) => {
                const d = new Date(project.created_at.replace(" ", "T"));
                newprojects.push({
                    name: project.name,
                    id: project.id,
                    progress: project.completed_tasks * 100 / project.num_tasks,
                    created_at: d.toLocaleString("en-us", { month: "long" })
                        + " " + d.getDate() + ", " + d.getFullYear(),
                });
            });
            this.setState({ projects: newprojects.concat(this.state.projects) });
        }).catch((error: any) => {
            // TODO handle error
        });
    }

    public render() {
        let header = null;
        let footer = null;
        let projectItems = <div className={portalStyles.lightText}>
            Oops, looks like you don't have any projects yet!
        </div>;
        if (this.state.projects.length > 0) {
            header = <div className={styles.projectTitleRow}>
                <div className={`${styles.projectName} ${styles.tableHeader}`}>Project Name</div>
                <div className={`${styles.projectProgress} ${styles.tableHeader}`}>Progress</div>
                <div className={`${styles.projectCreated} ${styles.tableHeader}`}>Created At</div>
            </div>;

            projectItems = this.state.projects.map((project: any) =>
                <div key={project.id}>
                    <a href={"/projects/" + project.id}><div className={styles.projectRow}>
                        <div className={`${styles.projectName} ${styles.tableBody}`}>
                            {project.name}
                            <span style={{ fontSize: "1.5em" }}>&nbsp;<b>›</b></span>
                        </div>
                        <div className={`${styles.projectProgress} ${styles.tableBody}`}>
                            <ProgressBar progress={project.progress} height={40}></ProgressBar>
                        </div>
                        <div className={`${styles.projectCreated} ${styles.tableBody}`}>
                            {project.created_at}
                        </div>
                    </div></a>
                    <div style={{ height: "20px" }}></div>
                </div> ,
            );

            footer = <div className={styles.tableFooter}>
                Showing {this.state.projects.length} of {this.state.projects.length} projects
            </div>;
        }

        return <div>
            {header}
            {projectItems}
            {footer}
        </div>;
    }
}

export default ProjectsList;
