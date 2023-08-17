/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

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

import { Mat4 } from './mat4';
import { Rect } from './rect';
import { Size } from './size';
import { Vec2 } from './vec2';
import { legacyCC } from '../global-exports';

/**
 * @en `AffineTransform` class represent an affine transform matrix. It's composed basically by translation, rotation, scale transformations.
 * @zh 二维仿射变换矩阵，描述了平移、旋转和缩放。
 */
export class AffineTransform {
    /**
     * @en Create an identity transformation matrix.
     * @zh 创建单位二维仿射变换矩阵，它不进行任何变换。
     */
    public static identity (): AffineTransform {
        return new AffineTransform();
    }

    /**
     * @en Clone an `AffineTransform` object from the specified transform.
     * @zh 克隆指定的二维仿射变换矩阵。
     * @param affineTransform Specified `AffineTransform` objects
     */
    public static clone (affineTransform: AffineTransform): AffineTransform {
        return new AffineTransform(
            affineTransform.a, affineTransform.b,
            affineTransform.c, affineTransform.d,
            affineTransform.tx, affineTransform.ty,
        );
    }

    /**
     * @en Concatenate a transform matrix to another. The results are reflected in the out `AffineTransform`.
     * First apply t1, then t2: out * v = t2 * (t1 * v).
     * @zh 将两个矩阵相乘的结果赋值给输出矩阵，先应用t1再应用t2: out * v = t2 * (t1 * v)。
     * @param out Out object to store the concat result
     * @param t1 The first transform object.
     * @param t2 The transform object to concatenate.
     */
    public static concat (out: AffineTransform, t1: AffineTransform, t2: AffineTransform): void {
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
     * @en Get the invert transform of an `AffineTransform` object.
     * @zh 将矩阵求逆的结果赋值给输出矩阵。
     * @param out Out object to store the invert result
     * @param t the input `AffineTransform` object
     */
    public static invert (out: AffineTransform, t: AffineTransform): void {
        const determinant = 1 / (t.a * t.d - t.b * t.c);
        out.a = determinant * t.d;
        out.b = -determinant * t.b;
        out.c = -determinant * t.c;
        out.d = determinant * t.a;
        out.tx = determinant * (t.c * t.ty - t.d * t.tx);
        out.ty = determinant * (t.b * t.tx - t.a * t.ty);
    }

    /**
     * @en Get an `AffineTransform` object from a given matrix 4x4.
     * @zh 将四维矩阵转换为二维仿射变换矩阵并赋值给输出矩阵。
     * @param out The output matrix to store the result
     * @param mat transform matrix.
     */
    public static fromMat4 (out: AffineTransform, mat: Mat4): void {
        out.a = mat.m00;
        out.b = mat.m01;
        out.c = mat.m04;
        out.d = mat.m05;
        out.tx = mat.m12;
        out.ty = mat.m13;
    }

    /**
     * @en Apply the `AffineTransform` on a 2D vector.
     * @zh 应用二维仿射变换矩阵到二维向量上，并将结果赋值给输出向量。
     * @param out The output vector to store the result
     * @param point Vector to apply transform.
     * @param t transform matrix.
     */
    public static transformVec2 (out: Vec2, point: Vec2, t: AffineTransform): any;

    /**
     * @en Apply the `AffineTransform` on a 2D vector.
     * @zh 应用二维仿射变换矩阵到二维向量上，并将结果赋值给输出向量。
     * @param out The output vector to store the result
     * @param x x to apply transform.
     * @param y y to apply transform.
     * @param t transform matrix.
     */
    public static transformVec2 (out: Vec2, x: number, y: number, t: AffineTransform): any;

    public static transformVec2 (out: Vec2, point: Vec2 | number, transOrY: AffineTransform | number, t?: AffineTransform): any {
        let x: number;
        let y: number;
        if (!t) {
            t = transOrY as AffineTransform;
            x = (point as Vec2).x;
            y = (point as Vec2).y;
        } else {
            x = point as number;
            y = transOrY as number;
        }
        out.x = t.a * x + t.c * y + t.tx;
        out.y = t.b * x + t.d * y + t.ty;
    }

    /**
     * @en Apply the `AffineTransform` on a size.
     * @zh 应用二维仿射变换矩阵到二维尺寸上，并将结果赋值给输出尺寸。
     * @param out The output size to store the result
     * @param size The size to apply transform.
     * @param t transform matrix.
     */
    public static transformSize (out: Size, size: Size, t: AffineTransform): void {
        out.width = t.a * size.width + t.c * size.height;
        out.height = t.b * size.width + t.d * size.height;
    }

    /**
     * @en Apply the `AffineTransform` on a rect.
     * @zh 应用二维仿射变换矩阵到矩形上，并将结果赋值给输出矩形。
     * @param out The output rect object to store the result
     * @param rect The rect object to apply transform.
     * @param t transform matrix.
     */
    public static transformRect (out: Rect, rect: Rect, t: AffineTransform): void {
        const or = rect.x + rect.width;
        const ot = rect.y + rect.height;
        const lbx = t.a * rect.x + t.c * rect.y + t.tx;
        const lby = t.b * rect.x + t.d * rect.y + t.ty;
        const rbx = t.a * or + t.c * rect.y + t.tx;
        const rby = t.b * or + t.d * rect.y + t.ty;
        const ltx = t.a * rect.x + t.c * ot + t.tx;
        const lty = t.b * rect.x + t.d * ot + t.ty;
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
     * @en Apply the `AffineTransform` on a rect, and turns to an Oriented Bounding Box.
     * This function does not allocate any memory, you should create the output vectors by yourself and manage their memory.
     * @zh 应用二维仿射变换矩阵到矩形上, 并转换为有向包围盒。
     * 这个函数不创建任何内存，你需要先创建包围盒的四个 Vector 对象用来存储结果，并作为前四个参数传入函数。
     * @param out_bl Output vector for storing the bottom left corner coordinates of the Obb object
     * @param out_tl Output vector for storing the top left corner coordinates of the Obb object
     * @param out_tr Output vector for storing the top right corner coordinates of the Obb object
     * @param out_br Output vector for storing the bottom right corner coordinates of the Obb object
     * @param rect The rect object to apply transform.
     * @param anAffineTransform transform matrix.
     */
    public static transformObb (out_bl: Vec2, out_tl: Vec2, out_tr: Vec2, out_br: Vec2, rect: Rect,
        anAffineTransform: AffineTransform, flipY = true): void {
        const tx = anAffineTransform.a * rect.x + anAffineTransform.c * rect.y + anAffineTransform.tx;
        const ty = anAffineTransform.b * rect.x + anAffineTransform.d * rect.y + anAffineTransform.ty;
        const xa = anAffineTransform.a * rect.width;
        const xb = anAffineTransform.b * rect.width;
        const yc = anAffineTransform.c * rect.height;
        const yd = anAffineTransform.d * rect.height;

        if (flipY) {
            out_tl.x = tx;
            out_tl.y = ty;
            out_tr.x = xa + tx;
            out_tr.y = xb + ty;
            out_bl.x = yc + tx;
            out_bl.y = yd + ty;
            out_br.x = xa + yc + tx;
            out_br.y = xb + yd + ty;
        } else {
            out_bl.x = tx;
            out_bl.y = ty;
            out_br.x = xa + tx;
            out_br.y = xb + ty;
            out_tl.x = yc + tx;
            out_tl.y = yd + ty;
            out_tr.x = xa + yc + tx;
            out_tr.y = xb + yd + ty;
        }
    }

    /**
     * matrix layout
     * |a  c  tx|
     * |b  d  ty|
     * |0  0  1 |
     */
    public declare a: number;
    public declare b: number;
    public declare c: number;
    public declare d: number;
    public declare tx: number;
    public declare ty: number;

    /**
     * @en constructor an `AffineTransform` object.
     * @zh 构造二维放射变换矩阵。
     * @param a a
     * @param b b
     * @param c c
     * @param d d
     * @param tx tx
     * @param ty ty
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

legacyCC.AffineTransform = AffineTransform;
