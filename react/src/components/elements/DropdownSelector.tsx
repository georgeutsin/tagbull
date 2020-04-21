import React, { Component } from "react";

interface IDropdownSelectorState {
    input: string;
    filteredOptions: any;
    optionsVisible: boolean;
}

interface IDropdownSelectorProps {
    onInputChange: any;
    validate?: boolean;
    placeHolder?: string;
    options: any;
}

class DropdownSelector extends Component<IDropdownSelectorProps, IDropdownSelectorState> {
    public static defaultProps = {
        validate: false,
        placeHolder: "Select option...",
    };

    private dropdownInputRef = React.createRef<HTMLInputElement>();
    private dropdownInputMenuRef = React.createRef<HTMLDivElement>();

    constructor(props: any) {
        super(props);
        this.state = {
            input: "",
            filteredOptions: this.props.options,
            optionsVisible: false,
        };

        this.onInputLoseFocus = this.onInputLoseFocus.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputClick = this.onInputClick.bind(this);
        this.onOptionClick = this.onOptionClick.bind(this);
    }

    public componentWillMount() {
        window.addEventListener("mousedown", this.onInputLoseFocus, false);
    }

    public componentWillUnmount() {
        window.removeEventListener("mousedown", this.onInputLoseFocus, false);
    }

    public onInputLoseFocus(event: any) {
        if (this.state.optionsVisible) {
            const inputBox = this.dropdownInputRef.current;
            const optionBox = this.dropdownInputMenuRef.current;

            if ((inputBox && inputBox.contains(event.target)) ||
                (optionBox && optionBox.contains(event.target))) {
                return;
            }

            this.setState({ optionsVisible: false });
        }
    }

    public onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        let filterOptions = [];

        const inputString = event.target.value.toLowerCase();

        if (event.target.value === "") {
            filterOptions = this.props.options;
        } else {
            for (const option of this.props.options) {
                const optionString = option.value.toLowerCase();
                if (optionString.indexOf(inputString) !== -1) {
                    filterOptions.push(option);
                }
            }
        }

        this.setState({
            input: event.target.value,
            filteredOptions: filterOptions,
        });

        this.props.onInputChange(event.target.value);
    }

    public onInputClick() {
        this.setState({ optionsVisible: true, filteredOptions: this.props.options });
    }

    public onOptionClick(event: React.MouseEvent<HTMLDivElement>) {
        this.setState({ optionsVisible: false, input: event.currentTarget.innerText });
        this.props.onInputChange(event.currentTarget.innerText);
    }

    public render() {
        const optionsList = this.state.filteredOptions.map((option: any) => {
            return (<div key={option.value} className="dropdownInputOption"
                onClick={(e) => this.onOptionClick(e)}> {option.value} </div>);
        });

        return <div className="dropdownInputContainer">
            <input ref={this.dropdownInputRef} className="dropdownInput" type="text"
                placeholder={this.props.placeHolder}
                value={this.state.input}
                onClick={this.onInputClick}
                onChange={this.onInputChange} />
            {this.state.optionsVisible &&
                <div ref={this.dropdownInputMenuRef} className="dropdownInputMenu">
                    {optionsList}
                </div>
            }
            <div style={{ height: "3em" }}></div>
        </div>;
    }
}

export default DropdownSelector;
