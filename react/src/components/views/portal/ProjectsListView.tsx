import React, { Component } from "react";
import { Backend } from "../../../utils";
import { InfiniteList, PortalWrapper, ProjectsHeader, ProjectsRow } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class ProjectsListView extends Component {
    constructor(props: any) {
        super(props);
        this.renderElement = this.renderElement.bind(this);
        this.loadElements = this.loadElements.bind(this);
    }

    public renderElement(project: any) {
        return <ProjectsRow project={project}></ProjectsRow>;
    }

    public async loadElements(meta: { offset: number, timestamp: number }) {
        return Backend.getProjects(meta);
    }

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
            <InfiniteList
                renderElement={this.renderElement}
                loadElements={this.loadElements}
                listHeader={<ProjectsHeader></ProjectsHeader>}
                listType="projects">
            </InfiniteList>
        </PortalWrapper>;
    }
}

export default ProjectsListView;
