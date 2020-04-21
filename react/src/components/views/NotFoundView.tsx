import React from "react";
import { NavBar } from "../elements";
function NotFoundView() {
    return <div>
            <NavBar isPortal>
                <li>
                    <a href="/about">About Us</a>
                </li>
            </NavBar>
            <div className="spacer"></div>
            <div className="pageWrapper" style={{ textAlign: "center" }}>
                <h1>404</h1>
                Sorry, we couldn't find the page you're looking for
            </div>
        </div>;
}

export default NotFoundView;