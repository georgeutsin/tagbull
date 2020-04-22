import React, { Component } from "react";
import { NavBar, ProjectsList } from "../elements";

import portalStyles from "../../styles/portal.module.scss";

class ProjectsListView extends Component {
    public render() {
        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className={portalStyles.portalWrapper} style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className={portalStyles.actionBar}>
                    <span style={{ display: "inline-block" }}><h1>Projects</h1></span>
                    <span className={portalStyles.actions}>
                        <a href="/projects/new"><button className={portalStyles.actionButton}>
                            New Project
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>

                <div className={portalStyles.mainCard}>
                    <ProjectsList></ProjectsList>
                </div>
            </div>
        </div>;
    }
}

export default ProjectsListView;
