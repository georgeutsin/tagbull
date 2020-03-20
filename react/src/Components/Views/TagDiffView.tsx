import queryString from "query-string";
import React, { Component } from "react";
import { Backend } from "../../Utils";
import { NavBar, TagDiffPreview } from "../UIElements";


class SamplesView extends Component<any, any> {
    constructor(props: any) {
        super(props);
        const values = queryString.parse(this.props.location.search);
        this.state = {
            projectIds: [Number(values.project1), Number(values.project2)],
            projectList: [{ name: "" }, { name: "" }],
            tagsLists: [[], []],
        };
    }

    public componentDidMount() {
        this.loadProject(0);
        this.loadProject(1);

        this.loadTags(0);
        this.loadTags(1);
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

    public loadTags(idx: number) {
        const projectId = this.state.projectIds[idx];
        Backend.getTags(projectId).then((resp: any) => {
            const newTags = resp.data.data;
            const tagsLists = this.state.tagsLists;
            tagsLists[idx] = tagsLists[idx].concat(newTags);
            console.log(tagsLists);
            this.setState({ tagsLists });
        });
    }

    public renderDiffs() {
        let idx0 = 0;
        let idx1 = 0;
        const tagDiffs = [];
        // "Loose zip" through the two tag lists
        // Images in one tag list may not be present in another, so perform a modified zip on the two lists
        for (; ;) {
            if (idx0 >= this.state.tagsLists[0].length) { // change length to offset in state when pagination merged in
                break; // TODO REMOVE AFTER PAGINATION MERGED IN
                this.loadTags(0);
            }
            if (idx1 >= this.state.tagsLists[1].length) { // change length to offset in state when pagination merged in
                break; // TODO REMOVE AFTER PAGINATION MERGED IN
                this.loadTags(1);
            }

            const tag0 = idx0 < this.state.tagsLists[0].length ? this.state.tagsLists[0][idx0] : null;
            const tag1 = idx1 < this.state.tagsLists[1].length ? this.state.tagsLists[1][idx1] : null;
            if (tag0 === null && tag1 === null) {
                break;
            }

            if (tag0 && tag1 && tag0.media.name === tag1.media.name) {
                tagDiffs.push(<TagDiffPreview key={tag0.task.id + "_" + tag1.task.id} tag0={tag0} tag1={tag1}></TagDiffPreview>);
                idx0 += 1;
                idx1 += 1;
                continue;
            }

            if ((tag0 && tag1 && tag0.media.name < tag1.media.name) || tag1 === null) {
                tagDiffs.push(<TagDiffPreview key={tag0.task.id + "_"}  tag0={tag0} tag1={null}></TagDiffPreview>);
                idx0 += 1;
                continue;
            }

            if ((tag0 && tag1 && tag0.media.name > tag1.media.name) || tag0 === null) {
                tagDiffs.push(<TagDiffPreview key={"_" + tag1.task.id}tag0={null} tag1={tag1}></TagDiffPreview>);
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
            <div className="pageWrapper" style={{ minHeight: "100vh" }}>
                <div className="spaceAfter"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Project1: {this.state.projectList[0].name} Project2: {this.state.projectList[1].name}</h1></span>
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
