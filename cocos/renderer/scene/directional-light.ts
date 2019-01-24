import { Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

export class DirectionalLight extends Light {
    protected _direction = Float32Array.from([0, 0, 1, 0]);

    set direction (val: Vec3) {
        vec3.array(this._direction, val);
    }
    get directionArray () {
        return this._direction;
    }

    constructor (scene: RenderScene, name: string) {
        super(scene, name);
        this._type = LightType.DIRECTIONAL;
    }
}
