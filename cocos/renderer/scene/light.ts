import { Vec3 } from '../../core/value-types';
import { ColorTemperatureToRGB } from '../../pipeline/define';
import { Node } from '../../scene-graph/node';
import { RenderScene } from './render-scene';

export enum LightType {
    DIRECTIONAL,
    SPHERE,
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

    set color (color: Vec3) {
        this._color.set(color);
    }

    get color (): Vec3 {
        return this._color;
    }

    set useColorTemperature (enable: boolean) {
        this._useColorTemp = enable;
    }

    get useColorTemperature (): boolean {
        return this._useColorTemp;
    }

    set colorTemperature (val: number) {
        this._colorTemp = val;
        ColorTemperatureToRGB(this._colorTempRGB, this._colorTemp);
    }

    get colorTemperature (): number {
        return this._colorTemp;
    }

    get colorTemperatureRGB (): Vec3 {
        return this._colorTempRGB;
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

    protected _enabled = true;
    protected _color: Vec3 = new Vec3(1, 1, 1);
    protected _useColorTemp: boolean = false;
    protected _colorTemp: number = 6550.0;
    protected _colorTempRGB: Vec3 = new Vec3(1, 1, 1);
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
