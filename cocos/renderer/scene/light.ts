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

    set color (color) {
        this._color.set(color);
    }

    get color () {
        return this._color;
    }

    set node (n) {
        this._node = n;
    }

    get node () {
        return this._node;
    }

    get type () {
        return this._type;
    }

    get name () {
        return this._name;
    }

    protected _color = Float32Array.from([1, 1, 1, 1]);
    protected _enabled = false;
    protected _scene: RenderScene;
    protected _node: Node;
    protected _type: LightType;
    protected _name: string;

    constructor (scene: RenderScene, name: string, node: Node) {
        this._scene = scene;
        this._name = name;
        this._type = LightType.UNKNOWN;
        this._node = node;
    }

    public update () {}
}
