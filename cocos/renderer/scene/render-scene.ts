import { _createSceneFun, Root } from '../../core/root';
import { Camera, ICameraInfo } from './camera';
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
    private _cameras: Camera[] = [];
    private _lights: Light[] = [];
    private _models: Model[] = [];
    private _modelId: number = 0;

    private constructor (root: Root) {
        this._root = root;
    }

    public initialize (info: IRenderSceneInfo): boolean {
        this._name = info.name;

        return true;
    }

    public destroy () {
        this.destroyCameras();
        this.destroyLights();
        this.destroyModels();
    }

    public createCamera (info: ICameraInfo): Camera {
        const camera = new Camera(this, info);
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
