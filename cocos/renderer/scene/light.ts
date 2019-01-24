import { RenderScene } from './render-scene';

export enum LightType {
    UNKNOWN,
    DIRECTIONAL,
    POINT,
    SPOT,
}

export class Light {
    protected _color = Float32Array.from([1, 1, 1, 1]);
    protected _enabled = false;

    set enabled (val) {
        this._enabled = val;
    }
    get enabled () {
        return this._enabled;
    }

    set color (val: number[]) {
        this._color.set(val);
    }
    get colorData () {
        return this._color;
    }

    get type (): LightType {
        return this._type;
    }
    get name (): string {
        return this._name;
    }

    protected _scene: RenderScene;
    protected _type: LightType;
    protected _name: string;

    constructor (scene: RenderScene, name: string) {
        this._scene = scene;
        this._name = name;
        this._type = LightType.UNKNOWN;
    }
}
