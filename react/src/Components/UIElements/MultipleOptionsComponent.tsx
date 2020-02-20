import React, { Component } from "react";
import "./MultipleOptions.css";

interface IMultipleOptionsState {
    selectedOption: number;
}

interface IMultipleOptionsProps {
    onLabelChange: any;
    options: string[];
}

class MultipleOptionsComponent extends Component<IMultipleOptionsProps, IMultipleOptionsState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedOption: -1,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    public handleClick(idx: number) {
        this.setState({ selectedOption: idx });
        this.props.onLabelChange(this.props.options[idx]);
    }

    public render() {
        const buttonsList: JSX.Element[] = [];
        this.props.options.forEach((option, i) => {
            let className = "optionButton";
            if (this.state.selectedOption === i) {
                className += " selected";
            }
            const btn =
                <div key={i} className={className} style={{ width: 99 / this.props.options.length + "%" }}>
                    <button onClick={() => this.handleClick(i)}>{option}</button>
                </div>;
            buttonsList.push(btn);
        });
        return <div className="multipleOptionsContainer">
            {buttonsList}
        </div>;
    }
}

export default MultipleOptionsComponent;
