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

import { Vec3 } from '../value-types';
import enums from './enums';
import { IVec3Like } from '../value-types/math';

/**
 * !#en
 * ray
 * !#zh
 * 射线。
 * @class geomUtils.Ray
 */
export default class ray {

    /**
     * !#en
     * create a new ray
     * !#zh
     * 创建一条射线。
     * @method create
     * @param {number} ox The x part of the starting point.
     * @param {number} oy The y part of the starting point.
     * @param {number} oz The z part of the starting point.
     * @param {number} dx X in the direction.
     * @param {number} dy Y in the direction.
     * @param {number} dz Z in the direction.
     * @return {Ray}
     */
    public static create (ox: number = 0, oy: number = 0, oz: number = 0, dx: number = 0, dy: number = 0, dz: number = 1): ray {
        return new ray(ox, oy, oz, dx, dy, dz);
    }

    /**
     * !#en
     * Creates a new ray initialized with values from an existing ray
     * !#zh
     * 从一条射线克隆出一条新的射线。
     * @method clone
     * @param {Ray} a Clone target
     * @return {Ray} Clone result
     */
    public static clone (a: ray): ray {
        return new ray(
            a.o.x, a.o.y, a.o.z,
            a.d.x, a.d.y, a.d.z,
        );
    }

    /**
     * !#en
     * Copy the values from one ray to another
     * !#zh
     * 将从一个 ray 的值复制到另一个 ray。
     * @method copy
     * @param {Ray} out Accept the ray of the operation.
     * @param {Ray} a Copied ray.
     * @return {Ray} out Accept the ray of the operation.
     */
    public static copy (out: ray, a: ray): ray {
        Vec3.copy(out.o, a.o);
        Vec3.copy(out.d, a.d);

        return out;
    }

    /**
     * !#en
     * create a ray from two points
     * !#zh
     * 用两个点创建一条射线。
     * @method fromPoints
     * @param {Ray} out Receive the operating ray.
     * @param {Vec3} origin Origin of ray
     * @param {Vec3} target A point on a ray.
     * @return {Ray} out Receive the operating ray.
     */
    public static fromPoints (out: ray, origin: Vec3, target: Vec3): ray {
        Vec3.copy(out.o, origin);
        Vec3.normalize(out.d, Vec3.subtract(out.d, target, origin));
        return out;
    }

    /**
     * !#en
     * Set the components of a ray to the given values
     * !#zh
     * 将给定射线的属性设置为给定的值。
     * @method set
     * @param {Ray} out Receive the operating ray.
     * @param {number} ox The x part of the starting point.
     * @param {number} oy The y part of the starting point.
     * @param {number} oz The z part of the starting point.
     * @param {number} dx X in the direction.
     * @param {number} dy Y in the direction.
     * @param {number} dz Z in the direction.
     * @return {Ray} out Receive the operating ray.
     */
    public static set (out: ray, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): ray {
        out.o.x = ox;
        out.o.y = oy;
        out.o.z = oz;
        out.d.x = dx;
        out.d.y = dy;
        out.d.z = dz;

        return out;
    }

    /**
     * !#en
     * Start point.
     * !#zh
     * 起点。
     * @property {Vec3} o
     */
    public o: Vec3;

    /**
     * !#e
     * Direction
     * !#zh
     * 方向。
     * @property {Vec3} d
     */
    public d: Vec3;

    private _type: number;

    /**
     * !#en Construct a ray.
     * !#zh 构造一条射线。
     * @constructor
     * @param {number} ox The x part of the starting point.
     * @param {number} oy The y part of the starting point.
     * @param {number} oz The z part of the starting point.
     * @param {number} dx X in the direction.
     * @param {number} dy Y in the direction.
     * @param {number} dz Z in the direction.
     */
    constructor (ox: number = 0, oy: number = 0, oz: number = 0,
        dx: number = 0, dy: number = 0, dz: number = -1) {
        this._type = enums.SHAPE_RAY;
        this.o = new Vec3(ox, oy, oz);
        this.d = new Vec3(dx, dy, dz);
    }

    /**
     * !#en Compute hit.
     * @method computeHit
     * @param {IVec3Like} out
     * @param {number} distance
     */
    public computeHit (out: IVec3Like, distance: number) {
        Vec3.normalize(out, this.d)
        Vec3.scaleAndAdd(out, this.o, out, distance);
    }
}
