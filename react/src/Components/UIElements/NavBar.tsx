import React, { Component } from "react";

class NavBar extends Component<any, any> {
    private burgerRef: any;

    constructor(props: any) {
        super(props);
        this.state = {
            activeClass: "landing",
            menuOpen: "",
        };
        this.burgerRef = React.createRef();

        this.toggleBurger = this.toggleBurger.bind(this);
    }

    public componentDidMount() {
        window.addEventListener("scroll", () => {
            let activeClass = "landing";
            if (window.scrollY > 0) {
                activeClass = "";
            }
            this.setState({ activeClass });
        });
    }

    public toggleBurger() {
        this.setState({menuOpen: this.state.menuOpen === "" ? "menuOpen" : ""});
    }

    public render() {
        let activeClass = "";
        if (this.props.isLanding) {
            activeClass = this.state.activeClass;
        }

        const wrapper = this.props.isPortal ? "pageWrapper" : "bodyWrapper";
        const menuBarClasses = `menuBar ${ !this.props.isPortal && "runSlideIn"} ${activeClass} ${this.state.menuOpen}`;
        return <div className={menuBarClasses}>
        <div className={wrapper} >
            <div style={{ padding: "10px" }}>
                <div style={{display: "block", width: "170px"}}>
                <a href="/" className={activeClass} style={{width: "170px"}}>
                    <span className={`menuLogo ${ !this.props.isPortal && "runSlideIn"}`} style={{ }}></span>
                </a>
                </div>
                {this.props.children}
                <div className={`burgerContainer ${this.state.menuOpen}`}
                    ref={this.burgerRef}
                    onClick={this.toggleBurger}>
                    <div className="bar1"></div>
                    <div className="bar2"></div>
                    <div className="bar3"></div>
                </div>
            </div>
        </div>
    </div>;
    }
}

export default NavBar;
