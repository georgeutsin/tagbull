import React, { Component } from "react";
import { Backend } from "../../../utils";
import { PortalWrapper, SamplePreview } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class TagDetailView extends Component<any, any> {
    private params: any;

    constructor(props: any) {
        super(props);
        const { match: { params } } = this.props;
        this.params = params;
        this.state = {
            project: {
                name: "",
            },
            task: {
                type: "",
                task: {},
                media: {},
                samples: [],
            },
        };
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

        Backend.getSamples(this.params.projectId, this.params.taskId).then((resp: any) => {
            const task = resp.data.data;
            this.setState({ task });
        });
    }

    public render() {
        const samples = this.state.task.samples.map((sample: any) => {
            return <SamplePreview sample={sample}></SamplePreview>;
        });

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
            <div className={portalStyles.tagPreviews}>
                {samples}
            </div>
        </PortalWrapper>;
    }
}

export default TagDetailView;
