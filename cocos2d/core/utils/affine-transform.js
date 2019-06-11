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
 * @class AffineTransform
 * @constructor
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} tx
 * @param {Number} ty
 * @see AffineTransform.create
 */
var AffineTransform = function (a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
};

/**
 * !#en Create a AffineTransform object with all contents in the matrix.
 * !#zh 用在矩阵中的所有内容创建一个 AffineTransform 对象。
 * @method create
 * @static
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @param {Number} d
 * @param {Number} tx
 * @param {Number} ty
 * @return {AffineTransform}
 */
AffineTransform.create = function (a, b, c, d, tx, ty) {
    return {a: a, b: b, c: c, d: d, tx: tx, ty: ty};
};

/**
 * !#en
 * Create a identity transformation matrix: <br/>
 * [ 1, 0, 0, <br/>
 *   0, 1, 0 ]
 * !#zh
 * 单位矩阵：<br/>
 * [ 1, 0, 0, <br/>
 *   0, 1, 0 ]
 *
 * @method identity
 * @static
 * @return {AffineTransform}
 */
AffineTransform.identity = function () {
    return {a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0};
};

/**
 * !#en Clone a AffineTransform object from the specified transform.
 * !#zh 克隆指定的 AffineTransform 对象。
 * @method clone
 * @static
 * @param {AffineTransform} t
 * @return {AffineTransform}
 */
AffineTransform.clone = function (t) {
    return {a: t.a, b: t.b, c: t.c, d: t.d, tx: t.tx, ty: t.ty};
};

/**
 * !#en
 * Concatenate a transform matrix to another
 * The results are reflected in the out affine transform
 * out = t1 * t2
 * This function is memory free, you should create the output affine transform by yourself and manage its memory.
 * !#zh
 * 拼接两个矩阵，将结果保存到 out 矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
 * out = t1 * t2
 * @method concat
 * @static
 * @param {AffineTransform} out Out object to store the concat result
 * @param {AffineTransform} t1 The first transform object.
 * @param {AffineTransform} t2 The transform object to concatenate.
 * @return {AffineTransform} Out object with the result of concatenation.
 */
AffineTransform.concat = function (out, t1, t2) {
    var a = t1.a, b = t1.b, c = t1.c, d = t1.d, tx = t1.tx, ty = t1.ty;
    out.a = a * t2.a + b * t2.c;
    out.b = a * t2.b + b * t2.d;
    out.c = c * t2.a + d * t2.c;
    out.d = c * t2.b + d * t2.d;
    out.tx = tx * t2.a + ty * t2.c + t2.tx;
    out.ty = tx * t2.b + ty * t2.d + t2.ty;
    return out;
};

/**
 * !#en Get the invert transform of an AffineTransform object.
 * This function is memory free, you should create the output affine transform by yourself and manage its memory.
 * !#zh 求逆矩阵。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
 * @method invert
 * @static
 * @param {AffineTransform} out
 * @param {AffineTransform} t
 * @return {AffineTransform} Out object with inverted result.
 */
AffineTransform.invert = function (out, t) {
    var a = t.a, b = t.b, c = t.c, d = t.d;
    var determinant = 1 / (a * d - b * c);
    var tx = t.tx, ty = t.ty;
    out.a = determinant * d;
    out.b = -determinant * b;
    out.c = -determinant * c;
    out.d = determinant * a;
    out.tx = determinant * (c * ty - d * tx);
    out.ty = determinant * (b * tx - a * ty);
    return out;
};

/**
 * !#en Get an AffineTransform object from a given matrix 4x4.
 * This function is memory free, you should create the output affine transform by yourself and manage its memory.
 * !#zh 从一个 4x4 Matrix 获取 AffineTransform 对象。这个函数不创建任何内存，你需要先创建 AffineTransform 对象用来存储结果，并作为第一个参数传入函数。
 * @method invert
 * @static
 * @param {AffineTransform} out
 * @param {Mat4} mat
 * @return {AffineTransform} Out object with inverted result.
 */
AffineTransform.fromMat4 = function (out, mat) {
    let matm = mat.m;
    out.a = matm[0];
    out.b = matm[1];
    out.c = matm[4];
    out.d = matm[5];
    out.tx = matm[12];
    out.ty = matm[13];
    return out;
};

/**
 * !#en Apply the affine transformation on a point.
 * This function is memory free, you should create the output Vec2 by yourself and manage its memory.
 * !#zh 对一个点应用矩阵变换。这个函数不创建任何内存，你需要先创建一个 Vec2 对象用来存储结果，并作为第一个参数传入函数。
 * @method transformVec2
 * @static
 * @param {Vec2} out The output point to store the result
 * @param {Vec2|Number} point Point to apply transform or x.
 * @param {AffineTransform|Number} transOrY transform matrix or y.
 * @param {AffineTransform} [t] transform matrix.
 * @return {Vec2}
 */
AffineTransform.transformVec2 = function (out, point, transOrY, t) {
    var x, y;
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
};

/**
 * !#en Apply the affine transformation on a size.
 * This function is memory free, you should create the output Size by yourself and manage its memory.
 * !#zh 应用仿射变换矩阵到 Size 上。这个函数不创建任何内存，你需要先创建一个 Size 对象用来存储结果，并作为第一个参数传入函数。
 * @method transformSize
 * @static
 * @param {Size} out The output point to store the result
 * @param {Size} size
 * @param {AffineTransform} t
 * @return {Size}
 */
AffineTransform.transformSize = function (out, size, t) {
    out.width = t.a * size.width + t.c * size.height;
    out.height = t.b * size.width + t.d * size.height;
    return out;
};

/**
 * !#en Apply the affine transformation on a rect.
 * This function is memory free, you should create the output Rect by yourself and manage its memory.
 * !#zh 应用仿射变换矩阵到 Rect 上。这个函数不创建任何内存，你需要先创建一个 Rect 对象用来存储结果，并作为第一个参数传入函数。
 * @method transformRect
 * @static
 * @param {Rect} out
 * @param {Rect} rect
 * @param {AffineTransform} anAffineTransform
 * @return {Rect}
 */
AffineTransform.transformRect = function(out, rect, t){
    var ol = rect.x;
    var ob = rect.y;
    var or = ol + rect.width;
    var ot = ob + rect.height;
    var lbx = t.a * ol + t.c * ob + t.tx;
    var lby = t.b * ol + t.d * ob + t.ty;
    var rbx = t.a * or + t.c * ob + t.tx;
    var rby = t.b * or + t.d * ob + t.ty;
    var ltx = t.a * ol + t.c * ot + t.tx;
    var lty = t.b * ol + t.d * ot + t.ty;
    var rtx = t.a * or + t.c * ot + t.tx;
    var rty = t.b * or + t.d * ot + t.ty;

    var minX = Math.min(lbx, rbx, ltx, rtx);
    var maxX = Math.max(lbx, rbx, ltx, rtx);
    var minY = Math.min(lby, rby, lty, rty);
    var maxY = Math.max(lby, rby, lty, rty);

    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;
    return out;
};

/**
 * !#en Apply the affine transformation on a rect, and truns to an Oriented Bounding Box.
 * This function is memory free, you should create the output vectors by yourself and manage their memory.
 * !#zh 应用仿射变换矩阵到 Rect 上, 并转换为有向包围盒。这个函数不创建任何内存，你需要先创建包围盒的四个 Vector 对象用来存储结果，并作为前四个参数传入函数。
 * @method transformObb
 * @static
 * @param {Vec2} out_bl
 * @param {Vec2} out_tl
 * @param {Vec2} out_tr
 * @param {Vec2} out_br
 * @param {Rect} rect
 * @param {AffineTransform} anAffineTransform
 */
AffineTransform.transformObb = function (out_bl, out_tl, out_tr, out_br, rect, anAffineTransform) {
    var x = rect.x;
    var y = rect.y;
    var width = rect.width;
    var height = rect.height;

    var tx = anAffineTransform.a * x + anAffineTransform.c * y + anAffineTransform.tx;
    var ty = anAffineTransform.b * x + anAffineTransform.d * y + anAffineTransform.ty;
    var xa = anAffineTransform.a * width;
    var xb = anAffineTransform.b * width;
    var yc = anAffineTransform.c * height;
    var yd = anAffineTransform.d * height;

    out_tl.x = tx;
    out_tl.y = ty;
    out_tr.x = xa + tx;
    out_tr.y = xb + ty;
    out_bl.x = yc + tx;
    out_bl.y = yd + ty;
    out_br.x = xa + yc + tx;
    out_br.y = xb + yd + ty;
};

cc.AffineTransform = module.exports = AffineTransform;