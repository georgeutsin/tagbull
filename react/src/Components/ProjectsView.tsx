import React, { Component } from "react";
import { NavBar, ProjectsListComponent } from "./UIElements";

class ProjectsView extends Component {
    public render() {
        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">Settings</a>
                </li>
            </NavBar>
            <div className="pageWrapper" style={{ minHeight: "100vh" }}>
                <div className="spaceAfter"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Projects</h1></span>
                    <span className="actions">
                        <a href="/projects/new"><button className="actionButton">
                            New Project
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>

                <ProjectsListComponent></ProjectsListComponent>
            </div>
        </div>;
    }
}

export default ProjectsView;
