import React, { Component } from "react";

import portalStyles from "../../../styles/portal.module.scss";

class InfiniteList extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            listOffset: 0,
            listTimestamp: null,
        };
        this.loadMoreButtonClicked = this.loadMoreButtonClicked.bind(this);
        this.loadAllButtonClicked = this.loadAllButtonClicked.bind(this);
    }

    public componentDidMount() {
        this.loadMoreElements();
    }

    public async loadMoreElements(loadAll: boolean = false) {
        let list = this.state.list;
        let listOffset = this.state.listOffset;
        let listTimestamp = this.state.listTimestamp;

        if (this.state.listOffset !== -1) {
            const resp = await this.props.loadElements({
                offset: this.state.listOffset,
                timestamp: this.state.listTimestamp,
            });
            list = list.concat(resp.data.data);
            listOffset = resp.data.data.length === 0 ? -1 : resp.data.meta.offset;
            listTimestamp = resp.data.meta.timestamp;
        }

        this.setState({ list, listOffset, listTimestamp }, () => {
            if (loadAll && this.state.listOffset !== -1) {
                this.loadMoreElements(true);
            }
        });
    }

    public loadMoreButtonClicked() {
        this.loadMoreElements(false);
    }

    public loadAllButtonClicked() {
        this.loadMoreElements(true);
    }

    public render() {
        let list = this.state.list.map(this.props.renderElement);
        if (this.props.isGrid) {
            list = <div className={portalStyles.tagPreviews}
                style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                {list}
            </div>;
        }
        return <div>
            {list}
            {this.state.listOffset !== -1 && <div style={{ textAlign: "center" }}>
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
        </div>;
    }
}

export default InfiniteList;
