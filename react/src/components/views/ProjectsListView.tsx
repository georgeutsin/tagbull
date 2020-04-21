import React, { Component } from "react";
import { NavBar, ProjectsList } from "../elements";

import "./portal.scss";

class ProjectsListView extends Component {
    public render() {
        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className="portalWrapper" style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Projects</h1></span>
                    <span className="actions">
                        <a href="/projects/new"><button className="actionButton">
                            New Project
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>

                <div className="mainCard">
                    <ProjectsList></ProjectsList>
                </div>
            </div>
        </div>;
    }
}

export default ProjectsListView;
