import Node from "../scene-graph/node";
import Camera from "../renderer/scene/camera";
import Light from "../renderer/scene/light";

export interface SceneManagerInfo {
    name: string;
};

export interface SceneNodeInfo {
    name: string;
    isStatic: boolean;
    //parent: Node;
}

export class SceneManager {

    constructor() {
    }

    public initialize(info: SceneManagerInfo): boolean {
        this._name = info.name;

        return true;
    }

    public destroy() {
        this.destroyCameras();
        this.destroyLights();
        this.destroyNodes();
    }

    public createNode(info: SceneNodeInfo): Node {
        let node = new Node(name);
        this._nodes.set(node.uuid, node);
        return node;
    }

    public destroyNode(node: Node) {
        this._nodes.delete(node.uuid);
    }

    public destroyNodes() {
        this._nodes.clear();
    }

    public getNode(id: number): Node | null {
        let node = this._nodes.get(id);
        if (node) {
            return node;
        } else {
            return null;
        }
    }

    public createCamera(name: string): Camera {
        let camera = new Camera(this, name);
        this._cameras.push(camera);
        return camera;
    }

    public destroyCamera(camera: Camera) {
        for (let i = 0; i < this._cameras.length; ++i) {
            if (this._cameras[i] === camera) {
                this._cameras.slice(i);
                return;
            }
        }
    }

    public destroyCameras() {
        this._cameras = [];
    }

    public getCamera(name: string): Camera | null {
        for (let i = 0; i < this._cameras.length; ++i) {
            let camera = this._cameras[i];
            if (camera.getName() === name) {
                return camera;
            }
        }

        return null;
    }

    public createLight(name: string): Light {
        let light = new Light(this, name);
        this._lights.push(light);
        return light;
    }

    public destroyLight(light: Light) {
        for (let i = 0; i < this._lights.length; ++i) {
            if (this._lights[i] === light) {
                this._lights.slice(i);
                return;
            }
        }
    }

    public destroyLights() {
        this._lights = [];
    }

    public getLight(name: string): Light | null {
        for (let i = 0; i < this._lights.length; ++i) {
            let light = this._lights[i];
            if (light.getName() === name) {
                return light;
            }
        }

        return null;
    }

    public get name(): string {
        return this._name;
    }

    public get cameras(): Camera[] {
        return this._cameras;
    }

    public get lights(): Light[] {
        return this._lights;
    }

    protected _name: string = "";
    protected _nodes: Map<number, Node> = new Map;
    protected _cameras: Camera[] = [];
    protected _lights: Light[] = [];
};
