import { Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

export class SpotLight extends Light {
    protected _direction = Float32Array.from([0, 0, 1, 0]);
    protected _positionAndRange = Float32Array.from([0, 0, 0, 10]);

    set position (val: Vec3) {
        vec3.array(this._positionAndRange, val);
    }
    set range (val: number) {
        this._positionAndRange[3] = val;
    }
    set direction (val: Vec3) {
        vec3.array(this._direction, val);
    }
    set spotAngle (val: number) {
        this._direction[3] = val;
    }

    get positionAndRange () {
        return this._positionAndRange;
    }
    get directionArray () {
        return this._direction;
    }

    constructor (scene: RenderScene, name: string) {
        super(scene, name);
        this._type = LightType.DIRECTIONAL;
    }
}
