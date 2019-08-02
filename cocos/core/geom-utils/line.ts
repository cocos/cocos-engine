/**
 * @category gemotry-utils
 */

import { Vec3 } from '../../core/math';
import enums from './enums';

/**
 * @zh
 * 基础几何 line。
 */
// tslint:disable-next-line:class-name
export default class line {

    /**
     * @en
     * create a new line
     * @zh
     * 创建一个新的 line。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     * @return
     */
    public static create (sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) {
        return new line(sx, sy, sz, ex, ey, ez);
    }

    /**
     * @en
     * Creates a new line initialized with values from an existing line
     * @zh
     * 克隆一个新的 line。
     * @param a 克隆的来源。
     * @return 克隆出的对象。
     */
    public static clone (a: line) {
        return new line(
            a.s.x, a.s.y, a.s.z,
            a.e.x, a.e.y, a.e.z,
        );
    }

    /**
     * @en
     * Copy the values from one line to another
     * @zh
     * 复制一个线的值到另一个。
     * @param out 接受操作的对象。
     * @param a 复制的来源。
     * @return 接受操作的对象。
     */
    public static copy (out: line, a: line) {
        Vec3.copy(out.s, a.s);
        Vec3.copy(out.e, a.e);

        return out;
    }

    /**
     * @en
     * create a line from two points
     * @zh
     * 用两个点创建一个线。
     * @param out 接受操作的对象。
     * @param start 起点。
     * @param end 终点。
     * @return out 接受操作的对象。
     */
    public static fromPoints (out: line, start: Vec3, end: Vec3) {
        Vec3.copy(out.s, start);
        Vec3.copy(out.e, end);
        return out;
    }

    /**
     * @en
     * Set the components of a Vec3 to the given values
     * @zh
     * 将给定线的属性设置为给定值。
     * @param out 接受操作的对象。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     * @return out 接受操作的对象。
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
     * @zh
     * 计算线的长度。
     * @param a 要计算的线。
     * @return 长度。
     */
    public static len (a: line) {
        return Vec3.distance(a.s, a.e);
    }

    /**
     * @zh
     * 起点。
     */
    public s: Vec3;

    /**
     * @zh
     * 终点。
     */
    public e: Vec3;

    private _type: number;

    /**
     * 构造一条线。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     */
    constructor (sx = 0, sy = 0, sz = 0, ex = 0, ey = 0, ez = -1) {
        this._type = enums.SHAPE_LINE;
        this.s = new Vec3(sx, sy, sz);
        this.e = new Vec3(ex, ey, ez);
    }

    /**
     * @zh
     * 计算线的长度。
     * @param a 要计算的线。
     * @return 长度。
     */
    public length () {
        return Vec3.distance(this.s, this.e);
    }
}
