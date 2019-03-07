import { Color, Vec3 } from '../../core/value-types';
import { color4, vec3 } from '../../core/vmath';
import { UBOShadow } from '../../pipeline/define';
import { Light } from './light';
import { RenderScene } from './render-scene';

const _v3 = new Vec3();

export class PlanarShadow {

    set normal (val: Vec3) {
        vec3.copy(this._normal, val);
    }
    get normal () {
        return this._normal;
    }

    set distance (val: number) {
        this._distance = val;
    }
    get distance () {
        return this._distance;
    }

    set offset (val: number) {
        this._offset = val;
    }
    get offset () {
        return this._offset;
    }

    set shadowColor (color: Color) {
        color4.array(this._data, color, UBOShadow.SHADOW_COLOR_OFFSET);
    }

    get data () {
        return this._data;
    }

    protected _scene: RenderScene;
    protected _normal = new Vec3(0, 1, 0);
    protected _distance = 0;
    protected _offset = 0.01;
    protected _data = Float32Array.from([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // matLightPlaneProj
        0.3, 0.3, 0.3, 1.0, // shadowColor
    ]);

    constructor (scene: RenderScene) {
        this._scene = scene;
    }

    // tslint:disable: one-variable-per-declaration
    public update (light: Light) {
        light.node.getWorldPosition(_v3);
        const n = this._normal, d = this._distance + this._offset;
        const lx = _v3.x, ly = _v3.y, lz = _v3.z;
        const nx = n.x, ny = n.y, nz = n.z;
        const NdL = vec3.dot(n, _v3);
        const m = this._data;
        m[0]  = NdL - d - lx * nx;
        m[1]  = -ly * nx;
        m[2]  = -lz * nx;
        m[3]  = -nx;
        m[4]  = -lx * ny;
        m[5]  = NdL - d - ly * ny;
        m[6]  = -lz * ny;
        m[7]  = -ny;
        m[8]  = -lx * nz;
        m[9]  = -ly * nz;
        m[10] = NdL - d - lz * nz;
        m[11] = -nz;
        m[12] = lx * d;
        m[13] = ly * d;
        m[14] = lz * d;
        m[15] = NdL;
    }
    // tslint:enable: one-variable-per-declaration
}
