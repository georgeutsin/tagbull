import React, { Component } from "react";
import { Backend } from "../../../utils";
import { ActorDetails, InfiniteList, PortalWrapper, SamplePreview } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";

class ActorView extends Component<any, any> {
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
        Backend.getActor(this.params.actorId).then((resp: any) => {
            const actor = resp.data.data;
            const stats = resp.data.stats;
            this.setState({ actor, stats });
        });
    }

    public renderElement(sample: any) {
        return <SamplePreview sample={sample}></SamplePreview>;
    }

    public async loadElements(meta: { offset: number, timestamp: number }) {
        return await Backend.getActorSamples(this.params.actorId, undefined, meta);
    }


    public render() {
        const samplesList = <InfiniteList
            isGrid={true}
            renderElement={this.renderElement}
            loadElements={this.loadElements}
            listType="samples">
        </InfiniteList>;

        const actions = <span className={portalStyles.actions}>
            <a href={`/actors`}>
                <button className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}>
                    Back
                </button>
            </a>
        </span>;

        return <PortalWrapper
            title={`Actor ID ${this.state.actor.id}`}
            actions={actions}>
            <ActorDetails
                actor={this.state.actor}
                stats={this.state.stats}>
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

export default ActorView;
