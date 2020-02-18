import React from "react";
import { Backend } from "../Utils";
import ActivitiesComponent from "./ActivitiesComponent";
import { BigButtonComponent, InputTurkID, ProgressBarComponent } from "./UIElements";

enum TurkViewStage {
    INPUT_TURK_ID = 0,
    ACTIVITIES = 1,
    COMPLETE = 2,
}

interface IActivitiesTurkViewState {
    currentStage: number;
    progressIndicator: number;
    completedActivityCounter: number;
    numActivities: number;
    deviceId: string;
    hasInput: boolean;
    waitingOnPost: boolean;
}

class ActivitiesTurkView extends React.Component<any, IActivitiesTurkViewState> {
    constructor(props: any) {
        super(props);

        // fetching turker ID, first try query string, try localStorage and default to empty
        const turkId = localStorage.getItem("turkID") || "";

        const stage = turkId === "" ? TurkViewStage.INPUT_TURK_ID : TurkViewStage.ACTIVITIES;

        // Don't call this.setState() here!
        this.state = {
            currentStage: stage,
            progressIndicator: 1,
            completedActivityCounter: 0,
            // TODO: load number of activities in the current session dynamically from the BE, based on user trust
            numActivities: 10,
            deviceId: turkId,
            hasInput: false,
            waitingOnPost: false,
        };

        // Bindings.
        this.doneActivity = this.doneActivity.bind(this);
        this.activitySource = this.activitySource.bind(this);
        this.exit = this.exit.bind(this);
        this.changeTurkId = this.changeTurkId.bind(this);
        this.onIDChange = this.onIDChange.bind(this);
        this.doneClicked = this.doneClicked.bind(this);
    }

    public exit() {
        window.parent.postMessage("success", "*");
    }

    public changeTurkId() {
        localStorage.setItem("turkID", "");
        this.setState({
            currentStage: TurkViewStage.INPUT_TURK_ID,
            deviceId: "",
        });
    }

    public onIDChange(turkID: string) {
        this.setState({
            deviceId: turkID,
            hasInput: (turkID !== ""),
        });
    }

    public doneClicked() {
        localStorage.setItem("turkID", this.state.deviceId);
        this.setState({
            currentStage: TurkViewStage.ACTIVITIES,
            completedActivityCounter: -1,
            progressIndicator: 1,
        }, () => {
            this.setState({ completedActivityCounter: 0 });
        });
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

            let stage = this.state.currentStage;
            if (counter === this.state.numActivities) {
                stage = TurkViewStage.COMPLETE;
            }

            this.setState({
                progressIndicator: this.state.progressIndicator + 1,
                completedActivityCounter: counter,
                currentStage: stage,
                waitingOnPost: false,
            });
        });


    }

    public render() {
        if (this.state.currentStage >= TurkViewStage.COMPLETE) {
            this.exit();
        }

        const progressBarHeight = 30;
        const turkIdHeight = 30;

        return <div style={{ height: "100%" }}>
            {this.state.currentStage === TurkViewStage.ACTIVITIES &&
                <div style={{ height: turkIdHeight, textAlign: "center" }}>
                    <p>Completing task as worker:&nbsp;
                    <b>{this.state.deviceId}</b>
                        <br></br>
                        {/* eslint-disable-next-line  */}
                        <a className="link" onClick={this.changeTurkId}>Not You?</a></p>
                </div>
            }
            <ProgressBarComponent
                height={progressBarHeight}
                progress={this.state.progressIndicator / this.progressDivisor() * 100}>
            </ProgressBarComponent>
            {this.state.currentStage === TurkViewStage.INPUT_TURK_ID &&
                <div>
                    <InputTurkID onIDChange={this.onIDChange} turkID={this.state.deviceId} />

                    <div style={{ marginRight: "10px", marginLeft: "10px" }}>
                        {
                            <BigButtonComponent
                                enabled={this.state.hasInput}
                                onClick={this.doneClicked}
                                label={"Done"}>
                            </BigButtonComponent>
                        }
                    </div>
                </div>
            }
            {this.state.currentStage === TurkViewStage.ACTIVITIES &&
                <div style={{ height: `calc(100% - ${turkIdHeight + progressBarHeight + 2 * 10}px)`, padding: "10px" }}>
                    <ActivitiesComponent
                        key={this.state.completedActivityCounter}
                        doneActivityCallback={this.doneActivity}
                        activityPromise={this.activitySource}
                        disabled={this.state.completedActivityCounter >= this.state.numActivities
                            || this.state.waitingOnPost}>
                    </ActivitiesComponent>
                </div>
            }
        </div>;
    }

    private progressDivisor() {
        return this.state.numActivities + 1;
    }

    private activitySource() {
        return Backend.getActivity(this.state.deviceId);
    }

    private postSample(data: any, callback: any) {
        this.setState({ waitingOnPost: true });
        data.actor_sig = this.state.deviceId;
        Backend.postSample(data).then((response: any) => {
            // TODO handle successs
            console.log(response);
            callback();
        }).catch((error: any) => {
            // TODO handle error
            console.log(error);
            callback();
        });
    }
}

export default ActivitiesTurkView;
