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

/**
 * !#en 
 * line
 * !#zh
 * 直线
 * @class geomUtils.Line
 */
export default class line {

    /**
     * !#en
     * create a new line
     * !#zh
     * 创建一个新的 line。
     * @method create
     * @param {Number} sx The x part of the starting point.
     * @param {Number} sy The y part of the starting point.
     * @param {Number} sz The z part of the starting point.
     * @param {Number} ex The x part of the end point.
     * @param {Number} ey The y part of the end point.
     * @param {Number} ez The z part of the end point.
     * @return {Line}
     */
    public static create (sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) {
        return new line(sx, sy, sz, ex, ey, ez);
    }

    /**
     * !#en
     * Creates a new line initialized with values from an existing line
     * !#zh
     * 克隆一个新的 line。
     * @method clone
     * @param {Line} a The source of cloning.
     * @return {Line} The cloned object.
     */
    public static clone (a: line) {
        return new line(
            a.s.x, a.s.y, a.s.z,
            a.e.x, a.e.y, a.e.z,
        );
    }

    /**
     * !#en
     * Copy the values from one line to another
     * !#zh
     * 复制一个线的值到另一个。
     * @method copy
     * @param {Line} out The object that accepts the action.
     * @param {Line} a The source of the copy.
     * @return {Line} The object that accepts the action.
     */
    public static copy (out: line, a: line) {
        Vec3.copy(out.s, a.s);
        Vec3.copy(out.e, a.e);

        return out;
    }

    /**
     * !#en
     * create a line from two points
     * !#zh
     * 用两个点创建一个线。
     * @method fromPoints
     * @param {Line} out The object that accepts the action.
     * @param {Vec3} start The starting point.
     * @param {Vec3} end At the end.
     * @return {Line} out The object that accepts the action.
     */
    public static fromPoints (out: line, start: Vec3, end: Vec3) {
        Vec3.copy(out.s, start);
        Vec3.copy(out.e, end);
        return out;
    }

    /**
     * !#en
     * Set the components of a Vec3 to the given values
     * !#zh
     * 将给定线的属性设置为给定值。
     * @method set
     * @param {Line} out The object that accepts the action.
     * @param {Number} sx The x part of the starting point.
     * @param {Number} sy The y part of the starting point.
     * @param {Number} sz The z part of the starting point.
     * @param {Number} ex The x part of the end point.
     * @param {Number} ey The y part of the end point.
     * @param {Number} ez The z part of the end point.
     * @return {Line} out The object that accepts the action.
     */
    public static set (out: line, sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) {
        out.s.x = sx;
        out.s.y = sy;
        out.s.z = sz;
        out.e.x = ex;
        out.e.y = ey;
        out.e.z = ez;

        return out;
    }

    /**
     * !#en
     * Calculate the length of the line.
     * !#zh
     * 计算线的长度。
     * @method len
     * @param {Line} a The line to calculate.
     * @return {Number} Length.
     */
    public static len (a: line) {
        return Vec3.distance(a.s, a.e);
    }

    /**
     * !#en
     * Start points.
     * !#zh
     * 起点。
     * @property {Vec3} s
     */
    public s: Vec3;

    /**
     * !#en
     * End points.
     * !#zh
     * 终点。
     * @property {Vec3} e
     */
    public e: Vec3;

    private _type: number;

    /**
     * !#en Construct a line.
     * !#zh 构造一条线。
     * @constructor
     * @param {Number} sx The x part of the starting point.
     * @param {Number} sy The y part of the starting point.
     * @param {Number} sz The z part of the starting point.
     * @param {Number} ex The x part of the end point.
     * @param {Number} ey The y part of the end point.
     * @param {Number} ez The z part of the end point.
     */
    constructor (sx = 0, sy = 0, sz = 0, ex = 0, ey = 0, ez = -1) {
        this._type = enums.SHAPE_LINE;
        this.s = new Vec3(sx, sy, sz);
        this.e = new Vec3(ex, ey, ez);
    }

    /**
     * !#en
     * Calculate the length of the line.
     * !#zh
     * 计算线的长度。
     * @method length
     * @return {Number} Length.
     */
    public length () {
        return Vec3.distance(this.s, this.e);
    }
}
