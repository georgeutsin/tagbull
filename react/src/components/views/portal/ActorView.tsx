import React, { Component } from "react";
import { Backend } from "../../../utils";
import { PortalWrapper, SamplePreview } from "../../elements";

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
            samples: [],
        };
    }

    public componentDidMount() {
        Backend.getActor(this.params.actorId).then((resp: any) => {
            const actor = resp.data.data;
            const stats = resp.data.stats;
            this.setState({ actor, stats });
        });
    }


    public render() {
        const samples = this.state.samples.map((sample: any) => {
            return <SamplePreview sample={sample}></SamplePreview>;
        });

        const actions = <span className={portalStyles.actions}>
            <a href={`/actors`}>
                <button className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}>
                    Back
                </button>
            </a>
        </span>;

        return <PortalWrapper
            title={`Actor: ${this.state.actor.id}`}
            actions={actions}>
            <div className={portalStyles.projectSection}>
                <h2>Details</h2>
            </div>
            <div className={portalStyles.tagPreviews}>
                {samples}
            </div>
        </PortalWrapper>;
    }
}

export default ActorView;
