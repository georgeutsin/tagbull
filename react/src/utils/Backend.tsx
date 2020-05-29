import axios from "axios";

// TODO: change all of the `any` to defined interfaces
interface IBackend {
    updateToken(): any;
    authorizationHandler(error: any, history: any): any;
    getActivity(deviceId: string, projectId?: string): any;
    postSample(data: any): any;
    getTags(projectId: number, meta?: any): any;
    getTagSamples(projectId: number, taskId: number): any;
    getProjectSamples(projectId: number, meta?: any): any;
    getActorSamples(actorId: number, projectId?: number, meta?: any): any;
    getProjects(meta?: any): any;
    getProject(projectId: number): any;
    postProject(data: any): any;
    patchProject(projectId: number, data: any): any;
    deleteProject(projectId: number): any;
    postMedia(projectId: number, data: any): any;
    getActors(projectId?: number, meta?: any): any;
    getActor(actorId: number, projectId?: number): any;
    postLogin(email: string, password: string): any;
    postRegister(email: string, password: string): any;
}

class RemoteBackend implements IBackend {
    private base: string;
    private defaultHeaders: any;
    private source: any;

    constructor(base: string) {
        this.base = base;
        const CancelToken = axios.CancelToken;
        this.source = CancelToken.source();
        this.updateToken();
        this.authorizationHandler = this.authorizationHandler.bind(this);
    }

    public updateToken() {
        this.defaultHeaders = {
            "Authorization": localStorage.getItem("token"),
        };
    }

    public authorizationHandler(error: any, history: any) {
        if (error && error.response && error.response.data && error.response.data.error &&
            error.response.data.error.message === "unauthorized") {
            localStorage.removeItem("token");
            this.source.cancel("Cancel inflight requests");
            history.push("/login");
            return;
        }
    }

    public cancellationHandler(error: any) {
        if (axios.isCancel(error)) {
            console.log(error.message);
            return;
        }
        throw error;
    }

    public getActivity(deviceId: string, projectId?: string): any {
        let route = `/activities/?actor_sig=${deviceId}`;
        if (projectId) {
            route += `&project_id=${projectId}`;
        }
        return axios.get(this.base + route,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public postSample(data: any): any {
        return axios.post(this.base + `/samples`, data,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public getTags(projectId: number, meta?: any): any {
        return axios.get(this.base + `/projects/${projectId}/tags`,
            { params: meta, headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public getTagSamples(projectId: number, taskId: number): any {
        return axios.get(this.base + `/projects/${projectId}/tags/${taskId}`,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public getProjectSamples(projectId: number, meta?: any): any {
        return axios.get(this.base + `/projects/${projectId}/samples`,
            { params: meta, headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public getActorSamples(actorId: number, projectId?: number, meta?: any): any {
        const projectSuffix = projectId ? `?project_id=${projectId}` : "";
        return axios.get(this.base + `/actors/${actorId}/samples` + projectSuffix,
            { params: meta, headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public getProjects(meta?: any): any {
        return axios.get(this.base + `/projects`,
            { params: meta, headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public getProject(projectId: number): any {
        return axios.get(this.base + `/projects/${projectId}`,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);;
    }

    public postProject(data: any): any {
        return axios.post(this.base + `/projects`, data,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public patchProject(projectId: number, data: any): any {
        return axios.patch(this.base + `/projects/${projectId}`, data,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public deleteProject(projectId: number): any {
        return axios.delete(this.base + `/projects/${projectId}`,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public postMedia(projectId: number, data: any): any {
        return axios.post(this.base + `/media?project_id=${projectId}`, data,
            {
                headers: {
                    "accept": "application/json",
                    "Accept-Language": "en-US,en;q=0.8",
                    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
                    "Authorization": localStorage.getItem("token"),
                },
                cancelToken: this.source.token,
            })
            .catch(this.cancellationHandler);
    }

    public getActors(projectId?: number, meta?: any): any {
        let route = `/actors/?`;
        if (projectId) {
            route += `project_id=${projectId}`;
        }
        return axios.get(this.base + route,
            { params: meta, headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public getActor(actorId: number, projectId?: number): any {
        let route = `/actors/${actorId}?`;
        if (projectId) {
            route += `project_id=${projectId}`;
        }
        return axios.get(this.base + route,
            { headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public postLogin(email: string, password: string): any {
        return axios.post(this.base + `/authenticate`,
            { email, password, headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }

    public postRegister(email: string, password: string): any {
        return axios.post(this.base + `/register`,
            { email, password, headers: this.defaultHeaders, cancelToken: this.source.token })
            .catch(this.cancellationHandler);
    }
}

// tslint:disable-next-line: max-classes-per-file
class MockBackend implements IBackend {
    private bbActivityResp: any;
    private locatorActivityResp: any;
    private imageFailureResp: any;
    private discreteAttrActivityResp: any;
    private noActivityResp: any;
    private defaultHeaders: any;

    constructor() {
        this.updateToken();

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
                    category: "donuts and bagels",
                },
            },
        };
        this.imageFailureResp = {
            data: {
                new_actor: false,
                task_id: 52,
                type: "LocatorTask",
                config: {
                    media_url: "https://lh3.googleusercontent.com/q0wbpyLn6ycBkjElBjKsyC4mnjU_-RzK4n9cok4HC1fESjYMvph_rDwKoLM6V2vRG-40s92JN",
                    category: "donuts and bagels",
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
                    max_box: {
                        min_x: 0.2,
                        min_y: 0.2,
                        max_x: 0.7,
                        max_y: 0.7,
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

    public updateToken() {
        this.defaultHeaders = {
            "Authorization": localStorage.getItem("token"),
        };
    }

    public authorizationHandler(error: any, history: any) {
        if (error && error.response && error.response.data && error.response.data.error &&
            error.response.data.error.message === "unauthorized") {
            localStorage.removeItem("token");
            history.push("/login");
            return;
        }
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
        const resp = { data: this.locatorActivityResp };
        // const resp = { data: this.bbActivityResp };
        // const resp = { data: this.imageFailureResp };
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
        const resp = { data: { data: [] } };
        return this.promiseOf(resp);
    }

    public getTagSamples(projectId: number, taskId: number): any {
        // TODO
        const resp = { data: { data: [] } };
        return this.promiseOf(resp);
    }

    public getProjectSamples(projectId: number): any {
        // TODO
        const resp = { data: { data: [] } };
        return this.promiseOf(resp);
    }

    public getActorSamples(actorId: number, projectId?: number, meta?: any): any {
        // TODO
        const resp = { data: { data: [] } };
        return this.promiseOf(resp);
    }

    public getProjects(): any {
        // TODO
        const resp = { data: { data: [] } };
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

    public deleteProject(projectId: number): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public postMedia(projectId: number, data: any): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public getActors(projectId?: number): any {
        // TODO
        const resp = { data: { data: [] } };
        return this.promiseOf(resp);
    }

    public getActor(actorId: number, projectId?: number): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public postLogin(email: string, password: string): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }

    public postRegister(email: string, password: string): any {
        // TODO
        const resp = {};
        return this.promiseOf(resp);
    }
}


const prodBase: string = "https://tagbull.herokuapp.com";
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

const BackendLocation = "local"; // CHANGE THIS LINE TO CHANGE THE BACKEND
const Backend = getBackend(BackendLocation);
export { Backend, BackendLocation };
