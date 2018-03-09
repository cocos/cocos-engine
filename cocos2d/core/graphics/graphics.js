/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const RenderComponent = require('../components/CCRenderComponent');
const renderer = require('../renderer');
const renderEngine = require('../renderer/render-engine');
const SpriteMaterial = renderEngine.SpriteMaterial;

const Helper = require('./helper');
const Types = require('./types');
const LineCap = Types.LineCap;
const LineJoin = Types.LineJoin;
const PointFlags = Types.PointFlags;

// Point
function Point (x, y) {
    cc.Vec2.call(this, x, y);
    this.reset();
}
cc.js.extend(Point, cc.Vec2);

Point.prototype.reset = function () {
    this.dx = 0;
    this.dy = 0;
    this.dmx = 0;
    this.dmy = 0;
    this.flags = 0;
    this.len = 0;
};

// Path
function Path () {
    this.reset();
}
Path.prototype.reset = function () {
    this.closed = false;
    this.nbevel = 0;
    this.complex = true;

    if (this.points) {
        this.points.length = 0;
    }
    else {
        this.points = [];
    }
};


/**
 * @class Graphics
 * @extends Component
 */
let Graphics = cc.Class({
    name: 'cc.Graphics',
    extends: RenderComponent,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Graphics',
    },

    ctor () {
        // inner properties
        this._tessTol = 0.25;
        this._distTol = 0.01;
        this._updatePathOffset = false;
        
        this._paths = null;
        this._pathLength = 0;
        this._pathOffset = 0;
        
        this._points = null;
        this._pointsOffset = 0;
        
        this._commandx = 0;
        this._commandy = 0;

        this._paths = [];
        this._points = [];

        this._renderDatas = [];
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
                this._strokeColor = cc.color(value);
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
                this._fillColor = cc.color(value);
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
            }
        }
    },

    statics: {
        LineJoin: LineJoin,
        LineCap: LineCap
    },

    onEnable () {
        this._super();
        this._activateMaterial();
    },

    onDestroy () {
        this._super();
        // all requested render data will be destroyed by RenderComponent
        this._renderDatas.length = 0;
    },

    _activateMaterial () {
        if (this._material) return;
        
        let key = 'graphics-material';
        this._material = renderer.materialUtil.get(key);
        if (!this._material) {
            this._material = new SpriteMaterial();
            this._material.useTexture = false;
            renderer.materialUtil.register(key, this._material);
        }
    },

    /**
     * !#en Move path start point to (x,y).
     * !#zh 移动路径起点到坐标(x, y)
     * @method moveTo
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    moveTo (x, y) {
        if (this._updatePathOffset) {
            this._pathOffset = this._pathLength;
            this._updatePathOffset = false;
        }
    
        this._addPath();
        this._addPoint(x, y, PointFlags.PT_CORNER);
    
        this._commandx = x;
        this._commandy = y;
    },

    /**
     * !#en Adds a straight line to the path
     * !#zh 绘制直线路径
     * @method lineTo
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    lineTo (x, y) {
        this._addPoint(x, y, PointFlags.PT_CORNER);
        
        this._commandx = x;
        this._commandy = y;
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
        var path = this._curPath;
        var last = path.points[path.points.length - 1];
    
        if (last.x === c1x && last.y === c1y && c2x === x && c2y === y) {
            this.lineTo(x, y);
            return;
        }
    
        Helper.tesselateBezier(this, last.x, last.y, c1x, c1y, c2x, c2y, x, y, 0, PointFlags.PT_CORNER);
    
        this._commandx = x;
        this._commandy = y;
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
        var x0 = this._commandx;
        var y0 = this._commandy;
        this.bezierCurveTo(x0 + 2.0 / 3.0 * (cx - x0), y0 + 2.0 / 3.0 * (cy - y0), x + 2.0 / 3.0 * (cx - x), y + 2.0 / 3.0 * (cy - y), x, y);
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
     * @param {Number} [counterclockwise] An optional Boolean which, if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
     */
    arc (cx, cy, r, startAngle, endAngle, counterclockwise) {
        Helper.arc(this, cx, cy, r, startAngle, endAngle, counterclockwise);
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
        Helper.ellipse(this, cx, cy, rx, ry);
        this._curPath.complex = false;
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
        Helper.ellipse(this, cx, cy, r, r);
        this._curPath.complex = false;
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
        this.moveTo(x, y);
        this.lineTo(x, y + h);
        this.lineTo(x + w, y + h);
        this.lineTo(x + w, y);
        this.close();
        this._curPath.complex = false;
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
        Helper.roundRect(this, x, y, w, h, r);
        this._curPath.complex = false;
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
        this._pathLength = 0;
        this._pathOffset = 0;
        this._pointsOffset = 0;
        
        this._curPath = null;
    
        let datas = this._renderDatas;
        if (clean) {
            this._paths.length = 0;
            this._points.length = 0;
            // manually destroy render datas
            for (let i = 0, l = datas.length; i < l; i++) {
                this.destroyRenderData(datas[i]);
            }
            datas.length = 0;
        }
        else {
            for (let i = 0, l = datas.length; i < l; i++) {
                let data = datas[i];
                data.vertexCount = data.indiceCount = data.dataLength = 0;
                data._indices.length = 0;
            }
        }
    },

    /**
     * !#en Causes the point of the pen to move back to the start of the current path. It tries to add a straight line from the current point to the start.
     * !#zh 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。
     * @method close
     */
    close () {
        this._curPath.closed = true;
    },

    /**
     * !#en Strokes the current or given path with the current stroke style.
     * !#zh 根据当前的画线样式，绘制当前或已经存在的路径。
     * @method stroke
     */
    stroke () {
        Graphics._assembler.stroke(this);
    },

    /**
     * !#en Fills the current or given path with the current fill style.
     * !#zh 根据当前的画线样式，填充当前或已经存在的路径。
     * @method fill
     */
    fill () {
        Graphics._assembler.fill(this);
    },

    _addPath () {
        var offset = this._pathLength;
        var path = this._paths[offset];
    
        if (!path) {
            path = new Path();
    
            this._paths.push(path);
        } else {
            path.reset();
        }
    
        this._pathLength++;
        this._curPath = path;
    
        return path;
    },
    
    _addPoint (x, y, flags) {
        var path = this._curPath;
        if (!path) return;
    
        var pt;
        var points = this._points;
        var pathPoints = path.points;
    
        var offset = this._pointsOffset++;
        pt = points[offset];
    
        if (!pt) {
            pt = new Point(x, y);
            points.push(pt);
        } else {
            pt.x = x;
            pt.y = y;
        }
    
        pt.flags = flags;
        pathPoints.push(pt);
    }
});

cc.Graphics = module.exports = Graphics;
