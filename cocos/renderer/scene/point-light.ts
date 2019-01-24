import { Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

export class PointLight extends Light {
    protected _positionAndRange = Float32Array.from([0, 0, 0, 10]);

    set position (val: Vec3) {
        vec3.array(this._positionAndRange, val);
    }
    set range (val: number) {
        this._positionAndRange[3] = val;
    }

    get positionAndRange () {
        return this._positionAndRange;
    }

    constructor (scene: RenderScene, name: string) {
        super(scene, name);
        this._type = LightType.POINT;
    }
}
