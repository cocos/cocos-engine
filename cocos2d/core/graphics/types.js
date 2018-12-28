/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 
'use strict';

/**
 * !#en Enum for LineCap.
 * !#zh 线段末端属性
 * @enum Graphics.LineCap
 */
var LineCap = cc.Enum({
    /**
     * !#en The ends of lines are squared off at the endpoints.
     * !#zh 线段末端以方形结束。
     * @property {Number} BUTT
     */
    BUTT: 0,

    /**
     * !#en The ends of lines are rounded.
     * !#zh 线段末端以圆形结束。
     * @property {Number} ROUND
     */
    ROUND: 1,

    /**
     * !#en The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.
     * !#zh 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。
     * @property {Number} SQUARE
     */
    SQUARE: 2,
});

/**
 * !#en Enum for LineJoin.
 * !#zh 线段拐角属性
 * @enum Graphics.LineJoin
 */
var LineJoin = cc.Enum({
    /**
     * !#en Fills an additional triangular area between the common endpoint of connected segments, and the separate outside rectangular corners of each segment.
     * !#zh 在相连部分的末端填充一个额外的以三角形为底的区域， 每个部分都有各自独立的矩形拐角。
     * @property {Number} BEVEL
     */
    BEVEL: 0,

    /**
     * !#en Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint of connected segments. The radius for these rounded corners is equal to the line width.
     * !#zh 通过填充一个额外的，圆心在相连部分末端的扇形，绘制拐角的形状。 圆角的半径是线段的宽度。
     * @property {Number} ROUND
     */
    ROUND: 1,

    /**
     * !#en Connected segments are joined by extending their outside edges to connect at a single point, with the effect of filling an additional lozenge-shaped area.
     * !#zh 通过延伸相连部分的外边缘，使其相交于一点，形成一个额外的菱形区域。
     * @property {Number} MITER
     */
    MITER: 2
});


// PointFlags
var PointFlags =  cc.Enum({
    PT_CORNER: 0x01,
    PT_LEFT: 0x02,
    PT_BEVEL: 0x04,
    PT_INNERBEVEL: 0x08,
});

module.exports = {
    LineCap:    LineCap,
    LineJoin:   LineJoin,
    PointFlags: PointFlags
};
