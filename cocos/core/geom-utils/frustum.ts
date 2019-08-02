/**
 * @category gemotry-utils
 */

import { Mat4, Vec3 } from '../../core/math';
import enums from './enums';
import plane from './plane';

const _v = new Array(8);
_v[0] = new Vec3(1, 1, 1);
_v[1] = new Vec3(-1, 1, 1);
_v[2] = new Vec3(-1, -1, 1);
_v[3] = new Vec3(1, -1, 1);
_v[4] = new Vec3(1, 1, -1);
_v[5] = new Vec3(-1, 1, -1);
_v[6] = new Vec3(-1, -1, -1);
_v[7] = new Vec3(1, -1, -1);

// tslint:disable-next-line: class-name
export class frustum {

    /**
     * Set whether to use accurate intersection testing function on this frustum
     */
    set accurate (b: boolean) {
        this._type = b ? enums.SHAPE_FRUSTUM_ACCURATE : enums.SHAPE_FRUSTUM;
    }

    public static createOrtho = (() => {
        const _temp_v3 = new Vec3();
        return (out: frustum, width: number, height: number, near: number, far: number, transform: Mat4) => {
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            Vec3.set(_temp_v3, halfWidth, halfHeight, near);
            Vec3.transformMat4(out.vertices[0], _temp_v3, transform);
            Vec3.set(_temp_v3, -halfWidth, halfHeight, near);
            Vec3.transformMat4(out.vertices[1], _temp_v3, transform);
            Vec3.set(_temp_v3, -halfWidth, -halfHeight, near);
            Vec3.transformMat4(out.vertices[2], _temp_v3, transform);
            Vec3.set(_temp_v3, halfWidth, -halfHeight, near);
            Vec3.transformMat4(out.vertices[3], _temp_v3, transform);
            Vec3.set(_temp_v3, halfWidth, halfHeight, far);
            Vec3.transformMat4(out.vertices[4], _temp_v3, transform);
            Vec3.set(_temp_v3, -halfWidth, halfHeight, far);
            Vec3.transformMat4(out.vertices[5], _temp_v3, transform);
            Vec3.set(_temp_v3, -halfWidth, -halfHeight, far);
            Vec3.transformMat4(out.vertices[6], _temp_v3, transform);
            Vec3.set(_temp_v3, halfWidth, -halfHeight, far);
            Vec3.transformMat4(out.vertices[7], _temp_v3, transform);

            plane.fromPoints(out.planes[0], out.vertices[1], out.vertices[6], out.vertices[5]);
            plane.fromPoints(out.planes[1], out.vertices[3], out.vertices[4], out.vertices[7]);
            plane.fromPoints(out.planes[2], out.vertices[6], out.vertices[3], out.vertices[7]);
            plane.fromPoints(out.planes[3], out.vertices[0], out.vertices[5], out.vertices[4]);
            plane.fromPoints(out.planes[4], out.vertices[2], out.vertices[0], out.vertices[3]);
            plane.fromPoints(out.planes[0], out.vertices[7], out.vertices[5], out.vertices[6]);
        };
    })();

    /**
     * create a new frustum
     *
     * @return {frustum}
     */
    public static create () {
        return new frustum();
    }

    /**
     * Clone a frustum
     */
    public static clone (f: frustum): frustum {
        return frustum.copy(new frustum(), f);
    }

    /**
     * Copy the values from one frustum to another
     */
    public static copy (out: frustum, f: frustum): frustum {
        out._type = f._type;
        for (let i = 0; i < 6; ++i) {
            plane.copy(out.planes[i], f.planes[i]);
        }
        for (let i = 0; i < 8; ++i) {
            Vec3.copy(out.vertices[i], f.vertices[i]);
        }
        return out;
    }

    public planes: plane[];
    public vertices: Vec3[];
    private _type: number;

    constructor () {
        this._type = enums.SHAPE_FRUSTUM;
        this.planes = new Array(6);
        for (let i = 0; i < 6; ++i) {
            this.planes[i] = plane.create(0, 0, 0, 0);
        }
        this.vertices = new Array(8);
        for (let i = 0; i < 8; ++i) {
            this.vertices[i] = new Vec3();
        }
    }

    /**
     * Update the frustum information according to the given transform matrix.
     * Note that the resulting planes are not normalized under normal mode.
     *
     * @param {Mat4} m the view-projection matrix
     * @param {Mat4} inv the inverse view-projection matrix
     */
    public update (m: Mat4, inv: Mat4) {
        // RTR4, ch. 22.14.1, p. 983
        // extract frustum planes from view-proj matrix.

        // left plane
        Vec3.set(this.planes[0].n, m.m03 + m.m00, m.m07 + m.m04, m.m11 + m.m08);
        this.planes[0].d = -(m.m15 + m.m12);
        // right plane
        Vec3.set(this.planes[1].n, m.m03 - m.m00, m.m07 - m.m04, m.m11 - m.m08);
        this.planes[1].d = -(m.m15 - m.m12);
        // bottom plane
        Vec3.set(this.planes[2].n, m.m03 + m.m01, m.m07 + m.m05, m.m11 + m.m09);
        this.planes[2].d = -(m.m15 + m.m13);
        // top plane
        Vec3.set(this.planes[3].n, m.m03 - m.m01, m.m07 - m.m05, m.m11 - m.m09);
        this.planes[3].d = -(m.m15 - m.m13);
        // near plane
        Vec3.set(this.planes[4].n, m.m03 + m.m02, m.m07 + m.m06, m.m11 + m.m10);
        this.planes[4].d = -(m.m15 + m.m14);
        // far plane
        Vec3.set(this.planes[5].n, m.m03 - m.m02, m.m07 - m.m06, m.m11 - m.m10);
        this.planes[5].d = -(m.m15 - m.m14);

        if (this._type !== enums.SHAPE_FRUSTUM_ACCURATE) { return; }

        // normalize planes
        for (let i = 0; i < 6; i++) {
            const pl = this.planes[i];
            const invDist = 1 / pl.n.length();
            Vec3.multiplyScalar(pl.n, pl.n, invDist);
            pl.d *= invDist;
        }

        // update frustum vertices
        for (let i = 0; i < 8; i++) {
            Vec3.transformMat4(this.vertices[i], _v[i], inv);
        }
    }

    public transform (mat: Mat4) {
        if (this._type !== enums.SHAPE_FRUSTUM_ACCURATE) {
            return;
        }
        for (let i = 0; i < 8; i++) {
            Vec3.transformMat4(this.vertices[i], this.vertices[i], mat);
        }
        plane.fromPoints(this.planes[0], this.vertices[1], this.vertices[5], this.vertices[6]);
        plane.fromPoints(this.planes[1], this.vertices[3], this.vertices[7], this.vertices[4]);
        plane.fromPoints(this.planes[2], this.vertices[6], this.vertices[7], this.vertices[3]);
        plane.fromPoints(this.planes[3], this.vertices[0], this.vertices[4], this.vertices[5]);
        plane.fromPoints(this.planes[4], this.vertices[2], this.vertices[3], this.vertices[0]);
        plane.fromPoints(this.planes[0], this.vertices[7], this.vertices[6], this.vertices[5]);
    }
}
