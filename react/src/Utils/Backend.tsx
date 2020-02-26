import axios from "axios";

// TODO: change all of the `any` to defined interfaces
interface IBackend {
    getActivity(deviceId: string): any;
    postSample(data: any): any;
    getTags(projectId: number): any;
    getSamples(projectId: number, taskId: number): any;
    getAllSamples(projectId: number): any;
    getProjects(): any;
    getProject(projectId: number): any;
    postProject(data: any): any;
    patchProject(projectId: number, data: any): any;
    postMedia(projectId: number, data: any): any;
    postPauseProject(projectId: number): any;
    postResumeProject(projectId: number): any;
}

class RemoteBackend implements IBackend {
    private base: string;

    constructor(base: string) {
        this.base = base;
    }

    public getActivity(deviceId: string): any {
        return axios.get(this.base + `/activities/?actor_sig=${deviceId}`);
    }

    public postSample(data: any): any {
        return axios.post(this.base + `/samples`, data);
    }

    public getTags(projectId: number): any {
        return axios.get(this.base + `/projects/${projectId}/tags`);
    }

    public getSamples(projectId: number, taskId: number): any {
        return axios.get(this.base + `/projects/${projectId}/tags/${taskId}`);
    }

    public getAllSamples(projectId: number): any {
        return axios.get(this.base + `/projects/${projectId}/samples`);
    }

    public getProjects(): any {
        return axios.get(this.base + `/projects`);
    }

    public getProject(projectId: number): any {
        return axios.get(this.base + `/projects/${projectId}`);
    }

    public postProject(data: any): any {
        return axios.post(this.base + `/projects`, data);
    }

    public patchProject(projectId: number, data: any): any {
        return axios.patch(this.base + `/projects/${projectId}`, data);
    }

    public postMedia(projectId: number, data: any): any {
        return axios.post(this.base + `/media?project_id=${projectId}`, data, {
            headers: {
                "accept": "application/json",
                "Accept-Language": "en-US,en;q=0.8",
                "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            },
        });
    }

    public postPauseProject(projectId: number): any {
        return axios.post(this.base + `/projects/${projectId}/pause`);
    }

    public postResumeProject(projectId: number): any {
        return axios.post(this.base + `/projects/${projectId}/resume`);
    }
}

// tslint:disable-next-line: max-classes-per-file
class MockBackend implements IBackend {
    private bbActivityResp: any;
    private locatorActivityResp: any;
    private discreteAttrActivityResp: any;
    private noActivityResp: any;

    constructor() {
        this.noActivityResp = {
            data: {
                new_actor: false,
                task_id: null,
            },
        };
        this.locatorActivityResp = {
            data: {
                new_actor: false,
                task_id: 52,
                type: "LocatorTask",
                config: {
                    media_url: "https://lh3.googleusercontent.com/q0wbpyLn6ycBkjElBjKsyC4mnjU_-RzK4n9cok4HC1fESjYMvph_rDwKoLM6V2vRG-40s92JNg=s0",
                    category: "television",
                },
            },
        };
        this.bbActivityResp = {
            data: {
                new_actor: false,
                task_id: 52,
                type: "BoundingBoxTask",
                config: {
                    media_url: "https://lh3.googleusercontent.com/q0wbpyLn6ycBkjElBjKsyC4mnjU_-RzK4n9cok4HC1fESjYMvph_rDwKoLM6V2vRG-40s92JNg=s0",
                    category: "television",
                    target_point: {
                        x: 0.5,
                        y: 0.5,
                    },
                },
            },
        };
        this.discreteAttrActivityResp = {
            data: {
                new_actor: false,
                task_id: 52,
                type: "DiscreteAttributeTask",
                config: {
                    media_url: "https://lh3.googleusercontent.com/q0wbpyLn6ycBkjElBjKsyC4mnjU_-RzK4n9cok4HC1fESjYMvph_rDwKoLM6V2vRG-40s92JNg=s0",
                    attribute_type: "LabelName",
                    bounding_box: {
                        min_x: 0.2,
                        min_y: 0.2,
                        max_x: 0.7,
                        max_y: 0.7,
                    },
                    options: ["donut", "bagel", "neither"],
                    category: "baked good",
                },
            },
        };
    }

    public promiseOf(resp: any, delay?: number) {
        if (delay) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(resp);
                }, delay);
            });
        }

        return new Promise((resolve) => {
            resolve(resp);
        });
    }

    public getActivity(deviceId: string): any {
        // const resp = { data: this.locatorActivityResp };
        // const resp = { data: this.bbActivityResp };
        const resp = { data: this.noActivityResp };
        // const resp = { data: this.discreteAttrActivityResp };
        return this.promiseOf(resp);
    }

    public postSample(data: any): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public getTags(projectId: number): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public getSamples(projectId: number, taskId: number): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public getAllSamples(projectId: number): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public getProjects(): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public getProject(projectId: number): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public postProject(data: any): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public patchProject(projectId: number, data: any): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public postMedia(projectId: number, data: any): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public postPauseProject(projectId: number): any {
        const resp = {};
        return this.promiseOf(resp);
    }

    public postResumeProject(projectId: number): any {
        const resp = {};
        return this.promiseOf(resp);
    }
}


const prodBase: string = "https://tagbull-prod.appspot.com";
const localBase: string = "http://localhost:8080";

function getBackend(type: string): IBackend {
    switch (type) {
        case "prod":
            return new RemoteBackend(prodBase);
        case "local":
            return new RemoteBackend(localBase);
        case "mock":
        default:
            return new MockBackend();
    }
}

const BackendLocation = "prod"; // CHANGE THIS LINE TO CHANGE THE BACKEND
const Backend = getBackend(BackendLocation);
export { Backend, BackendLocation };
