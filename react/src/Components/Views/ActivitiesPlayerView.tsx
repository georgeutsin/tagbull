import queryString from "query-string";
import React from "react";
import { Backend, getActorSig, UnityEvent } from "../../Utils";
import { CompletionComponent, ProgressBarComponent } from "../UIElements";
import ActivitiesComponent from "./ActivitiesComponent";

enum PlayerViewStage {
    ACTIVITIES = 0,
    COMPLETE = 1,
    NOTASK = 2,
}

interface IActivitiesPlayerViewState {
    currentStage: number;
    progressIndicator: number;
    completedActivityCounter: number;
    numActivities: number;
    deviceId: string;
    waitingOnPost: boolean;
}

class ActivitiesPlayerView extends React.Component<any, IActivitiesPlayerViewState> {
    constructor(props: any) {
        super(props);

        const values = queryString.parse(this.props.location.search);

        // Don't call this.setState() here!
        this.state = {
            currentStage: PlayerViewStage.ACTIVITIES,
            progressIndicator: 1,
            completedActivityCounter: 0,
            // TODO: load number of activities in the current session dynamically from the BE, based on user trust
            numActivities: 3,
            deviceId: values.device_id ? String(values.device_id) : getActorSig("web_player"),
            waitingOnPost: false,
        };

        // Bindings.
        this.doneActivity = this.doneActivity.bind(this);
        this.activitySource = this.activitySource.bind(this);
        this.exit = this.exit.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    public exit() {
        window.dispatchEvent(new UnityEvent("tagbull", {
            detail: "success",
        }));
    }

    public cancel() {
        window.dispatchEvent(new UnityEvent("tagbull", {
            detail: "cancel",
        }));
    }

    public doneActivity(data: any) {
        if (data.no_task_found) {
            this.setState({
                progressIndicator: this.state.numActivities + 1,
                completedActivityCounter: this.state.numActivities,
                currentStage: PlayerViewStage.NOTASK,
                waitingOnPost: false,
            });
        } else {
            this.postSample(data, () => this.updateActivityCounter());
        }
    }

    public updateActivityCounter() {
        let counter = this.state.completedActivityCounter;

        // Increment the counter if we haven't finished the last planned activity yet.
        // This has the side effect of unmounting and remounting the ActivitiesComponent
        // since the component takes the counter as the key prop.
        if (this.state.completedActivityCounter < this.state.numActivities) {
            counter += 1;
        }

        let stage = this.state.currentStage;
        if (counter === this.state.numActivities) {
            stage = PlayerViewStage.COMPLETE;
        }

        this.setState({
            progressIndicator: this.state.progressIndicator + 1,
            completedActivityCounter: counter,
            currentStage: stage,
            waitingOnPost: false,
        });
    }

    public render() {
        let completeComponent = null;
        if (this.state.currentStage >= PlayerViewStage.COMPLETE) {
            completeComponent = <div onClick={this.exit}><CompletionComponent ></CompletionComponent></div>;
        }

        const progressBarHeight = 50;

        return <div style={{ height: "100%" }}>
            <ProgressBarComponent
                progress={this.state.progressIndicator / this.progressDivisor() * 100}>
                {completeComponent === null && <div className="cancelActivities" onClick={this.cancel}>Cancel</div>}
            </ProgressBarComponent>
            <div style={{ height: `calc(100% - ${progressBarHeight + 2 * 10}px)`, padding: "10px" }}>
                {!completeComponent && <ActivitiesComponent
                    key={this.state.completedActivityCounter}
                    doneActivityCallback={this.doneActivity}
                    activityPromise={this.activitySource}
                    disabled={this.state.completedActivityCounter >= this.state.numActivities
                        || this.state.waitingOnPost}>
                </ActivitiesComponent>}
            </div>
            {completeComponent}

        </div>;
    }

    private progressDivisor() {
        return this.state.numActivities + 1;
    }

    private activitySource() {
        if (this.state.currentStage === PlayerViewStage.COMPLETE) {
            return new Promise((resolve) => {
                resolve({
                    data: {
                        task_id: 0,
                        activity_config: {},
                        activity_type: "none",
                    },
                });
            });
        }
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

export default ActivitiesPlayerView;
