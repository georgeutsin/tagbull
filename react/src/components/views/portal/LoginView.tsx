import React, { Component } from "react";
import { LoginForm, PortalWrapper } from "../../elements";

class LoginView extends Component {
    public render() {
        return <PortalWrapper
            actions={null}
            maxWidth={400}>
                <LoginForm></LoginForm>
        </PortalWrapper>;
    }
}

export default LoginView;
