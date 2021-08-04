/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @packageDocumentation
 * @module component/camera
 */

import { EDITOR } from 'internal:constants';
import { ccclass, help, executeInEditMode, menu, tooltip, displayOrder, type, serializable } from 'cc.decorator';
import { RenderTexture } from '../assets/render-texture';
import { UITransform } from '../../2d/framework';
import { Component } from './component';
import { Ray } from '../geometry';
import { Color, Rect, toRadian, Vec3 } from '../math';
import { CAMERA_DEFAULT_MASK } from '../pipeline/define';
import { view } from '../platform/view';
import { scene } from '../renderer';
import { SKYBOX_FLAG, CameraProjection, CameraFOVAxis, CameraAperture, CameraISO, CameraShutter } from '../renderer/scene/camera';
import { Root } from '../root';
import { Node } from '../scene-graph/node';
import { Layers } from '../scene-graph/layers';
import { Enum } from '../value-types';
import { TransformBit } from '../scene-graph/node-enum';
import { legacyCC } from '../global-exports';
import { RenderWindow } from '../renderer/core/render-window';
import { ClearFlagBit } from '../gfx';

const _temp_vec3_1 = new Vec3();

/**
 * @en The projection type.
 * @zh 投影类型。
 */
const ProjectionType = Enum(CameraProjection);
const FOVAxis = Enum(CameraFOVAxis);
const Aperture = Enum(CameraAperture);
const Shutter = Enum(CameraShutter);
const ISO = Enum(CameraISO);

export const ClearFlag = Enum({
    SKYBOX: SKYBOX_FLAG | ClearFlagBit.DEPTH_STENCIL,
    SOLID_COLOR: ClearFlagBit.ALL,
    DEPTH_ONLY: ClearFlagBit.DEPTH_STENCIL,
    DONT_CLEAR: ClearFlagBit.NONE,
});

export declare namespace Camera {
    export type ProjectionType = EnumAlias<typeof ProjectionType>;
    export type FOVAxis = EnumAlias<typeof FOVAxis>;
    export type ClearFlag = EnumAlias<typeof ClearFlag>;
    export type Aperture = EnumAlias<typeof Aperture>;
    export type Shutter = EnumAlias<typeof Shutter>;
    export type ISO = EnumAlias<typeof ISO>;
}

/**
 * @en The Camera Component.
 * @zh 相机组件。
 */
@ccclass('cc.Camera')
@help('i18n:cc.Camera')
@menu('Rendering/Camera')
@executeInEditMode
export class Camera extends Component {
    public static ProjectionType = ProjectionType;
    public static FOVAxis = FOVAxis;
    public static ClearFlag = ClearFlag;
    public static Aperture = Aperture;
    public static Shutter = Shutter;
    public static ISO = ISO;

    @serializable
    protected _projection = ProjectionType.PERSPECTIVE;
    @serializable
    protected _priority = 0;
    @serializable
    protected _fov = 45;
    @serializable
    protected _fovAxis = FOVAxis.VERTICAL;
    @serializable
    protected _orthoHeight = 10;
    @serializable
    protected _near = 1;
    @serializable
    protected _far = 1000;
    @serializable
    protected _color = new Color('#333333');
    @serializable
    protected _depth = 1;
    @serializable
    protected _stencil = 0;
    @serializable
    protected _clearFlags = ClearFlag.SOLID_COLOR;
    @serializable
    protected _rect = new Rect(0, 0, 1, 1);
    @serializable
    protected _aperture = Aperture.F16_0;
    @serializable
    protected _shutter = Shutter.D125;
    @serializable
    protected _iso = ISO.ISO100;
    @serializable
    protected _screenScale = 1;
    @serializable
    protected _visibility = CAMERA_DEFAULT_MASK;
    @serializable
    protected _targetTexture: RenderTexture | null = null;

    protected _camera: scene.Camera | null = null;
    protected _inEditorMode = false;
    protected _flows: string[] | undefined = undefined;

    get camera () {
        return this._camera!;
    }

    /**
     * @en Render priority of the camera. Cameras with higher depth are rendered after cameras with lower depth.
     * @zh 相机的渲染优先级，值越小越优先渲染。
     */
    @displayOrder(0)
    @tooltip('i18n:camera.priority')
    get priority () {
        return this._priority;
    }

    set priority (val) {
        this._priority = val;
        if (this._camera) {
            this._camera.priority = val;
        }
    }

    /**
     * @en Visibility mask, declaring a set of node layers that will be visible to this camera.
     * @zh 可见性掩码，声明在当前相机中可见的节点层级集合。
     */
    @type(Layers.BitMask)
    @displayOrder(1)
    @tooltip('i18n:camera.visibility')
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
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    @type(ClearFlag)
    @displayOrder(2)
    @tooltip('i18n:camera.clear_flags')
    get clearFlags () {
        return this._clearFlags;
    }

    set clearFlags (val) {
        this._clearFlags = val;
        if (this._camera) { this._camera.clearFlag = val; }
    }

    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    @displayOrder(3)
    @tooltip('i18n:camera.color')
    // @constget
    get clearColor (): Readonly<Color> {
        return this._color;
    }

    set clearColor (val) {
        this._color.set(val);
        if (this._camera) {
            this._camera.clearColor = this._color;
        }
    }

    /**
     * @en Clearing depth of the camera.
     * @zh 相机的深度缓冲默认值。
     */
    @displayOrder(4)
    @tooltip('i18n:camera.depth')
    get clearDepth () {
        return this._depth;
    }

    set clearDepth (val) {
        this._depth = val;
        if (this._camera) { this._camera.clearDepth = val; }
    }

    /**
     * @en Clearing stencil of the camera.
     * @zh 相机的模板缓冲默认值。
     */
    @displayOrder(5)
    @tooltip('i18n:camera.stencil')
    get clearStencil () {
        return this._stencil;
    }

    set clearStencil (val) {
        this._stencil = val;
        if (this._camera) { this._camera.clearStencil = val; }
    }

    /**
     * @en Projection type of the camera.
     * @zh 相机的投影类型。
     */
    @type(ProjectionType)
    @displayOrder(6)
    @tooltip('i18n:camera.projection')
    get projection () {
        return this._projection;
    }

    set projection (val) {
        this._projection = val;
        if (this._camera) { this._camera.projectionType = val; }
    }

    /**
     * @en The axis on which the FOV would be fixed regardless of screen aspect changes.
     * @zh 指定视角的固定轴向，在此轴上不会跟随屏幕长宽比例变化。
     */
    @type(FOVAxis)
    @displayOrder(7)
    @tooltip('i18n:camera.fov_axis')
    get fovAxis () {
        return this._fovAxis;
    }

    set fovAxis (val) {
        if (val === this._fovAxis) { return; }
        this._fovAxis = val;
        if (this._camera) {
            this._camera.fovAxis = val;
            if (val === CameraFOVAxis.VERTICAL) { this.fov = this._fov * this._camera.aspect; } else { this.fov = this._fov / this._camera.aspect; }
        }
    }

    /**
     * @en Field of view of the camera.
     * @zh 相机的视角大小。
     */
    @displayOrder(8)
    @tooltip('i18n:camera.fov')
    get fov () {
        return this._fov;
    }

    set fov (val) {
        this._fov = val;
        if (this._camera) { this._camera.fov = toRadian(val); }
    }

    /**
     * @en Viewport height in orthographic mode.
     * @zh 正交模式下的相机视角高度。
     */
    @displayOrder(9)
    @tooltip('i18n:camera.ortho_height')
    get orthoHeight () {
        return this._orthoHeight;
    }

    set orthoHeight (val) {
        this._orthoHeight = val;
        if (this._camera) { this._camera.orthoHeight = val; }
    }

    /**
     * @en Near clipping distance of the camera, should be as large as possible within acceptable range.
     * @zh 相机的近裁剪距离，应在可接受范围内尽量取最大。
     */
    @displayOrder(10)
    @tooltip('i18n:camera.near')
    get near () {
        return this._near;
    }

    set near (val) {
        this._near = val;
        if (this._camera) { this._camera.nearClip = val; }
    }

    /**
     * @en Far clipping distance of the camera, should be as small as possible within acceptable range.
     * @zh 相机的远裁剪距离，应在可接受范围内尽量取最小。
     */
    @displayOrder(11)
    @tooltip('i18n:camera.far')
    get far () {
        return this._far;
    }

    set far (val) {
        this._far = val;
        if (this._camera) { this._camera.farClip = val; }
    }

    /**
     * @en Camera aperture, controls the exposure parameter.
     * @zh 相机光圈，影响相机的曝光参数。
     */
    @type(Aperture)
    @displayOrder(12)
    @tooltip('i18n:camera.aperture')
    get aperture () {
        return this._aperture;
    }

    set aperture (val) {
        this._aperture = val;
        if (this._camera) { this._camera.aperture = val; }
    }

    /**
     * @en Camera shutter, controls the exposure parameter.
     * @zh 相机快门，影响相机的曝光参数。
     */
    @type(Shutter)
    @displayOrder(13)
    @tooltip('i18n:camera.shutter')
    get shutter () {
        return this._shutter;
    }

    set shutter (val) {
        this._shutter = val;
        if (this._camera) { this._camera.shutter = val; }
    }

    /**
     * @en Camera ISO, controls the exposure parameter.
     * @zh 相机感光度，影响相机的曝光参数。
     */
    @type(ISO)
    @displayOrder(14)
    @tooltip('i18n:camera.ISO')
    get iso () {
        return this._iso;
    }

    set iso (val) {
        this._iso = val;
        if (this._camera) { this._camera.iso = val; }
    }

    /**
     * @en Screen viewport of the camera wrt. the sceen size.
     * @zh 此相机最终渲染到屏幕上的视口位置和大小。
     */
    @displayOrder(15)
    @tooltip('i18n:camera.rect')
    get rect () {
        return this._rect;
    }

    set rect (val) {
        this._rect = val;
        if (this._camera) { this._camera.viewport = val; }
    }

    /**
     * @en Output render texture of the camera. Default to null, which outputs directly to screen.
     * @zh 指定此相机的渲染输出目标贴图，默认为空，直接渲染到屏幕。
     */
    @type(RenderTexture)
    @displayOrder(16)
    @tooltip('i18n:camera.target_texture')
    get targetTexture () {
        return this._targetTexture;
    }

    set targetTexture (value) {
        if (this._targetTexture === value) {
            return;
        }

        const old = this._targetTexture;
        this._targetTexture = value;
        this._checkTargetTextureEvent(old);
        this._updateTargetTexture();

        if (!value && this._camera) {
            this._camera.changeTargetWindow(EDITOR ? legacyCC.director.root.tempWindow : null);
            this._camera.isWindowSize = true;
        }
        this.node.emit('targetChange', this);
    }

    /**
     * @en Scale of the internal buffer size,
     * set to 1 to keep the same with the canvas size.
     * @zh 相机内部缓冲尺寸的缩放值, 1 为与 canvas 尺寸相同。
     */
    get screenScale () {
        return this._screenScale;
    }

    set screenScale (val) {
        this._screenScale = val;
        if (this._camera) { this._camera.screenScale = val; }
    }

    get inEditorMode () {
        return this._inEditorMode;
    }

    set inEditorMode (value) {
        this._inEditorMode = value;
        if (this._camera) {
            this._camera.changeTargetWindow(value ? legacyCC.director.root && legacyCC.director.root.mainWindow
                : legacyCC.director.root && legacyCC.director.root.tempWindow);
        }
    }

    public onLoad () {
        this._createCamera();
    }

    public onEnable () {
        this.node.hasChangedFlags |= TransformBit.POSITION; // trigger camera matrix update
        if (this._camera) {
            this._attachToScene();
        }
    }

    public onDisable () {
        if (this._camera) {
            this._detachFromScene();
        }
    }

    public onDestroy () {
        if (this._camera) {
            this._camera.destroy();
            this._camera = null;
        }

        if (this._targetTexture) {
            this._targetTexture.off('resize');
        }
    }

    public screenPointToRay (x: number, y: number, out?: Ray) {
        if (!out) { out = Ray.create(); }
        if (this._camera) { this._camera.screenPointToRay(out, x, y); }
        return out;
    }

    public worldToScreen (worldPos: Readonly<Vec3>, out?: Vec3) {
        if (!out) { out = new Vec3(); }
        if (this._camera) { this._camera.worldToScreen(out, worldPos); }
        return out;
    }

    public screenToWorld (screenPos: Vec3, out?: Vec3) {
        if (!out) { out = this.node.getWorldPosition(); }
        if (this._camera) { this._camera.screenToWorld(out, screenPos); }
        return out;
    }

    /**
     * @en 3D node to UI local node coordinates. The converted value is the offset under the UI node.
     *
     * @zh 3D 节点转 UI 本地节点坐标。转换后的值是该 UI 节点下的偏移。
     * @param wpos 3D 节点世界坐标
     * @param uiNode UI 节点
     * @param out 返回在当前传入的 UI 节点下的偏移量
     *
     * @example
     * ```ts
     * this.convertToUINode(target.worldPosition, uiNode.parent, out);
     * uiNode.position = out;
     * ```
     */
    public convertToUINode (wpos: Readonly<Vec3>, uiNode: Node, out?: Vec3) {
        if (!out) {
            out = new Vec3();
        }
        if (!this._camera) { return out; }

        this.worldToScreen(wpos, _temp_vec3_1);
        const cmp = uiNode.getComponent('cc.UITransform') as UITransform;
        const designSize = view.getVisibleSize();
        const xoffset = _temp_vec3_1.x - this._camera.width * 0.5;
        const yoffset = _temp_vec3_1.y - this._camera.height * 0.5;
        _temp_vec3_1.x = xoffset / legacyCC.view.getScaleX() + designSize.width * 0.5;
        _temp_vec3_1.y = yoffset / legacyCC.view.getScaleY() + designSize.height * 0.5;

        if (cmp) {
            cmp.convertToNodeSpaceAR(_temp_vec3_1, out);
        }

        return out;
    }

    public _createCamera () {
        if (!this._camera) {
            this._camera = (legacyCC.director.root as Root).createCamera();
            this._camera.initialize({
                name: this.node.name,
                node: this.node,
                projection: this._projection,
                window: this._inEditorMode ? legacyCC.director.root && legacyCC.director.root.mainWindow
                    : legacyCC.director.root && legacyCC.director.root.tempWindow,
                priority: this._priority,
            });

            this._camera.viewport = this._rect;
            this._camera.fovAxis = this._fovAxis;
            this._camera.fov = toRadian(this._fov);
            this._camera.orthoHeight = this._orthoHeight;
            this._camera.nearClip = this._near;
            this._camera.farClip = this._far;
            this._camera.clearColor = this._color;
            this._camera.clearDepth = this._depth;
            this._camera.clearStencil = this._stencil;
            this._camera.clearFlag = this._clearFlags;
            this._camera.visibility = this._visibility;
            this._camera.aperture = this._aperture;
            this._camera.shutter = this._shutter;
            this._camera.iso = this._iso;
        }

        this._updateTargetTexture();
    }

    protected _attachToScene () {
        if (!this.node.scene || !this._camera) {
            return;
        }
        if (this._camera && this._camera.scene) {
            this._camera.scene.removeCamera(this._camera);
        }
        const rs = this._getRenderScene();
        rs.addCamera(this._camera);
    }

    protected _detachFromScene () {
        if (this._camera && this._camera.scene) {
            this._camera.scene.removeCamera(this._camera);
        }
    }

    protected _checkTargetTextureEvent (old: RenderTexture | null) {
        const resizeFunc = (window: RenderWindow) => {
            if (this._camera) {
                this._camera.setFixedSize(window.width, window.height);
            }
        };

        if (old) {
            old.off('resize');
        }

        if (this._targetTexture) {
            this._targetTexture.on('resize', resizeFunc, this);
        }
    }

    protected _updateTargetTexture () {
        if (!this._camera) {
            return;
        }

        if (this._targetTexture) {
            const window = this._targetTexture.window;
            this._camera.changeTargetWindow(window);
            this._camera.setFixedSize(window!.width, window!.height);
        }
    }
}

legacyCC.Camera = Camera;
