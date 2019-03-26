import { Color, Mat4, Quat, Vec3 } from '../../core/value-types';
import { color4, mat4, vec3 } from '../../core/vmath';
import { UBOShadow } from '../../pipeline/define';
import { DirectionalLight } from './directional-light';
import { RenderScene } from './render-scene';
import { SphereLight } from './sphere-light';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();

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

    set shadowColor (color: Color) {
        color4.array(this._data, color, UBOShadow.SHADOW_COLOR_OFFSET);
    }

    get matLight () {
        return this._matLight;
    }

    get data () {
        return this._data;
    }

    protected _scene: RenderScene;
    protected _normal = new Vec3(0, 1, 0);
    protected _distance = 0;
    protected _matLight = new Mat4();
    protected _data = Float32Array.from([
        1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, // matLightPlaneProj
        0.3, 0.3, 0.3, 1.0, // shadowColor
    ]);

    constructor (scene: RenderScene) {
        this._scene = scene;
    }

    // tslint:disable: one-variable-per-declaration
    public updateSphereLight (light: SphereLight) {
        light.node.getWorldPosition(_v3);
        const n = this._normal, d = this._distance;
        const NdL = vec3.dot(n, _v3);
        const lx = _v3.x, ly = _v3.y, lz = _v3.z;
        const nx = n.x, ny = n.y, nz = n.z;
        const m = this._matLight;
        m.m00 = NdL - d - lx * nx;
        m.m01 = -ly * nx;
        m.m02 = -lz * nx;
        m.m03 = -nx;
        m.m04 = -lx * ny;
        m.m05 = NdL - d - ly * ny;
        m.m06 = -lz * ny;
        m.m07 = -ny;
        m.m08 = -lx * nz;
        m.m09 = -ly * nz;
        m.m10 = NdL - d - lz * nz;
        m.m11 = -nz;
        m.m12 = lx * d;
        m.m13 = ly * d;
        m.m14 = lz * d;
        m.m15 = NdL;
        mat4.array(this.data, this._matLight);
    }

    public updateDirLight (light: DirectionalLight) {
        if (!light.node.hasChanged) { return; }
        light.node.getWorldRotation(_qt);
        vec3.transformQuat(_v3, _forward, _qt);
        const n = this._normal, d = this._distance;
        const NdL = vec3.dot(n, _v3), scale = 1 / NdL;
        const lx = _v3.x * scale, ly = _v3.y * scale, lz = _v3.z * scale;
        const nx = n.x, ny = n.y, nz = n.z;
        const m = this._matLight;
        m.m00 = 1 - nx * lx;
        m.m01 = -nx * ly;
        m.m02 = -nx * lz;
        m.m03 = 0;
        m.m04 = -ny * lx;
        m.m05 = 1 - ny * ly;
        m.m06 = -ny * lz;
        m.m07 = 0;
        m.m08 = -nz * lx;
        m.m09 = -nz * ly;
        m.m10 = 1 - nz * lz;
        m.m11 = 0;
        m.m12 = lx * d;
        m.m13 = ly * d;
        m.m14 = lz * d;
        m.m15 = 1;
        mat4.array(this.data, this._matLight, UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET);
    }
    // tslint:enable: one-variable-per-declaration
}
