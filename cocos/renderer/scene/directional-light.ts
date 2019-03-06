import { Quat, Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { Node } from '../../scene-graph';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();

export class DirectionalLight extends Light {
    protected _direction = new Vec3(0, 0, 1);
    protected _directionArray = Float32Array.from([0, 0, 1, 0]);

    set direction (val: Vec3) {
        this._direction = val;
        vec3.normalize(this._direction, this._direction);
        vec3.array(this._directionArray, this._direction);
    }

    get direction (): Vec3 {
        return this._direction;
    }

    get directionArray (): Float32Array {
        return this._directionArray;
    }

    constructor (scene: RenderScene, name: string, node: Node) {
        super(scene, name, node);
        this._type = LightType.DIRECTIONAL;
    }

    public update () {
        if (this._node) {
            this._direction = vec3.transformQuat(_v3, _forward, this._node.getWorldRotation(_qt));
            vec3.array(this._directionArray, this._direction);
        }
    }
}
