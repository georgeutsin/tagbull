import React, { Component } from "react";

interface IInputTurkIDProps {
    onIDChange: any;
    turkID: string;
}

class InputTurkID extends Component<IInputTurkIDProps> {
    constructor(props: IInputTurkIDProps) {
        super(props);
        this.onIDChange = this.onIDChange.bind(this);
    }

    public onIDChange(event: React.ChangeEvent<HTMLInputElement>)  {
        this.setState({ turkID: event.target.value });
        this.props.onIDChange(event.target.value);
    }

    public render() {
        return <div className="question"> Welcome to <b>TagBull</b>!
            <p>Enter your Mechanical Turk worker ID below so we can get you paid!</p>
            <div className="dropdownInputContainer">
                <input className="dropdownInput" type="text"
                       placeholder="Enter your MTurk ID"
                       value={this.props.turkID}
                       onChange={this.onIDChange}/>
            </div>
        </div>;
    }
}

export default InputTurkID;
