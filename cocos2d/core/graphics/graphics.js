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

const RenderComponent = require('../components/CCRenderComponent');
const Material = require('../assets/material/CCMaterial');

const Types = require('./types');
const LineCap = Types.LineCap;
const LineJoin = Types.LineJoin;

/**
 * @class Graphics
 * @extends RenderComponent
 */
let Graphics = cc.Class({
    name: 'cc.Graphics',
    extends: RenderComponent,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Graphics',
    },

    ctor () {
        this._impl = new Graphics._Impl(this);
    },

    properties: {
        _lineWidth: 1,
        _strokeColor: cc.Color.BLACK,
        _lineJoin: LineJoin.MITER,
        _lineCap: LineCap.BUTT,
        _fillColor: cc.Color.WHITE,
        _miterLimit: 10,
        
        /**
         * !#en
         * Current line width.
         * !#zh
         * 当前线条宽度
         * @property {Number} lineWidth
         * @default 1
         */
        lineWidth: {
            get () {
                return this._lineWidth;
            },
            set (value) {
                this._lineWidth = value;
                this._impl.lineWidth = value;
            }
        },

        /**
         * !#en
         * lineJoin determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together.
         * !#zh
         * lineJoin 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性。
         * @property {Graphics.LineJoin} lineJoin
         * @default LineJoin.MITER
         */
        lineJoin: {
            get () {
                return this._lineJoin;
            },
            set (value) {
                this._lineJoin = value;
                this._impl.lineJoin = value;
            },
            type: LineJoin
        },

        /**
         * !#en
         * lineCap determines how the end points of every line are drawn.
         * !#zh
         * lineCap 指定如何绘制每一条线段末端。
         * @property {Graphics.LineCap} lineCap
         * @default LineCap.BUTT
         */
        lineCap: {
            get () {
                return this._lineCap;
            },
            set (value) {
                this._lineCap = value;
                this._impl.lineCap = value;
            },
            type: LineCap
        },

        /**
         * !#en
         * stroke color
         * !#zh
         * 线段颜色
         * @property {Color} strokeColor
         * @default Color.BLACK
         */
        strokeColor: {
            get () {
                return this._strokeColor;
            },
            set (value) {
                this._impl.strokeColor = this._strokeColor = cc.color(value);
            }
        },

        /**
         * !#en
         * fill color
         * !#zh
         * 填充颜色
         * @property {Color} fillColor
         * @default Color.WHITE
         */
        fillColor: {
            get () {
                return this._fillColor;
            },
            set (value) {
                this._impl.fillColor = this._fillColor = cc.color(value);
            }
        },

        /**
         * !#en
         * Sets the miter limit ratio
         * !#zh
         * 设置斜接面限制比例
         * @property {Number} miterLimit
         * @default 10
         */
        miterLimit: {
            get () {
                return this._miterLimit;
            },
            set (value) {
                this._miterLimit = value;
                this._impl.miterLimit = value;
            }
        }
    },

    statics: {
        LineJoin: LineJoin,
        LineCap: LineCap
    },

    onRestore () {
        if (!this._impl) {
            this._impl = new Graphics._Impl(this);
        }
    },

    onEnable () {
        this._super();
        this._activateMaterial();
    },

    onDestroy () {
        this.clear(true);
        this._super();
        this._impl = null;
    },

    _activateMaterial () {
        // Ignore material in canvas
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            this.disableRender();
            return;
        }
        
        let material = this.sharedMaterials[0];
        if (!material) {
            material = Material.getInstantiatedBuiltinMaterial('2d-base', this);
        }
        else {
            material = Material.getInstantiatedMaterial(material, this);
        }
        
        material.define('CC_USE_MODEL', true);
        this.setMaterial(0, material);
    },

    /**
     * !#en Move path start point to (x,y).
     * !#zh 移动路径起点到坐标(x, y)
     * @method moveTo
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    moveTo (x, y) {
        if (CC_DEBUG && x instanceof cc.Vec2) {
            cc.warn('[moveTo] : Can not pass Vec2 as [x, y] value, please check it.');
            return;
        }
        this._impl.moveTo(x, y);
    },

    /**
     * !#en Adds a straight line to the path
     * !#zh 绘制直线路径
     * @method lineTo
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    lineTo (x, y) {
        if (CC_DEBUG && x instanceof cc.Vec2) {
            cc.warn('[moveTo] : Can not pass Vec2 as [x, y] value, please check it.');
            return;
        }
        this._impl.lineTo(x, y);
    },

    /**
     * !#en Adds a cubic Bézier curve to the path
     * !#zh 绘制三次贝赛尔曲线路径
     * @method bezierCurveTo
     * @param {Number} [c1x] The x axis of the coordinate for the first control point.
     * @param {Number} [c1y] The y axis of the coordinate for first control point.
     * @param {Number} [c2x] The x axis of the coordinate for the second control point.
     * @param {Number} [c2y] The y axis of the coordinate for the second control point.
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    bezierCurveTo (c1x, c1y, c2x, c2y, x, y) {
        this._impl.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
    },

    /**
     * !#en Adds a quadratic Bézier curve to the path
     * !#zh 绘制二次贝赛尔曲线路径
     * @method quadraticCurveTo
     * @param {Number} [cx] The x axis of the coordinate for the control point.
     * @param {Number} [cy] The y axis of the coordinate for the control point.
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    quadraticCurveTo (cx, cy, x, y) {
        this._impl.quadraticCurveTo(cx, cy, x, y);
    },

    /**
     * !#en Adds an arc to the path which is centered at (cx, cy) position with radius r starting at startAngle and ending at endAngle going in the given direction by counterclockwise (defaulting to false).
     * !#zh 绘制圆弧路径。圆弧路径的圆心在 (cx, cy) 位置，半径为 r ，根据 counterclockwise （默认为false）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
     * @method arc
     * @param {Number} [cx] The x axis of the coordinate for the center point.
     * @param {Number} [cy] The y axis of the coordinate for the center point.
     * @param {Number} [r] The arc's radius.
     * @param {Number} [startAngle] The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
     * @param {Number} [endAngle] The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
     * @param {Boolean} [counterclockwise] An optional Boolean which, if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
     */
    arc (cx, cy, r, startAngle, endAngle, counterclockwise) {
        this._impl.arc(cx, cy, r, startAngle, endAngle, counterclockwise);
    },

    /**
     * !#en Adds an ellipse to the path.
     * !#zh 绘制椭圆路径。
     * @method ellipse
     * @param {Number} [cx] The x axis of the coordinate for the center point.
     * @param {Number} [cy] The y axis of the coordinate for the center point.
     * @param {Number} [rx] The ellipse's x-axis radius.
     * @param {Number} [ry] The ellipse's y-axis radius.
     */
    ellipse (cx, cy, rx, ry) {
        this._impl.ellipse(cx, cy, rx, ry);
    },

    /**
     * !#en Adds an circle to the path.
     * !#zh 绘制圆形路径。
     * @method circle
     * @param {Number} [cx] The x axis of the coordinate for the center point.
     * @param {Number} [cy] The y axis of the coordinate for the center point.
     * @param {Number} [r] The circle's radius.
     */
    circle (cx, cy, r) {
        this._impl.circle(cx, cy, r);
    },

    /**
     * !#en Adds an rectangle to the path.
     * !#zh 绘制矩形路径。
     * @method rect
     * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
     * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
     * @param {Number} [w] The rectangle's width.
     * @param {Number} [h] The rectangle's height.
     */
    rect (x, y, w, h) {
        this._impl.rect(x, y, w, h);
    },

    /**
     * !#en Adds an round corner rectangle to the path. 
     * !#zh 绘制圆角矩形路径。
     * @method roundRect
     * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
     * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
     * @param {Number} [w] The rectangles width.
     * @param {Number} [h] The rectangle's height.
     * @param {Number} [r] The radius of the rectangle.
     */
    roundRect (x, y, w, h, r) {
        this._impl.roundRect(x, y, w, h, r);
    },

    /**
     * !#en Draws a filled rectangle.
     * !#zh 绘制填充矩形。
     * @method fillRect
     * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
     * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
     * @param {Number} [w] The rectangle's width.
     * @param {Number} [h] The rectangle's height.
     */
    fillRect (x, y, w, h) {
        this.rect(x, y, w, h);
        this.fill();
    },

    /**
     * !#en Erasing any previously drawn content.
     * !#zh 擦除之前绘制的所有内容的方法。
     * @method clear
     * @param {Boolean} [clean] Whether to clean the graphics inner cache.
     */
    clear (clean) {
        this._impl.clear(clean);
        this._assembler.clear(clean);
    },

    /**
     * !#en Causes the point of the pen to move back to the start of the current path. It tries to add a straight line from the current point to the start.
     * !#zh 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。
     * @method close
     */
    close () {
        this._impl.close();
    },

    /**
     * !#en Strokes the current or given path with the current stroke style.
     * !#zh 根据当前的画线样式，绘制当前或已经存在的路径。
     * @method stroke
     */
    stroke () {
        if (!this._assembler) {
            this._resetAssembler();
        }
        this._assembler.stroke(this);
    },

    /**
     * !#en Fills the current or given path with the current fill style.
     * !#zh 根据当前的画线样式，填充当前或已经存在的路径。
     * @method fill
     */
    fill () {
        if (!this._assembler) {
            this._resetAssembler();
        }
        this._assembler.fill(this);
    }
});

cc.Graphics = module.exports = Graphics;
cc.Graphics.Types = Types;
cc.Graphics.Helper = require('./helper');
