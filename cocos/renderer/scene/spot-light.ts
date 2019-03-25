import { aabb, frustum } from '../../3d/geom-utils';
import { Mat4, Quat, Vec3 } from '../../core/value-types';
import { v3 } from '../../core/value-types/vec3';
import { mat4, vec3 } from '../../core/vmath';
import { Node } from '../../scene-graph/node';
import { Light, LightType, nt2lm } from './light';
import { RenderScene } from './render-scene';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();
const _matView = new Mat4();
const _matProj = new Mat4();
const _matViewProj = new Mat4();
const _matViewProjInv = new Mat4();

export class SpotLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);
    protected _size: number = 0.15;
    protected _range: number = 5.0;
    protected _luminance: number = 1700 / nt2lm(this._size);
    protected _spotAngle: number = Math.cos(Math.PI / 6);
    protected _pos: Vec3;
    protected _aabb: aabb;
    protected _frustum: frustum;
    protected _angle: number = 0;

    get position () {
        return this._pos;
    }

    set size (size: number) {
        this._size = size;
    }

    get size (): number {
        return this._size;
    }

    set range (range: number) {
        this._range = range;
    }

    get range (): number {
        return this._range;
    }

    set luminance (lum: number) {
        this._luminance = lum;
    }

    get luminance (): number {
        return this._luminance;
    }

    get direction (): Vec3 {
        return this._dir;
    }

    get spotAngle () {
        return this._spotAngle;
    }

    set spotAngle (val: number) {
        this._angle = val * 0.5;
        this._spotAngle = Math.cos(val * 0.5);
    }

    get aabb () {
        return this._aabb;
    }

    get frustum () {
        return this._frustum;
    }

    constructor (scene: RenderScene, name: string, node: Node) {
        super(scene, name, node);
        this._type = LightType.SPOT;
        this._aabb = aabb.create();
        this._frustum = frustum.create();
        this._pos = v3();
    }

    public update () {
        if (this._node) {
            this._node.getWorldPosition(this._pos);
            this._dir = vec3.transformQuat(_v3, _forward, this._node.getWorldRotation(_qt));
            vec3.normalize(this._dir, this._dir);
            aabb.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range);

            // view matrix
            this._node.getWorldRT(_matView);
            mat4.invert(_matView, _matView);

            mat4.perspective(_matProj, this._angle, 1, 0.001, this._range);

            // view-projection
            mat4.mul(_matViewProj, _matProj, _matView);
            mat4.invert(_matViewProjInv, _matViewProj);

            this._frustum.update(_matViewProj, _matViewProjInv);
        }
    }
}
