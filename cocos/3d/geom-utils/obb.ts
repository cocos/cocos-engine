import { mat3, mat4, quat, vec3 } from '../../core/vmath';
import enums from './enums';

const _v3_tmp = vec3.create();
const _v3_tmp2 = vec3.create();
const _m3_tmp = mat3.create();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
const transform_extent_m3 = (out: vec3, extent: vec3, m3: mat3) => {
    _m3_tmp.m00 = Math.abs(m3.m00); _m3_tmp.m01 = Math.abs(m3.m01); _m3_tmp.m02 = Math.abs(m3.m02);
    _m3_tmp.m03 = Math.abs(m3.m03); _m3_tmp.m04 = Math.abs(m3.m04); _m3_tmp.m05 = Math.abs(m3.m05);
    _m3_tmp.m06 = Math.abs(m3.m06); _m3_tmp.m07 = Math.abs(m3.m07); _m3_tmp.m08 = Math.abs(m3.m08);
    vec3.transformMat3(out, extent, _m3_tmp);
};

export default class obb {

    /**
     * create a new obb
     *
     * @param px X coordinates for obb's original point
     * @param py Y coordinates for obb's original point
     * @param pz Z coordinates for obb's original point
     * @param hw the half of obb width
     * @param hh the half of obb height
     * @param hl the half of obb length
     * @param ox_1 orientation matrix coefficient
     * @param ox_2 orientation matrix coefficient
     * @param ox_3 orientation matrix coefficient
     * @param oy_1 orientation matrix coefficient
     * @param oy_2 orientation matrix coefficient
     * @param oy_3 orientation matrix coefficient
     * @param oz_1 orientation matrix coefficient
     * @param oz_2 orientation matrix coefficient
     * @param oz_3 orientation matrix coefficient
     * @return
     */
    public static create (
        px: number, py: number, pz: number,
        hw: number, hh: number, hl: number,
        ox_1: number, ox_2: number, ox_3: number,
        oy_1: number, oy_2: number, oy_3: number,
        oz_1: number, oz_2: number, oz_3: number) {
        return new obb(px, py, pz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
    }

    /**
     * clone a new obb
     *
     * @param a the source obb
     * @return
     */
    public static clone (a: obb) {
        return new obb(a.center.x, a.center.y, a.center.z,
            a.halfExtents.x, a.halfExtents.y, a.halfExtents.z,
            a.orientation.m00, a.orientation.m01, a.orientation.m02,
            a.orientation.m03, a.orientation.m04, a.orientation.m05,
            a.orientation.m06, a.orientation.m07, a.orientation.m08);
    }

    /**
     * copy the values from one obb to another
     *
     * @param out the receiving obb
     * @param a the source obb
     * @return
     */
    public static copy (out: obb, a: obb) {
        vec3.copy(out.center, a.center);
        vec3.copy(out.halfExtents, a.halfExtents);
        mat3.copy(out.orientation, a.orientation);

        return out;
    }

    /**
     * create a new obb from two corner points
     *
     * @param out the receiving obb
     * @param minPos lower corner position of the obb
     * @param maxPos upper corner position of the obb
     * @return
     */
    public static fromPoints (out: obb, minPos: vec3, maxPos: vec3) {
        vec3.scale(out.center, vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        vec3.scale(out.halfExtents, vec3.sub(_v3_tmp2, maxPos, minPos), 0.5);
        mat3.identity(out.orientation);
        return out;
    }

    /**
     * Set the components of a obb to the given values
     *
     * @param out the receiving obb
     * @param px X coordinates for obb's original point
     * @param py Y coordinates for obb's original point
     * @param pz Z coordinates for obb's original point
     * @param hw the half of obb width
     * @param hh the half of obb height
     * @param hl the half of obb length
     * @param ox_1 orientation matrix coefficient
     * @param ox_2 orientation matrix coefficient
     * @param ox_3 orientation matrix coefficient
     * @param oy_1 orientation matrix coefficient
     * @param oy_2 orientation matrix coefficient
     * @param oy_3 orientation matrix coefficient
     * @param oz_1 orientation matrix coefficient
     * @param oz_2 orientation matrix coefficient
     * @param oz_3 orientation matrix coefficient
     * @return out
     */
    public static set (
        out: obb,
        px: number, py: number, pz: number,
        hw: number, hh: number, hl: number,
        ox_1: number, ox_2: number, ox_3: number,
        oy_1: number, oy_2: number, oy_3: number,
        oz_1: number, oz_2: number, oz_3: number) {
        vec3.set(out.center, px, py, pz);
        vec3.set(out.halfExtents, hw, hh, hl);
        mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
        return out;
    }
    public center: vec3;
    public halfExtents: vec3;
    public orientation: mat3;

    private _type: number;

    constructor (px = 0, py = 0, pz = 0,
                 hw = 1, hh = 1, hl = 1,
                 ox_1 = 1, ox_2 = 0, ox_3 = 0,
                 oy_1 = 0, oy_2 = 1, oy_3 = 0,
                 oz_1 = 0, oz_2 = 0, oz_3 = 1) {
        this._type = enums.SHAPE_OBB;
        this.center = vec3.create(px, py, pz);
        this.halfExtents = vec3.create(hw, hh, hl);
        this.orientation = mat3.create(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
    }

    /**
     * Get the bounding points of this shape
     * @param minPos
     * @param maxPos
     */
    public getBoundary (minPos: vec3, maxPos: vec3) {
        transform_extent_m3(_v3_tmp, this.halfExtents, this.orientation);
        vec3.sub(minPos, this.center, _v3_tmp);
        vec3.add(maxPos, this.center, _v3_tmp);
    }

    /**
     * Transform this shape
     * @param m the transform matrix
     * @param pos the position part of the transform
     * @param rot the rotation part of the transform
     * @param scale the scale part of the transform
     * @param [out] the target shape
     */
    public transform (m: mat4, pos: vec3, rot: quat, scale: vec3, out?: obb) {
        if (!out) { out = this; }
        vec3.transformMat4(out.center, this.center, m);
        // parent shape doesn't contain rotations for now
        mat3.fromQuat(out.orientation, rot);
        vec3.mul(out.halfExtents, this.halfExtents, scale);
    }
}
