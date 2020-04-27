import React from "react";
import { Redirect } from "react-router-dom";
import { Backend } from "../../../utils";
import { PortalWrapper } from "../../elements";

import portalStyles from "../../../styles/portal.module.scss";
import styles from "./NewProjectView.module.scss"; // TODO: redo this whole file

enum NewProjectStage {
    IMAGE_DEF = 0,
    TASK_TYPE_SELECTION = 1,
    TASK_CONFIG = 2,
    NAME_PROJECT = 3,
    COMPLETE = 4,
}

interface INewProjectViewState {
    currentStage: NewProjectStage;
    config: any;
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
            config: {
                name: "",
                type: "",
                category: "",
                csv: "",
            },

            redirect: false,
            currentStage: NewProjectStage.IMAGE_DEF,
        };

        // Bindings.
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleCSVChange = this.handleCSVChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.createClicked = this.createClicked.bind(this);
    }

    public createClicked() {
        Backend.postProject({
            project: {
                user_id: 1,
                config: this.state.config,
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

    public handleCSVChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        const config = this.state.config;
        config.csv = event.target.value;
        this.updateActivityConfig(config, NewProjectStage.TASK_TYPE_SELECTION);
    }

    public handleTypeChange(event: any) {
        const config = this.state.config;
        config.type = event.target.value;
        this.updateActivityConfig(config, NewProjectStage.TASK_CONFIG);
    }

    public handleCategoryChange(event: React.ChangeEvent<HTMLInputElement>) {
        const config = this.state.config;
        config.category = event.target.value;
        this.updateActivityConfig(config, NewProjectStage.NAME_PROJECT);
    }

    public handleNameChange(event: any) {
        const config = this.state.config;
        config.name = event.target.value;
        this.updateActivityConfig(config, NewProjectStage.COMPLETE);
    }

    public updateActivityConfig(config: any, maxStage: NewProjectStage) {
        this.setState({
            config,
            currentStage: Math.max(this.state.currentStage, maxStage),
        });
    }

    public render() {
        if (this.state.redirect) {
            return <Redirect push to="/projects" />;
        }

        const actions = <span className={portalStyles.actions}>
            <a href={`/projects`}>
                <button className={`${portalStyles.actionButton} ${portalStyles.greyButton}`}>
                    Back
                </button>
            </a>
        </span>;

        return <PortalWrapper
            title={`Create a New Project`}
            actions={actions}>
            <div className={styles.stepList}>
                <div className={styles.step}>
                    <div className={styles.stepInstruction}>
                        <h3>Step 1: Provide images</h3>
                        Please paste a CSV of links to the images you want tagged.
                    </div>
                    <div className={styles.stepBody}>
                        <textarea onChange={this.handleCSVChange}
                            placeholder="A comma separated list. Ex: cat, dog, rabbit"></textarea>
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={this.getStepInstructionClass(NewProjectStage.TASK_TYPE_SELECTION)}>
                        <h3>Step 2: Select task type</h3>
                        Indicate the type of labels you want generated for your dataset.
                    </div>
                    <div className={styles.stepBody}>
                        {this.shouldShowStage(NewProjectStage.TASK_TYPE_SELECTION) &&
                            <div className={styles.radioWrapper} onChange={this.handleTypeChange}>
                                <input
                                    type="radio"
                                    id="radio1"
                                    name="radios"
                                    value="bounding_box_for_catgory"></input>
                                <label className="leftRadio" htmlFor="radio1">Locator</label>
                            </div>
                        }
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={this.getStepInstructionClass(NewProjectStage.TASK_CONFIG)}>
                        <h3>Step 3: Configure label options</h3>
                        Telling us a bit more information about what kind of labels you
                        expect, and properties of the dataset will help us deliver more accurate labels faster.
                    </div>
                    <div className={styles.stepBody}>
                        {this.shouldShowStage(NewProjectStage.TASK_CONFIG) &&
                            <div>
                                What is this dataset labelling?&nbsp;&nbsp;&nbsp;
                                <input placeholder="The category of the labels. Example: animal"
                                    className="inlineInput" type="text" value={this.state.config.category}
                                    onChange={this.handleCategoryChange}></input>
                            </div>
                        }
                    </div>
                </div>

                <div className={styles.step}>
                    <div className={this.getStepInstructionClass(NewProjectStage.NAME_PROJECT)}>
                        <h3>Step 4: Project Name</h3>
                        Pick a concise name to identify the project.
                    </div>
                    <div className={styles.stepBody}>
                        {this.shouldShowStage(NewProjectStage.NAME_PROJECT) &&
                            <input className="inlineInput" placeholder="Project Name"
                                type="text" onChange={this.handleNameChange}
                                value={this.state.config.name}></input>
                        }
                    </div>
                </div>
            </div>
            <div className={portalStyles.actionBar} style={{ margin: "20px" }}>
                <span className={portalStyles.actions}>
                    <button onClick={this.createClicked}
                        className={this.getActionButtonClass(NewProjectStage.COMPLETE)} >
                        Create Project
                    </button>
                </span>
                <div style={{ clear: "both" }}></div>
            </div>

        </PortalWrapper>;
    }

    private getStepInstructionClass(stage: NewProjectStage) {
        let className = `${styles.stepInstruction} `;
        className += (this.state.currentStage < stage ? styles.disabledInstruction : "");
        return className;
    }

    private getActionButtonClass(stage: NewProjectStage) {
        let className = `${portalStyles.actionButton} `;
        className += (!this.shouldShowStage(stage) ? portalStyles.disabledButton : "");
        return className;
    }

    private shouldShowStage(stage: NewProjectStage) {
        return this.state.currentStage >= stage;
    }
}

export default NewProjectView;
