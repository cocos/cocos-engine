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
// @ts-check
import RenderSystemActor from './renderSystemActor';
import renderer from '../../renderer/index';
import { toRadian } from '../../core/vmath';
import { ccclass, menu, property } from "../../core/data/class-decorator";
import { Color, Enum } from '../../core/value-types';

/**
 * @typedef {import('../../core/value-types/index').Color} Color
 */

/**
 * !#en The light source type
 *
 * !#ch 光源类型
 * @static
 * @enum CameraComponent.Projection
 */
let CameraProjection = Enum({
    /**
     * !#en The orthogonal camera
     *
     * !#ch 正交相机
     * @property Ortho
     * @readonly
     * @type {Number}
     */
    Ortho: 0,
    /**
     * !#en The perspective camera
     *
     * !#ch 透视相机
     * @property Perspective
     * @readonly
     * @type {Number}
     */
    Perspective: 1,
});

/**
 * !#en The Camera Component
 *
 * !#ch 相机组件
 * @class CameraComponent
 * @extends RenderSystemActor
 */
@ccclass('cc.CameraComponent')
@menu('Components/CameraComponent')
export default class CameraComponent extends RenderSystemActor{
    @property
    _projection = CameraProjection.Perspective;

    @property
    _priority = 0;

    @property
    _fov = 45;

    @property
    _orthoHeight = 10;

    @property
    _near = 0.01;

    @property
    _far = 1000.0;

    @property
    _color = Color.WHITE;

    @property
    _depth = 1;

    @property
    _stencil = 0;

    @property
    _clearFlags = 3;

    @property
    _rect = [0, 0, 1, 1];

    /**
     * !#en The projection type of the camera
     *
     * !#ch 相机的投影类型
     * @type {Number}
     */
    @property({
        type: CameraProjection
    })
    get projection() {
        return this._projection;
    }

    set projection(val) {
        this._projection = val;

        let type = renderer.PROJ_PERSPECTIVE;
        if (this._projection === 'ortho') {
            type = renderer.PROJ_ORTHO;
        }
        this._camera.setType(type);
    }

    /**
     * !#en The camera priority
     *
     * !#ch 相机的优先级，优先级低的优先渲染
     * @type {Number}
     */
    @property
    get priority() {
        return this._priority;
    }

    set priority(val) {
        this._priority = val;
        this._camera.setPriority(val);
    }

    /**
     * !#en The camera field of view
     *
     * !#ch 相机的视野
     * @type {Number}
     */
    @property
    get fov() {
        return this._fov;
    }

    set fov(val) {
        this._fov = val;
        this._camera.setFov(toRadian(val));
    }

    /**
     * !#en The camera height when in orthogonal mode
     *
     * !#ch 在正交模式下的相机高度
     * @type {Number}
     */
    @property
    get orthoHeight() {
        return this._orthoHeight;
    }

    set orthoHeight(val) {
        this._orthoHeight = val;
        this._camera.setOrthoHeight(val);
    }

    /**
     * !#en The near clipping distance of the camera
     *
     * !#ch 相机的最近剪切距离
     * @type {Number}
     */
    @property
    get near() {
        return this._near;
    }

    set near(val) {
        this._near = val;
        this._camera.setNear(val);
    }

    /**
     * !#en The far clipping distance of the camera
     *
     * !#ch 相机的最近剪切距离
     * @type {Number}
     */
    @property
    get far() {
        return this._far;
    }

    set far(val) {
        this._far = val;
        this._camera.setFar(val);
    }

    /**
     * !#en The clearing color of the camera
     *
     * !#ch 在没有天空盒的情况下的屏幕颜色
     * @type {Color}
     */
    @property
    get color() {
        return this._color;
    }

    set color(val) {
        this._color = val;
        this._camera.setColor(val.r, val.g, val.b, val.a);
    }

    /**
     * !#en The clearing depth value of the camera
     *
     * !#ch 清除相机的深度值
     * @type {Number}
     */
    @property
    get depth() {
        return this._depth;
    }

    set depth(val) {
        this._depth = val;
        this._camera.setDepth(val);
    }

    /**
     * !#en The clearing stencil value of the camera
     *
     * !#ch 清除相机的模板值
     * @type {Number}
     */
    @property
    get stencil() {
        return this._stencil;
    }

    set stencil(val) {
        this._stencil = val;
        this._camera.setStencil(val);
    }

    /**
     * !#en The clearing flags of this camera
     *
     * !#ch 清除相机标志位
     * @type {Number}
     */
    @property
    get clearFlags() {
        return this._clearFlags;
    }

    set clearFlags(val) {
        this._clearFlags = val;
        this._camera.setClearFlags(val);
    }

    /**
     * !#en The screen rect of the camera
     *
     * !#ch 相机的屏幕矩形
     * @type {Array}
     */
    @property
    get rect() {
        return this._rect;
    }

    set rect(val) {
        this._rect = val;
        this._camera.setRect(val[0], val[1], val[2], val[3]);
    }

    static Projection = CameraProjection;

    constructor() {
        super();
        this._camera = new renderer.Camera();
    }

    onLoad() {
        this._camera.setStages([
            'opaque',
            'transparent'
        ]);
        this._camera.setNode(this.node);
    }

    onEnable() {
        this.scene.addCamera(this._camera);
    }

    onDisable() {
        this.scene.removeCamera(this._camera);
    }
}
