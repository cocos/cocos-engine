/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @category core/value-types
 */

import { Mat4 } from './mat4';
import { Rect } from './rect';
import { Size } from './size';
import { Vec2 } from './vec2';

/**
 * 二维仿射变换矩阵，描述了平移、缩放和缩放。
 */
export class AffineTransform {
    /**
     * 创建二维放射变换矩阵。
     * @param a a 元素。
     * @param b b 元素。
     * @param c c 元素。
     * @param d d 元素。
     * @param tx tx 元素。
     * @param ty ty 元素。
     * @returns `new AffineTransform(a, b, c, d, tx, ty)`
     */
    public static create (a: number, b: number, c: number, d: number, tx: number, ty: number) {
        return new AffineTransform(a, b, c, d, tx, ty);
    }

    /**
     * 创建单位二维仿射变换矩阵，它不进行任何变换。
     */
    public static identity () {
        return new AffineTransform();
    }

    /**
     * 克隆指定的二维仿射变换矩阵。
     * @param affineTransform 指定的二维仿射变换矩阵。
     */
    public static clone (affineTransform: AffineTransform) {
        return new AffineTransform(
            affineTransform.a, affineTransform.b,
            affineTransform.c, affineTransform.d,
            affineTransform.tx, affineTransform.ty);
    }

    /**
     * 将两个矩阵相乘的结果赋值给出口矩阵。
     * @param out 出口矩阵。
     * @param t1 左矩阵。
     * @param t2 右矩阵。
     */
    public static concat (out: AffineTransform, t1: AffineTransform, t2: AffineTransform) {
        const a = t1.a;
        const b = t1.b;
        const c = t1.c;
        const d = t1.d;
        const tx = t1.tx;
        const ty = t1.ty;
        out.a = a * t2.a + b * t2.c;
        out.b = a * t2.b + b * t2.d;
        out.c = c * t2.a + d * t2.c;
        out.d = c * t2.b + d * t2.d;
        out.tx = tx * t2.a + ty * t2.c + t2.tx;
        out.ty = tx * t2.b + ty * t2.d + t2.ty;
    }

    /**
     * 将矩阵求逆的结果赋值给出口矩阵。
     * @param out 出口矩阵。
     * @param t 求逆的矩阵。
     */
    public static invert (out: AffineTransform, t: AffineTransform) {
        const { a, b, c, d } = t;
        const determinant = 1 / (a * d - b * c);
        const tx = t.tx;
        const ty = t.ty;
        out.a = determinant * d;
        out.b = -determinant * b;
        out.c = -determinant * c;
        out.d = determinant * a;
        out.tx = determinant * (c * ty - d * tx);
        out.ty = determinant * (b * tx - a * ty);
    }

    /**
     * 将四维矩阵转换为二维仿射变换矩阵并赋值给出口矩阵。
     * @param out 出口矩阵。
     * @param mat 四维矩阵。
     */
    public static fromMat4 (out: AffineTransform, mat: Mat4) {
        out.a = mat.m00;
        out.b = mat.m01;
        out.c = mat.m04;
        out.d = mat.m05;
        out.tx = mat.m12;
        out.ty = mat.m13;
    }

    /**
     * 应用二维仿射变换矩阵到二维向量上，并将结果赋值给出口向量。
     * @param out 出口向量。
     * @param point 应用变换的向量。
     * @param t 二维仿射变换矩阵。
     */
    public static transformVec2 (out: Vec2, point: Vec2, t: AffineTransform);

    /**
     * 应用二维仿射变换矩阵到二维向量上，并将结果赋值给出口向量。
     * @param out 出口向量。
     * @param x 应用变换的向量的 x 分量。
     * @param y 应用变换的向量的 y 分量。
     * @param t 二维仿射变换矩阵。
     */
    public static transformVec2 (out: Vec2, x: number, y: number, t: AffineTransform);

    public static transformVec2 (out: Vec2, point: any, transOrY: any, t?: any) {
        let x;
        let y;
        if (t === undefined) {
            t = transOrY;
            x = point.x;
            y = point.y;
        } else {
            x = point;
            y = transOrY;
        }
        out.x = t.a * x + t.c * y + t.tx;
        out.y = t.b * x + t.d * y + t.ty;
    }

    /**
     * 应用二维仿射变换矩阵到二维尺寸上，并将结果赋值给出口尺寸。
     * @param out 出口尺寸。
     * @param size 应用变换的尺寸。
     * @param t 二维仿射变换矩阵。
     */
    public static transformSize (out: Size, size: Size, t: AffineTransform) {
        out.width = t.a * size.width + t.c * size.height;
        out.height = t.b * size.width + t.d * size.height;
    }

    /**
     * 应用二维仿射变换矩阵到矩形上，并将结果赋值给出口矩形。
     * @param out 出口矩形。
     * @param rect 应用变换的矩形。
     * @param t 二维仿射变换矩阵。
     */
    public static transformRect (out: Rect, rect: Rect, t: AffineTransform) {
        const ol = rect.x;
        const ob = rect.y;
        const or = ol + rect.width;
        const ot = ob + rect.height;
        const lbx = t.a * ol + t.c * ob + t.tx;
        const lby = t.b * ol + t.d * ob + t.ty;
        const rbx = t.a * or + t.c * ob + t.tx;
        const rby = t.b * or + t.d * ob + t.ty;
        const ltx = t.a * ol + t.c * ot + t.tx;
        const lty = t.b * ol + t.d * ot + t.ty;
        const rtx = t.a * or + t.c * ot + t.tx;
        const rty = t.b * or + t.d * ot + t.ty;

        const minX = Math.min(lbx, rbx, ltx, rtx);
        const maxX = Math.max(lbx, rbx, ltx, rtx);
        const minY = Math.min(lby, rby, lty, rty);
        const maxY = Math.max(lby, rby, lty, rty);

        out.x = minX;
        out.y = minY;
        out.width = maxX - minX;
        out.height = maxY - minY;
    }

    /**
     * 应用二维仿射变换矩阵到矩形上, 并转换为有向包围盒。
     * 这个函数不创建任何内存，你需要先创建包围盒的四个 Vector 对象用来存储结果，并作为前四个参数传入函数。
     */
    public static transformObb (out_bl: Vec2, out_tl: Vec2, out_tr: Vec2, out_br: Vec2, rect: Rect, anAffineTransform: AffineTransform) {
        const x = rect.x;
        const y = rect.y;
        const width = rect.width;
        const height = rect.height;

        const tx = anAffineTransform.a * x + anAffineTransform.c * y + anAffineTransform.tx;
        const ty = anAffineTransform.b * x + anAffineTransform.d * y + anAffineTransform.ty;
        const xa = anAffineTransform.a * width;
        const xb = anAffineTransform.b * width;
        const yc = anAffineTransform.c * height;
        const yd = anAffineTransform.d * height;

        out_tl.x = tx;
        out_tl.y = ty;
        out_tr.x = xa + tx;
        out_tr.y = xb + ty;
        out_bl.x = yc + tx;
        out_bl.y = yd + ty;
        out_br.x = xa + yc + tx;
        out_br.y = xb + yd + ty;
    }

    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public tx: number;
    public ty: number;

    /**
     * 构造二维放射变换矩阵。
     * @param a a 元素。
     * @param b b 元素。
     * @param c c 元素。
     * @param d d 元素。
     * @param tx tx 元素。
     * @param ty ty 元素。
     */
    constructor (a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
}

cc.AffineTransform = AffineTransform;
