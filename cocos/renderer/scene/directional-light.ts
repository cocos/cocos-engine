import { Vec3, Quat } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';
import { Node } from '../../scene-graph/node';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();

export class DirectionalLight extends Light {
    protected _direction = Float32Array.from([0, 0, 1, 0]);

    set direction (val: Vec3) {
        vec3.array(this._direction, val);
    }
    get directionArray () {
        return this._direction;
    }

    constructor (scene: RenderScene, node: Node, name: string) {
        super(scene, node, name);
        this._type = LightType.DIRECTIONAL;
    }

    public update () {
        this.direction = vec3.transformQuat(_v3, _forward, this._node.getWorldRotation(_qt));
    }
}
