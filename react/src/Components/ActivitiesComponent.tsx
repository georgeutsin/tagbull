import React from "react";
import { BinaryVerification, BoundingBoxTap } from "./ActivityComponents";

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
        if (timeElapsed < 3000) {
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
                // currentActivity = <BoundingBox
                //     activityConfig={this.state.activityConfig}
                //     notifyActivityComplete={this.completeActivity}
                //     disabled={this.props.disabled}>
                // </BoundingBox>;
                currentActivity = <BoundingBoxTap
                    key={this.state.timerStart} // to re-render if time too short
                    activity={this.state.activity}
                    notifyActivityComplete={this.completeActivity}
                    disabled={this.props.disabled}>
                </BoundingBoxTap>;
                break;
            case "binary verification":
                currentActivity = <BinaryVerification
                    key={this.state.timerStart}
                    activity={this.state.activity}
                    notifyActivityComplete={this.completeActivity}
                    disabled={this.props.disabled}>
                </BinaryVerification>;
                break;
            default: break;
        }

        return <div style={{ height: "100%" }}>
            {currentActivity}
        </div>;
    }

    private reset() {
        alert("That doesn't look quite right. Please try again :)");
        this.setState({ timerStart: +new Date() });
    }

    private getActivity() {
        this.props.activityPromise().then((response: { data: any; }) => {
            const activity = response.data.data;
            console.log(activity);
            this.setState({
                taskId: activity.task_id,
                activity,
                timerStart: +new Date(),
            });
        });
    }

}

export default ActivitiesComponent;
