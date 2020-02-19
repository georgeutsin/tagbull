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
}

// tslint:disable-next-line: max-classes-per-file
class MockBackend implements IBackend {
    private bbActivityResp: any;

    constructor() {
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
    }

    public getActivity(deviceId: string): any {
        const resp = { data: this.bbActivityResp };
        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public postSample(data: any): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public getTags(projectId: number): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public getSamples(projectId: number, taskId: number): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public getAllSamples(projectId: number): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public getProjects(): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public getProject(projectId: number): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public postProject(data: any): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public patchProject(projectId: number, data: any): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
    }

    public postMedia(projectId: number, data: any): any {
        // TODO
        const resp = {};

        const promise = new Promise((resolve) => {
            resolve(resp);
        });

        return promise;
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
