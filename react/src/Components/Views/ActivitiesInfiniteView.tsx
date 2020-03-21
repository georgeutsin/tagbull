import queryString from "query-string";
import React from "react";
import { Backend, getActorSig, UnityEvent } from "../../Utils";
import { ProgressBarComponent } from "../UIElements";
import ActivitiesComponent from "./ActivitiesComponent";

enum PlayerViewStage {
    ACTIVITIES = 0,
    COMPLETE = 1,
    NOTASK = 2,
}

interface IActivitiesInfiniteViewState {
    currentStage: number;
    progressIndicator: number;
    completedActivityCounter: number;
    numActivities: number;
    deviceId: string;
    projectId?: string;
    waitingOnPost: boolean;
}

class ActivitiesInfiniteView extends React.Component<any, IActivitiesInfiniteViewState> {
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
            deviceId: values.device_id ? String(values.device_id) : getActorSig("web_infinite"),
            projectId: values.project_id ? String(values.project_id) : "9",
            waitingOnPost: false,
        };

        // Bindings.
        this.doneActivity = this.doneActivity.bind(this);
        this.activitySource = this.activitySource.bind(this);
        this.exit = this.exit.bind(this);
    }

    public exit() {
        window.dispatchEvent(new UnityEvent("tagbull", {
            detail: "success",
        }));
        this.props.history.push("/");
    }

    public componentDidCatch(error: any, info: any) {
        this.setState({ completedActivityCounter: this.state.completedActivityCounter + 1 });
        // TODO: call backend with error
    }

    public doneActivity(data: any) {
        if (data.no_task_found) {
            this.exit();
        } else {
            this.postSample(data, () => this.updateActivityCounter());
        }
    }

    public updateActivityCounter() {
        this.setState({
            completedActivityCounter: this.state.completedActivityCounter + 1,
            waitingOnPost: false,
        });
    }

    public render() {
        const progressBarHeight = 50;

        return <div style={{ height: "100%" }}>
            <ProgressBarComponent
                progress={100}>
                <div className="cancelActivities" onClick={this.exit}>Exit</div>
            </ProgressBarComponent>
            <div style={{ height: `calc(100% - ${progressBarHeight + 2 * 10}px)`, padding: "10px" }}>
                {<ActivitiesComponent
                    key={this.state.completedActivityCounter}
                    doneActivityCallback={this.doneActivity}
                    activityPromise={this.activitySource}
                    disabled={this.state.waitingOnPost}>
                </ActivitiesComponent>}
            </div>
        </div>;
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
        return Backend.getActivity(this.state.deviceId, this.state.projectId);
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

export default ActivitiesInfiniteView;
