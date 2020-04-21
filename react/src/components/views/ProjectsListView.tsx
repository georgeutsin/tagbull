import React, { Component } from "react";
import { NavBar, ProjectsList } from "../elements";

class ProjectsListView extends Component {
    public render() {
        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
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

                <ProjectsList></ProjectsList>
            </div>
        </div>;
    }
}

export default ProjectsListView;
