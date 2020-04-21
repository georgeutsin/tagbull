import queryString from "query-string";
import React from "react";
import { Backend, getActorSig } from "../../utils";
import { ProgressBar } from "../elements";
import ActivitiesComponent from "./ActivitiesComponent";

enum TurkViewStage {
    ACTIVITIES = 1,
    COMPLETE = 2,
}

interface IActivitiesTurkViewState {
    currentStage: number;
    progressIndicator: number;
    completedActivityCounter: number;
    numActivities: number;
    deviceId: string;
    projectId?: string;
    hasInput: boolean;
    waitingOnPost: boolean;
}

class ActivitiesTurkView extends React.Component<any, IActivitiesTurkViewState> {
    constructor(props: any) {
        super(props);

        const values = queryString.parse(this.props.location.search);

        const stage = TurkViewStage.ACTIVITIES;

        // Don't call this.setState() here!
        this.state = {
            currentStage: stage,
            progressIndicator: 1,
            completedActivityCounter: 0,
            // TODO: load number of activities in the current session dynamically from the BE, based on user trust
            numActivities: 20,
            deviceId: getActorSig("web_turk"),
            projectId: values.project_id ? String(values.project_id) : undefined,
            hasInput: false,
            waitingOnPost: false,
        };

        // Bindings.
        this.doneActivity = this.doneActivity.bind(this);
        this.activitySource = this.activitySource.bind(this);
        this.exit = this.exit.bind(this);
        this.doneClicked = this.doneClicked.bind(this);
    }

    public exit() {
        window.parent.postMessage("success", "*");
    }

    public doneClicked() {
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

        return <div style={{ height: "100%" }}>
            <ProgressBar
                height={progressBarHeight}
                progress={this.state.progressIndicator / this.progressDivisor() * 100}>
            </ProgressBar>
            {this.state.currentStage === TurkViewStage.ACTIVITIES &&
                <div style={{ height: `calc(100% - ${progressBarHeight + 2 * 10}px)`, padding: "10px" }}>
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
        return Backend.getActivity(this.state.deviceId, this.state.projectId);
    }

    private postSample(data: any, callback: any) {
        this.setState({ waitingOnPost: true });
        data.actor_sig = this.state.deviceId;
        Backend.postSample(data).then((response: any) => {
            // TODO handle successs
            callback();
        }).catch((error: any) => {
            // TODO handle error
            callback();
        });
    }
}

export default ActivitiesTurkView;
