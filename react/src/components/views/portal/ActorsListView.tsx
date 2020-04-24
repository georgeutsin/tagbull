import React, { Component } from "react";
import { Backend } from "../../../utils";
import { ActorsHeader, ActorsRow, InfiniteList, PortalWrapper } from "../../elements";

class ActorsListView extends Component {
    constructor(props: any) {
        super(props);
        this.renderElement = this.renderElement.bind(this);
        this.loadElements = this.loadElements.bind(this);
    }

    public renderElement(actor: any) {
        return <ActorsRow actor={actor}></ActorsRow>;
    }

    public async loadElements(meta: { offset: number, timestamp: number }) {
        return Backend.getActors(undefined, meta);
    }
    public render() {
        return <PortalWrapper
            title={`Actors`}
            actions={null}>
            <InfiniteList
                renderElement={this.renderElement}
                loadElements={this.loadElements}
                listHeader={<ActorsHeader></ActorsHeader>}
                listType="actors">
            </InfiniteList>
        </PortalWrapper>;
    }
}

export default ActorsListView;
