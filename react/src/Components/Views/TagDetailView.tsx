import React, { Component } from "react";
import { Backend } from "../../Utils";
import { NavBar, SamplePreview } from "../UIElements";

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

        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className="pageWrapper" style={{ minHeight: "100vh" }}>
                <div className="spaceAfter"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Project: {this.state.project.name}</h1></span>
                    <span className="actions">
                        <a href={`/projects/${this.params.projectId}`}><button className="actionButton greyButton">
                            Back
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className="mainCard">
                    <div className="projectSection">
                        <h2>Samples</h2>
                    </div>
                    <div className="tagPreviews">
                        {samples}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default TagDetailView;
