import queryString from "query-string";
import React, { Component } from "react";
import { Backend } from "../../Utils";
import { NavBar, TagDiffPreview } from "../UIElements";


class SamplesView extends Component<any, any> {
    private projectId1: number;
    private projectId2: number;
    private idx1: number;
    private idx2: number;

    constructor(props: any) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.projectId1 = Number(values.project1);
        this.projectId2 = Number(values.project2);
        this.state = {
            project1: {
                name: "",
            },
            project2: {
                name: "",
            },
            tags1: [],
            tags2: [],
        };
        this.idx1 = 0;
        this.idx2 = 0;
    }

    public componentDidMount() {
        Backend.getProject(this.projectId1).then((resp: any) => {
            const project = resp.data.data;
            this.setState({
                project1: {
                    name: project.name,
                },
            });
        });
        Backend.getProject(this.projectId2).then((resp: any) => {
            const project = resp.data.data;
            this.setState({
                project2: {
                    name: project.name,
                },
            });
        });

        this.loadTags1();
        this.loadTags2();
    }


    public loadTags1() {
        Backend.getTags(this.projectId1).then((resp: any) => {
            const newList = this.state.tags1.concat(resp.data.data);
            console.log(newList);
            this.setState({ tags1: newList });
        });
    }

    public loadTags2() {
        Backend.getTags(this.projectId2).then((resp: any) => {
            this.setState({ tags2: this.state.tags2.concat(resp.data.data) });
        });
    }

    public renderDiffs() {
        const tagDiffs = [];
        // "Loose zip" through the two tag lists
        // Images in one tag list may not be present in another, so perform a modified zip on the two lists
        // Further, pagination means that we need to keep track of indexes individually
        for (;;) {
            if (this.idx1 >= this.state.tags1.length) {
                break; // TODO REMOVE AFTER PAGINATION MERGED IN
                this.loadTags1();
            }
            if (this.idx2 >= this.state.tags2.length) {
                break; // TODO REMOVE AFTER PAGINATION MERGED IN
                this.loadTags2();
            }
            const tag1 = this.idx1 < this.state.tags1.length ? this.state.tags1[this.idx1] : null;
            const tag2 = this.idx2 < this.state.tags2.length ? this.state.tags2[this.idx2] : null;

            if (tag1 === null && tag2 === null) {
                break;
            }

            if (tag1 && tag2 && tag1.media.name === tag2.media.name) {
                tagDiffs.push(<TagDiffPreview tag1={tag1} tag2={tag2}></TagDiffPreview>);
                this.idx1 += 1;
                this.idx2 += 1;
                continue;
            }

            if ((tag1 && tag2 && tag1.media.name < tag2.media.name) || tag1 === null) {
                tagDiffs.push(<TagDiffPreview tag1={null} tag2={tag2}></TagDiffPreview>);
                this.idx1 += 1;
                continue;
            }

            if ((tag1 && tag2 && tag1.media.name > tag2.media.name) || tag2 === null) {
                tagDiffs.push(<TagDiffPreview tag1={tag1} tag2={null}></TagDiffPreview>);
                this.idx2 += 1;
                continue;
            }
        }
        return tagDiffs;
    }

    public render() {
        const tagDiffs = this.renderDiffs();

        return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className="pageWrapper" style={{ minHeight: "100vh" }}>
                <div className="spaceAfter"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Project1: {this.state.project1.name} Project2: {this.state.project2.name}</h1></span>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className="mainCard">
                    <div className="projectSection">
                        <h2>Samples</h2>
                    </div>
                    <div className="tagPreviews" style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
                        {tagDiffs}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default SamplesView;
