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
import { Component } from '../../components/component';
import { ccclass, executeInEditMode, menu, property } from '../../core/data/class-decorator';
import { Enum, Rect } from '../../core/value-types';
import { color4, toRadian } from '../../core/vmath';
import { GFXClearFlag } from '../../gfx/define';
import { Camera, CameraProjection } from '../../renderer/scene/camera';

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
    SKYBOX: GFXClearFlag.SKYBOX | GFXClearFlag.DEPTH | GFXClearFlag.STENCIL,
    SOLID_COLOR: GFXClearFlag.COLOR | GFXClearFlag.DEPTH | GFXClearFlag.STENCIL,
    DEPTH_ONLY: GFXClearFlag.DEPTH | GFXClearFlag.STENCIL,
    DONT_CLEAR: 0,
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

    protected _camera: Camera | null = null;

    constructor () {
        super();
    }

    /**
     * !#en The projection type of the camera
     *
     * !#ch 相机的投影类型
     * @type {Number}
     */
    @property({
        type: ProjectionType,
    })
    get projection () {
        return this._projection;
    }

    set projection (val) {
        this._projection = val;

        let type = CameraProjection.PERSPECTIVE;
        if (this._projection === ProjectionType.ORTHO) {
            type = CameraProjection.ORTHO;
        }
        if (this._camera) { this._camera.projectionType = type; }
    }

    /**
     * !#en The camera field of view
     *
     * !#ch 相机的视野
     * @type {Number}
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
     * !#ch 在正交模式下的相机高度
     * @type {Number}
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
     * !#ch 相机的最近剪切距离
     * @type {Number}
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
     * !#ch 相机的最近剪切距离
     * @type {Number}
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
     * !#en The clearing color of the camera
     *
     * !#ch 在没有天空盒的情况下的屏幕颜色
     * @type {Color}
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
     * !#en The clearing depth value of the camera
     *
     * !#ch 清除相机的深度值
     * @type {Number}
     */
    @property
    get depth () {
        return this._depth;
    }

    set depth (val) {
        this._depth = val;
        if (this._camera) {
            this._camera.clearDepth = val;
        }
    }

    /**
     * !#en The clearing stencil value of the camera
     *
     * !#ch 清除相机的模板值
     * @type {Number}
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
     * !#ch 清除相机标志位
     * @type {Number}
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
     * !#en The screen rect of the camera
     *
     * !#ch 相机的屏幕矩形
     * @type {Rect}
     */
    @property
    get rect () {
        return this._rect;
    }

    set rect (val) {
        this._rect = val;
        if (this._camera) { this._camera.viewport = val; }
    }

    public onLoad () {

    }

    public onEnable () {
        this._camera = this._getRenderScene().createCamera(this.name);
        this._camera.node = this.node;
        this.projection = this._projection;
        this.fov = this._fov;
        this.orthoHeight = this._orthoHeight;
        this.near = this._near;
        this.far = this._far;
        this.color = this._color;
        this.depth = this._depth;
        this.stencil = this._stencil;
        this.clearFlags = this._clearFlags;
        this.rect = this._rect;
    }

    public onDisable () {
        if (this._camera) { this._getRenderScene().destroyCamera(this._camera); }
    }

    public onDestroy () {

    }
}
