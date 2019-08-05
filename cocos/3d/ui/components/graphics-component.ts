/*
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
*/

/**
 * @category ui
 */

import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import { Color } from '../../../core/math';
import { Model } from '../../../renderer';
import { UI } from '../../../renderer/ui/ui';
import { Material } from '../../assets';
import { RenderableComponent } from '../../framework/renderable-component';
import { IAssembler } from '../assembler/base';
import { LineCap, LineJoin } from '../assembler/graphics/types';
import { Impl } from '../assembler/graphics/webgl/impl';
import { InstanceMaterialType, UIRenderComponent } from '../components/ui-render-component';

/**
 * @zh
 * 自定义图形类
 * 可通过 cc.GraphicsComponent 获得此组件
 */
@ccclass('cc.GraphicsComponent')
@executionOrder(110)
@menu('UI/Render/Graphics')
export class GraphicsComponent extends UIRenderComponent {

    /**
     * @zh
     * 当前线条宽度。
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
     * @zh
     * lineJoin 用来设置2个长度不为0的相连部分（线段，圆弧，曲线）如何连接在一起的属性。
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
     * @zh
     * lineCap 指定如何绘制每一条线段末端。
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
     * @zh
     * 线段颜色。
     */
    @property
    // @constget
    get strokeColor (): Readonly<Color> {
        return this._strokeColor;
    }

    set strokeColor (value) {
        if (!this.impl) {
            return;
        }

        this._strokeColor.set(value);
        this.impl.strokeColor = this._strokeColor;
    }

    /**
     * @zh
     * 填充颜色。
     */
    @property
    // @constget
    get fillColor (): Readonly<Color> {
        return this._fillColor;
    }

    set fillColor (value) {
        if (!this.impl){
            return;
        }

        this._fillColor.set(value);
        this.impl.fillColor = this._fillColor;
    }

    /**
     * @zh
     * 设置斜接面限制比例。
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
    get color () {
        return this._color;
    }

    public static LineJoin = LineJoin;
    public static LineCap = LineCap;
    public impl: Impl | null = null;
    public model: Model | null = null;
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

        // this._flushAssembler();
        this.impl = this._assembler && (this._assembler as IAssembler).createImpl!(this);
    }

    public onLoad (){
       this._sceneGetter = cc.director.root.ui.getRenderSceneGetter();
    }

    public onEnable () {
        super.onEnable();

        if (this.model){
            this.model.enabled = true;
        }

        this._activateMaterial();
    }

    public onDisable (){
        if (this.model){
            this.model.enabled = false;
        }
    }

    public onDestroy () {
        super.onDestroy();

        this._sceneGetter = null;
        if (this.model) {
            this._getRenderScene().destroyModel(this.model);
            this.model = null;
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
     * @zh
     * 移动路径起点到坐标(x, y)。
     *
     * @param x - 移动坐标 x 轴。
     * @param y - 移动坐标 y 轴。
     */
    public moveTo (x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.moveTo(x, y);
    }

    /**
     * @zh
     * 绘制直线路径。
     *
     * @param x - 绘制路径坐标 x 轴。
     * @param y - 绘制路径坐标 y 轴。
     */
    public lineTo (x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.lineTo(x, y);
    }

    /**
     * @zh
     * 绘制三次贝赛尔曲线路径。
     *
     * @param c1x - 第一个控制点的坐标 x 轴。
     * @param c1y - 第一个控制点的坐标 y 轴。
     * @param c2x - 第二个控制点的坐标 x 轴。
     * @param c2y - 第二个控制点的坐标 y 轴。
     * @param x - 最后一个控制点的坐标 x 轴。
     * @param y - 最后一个控制点的坐标 y 轴。
     */
    public bezierCurveTo (c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.bezierCurveTo(c1x, c1y, c2x, c2y, x, y);
    }

    /**
     * @zh
     * 绘制二次贝赛尔曲线路径。
     *
     * @param cx - 起始控制点的坐标 x 轴。
     * @param cy - 起始控制点的坐标 y 轴。
     * @param x - 终点控制点的坐标 x 轴。
     * @param y - 终点控制点的坐标 x 轴。
     */
    public quadraticCurveTo (cx: number, cy: number, x: number, y: number) {
        if (!this.impl) {
            return;
        }

        this.impl.quadraticCurveTo(cx, cy, x, y);
    }

    /**
     * @zh
     * 绘制圆弧路径。圆弧路径的圆心在 (cx, cy) 位置，半径为 r ，根据 counterclockwise （默认为false）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
     *
     * @param cx - 中心控制点的坐标 x 轴。
     * @param cy - 中心控制点的坐标 y 轴。
     * @param r - 圆弧弧度。
     * @param startAngle - 开始弧度，从正 x 轴顺时针方向测量。
     * @param endAngle - 结束弧度，从正 x 轴顺时针方向测量。
     * @param counterclockwise 如果为真，在两个角度之间逆时针绘制。默认顺时针。
     */
    public arc (cx: number, cy: number, r: number, startAngle: number, endAngle: number, counterclockwise: boolean) {
        if (!this.impl) {
            return;
        }

        this.impl.arc(cx, cy, r, startAngle, endAngle, counterclockwise);
    }

    /**
     * @zh
     * 绘制椭圆路径。
     *
     * @param cx - 中心点的坐标 x 轴。
     * @param cy - 中心点的坐标 y 轴。
     * @param rx - 椭圆 x 轴半径。
     * @param ry - 椭圆 y 轴半径。
     */
    public ellipse (cx: number, cy: number, rx: number, ry: number) {
        if (!this.impl) {
            return;
        }

        this.impl.ellipse(cx, cy, rx, ry);
    }

    /**
     * @zh
     * 绘制圆形路径。
     *
     * @param cx - 中心点的坐标 x 轴。
     * @param cy - 中心点的坐标 y 轴。
     * @param r - 圆半径。
     */
    public circle (cx: number, cy: number, r: number) {
        if (!this.impl) {
            return;
        }

        this.impl.circle(cx, cy, r);
    }

    /**
     * @zh
     * 绘制矩形路径。
     *
     * @param x - 矩形起始坐标 x 轴。
     * @param y - 矩形起始坐标 y 轴。
     * @param w - 矩形宽度。
     * @param h - 矩形高度。
     */
    public rect (x: number, y: number, w: number, h: number) {
        if (!this.impl) {
            return;
        }

        this.impl.rect(x, y, w, h);
    }

    /**
     * @zh
     * 绘制圆角矩形路径。
     *
     * @param x - 矩形起始坐标 x 轴。
     * @param y - 矩形起始坐标 y 轴。
     * @param w - 矩形宽度。
     * @param h - 矩形高度。
     * @param r - 矩形圆角半径。
     */
    public roundRect (x: number, y: number, w: number, h: number, r: number) {
        if (!this.impl) {
            return;
        }

        this.impl.roundRect(x, y, w, h, r);
    }

    /**
     * @zh
     * 绘制填充矩形。
     *
     * @param x - 矩形起始坐标 x 轴。
     * @param y - 矩形起始坐标 y 轴。
     * @param w - 矩形宽度。
     * @param h - 矩形高度。
     */
    public fillRect (x, y, w, h) {
        this.rect(x, y, w, h);
        this.fill();
    }

    /**
     * @zh
     * 擦除之前绘制的所有内容的方法。
     */
    public clear (clean = false) {
        if (!this.impl) {
            return;
        }

        this.impl.clear(clean);
        if (this.model) {
            this.model.destroy();
            this.model.scene.destroyModel(this.model);
            this.model = null;
        }
    }

    /**
     * @zh
     * 将笔点返回到当前路径起始点的。它尝试从当前点到起始点绘制一条直线。
     */
    public close () {
        if (!this.impl) {
            return;
        }

        this.impl.close();
    }

    /**
     * @zh
     * 根据当前的画线样式，绘制当前或已经存在的路径。
     */
    public stroke () {
        (this._assembler as IAssembler).stroke!(this);
    }

    /**
     * @zh
     * 根据当前的画线样式，填充当前或已经存在的路径。
     */
    public fill () {
        (this._assembler as IAssembler).fill!(this);
    }

    /**
     * @zh
     * 辅助材质实例化。可用于只取数据而无实体情况下渲染使用。特殊情况可参考：[[_instanceMaterial]]
     */
    public helpInstanceMaterial () {
        let mat: Material | null = null;
        if (this._sharedMaterial) {
            mat = Material.getInstantiatedMaterial(this._sharedMaterial, new RenderableComponent(), CC_EDITOR ? true : false);
        } else {
            mat = Material.getInstantiatedMaterial(cc.builtinResMgr.get('ui-base-material'), new RenderableComponent(), CC_EDITOR ? true : false);
            mat.recompileShaders({ USE_LOCAL: true });
            mat.onLoaded();
        }

        this._updateMaterial(mat);
        if (!this.impl){
            this._flushAssembler();
            this.impl = this._assembler && (this._assembler as IAssembler).createImpl!(this);
        }
    }

    protected _render(render: UI) {
        render.commitModel(this, this.model, this._material);
    }

    protected _instanceMaterial (){
        this.helpInstanceMaterial();
    }

    protected _flushAssembler (){
        const assembler = GraphicsComponent.Assembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this._assembler = assembler;
        }
    }

    protected _canRender (){
        if (!super._canRender()){
            return false;
        }

        return this.model ? true : false;
    }
}

cc.GraphicsComponent = GraphicsComponent;
