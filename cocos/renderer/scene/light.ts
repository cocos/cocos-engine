import { RenderScene } from './render-scene';

export enum LightType {
    DIRECTIONAL,
    POINT,
}

export class Light {

    public get type (): LightType {
        return this._type;
    }

    public get name (): string {
        return this._name;
    }

    private _scene: RenderScene;
    private _type: LightType;
    private _name: string;

    constructor (scene: RenderScene, type: LightType, name: string) {
        this._scene = scene;
        this._type = type;
        this._name = name;
    }
}
