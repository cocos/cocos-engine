/*
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
*/

/**
 * @category component/camera
 */

import { ray } from '../../3d/geom-utils';
import { Component } from '../../components/component';
import { ccclass, executeInEditMode, menu, property } from '../../core/data/class-decorator';
import { Color, Rect, toRadian, Vec3 } from '../../core/math';
import { Enum } from '../../core/value-types';
import { GFXClearFlag } from '../../gfx/define';
import { Camera } from '../../renderer';
import { Scene } from '../../scene-graph';
import { RenderTexture } from '../../assets';
import { GFXWindow } from '../../gfx/window';

/**
 * @en
 * The projection type
 * @zh
 * 投影类型。
 * @static
 * @enum CameraComponent.Projection
 */
const ProjectionType = Enum({
    /**
     * 正交相机。
     * @property Ortho
     * @readonly
     */
    ORTHO: 0,
    /**
     * 透视相机。
     * @property Perspective
     * @readonly
     */
    PERSPECTIVE: 1,
});

const CameraClearFlag = Enum({
    SOLID_COLOR: GFXClearFlag.ALL,
    DEPTH_ONLY: GFXClearFlag.DEPTH_STENCIL,
    DONT_CLEAR: GFXClearFlag.NONE,
});

const c4_1 = new Color();

/**
 * @en The Camera Component
 * @zh 相机组件。
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
    protected _near = 0.1;
    @property
    protected _far = 1000.0;
    @property
    protected _color = new Color('#334C78'); // fromHEX('#334C78');
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
    protected _visibility = 0;
    @property
    protected _targetTexture: RenderTexture | null = null;

    protected _camera: Camera | null = null;
    // hack
    protected _editorWindow: GFXWindow | null = null

    constructor () {
        super();
    }

    /**
     * @en The projection type of the camera
     * @zh 相机的投影类型。
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
     * @en The priority of the camera, it cannot be modified at runtime, instead, it should be set in editor.
     * @zh 相机的优先级顺序，只能在编辑器中设置，动态设置无效。
     */
    @property
    get priority () {
        return this._priority;
    }

    set priority (val) {
        this._priority = val;
    }

    /**
     * @en The camera field of view
     * @zh 相机的视角大小。
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
     * @en The camera height when in orthogonal mode
     * @zh 正交模式下的相机视角大小。
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
     * @en The near clipping distance of the camera
     * @zh 相机的近平面。
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
     * @en The far clipping distance of the camera
     * @zh 相机的远平面。
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
     * @en The color clearing value of the camera
     * @zh 相机的颜色缓冲默认值。
     */
    @property
    // @constget
    get color (): Readonly<Color>  {
        return this._color;
    }

    set color (val) {
        this._color.set(val);
        if (this._camera) {
            Color.set(c4_1, val.r / 255, val.g / 255, val.b / 255, val.a / 255);
            this._camera.clearColor = c4_1;
        }
    }

    /**
     * @en The depth clearing value of the camera
     * @zh 相机的深度缓冲默认值。
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
     * @en The stencil clearing value of the camera
     * @zh 相机的模板缓冲默认值。
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
     * @en The clearing flags of this camera
     * @zh 相机的缓冲清除标志位。
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
     * @en The screen viewport of the camera wrt. sceen size
     * @zh 相机相对屏幕的 viewport。
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
     * @en The scale of the interal buffer size,
     * set to 1 to keep the same with the canvas size
     * @zh 相机内部缓冲尺寸的缩放值, 1 为与 canvas 尺寸相同。
     */
    @property({ visible: false })
    get screenScale () {
        return this._screenScale;
    }

    set screenScale (val) {
        this._screenScale = val;
        if (this._camera) { this._camera.screenScale = val; }
    }

    /**
     * @zh 设置摄像机可见掩码，与Component中的visibility同时使用，用于过滤摄像机不需要渲染的物体
     */
    @property
    get visibility () {
        return this._visibility;
    }

    set visibility (val) {
        this._visibility = val;
        if (this._camera) {
            this._camera.visibility = val;
        }
    }

    /**
     * @zh 设置摄像机 RenderTexture
     */
    @property({
        type: RenderTexture,
    })
    get targetTexture () {
        return this._targetTexture;
    }

    set targetTexture (value){
        if(this._targetTexture === value){
            return;
        }

        if(!value && this._camera){
            this._targetTexture!.removeCamera(this._camera);
        }

        this._targetTexture = value;
        this._updateTargetTexture();
    }

    public onLoad () {
        cc.director.on(cc.Director.EVENT_AFTER_SCENE_LAUNCH, this.onSceneChanged, this);
        this._getEditorWindow();
    }

    public onEnable () {
        if (this._camera) { this._camera.enabled = true; return; }
        this._createCamera();
        this._camera!.enabled = true;
        this._updateTargetTexture();
    }

    public onDisable () {
        if (this._camera) { this._camera.enabled = false; }
    }

    public onDestroy () {
        this._editorWindow = null;
        if (this._camera) { this._getRenderScene().destroyCamera(this._camera); this._camera = null; }
        if(this._targetTexture){
            this._targetTexture.destroy();
            this._targetTexture = null;
        }
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
            name: this.node.name,
            node: this.node,
            projection: this._projection,
            priority: this._priority,
        });

        if (this._camera) {
            this._camera.viewport = this._rect;
            this._camera.fov = toRadian(this._fov);
            this._camera.orthoHeight = this._orthoHeight;
            this._camera.nearClip = this._near;
            this._camera.farClip = this._far;
            const r = this._color.r / 255;
            const g = this._color.g / 255;
            const b = this._color.b / 255;
            const a = this._color.a / 255;
            this._camera.clearColor = { r, g, b, a };
            this._camera.clearDepth = this._depth;
            this._camera.clearStencil = this._stencil;
            this._camera.clearFlag = this._clearFlags;
            this._camera.visibility = this._visibility;
        }
    }

    protected onSceneChanged (scene: Scene) {
        // to handle scene switch of editor camera
        if (this._camera && this._camera.scene !== scene.renderScene) {
            if(this._targetTexture){
                this._targetTexture.removeCamera(this._camera);
            }
            this._createCamera();
            this._camera.enabled = true;
            this._updateTargetTexture();

        }
    }

    protected _getEditorWindow (){
        if(cc.director.root && CC_EDITOR){
            this._editorWindow = cc.director.root.windows[0];
        }
    }

    protected _updateTargetTexture (){
        if (!this._camera) {
            return;
        }

        if (!this._targetTexture) {
            this._camera.changeTargetWindow(this._editorWindow);
        } else {
            this._camera.changeTargetWindow(this._targetTexture.getGFXWindow());
            this._targetTexture.addCamera(this._camera);
        }



    }
}
