import React from "react";
import { NavBar } from "../elements";

import pageStyles from "../../styles/page.module.scss";

function NotFoundView() {
    return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className="spacer"></div>
            <div className={pageStyles.pageWrapper} style={{ textAlign: "center" }}>
                <h1>404</h1>
                Sorry, we couldn't find the page you're looking for
            </div>
        </div>;
}

export default NotFoundView;
