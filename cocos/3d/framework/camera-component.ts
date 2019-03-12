/****************************************************************************
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
import { ray } from '../../3d/geom-utils';
import { Component } from '../../components/component';
import { ccclass, executeInEditMode, menu, property } from '../../core/data/class-decorator';
import { Enum, Rect, Vec3 } from '../../core/value-types';
import { color4, toRadian } from '../../core/vmath';
import { GFXClearFlag } from '../../gfx/define';
import { Camera } from '../../renderer';
import { IRenderTargetInfo } from '../../pipeline/render-view';

/**
 * !#en The light source type
 *
 * !#ch 光源类型
 * @static
 * @enum CameraComponent.Projection
 */
const ProjectionType = Enum({
    /**
     * !#en The orthogonal camera
     *
     * !#ch 正交相机
     * @property Ortho
     * @readonly
     * @type {Number}
     */
    ORTHO: 0,
    /**
     * !#en The perspective camera
     *
     * !#ch 透视相机
     * @property Perspective
     * @readonly
     * @type {Number}
     */
    PERSPECTIVE: 1,
});

const CameraClearFlag = Enum({
    SOLID_COLOR: GFXClearFlag.COLOR | GFXClearFlag.DEPTH | GFXClearFlag.STENCIL,
    DEPTH_ONLY: GFXClearFlag.DEPTH | GFXClearFlag.STENCIL,
    DONT_CLEAR: GFXClearFlag.NONE,
});

/**
 * !#en The Camera Component
 *
 * !#ch 相机组件
 * @class CameraComponent
 * @extends Component
 */
@ccclass('cc.CameraComponent')
@menu('Components/CameraComponent')
@executeInEditMode
export class CameraComponent extends Component {
    public static ProjectionType = ProjectionType;

    @property
    protected _projection = ProjectionType.PERSPECTIVE;
    @property
    protected _priority = 0;
    @property
    protected _fov = 45;
    @property
    protected _orthoHeight = 10;
    @property
    protected _near = 0.01;
    @property
    protected _far = 1000.0;
    @property
    protected _color = cc.color('#334C78');
    @property
    protected _depth = 1;
    @property
    protected _stencil = 0;
    @property
    protected _clearFlags = CameraClearFlag.SOLID_COLOR;
    @property
    protected _rect = new Rect(0, 0, 1, 1);
    @property
    protected _screenScale = 1;
    @property
    protected _targetDisplay = -1;

    protected _camera: Camera | null = null;

    constructor () {
        super();
    }

    /**
     * !#en Create offscreen render target
     *
     * !#ch 创建离屏渲染目标
     */
    public createRenderTarget (info: IRenderTargetInfo): boolean {
        if (this._camera) {
            return this._camera.view.createRenderTarget(info);
        } else {
            return false;
        }
    }

    /**
     * !#en Destroy offscreen render target
     *
     * !#ch 销毁离屏渲染目标
     */
    public destroyRenderTarget () {
        if (this._camera) {
            return this._camera.view.destroyRenderTarget();
        }
    }

    /**
     * !#en The projection type of the camera
     *
     * !#ch 相机的投影类型
     */
    @property({
        type: ProjectionType,
    })
    get projection () {
        return this._projection;
    }

    set projection (val) {
        this._projection = val;
        if (this._camera) { this._camera.projectionType = val; }
    }

    /**
     * !#en The camera field of view
     *
     * !#ch 相机的视角高度
     */
    @property
    get fov () {
        return this._fov;
    }

    set fov (val) {
        this._fov = val;
        if (this._camera) { this._camera.fov = toRadian(val); }
    }

    /**
     * !#en The camera height when in orthogonal mode
     *
     * !#ch 正交模式下的相机高度
     */
    @property
    get orthoHeight () {
        return this._orthoHeight;
    }

    set orthoHeight (val) {
        this._orthoHeight = val;
        if (this._camera) { this._camera.orthoHeight = val; }
    }

    /**
     * !#en The near clipping distance of the camera
     *
     * !#ch 相机的近平面
     */
    @property
    get near () {
        return this._near;
    }

    set near (val) {
        this._near = val;
        if (this._camera) { this._camera.nearClip = val; }
    }

    /**
     * !#en The far clipping distance of the camera
     *
     * !#ch 相机的远平面
     */
    @property
    get far () {
        return this._far;
    }

    set far (val) {
        this._far = val;
        if (this._camera) { this._camera.farClip = val; }
    }

    /**
     * !#en The color clearing value of the camera
     *
     * !#ch 相机的颜色缓冲默认值
     */
    @property
    get color () {
        return this._color;
    }

    set color (val) {
        this._color = val;
        if (this._camera) { this._camera.clearColor =
            color4.create(val.r / 255, val.g / 255, val.b / 255, val.a / 255);
        }
    }

    /**
     * !#en The depth clearing value of the camera
     *
     * !#ch 相机的深度缓冲默认值
     */
    @property
    get depth () {
        return this._depth;
    }

    set depth (val) {
        this._depth = val;
        if (this._camera) { this._camera.clearDepth = val; }
    }

    /**
     * !#en The stencil clearing value of the camera
     *
     * !#ch 相机的模板缓冲默认值
     */
    @property
    get stencil () {
        return this._stencil;
    }

    set stencil (val) {
        this._stencil = val;
        if (this._camera) { this._camera.clearStencil = val; }
    }

    /**
     * !#en The clearing flags of this camera
     *
     * !#ch 相机的缓冲清除标志位
     */
    @property({
        type: CameraClearFlag,
    })
    get clearFlags () {
        return this._clearFlags;
    }

    set clearFlags (val) {
        this._clearFlags = val;
        if (this._camera) { this._camera.clearFlag = val; }
    }

    /**
     * !#en The screen viewport of the camera wrt. sceen size
     *
     * !#ch 相机相对屏幕的 viewport
     */
    @property
    get rect () {
        return this._rect;
    }

    set rect (val) {
        this._rect = val;
        if (this._camera) { this._camera.viewport = val; }
    }

    /**
     * !#en The scale of the interal buffer size,
     * set to 1 to keep the same with the canvas size
     *
     * !#ch 相机内部缓冲尺寸的缩放值, 1 为与 canvas 尺寸相同
     */
    @property
    get screenScale () {
        return this._screenScale;
    }

    set screenScale (val) {
        this._screenScale = val;
        if (this._camera) { this._camera.screenScale = val; }
    }

    /**
     * !#en The target display for this Camera.
     *
     * !#ch 相机的目标屏幕序号
     */
    @property
    get targetDisplay () {
        return this._targetDisplay;
    }
    set targetDisplay (val) {
        this._targetDisplay = val;
        if (this._camera) { this._camera.changeTargetDisplay(val); }
    }

    public onEnable () {
        if (this._camera) { this._camera.enabled = true; return; }
        this._createCamera();
        this._camera!.enabled = true;
    }

    public onDisable () {
        if (this._camera) { this._camera.enabled = false; }
    }

    public onDestroy () {
        if (this._camera) { this._getRenderScene().destroyCamera(this._camera); this._camera = null; }
    }

    public screenPointToRay (x: number, y: number, out?: ray) {
        if (!out) { out = ray.create(); }
        if (this._camera) { this._camera.screenPointToRay(out, x, y); }
        return out;
    }

    public worldToScreen (worldPos: Vec3, out?: Vec3) {
        if (!out) { out = new Vec3(); }
        if (this._camera) { this._camera.worldToScreen(out, worldPos); }
        return out;
    }

    public screenToWorld (screenPos: Vec3, out?: Vec3) {
        if (!out) { out = this.node.getWorldPosition(); }
        if (this._camera) { this._camera.screenToWorld(out, screenPos); }
        return out;
    }

    protected _createCamera () {
        if (!this.node.scene) { return; }
        const scene = this._getRenderScene();
        if (this._camera && scene.cameras.find((c) => c === this._camera)) { return; }
        this._camera = scene.createCamera({
            name: this._name,
            node: this.node,
            projection: this._projection,
            targetDisplay: this._targetDisplay,
            priority: this._priority,
        });

        this._camera.viewport = this._rect;
        this._camera.fov = this._fov;
        this._camera.nearClip = this._near;
        this._camera.farClip = this._far;
        this._camera.clearColor = color4.create(this._color.r / 255, this._color.g / 255, this._color.b / 255, this._color.a / 255)
        this._camera.clearDepth = this._depth;
        this._camera.clearStencil = this._stencil;
        this._camera.clearFlag = this._clearFlags;
    }
}
