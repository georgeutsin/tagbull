import React, { Component } from "react";

import portalStyles from "../../../styles/portal.module.scss";
import styles from "./InfiniteList.module.scss";

class InfiniteList extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            list: [],
            listOffset: 0,
            listTimestamp: null,
            listTotalCount: -1,
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
        let listTotalCount = this.state.listTotalCount;

        if (this.state.listOffset !== -1) {
            const resp = await this.props.loadElements({
                offset: this.state.listOffset,
                timestamp: this.state.listTimestamp,
            });
            list = list.concat(resp.data.data);
            const meta = resp.data.meta ? resp.data.meta : { offset: -1, total_count: -1 };
            listOffset = resp.data.data.length === 0 ? -1 : meta.offset;
            listTimestamp = meta.timestamp;
            listTotalCount = meta.total_count;
        }

        this.setState({ list, listOffset, listTimestamp, listTotalCount }, () => {
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
        if (this.state.listTotalCount === 0) {
            return <div className={portalStyles.lightText}>
                Looks like you don't have {this.props.listType ? `any ${this.props.listType}` : `anything here`} yet!
            </div>;
        }

        let list = this.state.list.map(this.props.renderElement);
        if (this.props.isGrid) {
            list = <div className={portalStyles.tagPreviews}
                style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                {list}
            </div>;
        }

        const listCount = this.state.listTotalCount === -1 || this.state.listTotalCount === undefined ? "" : `of ${this.state.listTotalCount}`;
        const listOffset = this.state.listOffset === -1 ? "all" : this.state.listOffset;
        const listType = this.props.listType ?? "";
        const shouldShowLoadMore = this.state.listOffset !== -1 && this.state.listTotalCount !== this.state.list.length;
        const listFooter = <div className={styles.listFooter}>
            <div>{`Showing ${listOffset} ${listCount} ${listType}`}</div>
            {shouldShowLoadMore && <div style={{ textAlign: "center", paddingTop: 20 }}>
                <button
                    className={`${portalStyles.actionButton}`}
                    onClick={this.loadMoreButtonClicked}>
                    Load More
                </button>
                <div style={{ width: 20, display: "inline-block" }}></div>
                <button
                    className={`${portalStyles.actionButton}`}
                    onClick={this.loadAllButtonClicked}>
                    Load All
                </button>
            </div>}
        </div>;

        return <div>
            {this.props.listHeader}
            {list}
            {listFooter}
        </div>;
    }
}

export default InfiniteList;
