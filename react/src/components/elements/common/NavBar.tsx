import React, { Component } from "react";

import pageStyles from "../../../styles/page.module.scss";
import portalStyles from "../../../styles/portal.module.scss";
import styles from "./NavBar.module.scss";

class NavBar extends Component<any, any> {
    private burgerRef: any;

    constructor(props: any) {
        super(props);
        this.state = {
            activeClass: styles.landing,
            menuOpen: "",
        };
        this.burgerRef = React.createRef();

        this.toggleBurger = this.toggleBurger.bind(this);
    }

    public componentDidMount() {
        window.addEventListener("scroll", () => {
            let activeClass = styles.landing;
            if (window.scrollY > 0) {
                activeClass = "";
            }
            this.setState({ activeClass });
        });
    }

    public toggleBurger() {
        this.setState({menuOpen: this.state.menuOpen === "" ? styles.menuOpen : ""});
    }

    public render() {
        let activeClass = "";
        if (this.props.isLanding) {
            activeClass = this.state.activeClass;
        }

        const wrapper = this.props.isPortal ? portalStyles.portalWrapper : pageStyles.pageWrapper;
        const menuBarClasses = `${styles.menuBar} ${ !this.props.isPortal && "runSlideIn"} ${activeClass} ${this.state.menuOpen}`;
        return <div className={menuBarClasses}>
        <div className={wrapper} >
            <div style={{ padding: "10px" }}>
                <div style={{display: "block", width: "170px"}}>
                <a href="/" className={activeClass} style={{width: "170px"}}>
                    <span className={`${styles.menuLogo} ${ !this.props.isPortal && "runSlideIn"}`} style={{ }}></span>
                </a>
                </div>
                {this.props.children}
                <div className={`${styles.burgerContainer} ${this.state.menuOpen}`}
                    ref={this.burgerRef}
                    onClick={this.toggleBurger}>
                    <div className={styles.bar1}></div>
                    <div className={styles.bar2}></div>
                    <div className={styles.bar3}></div>
                </div>
            </div>
        </div>
    </div>;
    }
}

export default NavBar;
