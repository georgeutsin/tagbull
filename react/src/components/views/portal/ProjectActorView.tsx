import React, { Component } from "react";
import { Backend } from "../../../utils";
import { NavBar, SamplePreview } from "../../elements";

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
            samples: [],
        };
    }

    public componentDidMount() {

        Backend.getActor(this.params.actorId, this.params.projectId).then((resp: any) => {
            const actor = resp.data.data;
            const stats = resp.data.stats;
            this.setState({ actor, stats });
        });
    }


    public render() {
        const samples = this.state.samples.map((sample: any) => {
            return <SamplePreview sample={sample}></SamplePreview>;
        });

        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className={portalStyles.portalWrapper} style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className={portalStyles.actionBar}>
                    <span style={{ display: "inline-block" }}><h1>Actor ID {this.state.actor.id}</h1></span>
                    <span className={portalStyles.actions}>
                        <a href={`/projects/${this.params.projectId}`}><button className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}>
                            Back
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className={portalStyles.mainCard}>
                    <div className={portalStyles.projectSection}>
                        <h2>Details</h2>
                        num_samples_for_project: {this.state.stats.num_samples_for_project} <br></br>
                        correct_samples_for_project: {this.state.stats.correct_samples_for_project} <br></br>
                    </div>
                    <div className={portalStyles.tagPreviews}>
                        {samples}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default ProjectActorView;
