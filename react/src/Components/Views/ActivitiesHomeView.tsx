import React from "react";
import { Backend, UnityEvent } from "../../Utils";
import { ProgressBarComponent } from "../UIElements";
import ActivitiesComponent from "./ActivitiesComponent";

interface IActivitiesHomeViewState {
    progressIndicator: number;
    completedActivityCounter: number;
    numActivities: number;
    deviceId: string;
    waitingOnPost: boolean;
    email: string;
}

class ActivitiesHomeView extends React.Component<any, IActivitiesHomeViewState> {
    private bgRef: any;
    private cancelRef: any;
    constructor(props: any) {
        super(props);


        // fetching device ID, first try query string, try localStorage and default to random
        const N = 30;
        // tslint:disable-next-line: max-line-length
        const randId = "web" + Array(N + 1).join((Math.random().toString(36) + "00000000000000000").slice(2, 18)).slice(0, N);
        let queryDeviceId = localStorage.getItem("deviceID");
        queryDeviceId = queryDeviceId || randId;

        if (queryDeviceId === randId) {
            localStorage.setItem("deviceID", queryDeviceId);
        }

        // Don't call this.setState() here!
        this.state = {
            progressIndicator: 1,
            completedActivityCounter: 0,
            // TODO: load number of activities in the current session dynamically from the BE, based on user trust
            numActivities: 3,
            deviceId: queryDeviceId,
            waitingOnPost: false,
            email: "",
        };

        // Bindings.
        this.doneActivity = this.doneActivity.bind(this);
        this.activitySource = this.activitySource.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.bgRef = React.createRef();
        this.cancelRef = React.createRef();
    }

    public handleChange(e: any) {
        this.setState({ email: e.target.value });
    }

    public cancel(event: any) {
        if (!this.bgRef.current.contains(event.target) || this.cancelRef.current.contains(event.target)) {
            window.dispatchEvent(new UnityEvent("tagbull", {
                detail: "cancel",
            }));
        }
    }

    public doneActivity(data: any) {
        this.postSample(data, () => {
            let counter = this.state.completedActivityCounter;

            // Increment the counter if we haven't finished the last planned activity yet.
            // This has the side effect of unmounting and remounting the ActivitiesComponent
            // since the component takes the counter as the key prop.
            if (this.state.completedActivityCounter < this.state.numActivities) {
                counter += 1;
            }

            this.setState({
                progressIndicator: this.state.progressIndicator + 1,
                completedActivityCounter: counter,
                waitingOnPost: false,
            });
        });
    }

    public render() {
        let activities = <ActivitiesComponent
            key={this.state.completedActivityCounter}
            doneActivityCallback={this.doneActivity}
            activityPromise={this.activitySource}
            disabled={this.state.completedActivityCounter >= this.state.numActivities
                || this.state.waitingOnPost}>
        </ActivitiesComponent>;

        const validateForm = () => {
            // eslint-disable-next-line
            const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
            return validEmailRegex.test(this.state.email);
        };

        const handleSubmit = (e: any) => {
            if (!validateForm()) {
                e.preventDefault();
                alert("Please enter an email");
            }
        };

        if (this.state.completedActivityCounter === this.state.numActivities) {
            activities = <div>
                <div className="promoSection"
                    style={{ textAlign: "center", backgroundColor: "white", margin: "10px" }}>
                    <div
                        style={{ fontWeight: 100, fontSize: "2.5em", paddingBottom: "40px" }}>
                        Like what you see?
                    </div>
                    <div>
                        Put your dataset here instead. Let's get in touch:
                        <div className="login" style={{ width: "100%", maxWidth: "400px", margin: "auto", paddingTop: "30px" }}>
                            <form
                                name="contact-demo"
                                method="POST"
                                data-netlify="true"
                                netlify-honeypot="bot-field"
                                ref="form-top"
                                onSubmit={handleSubmit}>
                                <input type="hidden" name="form-name" value="contact-demo" />
                                <input
                                    type="text"
                                    placeholder="you@email.com"
                                    name="email"
                                    onChange={this.handleChange} />

                                <button type="submit" style={{ marginTop: "20px", backgroundColor: "#6600ff" }}>
                                    Email Me
                                    </button>
                            </form>
                        </div>
                    </div>
                    <div style={{ clear: "both" }}></div>
                    <div className="spaceAfter"></div>
                </div>
            </div>;
        }
        const progressBarHeight = 50;

        return <div className="goodJobBackground" onClick={this.cancel} >
            <div className="both-center" style={{ height: "80%", width: "80%", backgroundColor: "white", borderRadius: "10px" }} ref={this.bgRef}>
                <ProgressBarComponent
                    progress={this.state.progressIndicator / this.progressDivisor() * 100}>
                    <div className="cancelActivities" onClick={this.cancel} ref={this.cancelRef}>
                        Cancel
                </div>
                </ProgressBarComponent>
                <div style={{ height: `calc(100% - ${progressBarHeight + 2 * 10}px)`, padding: "10px" }}>
                    {activities}
                </div>
            </div>
        </div>
            ;
    }

    private progressDivisor() {
        return this.state.numActivities + 1;
    }

    private activitySource() {
        return Backend.getActivity(this.state.deviceId);
    }

    private postSample(data: any, callback: any) {
        data.actor_sig = this.state.deviceId;
        this.setState(({ waitingOnPost: true }));
        Backend.postSample(data).then((response: any) => {
            // TODO handle successs
            callback();
        }).catch((error: any) => {
            // TODO handle error
            callback();
        });
    }
}

export default ActivitiesHomeView;
