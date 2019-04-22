import Mat4 from './mat4';
import Rect from './rect';
import Size from './size';
import Vec2 from './vec2';

/****************************************************************************
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
 ****************************************************************************/

/**
 * !#en
 * AffineTransform class represent an affine transform matrix. It's composed basically by translation, rotation, scale transformations.<br/>
 * !#zh
 * AffineTransform 类代表一个仿射变换矩阵。它基本上是由平移旋转，缩放转变所组成。<br/>
 */
export default class AffineTransform {

    /**
     * !#en Create a AffineTransform object with all contents in the matrix.
     * !#zh 用在矩阵中的所有内容创建一个 AffineTransform 对象。
     */
    public static create (a: number, b: number, c: number, d: number, tx: number, ty: number) {
        return new AffineTransform(a, b, c, d, tx, ty);
    }

    /**
     * !#en
     * Create a identity transformation matrix: <br/>
     * [ 1, 0, 0, <br/>
     *   0, 1, 0 ]
     * !#zh
     * 单位矩阵：<br/>
     * [ 1, 0, 0, <br/>
     *   0, 1, 0 ]
     */
    public static identity () {
        return new AffineTransform();
    }

    /**
     * !#en Clone a AffineTransform object from the specified transform.
     * !#zh 克隆指定的 AffineTransform 对象。
     */
    public static clone (t: AffineTransform) {
        return new AffineTransform(t.a, t.b, t.c, t.d, t.tx, t.ty);
    }

    /**
     * !#en
     * Concatenate a transform matrix to another
     * The results are reflected in the out affine transform
     * out = t1 * t2
     * This function is memory free, you should create the output affine transform by yourself and manage its memory.
     * !#zh
     * 拼接两个矩阵，将结果保存到 out 矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
     * out = t1 * t2
     * @param out Out object to store the concat result
     * @param t1 The first transform object.
     * @param t2 The transform object to concatenate.
     * @return Out object with the result of concatenation.
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
        return out;
    }

    /**
     * !#en Get the invert transform of an AffineTransform object.
     * This function is memory free, you should create the output affine transform by yourself and manage its memory.
     * !#zh 求逆矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
     * @return Out object with inverted result.
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
        return out;
    }

    /**
     * !#en Get an AffineTransform object from a given matrix 4x4.
     * This function is memory free, you should create the output affine transform by yourself and manage its memory.
     * !#zh 从一个 4x4 Matrix 获取 AffineTransform 对象。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
     * @return Out object with inverted result.
     */
    public static fromMat4 (out: AffineTransform, mat: Mat4) {
        out.a = mat.m00;
        out.b = mat.m01;
        out.c = mat.m04;
        out.d = mat.m05;
        out.tx = mat.m12;
        out.ty = mat.m13;
        return out;
    }

    /**
     * !#en Apply the affine transformation on a point.
     * This function is memory free, you should create the output Vec2 by yourself and manage its memory.
     * !#zh 对一个点应用矩阵变换。这个函数不创建任何内存，你需要先创建一个 Vec2 对象用来存储结果，并作为第一个参数传入函数。
     * @param out The output point to store the result
     * @param point Point to apply transform.
     * @param t Transform matrix.
     */
    public static transformVec2 (out: Vec2, point: Vec2, t: AffineTransform): Vec2;

    /**
     * !#en Apply the affine transformation on a point.
     * This function is memory free, you should create the output Vec2 by yourself and manage its memory.
     * !#zh 对一个点应用矩阵变换。这个函数不创建任何内存，你需要先创建一个 Vec2 对象用来存储结果，并作为第一个参数传入函数。
     * @param out The output point to store the result
     * @param x The x.
     * @param y The y.
     * @param t Transform matrix.
     */
    public static transformVec2 (out: Vec2, x: number, y: number, t: AffineTransform): Vec2;

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
        return out;
    }

    /**
     * !#en Apply the affine transformation on a size.
     * This function is memory free, you should create the output Size by yourself and manage its memory.
     * !#zh 应用仿射变换矩阵到 Size 上。这个函数不创建任何内存，你需要先创建一个 Size 对象用来存储结果，并作为第一个参数传入函数。
     * @param out The output point to store the result
     */
    public static transformSize (out: Size, size: Size, t: AffineTransform) {
        out.width = t.a * size.width + t.c * size.height;
        out.height = t.b * size.width + t.d * size.height;
        return out;
    }

    /**
     * !#en Apply the affine transformation on a rect.
     * This function is memory free, you should create the output Rect by yourself and manage its memory.
     * !#zh 应用仿射变换矩阵到 Rect 上。这个函数不创建任何内存，你需要先创建一个 Rect 对象用来存储结果，并作为第一个参数传入函数。
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
        return out;
    }

    /**
     * !#en Apply the affine transformation on a rect, and truns to an Oriented Bounding Box.
     * This function is memory free, you should create the output vectors by yourself and manage their memory.
     * !#zh 应用仿射变换矩阵到 Rect 上, 并转换为有向包围盒。这个函数不创建任何内存，你需要先创建包围盒的四个 Vector 对象用来存储结果，并作为前四个参数传入函数。
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
