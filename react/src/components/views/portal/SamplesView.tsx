import React, { Component } from "react";
import { Backend } from "../../../utils";
import { InfiniteList, PortalWrapper, SamplePreview } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class SamplesView extends Component<any, any> {
    private params: any;

    constructor(props: any) {
        super(props);
        const { match: { params } } = this.props;
        this.params = params;
        this.state = {
            project: {
                name: "",
            },
        };

        this.renderElement = this.renderElement.bind(this);
        this.loadElements = this.loadElements.bind(this);
    }

    public componentDidMount() {
        Backend.getProject(this.params.projectId).then((resp: any) => {
            const project = resp.data.data;
            this.setState({
                project: {
                    name: project.name,
                },
            });
        });
    }

    public renderElement(sample: any) {
        return <SamplePreview sample={sample}></SamplePreview>;
    }

    public async loadElements(meta: { offset: number, timestamp: number }) {
        const projectId = this.params.projectId;
        return await Backend.getProjectSamples(projectId, meta);
    }

    public render() {
        const samplesList = <InfiniteList
            isGrid={true}
            renderElement={this.renderElement}
            loadElements={this.loadElements}
            listType="samples">
        </InfiniteList>;

        const actions = <span className={portalStyles.actions}>
            <a href={`/projects/${this.params.projectId}`}>
                <button className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}>
                    Back
                </button>
            </a>
        </span>;

        return <PortalWrapper
            title={`Project: ${this.state.project.name}`}
            actions={actions}>
            <div className={portalStyles.projectSection}>
                <h2>Samples</h2>
            </div>
            {samplesList}
        </PortalWrapper>;
    }
}

export default SamplesView;
