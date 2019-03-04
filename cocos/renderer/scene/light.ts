import { Node } from '../../scene-graph/node';
import { RenderScene } from './render-scene';

export enum LightType {
    DIRECTIONAL,
    POINT,
    SPOT,
    UNKNOWN,
}

export class Light {

    set enabled (val) {
        this._enabled = val;
    }
    get enabled () {
        return this._enabled;
    }

    set color (color: Float32Array) {
        this._color.set(color);
    }

    get color () {
        return this._color;
    }

    get type (): LightType {
        return this._type;
    }
    get name (): string {
        return this._name;
    }

    set node (n: Node | null) {
        this._node = n;
    }

    get node (): Node | null {
        return this._node;
    }

    protected _color = Float32Array.from([1, 1, 1, 1]);
    protected _enabled = false;
    protected _scene: RenderScene;
    protected _node: Node | null = null;
    protected _type: LightType;
    protected _name: string;

    constructor (scene: RenderScene, name: string) {
        this._scene = scene;
        this._name = name;
        this._type = LightType.UNKNOWN;
    }

    public update () {}
}
