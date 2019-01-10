import { Root, _createSceneFun } from '../../core/root';
import { Node } from '../../scene-graph/node';
import { Camera } from './camera';
import Light from './light';
import Model from './model';

export interface IRenderSceneInfo {
    name: string;
}

export interface ISceneNodeInfo {
    name: string;
    isStatic?: boolean;
    // parent: Node;
}

export class RenderScene {

    public get root (): Root {
        return this._root;
    }

    public get name (): string {
        return this._name;
    }

    public get cameras (): Camera[] {
        return this._cameras;
    }

    public get mainCamera (): Camera | null {
        return this._mainCamera;
    }

    public get lights (): Light[] {
        return this._lights;
    }

    public get models (): Model[] {
        return this._models;
    }

    public static registerCreateFunc (root: Root) {
        root._createSceneFun = (_root: Root): RenderScene => new RenderScene(_root);
    }

    private _root: Root;
    private _name: string = '';
    private _nodes: Map<number, Node> = new Map();
    private _cameras: Camera[] = [];
    private _mainCamera: Camera | null = null;
    private _lights: Light[] = [];
    private _models: Model[] = [];
    private _modelId: number = 0;

    private constructor (root: Root) {
        this._root = root;
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;
        this._mainCamera = this.createCamera('mainCamera');

        return true;
    }

    public destroy () {
        this.destroyCameras();
        this.destroyLights();
        this.destroyNodes();
        this.destroyModels();
    }

    public createNode (info: ISceneNodeInfo): Node {
        const node = new Node(info.name);
        this._nodes.set(node.uuid, node);
        return node;
    }

    public destroyNode (node: Node) {
        this._nodes.delete(node.uuid);
    }

    public destroyNodes () {
        this._nodes.clear();
    }

    public getNode (id: number): Node | null {
        const node = this._nodes.get(id);
        if (node) {
            return node;
        } else {
            return null;
        }
    }

    public createCamera (name: string): Camera {
        const camera = new Camera(this, name);
        this._cameras.push(camera);
        return camera;
    }

    public destroyCamera (camera: Camera) {
        for (let i = 0; i < this._cameras.length; ++i) {
            if (this._cameras[i] === camera) {
                this._cameras.slice(i);
                return;
            }
        }
    }

    public destroyCameras () {
        this._cameras = [];
        this._mainCamera = null;
    }

    public getCamera (name: string): Camera | null {
        for (const camera of this._cameras) {
            if (camera.name === name) {
                return camera;
            }
        }

        return null;
    }

    public createLight (name: string): Light {
        const light = new Light(this, name);
        this._lights.push(light);
        return light;
    }

    public destroyLight (light: Light) {
        for (let i = 0; i < this._lights.length; ++i) {
            if (this._lights[i] === light) {
                this._lights.slice(i);
                return;
            }
        }
    }

    public destroyLights () {
        this._lights = [];
    }

    public getLight (name: string): Light | null {
        for (const light of this._lights) {
            if (light.getName() === name) {
                return light;
            }
        }

        return null;
    }

    public createModel<T extends Model> (clazz: new () => T): Model {
        const model = new clazz();
        model.initialize();
        model.scene = this;
        this._models.push(model);
        return model;
    }

    public destroyModel (model: Model) {
        for (let i = 0; i < this._models.length; ++i) {
            if (this._models[i] === model) {
                this._models.splice(i, 1);
                return;
            }
        }
    }

    public destroyModels () {
        this._models = [];
    }

    public generateModelId (): number {
        return this._modelId++;
    }
}
