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
    protected _color = Float32Array.from([1, 1, 1, 1]);
    protected _enabled = false;
    protected _scene: RenderScene;
    protected _node: Node;
    protected _type: LightType;
    protected _name: string;

    constructor (scene: RenderScene, node: Node, name: string) {
        this._scene = scene;
        this._node = node;
        this._name = name;
        this._type = LightType.UNKNOWN;
    }

    public update () {}
}
