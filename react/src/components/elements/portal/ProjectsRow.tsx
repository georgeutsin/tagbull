import React from "react";
import { ProgressBar } from "..";

import portalStyles from "../../../styles/portal.module.scss";
import styles from "./ProjectsRow.module.scss";

function ProjectsRow(props: any) {
    const project = props.project;
    const d = new Date(project.created_at.replace(" ", "T"));
    const createdAt = d.toLocaleString("en-us", { month: "long" })
        + " " + d.getDate() + ", " + d.getFullYear();
    const progress = project.completed_tasks * 100 / project.num_tasks;
    return <div key={project.id}>
        <a href={"/projects/" + project.id} className={portalStyles.tableLink}>
            <div className={portalStyles.tableRow}>
                <div className={`${styles.projectName} ${portalStyles.tableColumn}`}>
                    {project.name}
                </div>
                <div className={`${styles.projectProgress} ${portalStyles.tableColumn}`}>
                    <ProgressBar
                        progress={progress}
                        height={50}>
                        <div className={portalStyles.centeredProgress}>
                            <span>{project.completed_tasks} / {project.num_tasks}</span>
                        </div>
                    </ProgressBar>
                </div>
                <div className={`${styles.projectCreated} ${portalStyles.tableColumn}`}>
                    {createdAt}
                </div>
            </div>
        </a>
    </div>;
}

function ProjectsHeader(props: any) {
    return <div className={portalStyles.tableHeader}>
        <div className={`${styles.projectName} ${portalStyles.tableColumn}`}>Project Name</div>
        <div className={`${styles.projectProgress} ${portalStyles.tableColumn}`}>Progress</div>
        <div className={`${styles.projectCreated} ${portalStyles.tableColumn}`}>Created At</div>
    </div>;
}

export {
    ProjectsRow,
    ProjectsHeader,
};
