/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { Color } from '../../../core/value-types';
import { UI } from '../../../renderer/ui/ui';
import { IAssembler } from '../assembler/assembler';
import { LineCap, LineJoin } from '../assembler/graphics/types';
import { Impl } from '../assembler/graphics/webgl/impl';
import { InstanceMaterialType, UIRenderComponent } from '../components/ui-render-component';

/**
 * @class Graphics
 * @extends Component
 */
@ccclass('cc.GraphicsComponent')
@executionOrder(100)
@menu('UI/Render/Graphics')
export class GraphicsComponent extends UIRenderComponent {

    /**
     * !#en
     * Current line width.
     * !#zh
     * 当前线条宽度
     * @property {Number} lineWidth
     * @default 1
     */
    get lineWidth () {
        return this._lineWidth;
    }
    set lineWidth (value) {
        this._lineWidth = value;
        if (!this.impl){
            return;
        }

        this.impl.lineWidth = value;
    }

    /**
     * !#en
     * lineJoin determines how two connecting segments (of lines, arcs or curves) with non-zero lengths in a shape are joined together.
     * !#zh
     * lineJoin 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性。
     * @property {Graphics.LineJoin} lineJoin
     * @default LineJoin.MITER
     */
    @property({
        type: LineJoin,
    })
    get lineJoin () {
        return this._lineJoin;
    }

    set lineJoin (value: LineJoin) {
        this._lineJoin = value;
        if (!this.impl) {
            return;
        }

        this.impl.lineJoin = value;
    }

    /**
     * !#en
     * lineCap determines how the end points of every line are drawn.
     * !#zh
     * lineCap 指定如何绘制每一条线段末端。
     * @property {Graphics.LineCap} lineCap
     * @default LineCap.BUTT
     */
    @property({
        type: LineCap,
    })
    get lineCap () {
        return this._lineCap;
    }

    set lineCap (value: LineCap) {
        this._lineCap = value;
        if (!this.impl) {
            return;
        }

        this.impl.lineCap = value;
    }

    /**
     * !#en
     * stroke color
     * !#zh
     * 线段颜色
     * @property {Color} strokeColor
     * @default Color.BLACK
     */
    @property
    get strokeColor () {
        return this._strokeColor;
    }

    set strokeColor (value: Color) {
        if (!this.impl) {
            return;
        }

        this.impl.strokeColor = this._strokeColor = new Color(value);
    }

    /**
     * !#en
     * fill color
     * !#zh
     * 填充颜色
     * @property {Color} fillColor
     * @default Color.WHITE
     */
    @property
    get fillColor () {
        return this._fillColor;
    }

    set fillColor (value) {
        if (!this.impl){
            return;
        }

        this.impl.fillColor = this._fillColor = new Color(value);
    }

    /**
     * !#en
     * Sets the miter limit ratio
     * !#zh
     * 设置斜接面限制比例
     * @property {Number} miterLimit
     * @default 10
     */
    @property
    get miterLimit () {
        return this._miterLimit;
    }

    set miterLimit (value) {
        this._miterLimit = value;
        // this.impl.miterLimit = value;
    }

    @property({
        override: true,
        visible: false,
    })
    get color (){
        return super.color;
    }

    public static LineJoin = LineJoin;
    public static LineCap = LineCap;
    public impl: Impl | null = null;
    @property
    private _lineWidth = 1;
    @property
    private _strokeColor = Color.BLACK;
    @property
    private _lineJoin = LineJoin.MITER;
    @property
    private _lineCap = LineCap.BUTT;
    @property
    private _fillColor = Color.WHITE;
    @property
    private _miterLimit = 10;

    constructor (){
        super();
        this._instanceMaterialType = InstanceMaterialType.ADDCOLOR;
    }

    public onRestore () {
        if (!this.impl) {
            this._flushAssembler();
        }
    }

    public __preload (){
        if (super.__preload){
            super.__preload();
        }

        this._flushAssembler();
        this.impl = this._assembler && (this._assembler as IAssembler).createImpl!(this);
    }

    public onEnable () {
        if (super.onEnable) {
            super.onEnable();
        }

        this._activateMaterial();
    }

    public onDestroy () {
        if (super.onDestroy) {
            super.onDestroy();
        }

        if (!this.impl) {
            return;
        }

        this.impl.clear();
        this.impl = null;
    }

    public _activateMaterial () {
        if (!this._material) {
            return;
        }

        this._updateMaterial(this._material);
    }

    /**
     * !#en Move path start point to (x,y).
     * !#zh 移动路径起点到坐标(x, y)
     * @method moveTo
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    public moveTo (x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.moveTo(x, y);
    }

    /**
     * !#en Adds a straight line to the path
     * !#zh 绘制直线路径
     * @method lineTo
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    public lineTo (x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.lineTo(x, y);
    }

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
    public bezierCurveTo (c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
    }

    /**
     * !#en Adds a quadratic Bézier curve to the path
     * !#zh 绘制二次贝赛尔曲线路径
     * @method quadraticCurveTo
     * @param {Number} [cx] The x axis of the coordinate for the control point.
     * @param {Number} [cy] The y axis of the coordinate for the control point.
     * @param {Number} [x] The x axis of the coordinate for the end point.
     * @param {Number} [y] The y axis of the coordinate for the end point.
     */
    public quadraticCurveTo (cx: number, cy: number, x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.quadraticCurveTo(cx, cy, x, y);
    }

    /**
     * !#en Adds an arc to the path which is centered at (cx, cy) position with radius r starting at startAngle
     * and ending at endAngle going in the given direction by counterclockwise (defaulting to false).
     * !#zh 绘制圆弧路径。圆弧路径的圆心在 (cx, cy) 位置，半径为 r ，根据 counterclockwise （默认为false）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
     * @method arc
     * @param {Number} [cx] The x axis of the coordinate for the center point.
     * @param {Number} [cy] The y axis of the coordinate for the center point.
     * @param {Number} [r] The arc's radius.
     * @param {Number} [startAngle] The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
     * @param {Number} [endAngle] The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
     * @param {Boolean} [counterclockwise] An optional Boolean which, if true, causes the arc to be drawn counter-clockwise between the two angles.
     * By default it is drawn clockwise.
     */
    public arc (cx: number, cy: number, r: number, startAngle: number, endAngle: number, counterclockwise: boolean) {
        if (!this.impl) {
            return;
        }

        this.impl.arc(cx, cy, r, startAngle, endAngle, counterclockwise);
    }

    /**
     * !#en Adds an ellipse to the path.
     * !#zh 绘制椭圆路径。
     * @method ellipse
     * @param {Number} [cx] The x axis of the coordinate for the center point.
     * @param {Number} [cy] The y axis of the coordinate for the center point.
     * @param {Number} [rx] The ellipse's x-axis radius.
     * @param {Number} [ry] The ellipse's y-axis radius.
     */
    public ellipse (cx: number, cy: number, rx: number, ry: number) {
        if (!this.impl) {
            return;
        }

        this.impl.ellipse(cx, cy, rx, ry);
    }

    /**
     * !#en Adds an circle to the path.
     * !#zh 绘制圆形路径。
     * @method circle
     * @param {Number} [cx] The x axis of the coordinate for the center point.
     * @param {Number} [cy] The y axis of the coordinate for the center point.
     * @param {Number} [r] The circle's radius.
     */
    public circle (cx: number, cy: number, r: number) {
        if (!this.impl) {
            return;
        }

        this.impl.circle(cx, cy, r);
    }

    /**
     * !#en Adds an rectangle to the path.
     * !#zh 绘制矩形路径。
     * @method rect
     * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
     * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
     * @param {Number} [w] The rectangle's width.
     * @param {Number} [h] The rectangle's height.
     */
    public rect (x: number, y: number, w: number, h: number) {
        if (!this.impl) {
            return;
        }

        this.impl.rect(x, y, w, h);
    }

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
    public roundRect (x: number, y: number, w: number, h: number, r: number) {
        if (!this.impl) {
            return;
        }

        this.impl.roundRect(x, y, w, h, r);
    }

    /**
     * !#en Draws a filled rectangle.
     * !#zh 绘制填充矩形。
     * @method fillRect
     * @param {Number} [x] The x axis of the coordinate for the rectangle starting point.
     * @param {Number} [y] The y axis of the coordinate for the rectangle starting point.
     * @param {Number} [w] The rectangle's width.
     * @param {Number} [h] The rectangle's height.
     */
    public fillRect (x, y, w, h) {
        this.rect(x, y, w, h);
        this.fill();
    }

    /**
     * !#en Erasing any previously drawn content.
     * !#zh 擦除之前绘制的所有内容的方法。
     * @method clear
     * @param {Boolean} [clean] Whether to clean the graphics inner cache.
     */
    public clear (/*clean: boolean*/) {
        if (!this.impl) {
            return;
        }

        this.impl.clear();
    }

    /**
     * !#en Causes the point of the pen to move back to the start of the current path. It tries to add a straight line from the current point to the start.
     * !#zh 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。
     * @method close
     */
    public close () {
        if (!this.impl) {
            return;
        }

        this.impl.close();
    }

    /**
     * !#en Strokes the current or given path with the current stroke style.
     * !#zh 根据当前的画线样式，绘制当前或已经存在的路径。
     * @method stroke
     */
    public stroke () {
        (this._assembler as IAssembler).stroke!(this);
    }

    /**
     * !#en Fills the current or given path with the current fill style.
     * !#zh 根据当前的画线样式，填充当前或已经存在的路径。
     * @method fill
     */
    public fill () {
        (this._assembler as IAssembler).fill!(this);
    }

    public updateAssembler (render: UI) {
        if (super.updateAssembler(render)) {
            render.commitComp(this, null, this._assembler!);
            return true;
        }

        return false;
    }

    public helpInstanceMaterial () {
        this._instanceMaterial();
        if (!this.impl){
            this._flushAssembler();
            this.impl = this._assembler && (this._assembler as IAssembler).createImpl!(this);
        }
    }

    protected _flushAssembler (){
        const assembler = GraphicsComponent.Assembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this._assembler = assembler;
        }
    }

}

cc.GraphicsComponent = GraphicsComponent;
