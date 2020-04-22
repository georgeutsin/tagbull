import React from "react";
import { BoundingBoxTap, DiscreteAttribute, Locator } from "../../activities";
import { Welcome } from "../../elements";

interface IActivitiesComponentState {
    taskId: number;
    activity: any;
    timerStart: number;
}

interface IActivitiesComponentProps {
    doneActivityCallback: any;
    activityPromise: any;
    disabled: boolean;
}

const activityDelay: { [key: string]: number; } = {
    BoundingBoxTask: 2800,
    LocatorTask: 1000,
    DiscreteAttributeTask: 1200,
};

class ActivitiesComponent extends React.Component<IActivitiesComponentProps, IActivitiesComponentState> {
    constructor(props: any) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            taskId: -1,
            activity: {},
            timerStart: 0,
        };

        // Bindings.
        this.completeActivity = this.completeActivity.bind(this);
    }

    public componentWillReceiveProps(props: IActivitiesComponentProps) {
        // TODO , maybe we'lll have to use this? hopefully the key thing unmounts and remounts but we'll see
    }

    public componentDidMount() {
        this.getActivity();
    }

    public completeActivity(sample: any) {
        // End time elapsed timer
        const timeElapsed = +new Date() - this.state.timerStart;
        if (timeElapsed < activityDelay[this.state.activity.type]) {
            this.reset();
            return;
        }
        this.props.doneActivityCallback({
            task_id: this.state.taskId,
            task_type: this.state.activity.type,
            data: sample,
            time_elapsed: timeElapsed,
        });
    }

    public render() {
        let currentActivity = null;
        switch (this.state.activity.type) {
            case "BoundingBoxTask":
                currentActivity = <BoundingBoxTap
                    activity={this.state.activity}
                    notifyActivityComplete={this.completeActivity}
                    disabled={this.props.disabled}>
                </BoundingBoxTap>;
                break;
            case "DiscreteAttributeTask":
                currentActivity = <DiscreteAttribute
                    activity={this.state.activity}
                    notifyActivityComplete={this.completeActivity}
                    disabled={this.props.disabled}>
                </DiscreteAttribute>;
                break;
            case "LocatorTask":
                currentActivity = <Locator
                    activity={this.state.activity}
                    notifyActivityComplete={this.completeActivity}
                    disabled={this.props.disabled}>
                </Locator>;
                break;
            default: break;
        }

        return <div style={{ height: "100%" }}>
            {currentActivity === null && <div className="loadingWheel"></div>}
            {currentActivity}
            {(this.state.activity && this.state.activity.new_actor) && <Welcome></Welcome> }
        </div>;
    }

    private reset() {
        alert("Wow that was fast! Take a moment to review your submission to be extra sure :)");
        // alert is blocking
        this.setState({ timerStart: +new Date() });
    }

    private getActivity() {
        this.props.activityPromise().then((response: { data: any; }) => {
            const activity = response.data.data;
            if (activity.task_id == null) {
                this.props.doneActivityCallback({
                    no_task_found: true,
                });
                return;
            }
            this.setState({
                taskId: activity.task_id,
                activity,
                timerStart: +new Date(),
            });
        });
    }

}

export default ActivitiesComponent;
