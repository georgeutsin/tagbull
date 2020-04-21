import queryString from "query-string";
import React, { Component } from "react";
import { Backend } from "../../utils";
import { NavBar, TagDiffPreview } from "../elements";

import "./portal.scss";

class SamplesView extends Component<any, any> {
    constructor(props: any) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.state = {
            projectIds: [Number(values.project1), Number(values.project2)],
            projectList: [{ name: "" }, { name: "" }],
            tagsLists: [[], []],
            tagOffsets: [0, 0],
            tagTimestamps: [null, null],
        };
    }

    public componentDidMount() {
        this.loadProject(0);
        this.loadProject(1);

        // load all tags
        this.loadMoreTags(true);
    }

    public loadProject(idx: number) {
        const projectId = this.state.projectIds[idx];
        Backend.getProject(projectId).then((resp: any) => {
            const project = resp.data.data;
            const projectList = this.state.projectList;
            projectList[idx] = project;
            this.setState({ projectList });
        });
    }

    public async loadTags(idx: number) {
        const projectId = this.state.projectIds[idx];
        const meta = {
            offset: this.state.tagOffsets[idx],
            timestamp: this.state.tagTimestamps[idx],
            sort: "media_name",
        };
        return await Backend.getTags(projectId, meta);
    }


    public async loadMoreTags(loadAll: boolean = false) {
        const tagsLists = this.state.tagsLists;
        const tagOffsets = this.state.tagOffsets;
        const tagTimestamps = this.state.tagTimestamps;

        if (this.state.tagOffsets[0] !== -1) {
            const resp = await this.loadTags(0);
            tagsLists[0] = tagsLists[0].concat(resp.data.data);
            tagOffsets[0] = resp.data.data.length === 0 ? -1 : resp.data.meta.offset;
            tagTimestamps[0] = resp.data.meta.timestamp;
        }
        if (this.state.tagOffsets[1] !== -1) {
            const resp = await this.loadTags(1);
            tagsLists[1] = tagsLists[1].concat(resp.data.data);
            tagOffsets[1] = resp.data.data.length === 0 ? -1 : resp.data.meta.offset;
            tagTimestamps[1] = resp.data.meta.timestamp;
        }

        this.setState({ tagsLists, tagOffsets, tagTimestamps }, () => {
            if (loadAll && (this.state.tagOffsets[1] !== -1 || this.state.tagOffsets[0] !== -1)) {
                this.loadMoreTags(true);
            }
        });
    }

    public renderDiffs() {
        let idx0 = 0;
        let idx1 = 0;
        const tagDiffs = [];
        // "Loose zip" through the two tag lists
        // Images in one tag list may not be present in another, so perform a modified zip on the two lists
        for (; ;) {
            const tag0 = idx0 < this.state.tagsLists[0].length ? this.state.tagsLists[0][idx0] : null;
            const tag1 = idx1 < this.state.tagsLists[1].length ? this.state.tagsLists[1][idx1] : null;
            if (tag0 === null && tag1 === null) {
                break;
            }
            const key = "" + idx0 + "_" + idx1;
            if (tag0 && tag1 && tag0.media.name === tag1.media.name) {
                tagDiffs.push(<TagDiffPreview key={key} tag0={tag0} tag1={tag1}></TagDiffPreview>);
                idx0 += 1;
                idx1 += 1;
                continue;
            }

            if ((tag0 && tag1 && tag0.media.name < tag1.media.name) || tag1 === null) {
                tagDiffs.push(<TagDiffPreview key={key} tag0={tag0} tag1={null}></TagDiffPreview>);
                idx0 += 1;
                continue;
            }

            if ((tag0 && tag1 && tag0.media.name > tag1.media.name) || tag0 === null) {
                tagDiffs.push(<TagDiffPreview key={key} tag0={null} tag1={tag1}></TagDiffPreview>);
                idx1 += 1;
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
            <div className="portalWrapper" style={{ minHeight: "100vh" }}>
                <div className="spacer"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Project1: {this.state.projectList[0].name}
                        <br></br> Project2: {this.state.projectList[1].name}</h1></span>
                    <div style={{ clear: "both" }}></div>
                </div>
                <div className="mainCard">
                    <div className="projectSection">
                        <h2>Samples</h2>
                    </div>
                    <div className="tagPreviews" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                        {tagDiffs}
                    </div>
                </div>
            </div>
        </div>;
    }
}

export default SamplesView;
