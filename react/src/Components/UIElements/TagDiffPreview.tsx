import React, { Component } from "react";

class TagDiffPreview extends Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return <div>{this.props.tag1 ? this.props.tag1.media.name : "-"} : {this.props.tag2 ? this.props.tag2.media.name : "-"}</div>;
    }
}

export default TagDiffPreview;
