import React, { Component } from "react";
import { Backend } from "../../../utils";
import { ActorDetails, InfiniteList, PortalWrapper, SamplePreview } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class ProjectActorView extends Component<any, any> {
    private params: any;

    constructor(props: any) {
        super(props);
        const { match: { params } } = this.props;
        this.params = params;
        this.state = {
            actor: {
                id: 0,
            },
            stats: {},
        };
        this.renderElement = this.renderElement.bind(this);
        this.loadElements = this.loadElements.bind(this);
    }

    public componentDidMount() {

        Backend.getActor(this.params.actorId, this.params.projectId).then((resp: any) => {
            const actor = resp.data.data;
            const stats = resp.data.stats;
            this.setState({ actor, stats });
        });
    }


    public renderElement(sample: any) {
        return <SamplePreview sample={sample} project_id={this.params.projectId}></SamplePreview>;
    }

    public async loadElements(meta: { offset: number, timestamp: number }) {
        return await Backend.getActorSamples(this.params.actorId, this.params.projectId, meta);
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
            title={`Actor ID ${this.state.actor.id} (in Project ${this.params.projectId})`}
            actions={actions}>
            <ActorDetails
                actor={this.state.actor}
                stats={this.state.stats}
                project_id={this.params.projectId}>
            </ActorDetails>
            <div className={portalStyles.projectSection}>
                <h2>Samples</h2>
                <div className={portalStyles.tagPreviews}>
                    {samplesList}
                </div>
            </div>
        </PortalWrapper>;
    }
}

export default ProjectActorView;
