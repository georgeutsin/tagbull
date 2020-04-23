import React, { Component } from "react";
import { PortalWrapper, ProjectsList } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class ProjectsListView extends Component {
    public render() {
        const actions = <span className={portalStyles.actions}>
            <a href="/projects/new">
                <button className={portalStyles.actionButton}>
                    New Project
                </button>
            </a>
        </span>;
        return <PortalWrapper
            title={`Projects`}
            actions={actions}>
            <ProjectsList></ProjectsList>
        </PortalWrapper>;
    }
}

export default ProjectsListView;
