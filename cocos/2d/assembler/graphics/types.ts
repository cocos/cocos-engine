/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { ccenum } from '../../../core';

/**
 * @en Enum for LineCap.
 * @zh 线段末端属性
 * @enum Graphics.LineCap
 */
export enum LineCap {
    /**
     * @en The ends of lines are squared off at the endpoints.
     * @zh 线段末端以方形结束。
     */
    BUTT = 0,

    /**
     * @en The ends of lines are rounded.
     * @zh 线段末端以圆形结束。
     */
    ROUND = 1,

    /**
     * @en The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.
     * @zh 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。
     */
    SQUARE = 2,
}

ccenum(LineCap);

/**
 * @en Enum for LineJoin.
 * @zh 线段拐角属性
 * @enum Graphics.LineJoin
 */
export enum LineJoin {
    /**
     * @en Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
     * @zh 在相连部分的末端填充一个额外的以三角形为底的区域， 每个部分都有各自独立的矩形拐角。
     */
    BEVEL = 0,

    /**
     * @en Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments.
     * The radius for these rounded corners is equal to the line width.
     * @zh 通过填充一个额外的，圆心在相连部分末端的扇形，绘制拐角的形状。 圆角的半径是线段的宽度。
     */
    ROUND = 1,

    /**
     * @en Connected segments are joined by extending their outside edges to connect at a single point,
     * with the effect of filling an additional lozenge-shaped area.
     * @zh 通过延伸相连部分的外边缘，使其相交于一点，形成一个额外的菱形区域。
     */
    MITER = 2,
}

ccenum(LineJoin);

// PointFlags
export enum PointFlags {
    PT_CORNER = 0x01,
    PT_LEFT = 0x02,
    PT_BEVEL = 0x04,
    PT_INNERBEVEL = 0x08,
}

ccenum(PointFlags);
