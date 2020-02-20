import React from "react";
import { Redirect } from "react-router-dom";
import { ActivitiesComponent } from ".";
import { Backend } from "../../Utils";
import ImageUpload from "../UIElements/ImageUpload";

enum NewProjectStage {
    IMAGE_UPLOAD = 0,
    TASK_TYPE_SELECTION = 1,
    TASK_CONFIG = 2,
    EXAMPLE_ACTIVITY = 3,
    NAME_PROJECT = 4,
    COMPLETE = 5,
}

interface INewProjectViewState {
    projectId: number;
    taskId: number;
    numImages: number;
    currentStage: NewProjectStage;

    activityType: string;
    activityConfig: any;
    allowOther: boolean;
    hasInput: boolean;
    completedActivityCounter: number;
    numActivities: number;

    projectName: string;
    redirect: boolean;
}

// tslint:disable-next-line: no-empty-interface
interface INewProjectViewProps {
}


class NewProjectView extends React.Component<INewProjectViewProps, INewProjectViewState>  {
    constructor(props: any) {
        super(props);

        // Don't call this.setState() here!
        this.state = {
            projectId: -1,
            taskId: -1,
            numImages: 0,

            activityType: "",
            activityConfig: {
                labels: [],
                category: "",
            },
            allowOther: false,
            hasInput: false,
            completedActivityCounter: 0,
            numActivities: 1,

            projectName: "",
            redirect: false,
            currentStage: NewProjectStage.IMAGE_UPLOAD,
        };

        Backend.postProject({
            user_id: 1,
        }).then((response: any) => {
            this.setState({ projectId: response.data.id });
        }).catch((error: any) => {
            // TODO handle error
        });

        // Bindings.
        this.doneSelectingImages = this.doneSelectingImages.bind(this);
        this.doneSelectingType = this.doneSelectingType.bind(this);
        this.doneSampleTask = this.doneSampleTask.bind(this);
        this.handleLabelListChange = this.handleLabelListChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.createClicked = this.createClicked.bind(this);
        this.allowOtherChanged = this.allowOtherChanged.bind(this);
        this.activitySource = this.activitySource.bind(this);
        this.doneActivity = this.doneActivity.bind(this);
    }

    public createClicked() {
        Backend.patchProject(this.state.projectId, {
            project: {
                id: this.state.projectId,
                user_id: 1,
                name: this.state.projectName,
                activity_type: this.state.activityType,
            },
            task_specific_data: {
                question: this.getQuestion(this.state.activityConfig.category),
                prompt: this.getPrompt(this.state.activityConfig.category),
                labels: this.state.activityConfig.labels,
                allow_other: this.state.allowOther,
            },
        }).then((response: any) => {
            if (response.status === 204) {
                this.setState({ redirect: true });
            } else {
                // TODO handle non 204 response
            }
        }).catch((error: any) => {
            // TODO handle error
        });
    }

    public handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
        const config = this.state.activityConfig;
        config.category = event.target.value;
        this.updateActivityConfig(config);
    }

    public doneSelectingImages(response: any) {
        this.setState({
            numImages: this.state.numImages + 1,
            currentStage: NewProjectStage.TASK_TYPE_SELECTION,
        }, () => {
            if (this.state.numImages === 1) {
                const config = this.state.activityConfig;
                config.media_urls = [response.data.url];
                this.setState({
                    taskId: response.data.task_id,
                    activityConfig: config,
                });
            }
        });
    }

    public doneSelectingType(event: any) {
        this.setState({
            currentStage: NewProjectStage.TASK_CONFIG,
            activityType: event.target.value,
        });
    }

    public updateActivityConfig(config: any) {
        this.setState({
            activityConfig: config,
            completedActivityCounter: -1,
        }, () => {
            // Update the activity key to unmount and remount the component.
            let currentStage = NewProjectStage.TASK_CONFIG;
            if (this.state.activityConfig.labels.length > 0 && this.state.activityConfig.category !== "") {
                currentStage = NewProjectStage.EXAMPLE_ACTIVITY;
            }
            this.setState({
                completedActivityCounter: 0,
                currentStage,
            });
        });
    }

    public handleLabelListChange(event: any) {
        const labelsString = event.target.value;

        const config = this.state.activityConfig;
        config.labels = labelsString.split(", ")
            .join(",")
            .split(",")
            .filter((label: string) => label !== "");
        this.updateActivityConfig(config);
    }

    public allowOtherChanged(event: any) {
        this.setState({ allowOther: event.target.checked });
    }

    public doneSampleTask() {
        this.setState({ currentStage: NewProjectStage.NAME_PROJECT });
    }

    public handleNameChange(event: any) {
        this.setState({
            projectName: event.target.value,
            currentStage: NewProjectStage.COMPLETE,
        });
    }

    public doneActivity(data: any) {
        this.postSample(data);

        this.setState({
            completedActivityCounter: this.state.completedActivityCounter + 1,
        }, () => {
            if (this.state.completedActivityCounter >= this.state.numActivities) {
                this.doneSampleTask();
            }
        });
    }

    public render() {
        if (this.state.redirect) {
            return <Redirect push to="/projects" />;
        }

        return <div>
            <div className="pageWrapper menuBar">
                <a href="/"><span style={{ width: "170px", height: "100%", float: "left" }}></span></a>
                <li className="light">Settings</li>
            </div>
            <div className="pageWrapper" style={{ minHeight: "100vh" }}>
                <div className="spaceAfter"></div>
                <div className="actionBar">
                    <span style={{ display: "inline-block" }}><h1>Create a New Project</h1></span>
                    <span className="actions">
                        <a href="/projects"><button className="actionButton greyButton">
                            Back
                        </button></a>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>

                <div className="stepList">
                    <div className="step">
                        <div className="stepInstruction">
                            <h3>Step 1: Upload images</h3>
                            Please select the images that you would like to be tagged.
                        </div>
                        <div className="stepBody stepBodyTop">
                            {this.state.projectId !== -1 &&
                                <ImageUpload projectId={this.state.projectId}
                                    callback={this.doneSelectingImages}></ImageUpload>
                            }
                        </div>
                        <div className="stepBreather"></div>
                    </div>
                    <div className="step">
                        <div className={this.getStepInstructionClass(NewProjectStage.TASK_TYPE_SELECTION)}>
                            <h3>Step 2: Select task type</h3>
                            Indicate the type of labels you want generated for your dataset.
                        </div>
                        <div className="stepBody">
                            {this.shouldShowStage(NewProjectStage.TASK_TYPE_SELECTION) &&
                                <div className="radioWrapper" onChange={this.doneSelectingType}>
                                    <input
                                        type="radio"
                                        id="radio1"
                                        name="radios"
                                        value="bounding_box_for_catgory"></input>
                                    <label className="leftRadio" htmlFor="radio1">Bounding Box For Category</label>

                                    <input
                                        type="radio"
                                        id="radio2"
                                        name="radios"
                                        value="identification"></input>
                                    <label htmlFor="radio2">Identification</label>

                                    <input
                                        type="radio"
                                        id="radio3"
                                        name="radios"
                                        value="semantic segmentatin"></input>
                                    <label className="rightRadio" htmlFor="radio3">Semantic Segmentation</label>
                                </div>
                            }


                        </div>
                    </div>
                    <div className="step">
                        <div className={this.getStepInstructionClass(NewProjectStage.TASK_CONFIG)}>
                            <h3>Step 3: Configure label options</h3>
                            Telling us a bit more information about what kind of labels you
                            expect, and properties of the dataset will help us deliver more accurate labels faster.
                        </div>
                        <div className="stepBody ">
                            {this.shouldShowStage(NewProjectStage.TASK_CONFIG) &&
                                <div>
                                    What is this dataset labelling?&nbsp;&nbsp;&nbsp;
                                    <input placeholder="The category of the labels. Example: animal"
                                        className="inlineInput" type="text" value={this.state.activityConfig.category}
                                        onChange={this.handleCategoryChange}></input>
                                    <br></br>

                                    <div style={{ marginLeft: "60px", marginBottom: "30px" }}>
                                        <div className="examplePrompt">Example prompt</div>
                                        <div>
                                            Please draw a <b>box</b> around the <b>
                                                {this.state.activityConfig.category}</b>:
                                        </div>
                                    </div>

                                    <br></br>
                                    Possible Labels (comma separated list): <br></br>
                                    <textarea className="newProjectTextArea" onChange={this.handleLabelListChange}
                                        placeholder="A comma separated list. Ex: cat, dog, rabbit"></textarea> <br></br>
                                    <input type="checkbox" id="allowOtherCheckbox"
                                        checked={this.state.allowOther} onChange={this.allowOtherChanged}></input>
                                    <label htmlFor="allowOtherCheckbox">&nbsp; Allow freeform "Other" option</label>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="step">
                        <div className={this.getStepInstructionClass(NewProjectStage.EXAMPLE_ACTIVITY)}>
                            <h3>Step 4: Verify task selection</h3>
                            Make sure we generate the right types of labels by running through
                            a few example labelling tasks.
                        </div>
                        <div className="stepBody stepTask">
                            {this.shouldShowStage(NewProjectStage.EXAMPLE_ACTIVITY) &&
                                <ActivitiesComponent
                                    key={this.state.completedActivityCounter}
                                    doneActivityCallback={this.doneActivity}
                                    activityPromise={this.activitySource}
                                    disabled={this.state.completedActivityCounter >= this.state.numActivities}>
                                </ActivitiesComponent>
                            }
                        </div>
                    </div>

                    <div className="step">
                        <div className={this.getStepInstructionClass(NewProjectStage.NAME_PROJECT)}>
                            <h3>Step 5: Project Name</h3>
                            Pick a concise name to identify the project.
                        </div>
                        <div className="stepBody stepBodyBottom">
                            {this.shouldShowStage(NewProjectStage.NAME_PROJECT) &&
                                <input className="inlineInput" placeholder="Project Name"
                                    type="text" onChange={this.handleNameChange}
                                    value={this.state.projectName}></input>
                            }
                        </div>
                    </div>

                </div>

                <div className="actionBar" style={{ marginTop: "40px" }}>
                    <span className="actions">
                        <button onClick={this.createClicked}
                            className={this.getActionButtonClass(NewProjectStage.COMPLETE)} >
                            Create Project
                        </button>
                    </span>
                    <div style={{ clear: "both" }}></div>
                </div>

            </div>
        </div>;
    }

    private getStepInstructionClass(stage: NewProjectStage) {
        let className = "stepInstruction ";
        className += (this.state.currentStage < stage ? "disabledInstruction" : "");
        return className;
    }

    private getActionButtonClass(stage: NewProjectStage) {
        let className = "actionButton ";
        className += (!this.shouldShowStage(stage) ? "disabledButton" : "");
        return className;
    }

    private shouldShowStage(stage: NewProjectStage) {
        return this.state.currentStage >= stage;
    }

    private getPrompt(category: string) {
        return "Please draw a <b>box</b> around the <b>" + category + "</b>:";
    }

    private getQuestion(category: string) {
        return "Which <b> " + category + "</b> is this?";
    }

    private activitySource() {
        const localActivity = {
            data: {
                id: 0,
                config: {
                    media_url: "https://storage.googleapis.com/tagbull-images-staging/3.jpg",
                    category: this.state.activityConfig.category,
                },
                type: "bounding_box_for_category",
            },
        };

        const promise = new Promise((resolve) => {
            resolve(localActivity);
        });

        return promise;
    }

    private postSample(data: any) {
        data.token = "cookie.token";
        data.task_id = this.state.taskId;

        Backend.postSample(data).then((response: any) => {
            // TODO handle successs
        }).catch((error: any) => {
            // TODO handle error
        });
    }
}

export default NewProjectView;
