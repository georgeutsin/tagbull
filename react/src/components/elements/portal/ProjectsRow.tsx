import React from "react";
import { ProgressBar } from "..";

import styles from "./ProjectsRow.module.scss";

function ProjectsRow(props: any) {
    const project = props.project;
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

function ProjectsHeader(props: any) {
    return <div className={styles.projectTitleRow}>
        <div className={`${styles.projectName} ${styles.tableHeader}`}>Project Name</div>
        <div className={`${styles.projectProgress} ${styles.tableHeader}`}>Progress</div>
        <div className={`${styles.projectCreated} ${styles.tableHeader}`}>Created At</div>
    </div>;
}

export {
    ProjectsRow,
    ProjectsHeader,
};
