/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import Vec3 from '../value-types/vec3';
import Mat3 from '../value-types/mat3';
import enums from './enums';

let _v3_tmp = new Vec3();
let _v3_tmp2 = new Vec3();
let _m3_tmp = new Mat3();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
let transform_extent_m4 = function (out, extent, m4) {
    let _m3_tmpm = _m3_tmp.m, m4m = m4.m;
    _m3_tmpm[0] = Math.abs(m4m[0]); _m3_tmpm[1] = Math.abs(m4m[1]); _m3_tmpm[2] = Math.abs(m4m[2]);
    _m3_tmpm[3] = Math.abs(m4m[4]); _m3_tmpm[4] = Math.abs(m4m[5]); _m3_tmpm[5] = Math.abs(m4m[6]);
    _m3_tmpm[6] = Math.abs(m4m[8]); _m3_tmpm[7] = Math.abs(m4m[9]); _m3_tmpm[8] = Math.abs(m4m[10]);
    Vec3.transformMat3(out, extent, _m3_tmp);
};

/**
 * Aabb
 * @class geomUtils.Aabb
 */
export default class aabb {

    /**
     * create a new aabb
     * @method create
     * @param {number} px X coordinates for aabb's original point
     * @param {number} py Y coordinates for aabb's original point
     * @param {number} pz Z coordinates for aabb's original point
     * @param {number} w the half of aabb width
     * @param {number} h the half of aabb height
     * @param {number} l the half of aabb length
     * @return {geomUtils.Aabb}
     */
    public static create (px, py, pz, w, h, l) {
        return new aabb(px, py, pz, w, h, l);
    }

    /**
     * clone a new aabb
     * @method clone
     * @param {geomUtils.Aabb} a the source aabb
     * @return {geomUtils.Aabb}
     */
    public static clone (a) {
        return new aabb(a.center.x, a.center.y, a.center.z,
            a.halfExtents.x, a.halfExtents.y, a.halfExtents.z);
    }

    /**
     * copy the values from one aabb to another
     * @method copy
     * @param {geomUtils.Aabb} out the receiving aabb
     * @param {geomUtils.Aabb} a the source aabb
     * @return {geomUtils.Aabb}
     */
    public static copy (out, a) {
        Vec3.copy(out.center, a.center);
        Vec3.copy(out.halfExtents, a.halfExtents);

        return out;
    }

    /**
     * create a new aabb from two corner points
     * @method fromPoints
     * @param {geomUtils.Aabb} out the receiving aabb
     * @param {Vec3} minPos lower corner position of the aabb
     * @param {Vec3} maxPos upper corner position of the aabb
     * @return {geomUtils.Aabb}
     */
    public static fromPoints (out, minPos, maxPos) {
        Vec3.scale(out.center, Vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        Vec3.scale(out.halfExtents, Vec3.sub(_v3_tmp2, maxPos, minPos), 0.5);
        return out;
    }

    /**
     * Set the components of a aabb to the given values
     * @method set
     * @param {geomUtils.Aabb} out the receiving aabb
     * @param {number} px X coordinates for aabb's original point
     * @param {number} py Y coordinates for aabb's original point
     * @param {number} pz Z coordinates for aabb's original point
     * @param {number} w the half of aabb width
     * @param {number} h the half of aabb height
     * @param {number} l the half of aabb length
     * @return {geomUtils.Aabb} out
     */
    public static set (out, px, py, pz, w, h, l) {
        Vec3.set(out.center, px, py, pz);
        Vec3.set(out.halfExtents, w, h, l);
        return out;
    }

    /**
     * @property {Vec3} center
     */
    center: Vec3;
    /**
     * @property {Vec3} halfExtents
     */
    halfExtents: Vec3;
    /**
     * @property {number} _type
     */
    _type: number;

    constructor (px: number, py: number, pz: number, w: number, h: number, l: number) {
        this._type = enums.SHAPE_AABB;
        this.center = new Vec3(px, py, pz);
        this.halfExtents = new Vec3(w, h, l);
    }


    /**
     * Get the bounding points of this shape
     * @method getBoundary
     * @param {Vec3} minPos
     * @param {Vec3} maxPos
     */
    getBoundary (minPos, maxPos) {
        Vec3.sub(minPos, this.center, this.halfExtents);
        Vec3.add(maxPos, this.center, this.halfExtents);
    }

    /**
     * Transform this shape
     * @method transform
     * @param {Mat4} m the transform matrix
     * @param {Vec3} pos the position part of the transform
     * @param {Quat} rot the rotation part of the transform
     * @param {Vec3} scale the scale part of the transform
     * @param {geomUtils.Aabb} [out] the target shape
     */
    transform (m, pos, rot, scale, out) {
        if (!out) out = this;
        Vec3.transformMat4(out.center, this.center, m);
        transform_extent_m4(out.halfExtents, this.halfExtents, m);
    }
}
