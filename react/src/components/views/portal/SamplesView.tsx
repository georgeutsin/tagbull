import React, { Component } from "react";
import { Backend } from "../../../utils";
import { NavBar, SamplePreview } from "../../elements";

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
            samples: [],
            sampleOffset: 0,
            sampleTimestamp: null,
        };
        this.loadMoreButtonClicked = this.loadMoreButtonClicked.bind(this);
        this.loadAllButtonClicked = this.loadAllButtonClicked.bind(this);
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

        this.loadMoreSamples();
    }

    public async loadSamples() {
        const projectId = this.params.projectId;
        const meta = { offset: this.state.sampleOffset, timestamp: this.state.sampleTimestamp };
        return await Backend.getAllSamples(projectId, meta);
    }

    public async loadMoreSamples(loadAll: boolean = false) {
        let samples = this.state.samples;
        let sampleOffset = this.state.sampleOffset;
        let sampleTimestamp = this.state.sampleTimestamp;

        if (this.state.sampleOffset !== -1) {
            const resp = await this.loadSamples();
            samples = samples.concat(resp.data.data);
            sampleOffset = resp.data.data.length === 0 ? -1 : resp.data.meta.offset;
            sampleTimestamp = resp.data.meta.timestamp;
        }

        this.setState({ samples, sampleOffset, sampleTimestamp }, () => {
            if (loadAll && this.state.sampleOffset !== -1) {
                this.loadMoreSamples(true);
            }
        });
    }

    public loadMoreButtonClicked() {
        this.loadMoreSamples(false);
    }

    public loadAllButtonClicked() {
        this.loadMoreSamples(true);
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
                    <span style={{ display: "inline-block" }}><h1>Project: {this.state.project.name}</h1></span>
                    <span className={portalStyles.actions}>
                        <a href={`/projects/${this.params.projectId}`}>
                            <button className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}>
                                Back
                            </button>
                        </a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className={portalStyles.mainCard}>
                    <div className={portalStyles.projectSection}>
                        <h2>Samples</h2>
                    </div>
                    <div
                        className={portalStyles.tagPreviews}
                        style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                        {samples}
                    </div>
                    {this.state.sampleOffset !== -1 && <div style={{ textAlign: "center" }}>
                        <button
                            className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}
                            onClick={this.loadMoreButtonClicked}>
                            Load More
                        </button>
                        <div style={{ width: 20, display: "inline-block" }}></div>
                        <button
                            className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}
                            onClick={this.loadAllButtonClicked}>
                            Load All
                        </button>
                    </div>}
                </div>
            </div>
        </div>;
    }
}

export default SamplesView;
