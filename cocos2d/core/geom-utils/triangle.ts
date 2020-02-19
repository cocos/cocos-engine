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
import enums from './enums';

/**
 * Triangle
 * @class geomUtils.Triangle
 */
export default class triangle {

    /**
     * create a new triangle
     * @method create
     * @param {number} ax
     * @param {number} ay
     * @param {number} az
     * @param {number} bx
     * @param {number} by
     * @param {number} bz
     * @param {number} cx
     * @param {number} cy
     * @param {number} cz
     * @return {geomUtils.Triangle}
     */
    public static create (ax, ay, az, bx, by, bz, cx, cy, cz) {
        return new triangle(ax, ay, az, bx, by, bz, cx, cy, cz);
    }

    /**
     * clone a new triangle
     * @method clone
     * @param {geomUtils.Triangle} t the source plane
     * @return {geomUtils.Triangle}
     */
    public static clone (t) {
        return new triangle(
            t.a.x, t.a.y, t.a.z,
            t.b.x, t.b.y, t.b.z,
            t.c.x, t.c.y, t.c.z
        );
    }

    /**
     * copy the values from one triangle to another
     * @method copy
     * @param {geomUtils.Triangle} out the receiving triangle
     * @param {geomUtils.Triangle} t the source triangle
     * @return {geomUtils.Triangle}
     */
    public static copy (out, t) {
        Vec3.copy(out.a, t.a);
        Vec3.copy(out.b, t.b);
        Vec3.copy(out.c, t.c);

        return out;
    }

    /**
     * Create a triangle from three points
     * @method fromPoints
     * @param {geomUtils.Triangle} out the receiving triangle
     * @param {Vec3} a
     * @param {Vec3} b
     * @param {Vec3} c
     * @return {geomUtils.Triangle}
     */
    public static fromPoints (out, a, b, c) {
        Vec3.copy(out.a, a);
        Vec3.copy(out.b, b);
        Vec3.copy(out.c, c);
        return out;
    }

    /**
     * Set the components of a triangle to the given values
     *
     * @method set
     * @param {geomUtils.Triangle} out the receiving plane
     * @param {number} ax X component of a
     * @param {number} ay Y component of a
     * @param {number} az Z component of a
     * @param {number} bx X component of b
     * @param {number} by Y component of b
     * @param {number} bz Z component of b
     * @param {number} cx X component of c
     * @param {number} cy Y component of c
     * @param {number} cz Z component of c
     * @return {Plane}
     */
    public static set (out, ax, ay, az, bx, by, bz, cx, cy, cz) {
        out.a.x = ax;
        out.a.y = ay;
        out.a.z = az;

        out.b.x = bx;
        out.b.y = by;
        out.b.z = bz;

        out.c.x = cx;
        out.c.y = cy;
        out.c.z = cz;

        return out;
    }

    /**
     * @property {Vec3} a
     */
    a: Vec3;
    /**
     * @property {Vec3} b
     */
    b: Vec3;
    /**
     * @property {Vec3} c
     */
    c: Vec3;

    /**
     * geometry type
     */
    _type: number;

    /**
     * create a new triangle
     * @constructor
     * @param {number} ax
     * @param {number} ay
     * @param {number} az
     * @param {number} bx
     * @param {number} by
     * @param {number} bz
     * @param {number} cx
     * @param {number} cy
     * @param {number} cz
     */
    constructor (ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number) {
        this.a = new Vec3(ax, ay, az);
        this.b = new Vec3(bx, by, bz);
        this.c = new Vec3(cx, cy, cz);
        this._type = enums.SHAPE_TRIANGLE;;
    }
}
