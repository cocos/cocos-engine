/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */
import { EDITOR } from 'internal:constants';
import { Frustum, Ray } from '../../geometry';
import { SurfaceTransform, ClearFlagBit, Device, Color, ClearFlags } from '../../gfx';
import { lerp, Mat4, Rect, toRadian, Vec3, IVec4Like } from '../../math';
import { CAMERA_DEFAULT_MASK } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { RenderScene } from '../core/render-scene';
import { legacyCC } from '../../global-exports';
import { RenderWindow } from '../core/render-window';
import { preTransforms } from '../../math/mat4';
import { warnID } from '../../platform/debug';
import { GeometryRenderer } from '../../pipeline/geometry-renderer';

export enum CameraFOVAxis {
    VERTICAL,
    HORIZONTAL,
}

export enum CameraProjection {
    ORTHO,
    PERSPECTIVE,
}

export enum CameraAperture {
    F1_8,
    F2_0,
    F2_2,
    F2_5,
    F2_8,
    F3_2,
    F3_5,
    F4_0,
    F4_5,
    F5_0,
    F5_6,
    F6_3,
    F7_1,
    F8_0,
    F9_0,
    F10_0,
    F11_0,
    F13_0,
    F14_0,
    F16_0,
    F18_0,
    F20_0,
    F22_0,
}

export enum CameraISO {
    ISO100,
    ISO200,
    ISO400,
    ISO800,
}

export enum CameraShutter {
    D1,
    D2,
    D4,
    D8,
    D15,
    D30,
    D60,
    D125,
    D250,
    D500,
    D1000,
    D2000,
    D4000,
}

export enum CameraType {
    DEFAULT = -1,
    LEFT_CAMERA = 0,
    RIGHT_CAMERA = 1,
    MAIN = 2,
}

export enum TrackingType {
    NO_TRACKING = 0,
    POSITION_AND_ROTATION = 1,
    POSITION = 2,
    ROTATION = 3,
}

const FSTOPS: number[] = [1.8, 2.0, 2.2, 2.5, 2.8, 3.2, 3.5, 4.0, 4.5, 5.0, 5.6, 6.3, 7.1, 8.0, 9.0, 10.0, 11.0, 13.0, 14.0, 16.0, 18.0, 20.0, 22.0];
const SHUTTERS: number[] = [1.0, 1.0 / 2.0, 1.0 / 4.0, 1.0 / 8.0, 1.0 / 15.0, 1.0 / 30.0, 1.0 / 60.0, 1.0 / 125.0,
    1.0 / 250.0, 1.0 / 500.0, 1.0 / 1000.0, 1.0 / 2000.0, 1.0 / 4000.0];
const ISOS: number[] = [100.0, 200.0, 400.0, 800.0];

export interface ICameraInfo {
    name: string;
    node: Node;
    projection: number;
    targetDisplay?: number;
    window?: RenderWindow | null;
    priority: number;
    pipeline?: string;
    cameraType: CameraType;
    trackingType: TrackingType;
}

const v_a = new Vec3();
const v_b = new Vec3();
const _tempMat1 = new Mat4();

export const SKYBOX_FLAG = ClearFlagBit.STENCIL << 1;

const correctionMatrices: Mat4[] = [];

/**
 * @en The render camera representation in the render scene, it's managed by [[Camera]]
 * @zh 渲染场景中的相机对象，由项目层的 [[Camera]] 管理。
 */
export class Camera {
    /**
     * @en This exposure value corresponding to default standard camera exposure parameters.
     * @zh 默认相机的曝光值。
     */
    public static get standardExposureValue () {
        return 1.0 / 38400.0;
    }

    /**
     * @en The luminance unit scale used by area lights.
     * @zh 默认局部光源使用的亮度单位缩放。
     */
    public static get standardLightMeterScale () {
        return 10000.0;
    }

    /**
     * @en The name of the camera
     * @zh 相机的名称
     */
    get name () {
        return this._name;
    }

    /**
     * @en The render scene to which the camera is attached
     * @zh 相机所挂载的场景
     */
    get scene () {
        return this._scene;
    }

    /**
     * @en The node of the camera which determines its transform in world space.
     * @zh 相机绑定的节点，决定了它在世界空间的变换矩阵
     */
    set node (val: Node) {
        this._node = val;
    }
    get node () {
        return this._node!;
    }

    /**
     * @en The render window of the camera
     * @zh 相机关联的渲染窗口
     */
    set window (val) {
        this._window = val;
    }
    get window () {
        return this._window!;
    }

    /**
     * @en Whether the camera is enabled, a disabled camera won't be processed in the render pipeline.
     * @zh 相机是否启用，未启用的相机不会被渲染
     */
    set enabled (val) {
        this._enabled = val;
    }
    get enabled () {
        return this._enabled;
    }

    /**
     * @en Visibility mask of the camera, declaring a set of node layers that will be visible to this camera.
     * @zh 相机的可见性掩码，声明在当前相机中可见的节点层级集合。
     */
    set visibility (vis: number) {
        this._visibility = vis;
    }
    get visibility (): number {
        return this._visibility;
    }

    /**
     * @en Render priority of the camera. Cameras with higher depth are rendered after cameras with lower depth.
     * @zh 相机的渲染优先级，值越小越优先渲染。
     */
    get priority (): number {
        return this._priority;
    }

    set priority (val: number) {
        this._priority = val;
    }

    /**
     * @en The width of the camera's view size
     * @zh 相机的视图宽度
     */
    get width () {
        return this._width;
    }

    /**
     * @en The height of the camera's view size
     * @zh 相机的视图高度
     */
    get height () {
        return this._height;
    }

    /**
     * @en The world position of the camera
     * @zh 相机的世界坐标
     */
    set position (val) {
        this._position = val;
    }
    get position () {
        return this._position;
    }

    /**
     * @en The forward vector of the camera's look direction
     * @zh 指向相机观察方向的向量
     */
    set forward (val) {
        this._forward = val;
    }
    get forward () {
        return this._forward;
    }

    /**
     * @en Camera aperture, controls the exposure parameter.
     * @zh 相机光圈，影响相机的曝光参数。
     */
    set aperture (val: CameraAperture) {
        this._aperture = val;
        this._apertureValue = FSTOPS[this._aperture];
        this.updateExposure();
    }
    get aperture (): CameraAperture {
        return this._aperture;
    }

    /**
     * @en Camera aperture value.
     * @zh 相机光圈值。
     */
    get apertureValue (): number {
        return this._apertureValue;
    }

    /**
     * @en Camera shutter, controls the exposure parameter.
     * @zh 相机快门，影响相机的曝光参数。
     */
    set shutter (val: CameraShutter) {
        this._shutter = val;
        this._shutterValue = SHUTTERS[this._shutter];
        this.updateExposure();
    }
    get shutter (): CameraShutter {
        return this._shutter;
    }

    /**
     * @en Camera shutter value.
     * @zh 相机快门值。
     */
    get shutterValue (): number {
        return this._shutterValue;
    }

    /**
     * @en Camera ISO, controls the exposure parameter.
     * @zh 相机感光度，影响相机的曝光参数。
     */
    set iso (val: CameraISO) {
        this._iso = val;
        this._isoValue = ISOS[this._iso];
        this.updateExposure();
    }
    get iso (): CameraISO {
        return this._iso;
    }

    /**
     * @en Camera ISO value.
     * @zh 相机感光度值。
     */
    get isoValue (): number {
        return this._isoValue;
    }

    /**
     * @en The calculated exposure of the camera
     * @zh 相机的曝光参数
     */
    get exposure (): number {
        return this._exposure;
    }

    /**
     * @en Clearing flags of the camera, specifies which part of the framebuffer will be actually cleared every frame.
     * @zh 相机的缓冲清除标志位，指定帧缓冲的哪部分要每帧清除。
     */
    get clearFlag () : ClearFlags {
        return this._clearFlag;
    }
    set clearFlag (flag: ClearFlags) {
        this._clearFlag = flag;
    }

    /**
     * @en Clearing color of the camera.
     * @zh 相机的颜色缓冲默认值。
     */
    set clearColor (val) {
        this._clearColor.x = val.x;
        this._clearColor.y = val.y;
        this._clearColor.z = val.z;
        this._clearColor.w = val.w;
    }
    get clearColor () {
        return this._clearColor as IVec4Like;
    }

    /**
     * @en Clearing depth of the camera.
     * @zh 相机的深度缓冲默认值。
     */
    get clearDepth () : number {
        return this._clearDepth;
    }
    set clearDepth (depth: number) {
        this._clearDepth = depth;
    }

    /**
     * @en Clearing stencil of the camera.
     * @zh 相机的模板缓冲默认值。
     */
    get clearStencil () : number {
        return this._clearStencil;
    }
    set clearStencil (stencil: number) {
        this._clearStencil = stencil;
    }

    /**
     * @en The projection type of the camera.
     * @zh 相机的投影类型。
     */
    set projectionType (val) {
        this._proj = val;
        this._isProjDirty = true;
    }
    get projectionType () {
        return this._proj;
    }

    /**
     * @en The aspect ratio of the camera
     * @zh 相机视图的长宽比
     */
    get aspect () {
        return this._aspect;
    }

    /**
     * @en The viewport height of the orthogonal type camera.
     * @zh 正交相机的视角高度。
     */
    set orthoHeight (val) {
        this._orthoHeight = val;
        this._isProjDirty = true;
    }
    get orthoHeight () {
        return this._orthoHeight;
    }

    /**
     * @en The axis on which the FOV would be fixed regardless of screen aspect changes.
     * @zh 指定视角的固定轴向，在此轴上不会跟随屏幕长宽比例变化。
     */
    set fovAxis (axis) {
        this._fovAxis = axis;
        this._isProjDirty = true;
    }
    get fovAxis () {
        return this._fovAxis;
    }

    /**
     * @en Field of view of the camera.
     * @zh 相机的视角大小。
     */
    set fov (fov) {
        this._fov = fov;
        this._isProjDirty = true;
    }
    get fov () {
        return this._fov;
    }

    /**
     * @en Near clipping distance of the camera, should be as large as possible within acceptable range.
     * @zh 相机的近裁剪距离，应在可接受范围内尽量取最大。
     */
    set nearClip (nearClip) {
        this._nearClip = nearClip;
        this._isProjDirty = true;
    }
    get nearClip () {
        return this._nearClip;
    }

    /**
     * @en Far clipping distance of the camera, should be as small as possible within acceptable range.
     * @zh 相机的远裁剪距离，应在可接受范围内尽量取最小。
     */
    set farClip (farClip) {
        this._farClip = farClip;
        this._isProjDirty = true;
    }
    get farClip () {
        return this._farClip;
    }

    /**
     * @en The viewport rect of the camera, pre-rotated (i.e. always in identity/portrait mode) if possible.
     * @zh 相机的视口矩形，如果设备允许的话，这个视口会永远保持竖屏状态，由渲染流程保障旋转的正确。
     */
    get viewport () {
        return this._viewport;
    }
    set viewport (val) {
        warnID(8302);
        this.setViewportInOrientedSpace(val);
    }

    /**
     * @en The view frustum of the camera
     * @zh 相机的视锥体
     */
    set frustum (val) {
        this._frustum = val;
    }
    get frustum () {
        return this._frustum;
    }

    /**
     * @en The view matrix of the camera
     * @zh 相机的视图矩阵
     */
    get matView () {
        return this._matView;
    }

    /**
     * @en The projection matrix of the camera
     * @zh 相机的投影矩阵
     */
    get matProj () {
        return this._matProj;
    }

    /**
     * @en The inverse of the projection matrix of the camera
     * @zh 相机的逆投影矩阵
     */
    get matProjInv () {
        return this._matProjInv;
    }

    /**
     * @en The view projection matrix of the camera
     * @zh 相机的视图投影矩阵
     */
    get matViewProj () {
        return this._matViewProj;
    }

    /**
     * @en The inverse of the view projection matrix of the camera
     * @zh 相机的逆视图投影矩阵
     */
    get matViewProjInv () {
        return this._matViewProjInv;
    }

    /**
     * @en Whether the camera is fixed size or matching the window size.
     * @zh 相机是固定尺寸还是跟随屏幕尺寸
     */
    public isWindowSize = true;

    /**
     * @en Scale of the internal buffer size,
     * set to 1 to keep the same with the canvas size.
     * @zh 相机内部缓冲尺寸的缩放值, 1 为与 canvas 尺寸相同。
     */
    public screenScale: number;

    private _device: Device;
    private _scene: RenderScene | null = null;
    private _node: Node | null = null;
    private _name: string | null = null;
    private _enabled = false;
    private _proj: CameraProjection = -1;
    private _aspect: number;
    private _orthoHeight = 10.0;
    private _fovAxis = CameraFOVAxis.VERTICAL;
    private _fov: number = toRadian(45);
    private _nearClip = 1.0;
    private _farClip = 1000.0;
    private _clearColor = new Color(0.2, 0.2, 0.2, 1);
    private _viewport: Rect = new Rect(0, 0, 1, 1);
    private _orientedViewport: Rect = new Rect(0, 0, 1, 1);
    private _curTransform = SurfaceTransform.IDENTITY;
    private _isProjDirty = true;
    private _matView: Mat4 = new Mat4();
    private _matProj: Mat4 = new Mat4();
    private _matProjInv: Mat4 = new Mat4();
    private _matViewProj: Mat4 = new Mat4();
    private _matViewProjInv: Mat4 = new Mat4();
    private _frustum: Frustum = new Frustum();
    private _forward: Vec3 = new Vec3();
    private _position: Vec3 = new Vec3();
    private _priority = 0;
    private _aperture: CameraAperture = CameraAperture.F16_0;
    private _apertureValue: number;
    private _shutter: CameraShutter = CameraShutter.D125;
    private _shutterValue = 0.0;
    private _iso: CameraISO = CameraISO.ISO100;
    private _isoValue = 0.0;
    private _window: RenderWindow | null = null;
    private _width = 1;
    private _height = 1;
    private _clearFlag = ClearFlagBit.NONE;
    private _clearDepth = 1.0;
    private _visibility = CAMERA_DEFAULT_MASK;
    private _exposure = 0;
    private _clearStencil = 0;
    private _geometryRenderer: GeometryRenderer | null = null;
    private _cameraType: CameraType = CameraType.DEFAULT;
    private _trackingType: TrackingType = TrackingType.NO_TRACKING;

    constructor (device: Device) {
        this._device = device;
        this._apertureValue = FSTOPS[this._aperture];
        this._shutterValue = SHUTTERS[this._shutter];
        this._isoValue = ISOS[this._iso];

        this._aspect = this.screenScale = 1;
        this._frustum.accurate = true;

        if (!correctionMatrices.length) {
            const ySign = device.capabilities.clipSpaceSignY;
            correctionMatrices[SurfaceTransform.IDENTITY] = new Mat4(1, 0, 0, 0, 0, ySign);
            correctionMatrices[SurfaceTransform.ROTATE_90] = new Mat4(0, 1, 0, 0, -ySign, 0);
            correctionMatrices[SurfaceTransform.ROTATE_180] = new Mat4(-1, 0, 0, 0, 0, -ySign);
            correctionMatrices[SurfaceTransform.ROTATE_270] = new Mat4(0, -1, 0, 0, ySign, 0);
        }
    }

    private _updateAspect (oriented = true) {
        this._aspect = (this.window.width * this._viewport.width) / (this.window.height * this._viewport.height);
        // window size/viewport is pre-rotated, but aspect should be oriented to acquire the correct projection
        if (oriented) {
            const swapchain = this.window.swapchain;
            const orientation = swapchain && swapchain.surfaceTransform || SurfaceTransform.IDENTITY;
            if (orientation % 2) this._aspect = 1 / this._aspect;
        }
        this._isProjDirty = true;
    }

    /**
     * @en Initialize the camera, normally you shouldn't invoke this function, it's managed automatically.
     * @zh 初始化相机，开发者通常不应该使用这个方法，初始化流程是自动管理的。
     */
    public initialize (info: ICameraInfo) {
        this._trackingType = info.trackingType;
        this._cameraType = info.cameraType;
        this.node = info.node;
        this._width = 1;
        this._height = 1;
        this.clearFlag = ClearFlagBit.NONE;
        this.clearDepth = 1.0;
        this.visibility = CAMERA_DEFAULT_MASK;
        this._name = info.name;
        this._proj = info.projection;
        this._priority = info.priority || 0;
        this._aspect = this.screenScale = 1;
        this.updateExposure();
        this.changeTargetWindow(info.window);
    }

    /**
     * @en Destroy the camera, you shouldn't invoke this function, it's managed by the render scene.
     * @zh 销毁相机，开发者不应该使用这个方法，销毁流程是由 RenderScene 管理的。
     */
    public destroy () {
        this._node = null;
        this.detachFromScene();
        if (this._window) {
            this._window.detachCamera(this);
            this.window = null!;
        }
        this._name = null;
        this._geometryRenderer?.destroy();
    }

    /**
     * @en Attach the camera to the given render scene so that it will be rendered in it.
     * @zh 将相机添加到相关的渲染场景中，以便可以被渲染器渲染。
     * @param scene @en The render scene @zh 渲染场景
     */
    public attachToScene (scene: RenderScene) {
        this._enabled = true;
        this._scene = scene;
    }

    /**
     * @en Detach the camera from previously attached render scene. It will no longer be rendered.
     * @zh 将相机从之前设置的渲染场景移除，之后将不会再被渲染。
     */
    public detachFromScene () {
        this._enabled = false;
        this._scene = null;
    }

    /**
     * @en Resize the view size of the camera.
     * @zh 重置相机视图尺寸
     * @param width The width of the view size
     * @param height The height of the view size
     */
    public resize (width: number, height: number): void {
        if (!this._window) return;

        this._width = width;
        this._width = width;
        this._height = height;
        this._aspect = (width * this._viewport.width) / (height * this._viewport.height);
        this._isProjDirty = true;
    }

    /**
     * @en Set a fixed size for the camera view.
     * @zh 设置固定相机视图尺寸
     * @param width The width of the view size
     * @param height The height of the view size
     */
    public setFixedSize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._updateAspect();
        this.isWindowSize = false;
    }

    /**
     * Editor specific gizmo camera logic
     * @internal
     */
    public syncCameraEditor (camera) {
        if (EDITOR) {
            this.position = camera.position;
            this.forward = camera.forward;
            this._matView = camera.matView;
            this._matProj = camera.matProj;
            this._matProjInv = camera.matProjInv;
            this._matViewProj = camera.matViewProj;
        }
    }

    /**
     * @en Update the camera's builtin matrixes
     * @zh 更新相机的视图、投影等矩阵
     * @param forceUpdate If force update, then dirty flag will be ignored
     */
    public update (forceUpdate = false): void { // for lazy eval situations like the in-editor preview
        if (!this._node) return;

        let viewProjDirty = false;
        // view matrix
        if (this._node.hasChangedFlags || forceUpdate) {
            Mat4.invert(this._matView, this._node.worldMatrix);
            this._forward.x = -this._matView.m02;
            this._forward.y = -this._matView.m06;
            this._forward.z = -this._matView.m10;
            // Remove scale
            Mat4.multiply(this._matView, new Mat4().scale(this._node.worldScale), this._matView);
            this._node.getWorldPosition(this._position);
            viewProjDirty = true;
        }

        // projection matrix
        const swapchain = this.window?.swapchain;
        const orientation = swapchain && swapchain.surfaceTransform || SurfaceTransform.IDENTITY;
        if (this._isProjDirty || this._curTransform !== orientation) {
            this._curTransform = orientation;
            const projectionSignY = this._device.capabilities.clipSpaceSignY;
            // Only for rendertexture processing
            if (this._proj === CameraProjection.PERSPECTIVE) {
                Mat4.perspective(this._matProj, this._fov, this._aspect, this._nearClip, this._farClip,
                    this._fovAxis === CameraFOVAxis.VERTICAL, this._device.capabilities.clipSpaceMinZ, projectionSignY, orientation);
            } else {
                const x = this._orthoHeight * this._aspect;
                const y = this._orthoHeight;
                Mat4.ortho(this._matProj, -x, x, -y, y, this._nearClip, this._farClip,
                    this._device.capabilities.clipSpaceMinZ, projectionSignY, orientation);
            }
            Mat4.invert(this._matProjInv, this._matProj);
            viewProjDirty = true;
            this._isProjDirty = false;
        }

        // view-projection
        if (viewProjDirty) {
            Mat4.multiply(this._matViewProj, this._matProj, this._matView);
            Mat4.invert(this._matViewProjInv, this._matViewProj);
            this._frustum.update(this._matViewProj, this._matViewProjInv);
        }
    }

    get surfaceTransform () {
        return this._curTransform;
    }

    /**
     * @en Set the viewport in oriented space (equal to the actual screen rotation)
     * @zh 在目标朝向空间（实际屏幕朝向）内设置相机视口
     */
    public setViewportInOrientedSpace (val: Rect) {
        const { x, width, height } = val;
        const y = this._device.capabilities.screenSpaceSignY < 0 ? 1 - val.y - height : val.y;

        const swapchain = this.window?.swapchain;
        const orientation = swapchain && swapchain.surfaceTransform || SurfaceTransform.IDENTITY;

        switch (orientation) {
        case SurfaceTransform.ROTATE_90:
            this._viewport.x = 1 - y - height;
            this._viewport.y = x;
            this._viewport.width = height;
            this._viewport.height = width;
            break;
        case SurfaceTransform.ROTATE_180:
            this._viewport.x = 1 - x - width;
            this._viewport.y = 1 - y - height;
            this._viewport.width = width;
            this._viewport.height = height;
            break;
        case SurfaceTransform.ROTATE_270:
            this._viewport.x = y;
            this._viewport.y = 1 - x - width;
            this._viewport.width = height;
            this._viewport.height = width;
            break;
        case SurfaceTransform.IDENTITY:
            this._viewport.x = x;
            this._viewport.y = y;
            this._viewport.width = width;
            this._viewport.height = height;
            break;
        default:
        }

        this._orientedViewport.x = x;
        this._orientedViewport.y = y;
        this._orientedViewport.width = width;
        this._orientedViewport.height = height;

        this.resize(this.width, this.height);
    }

    /**
     * @en create geometry renderer for this camera
     * @zh 创建这个摄像机的几何体渲染器
     */
    public initGeometryRenderer() {
        if (!this._geometryRenderer) {
            this._geometryRenderer = legacyCC.internal.GeometryRenderer ? new legacyCC.internal.GeometryRenderer() : null;
            this._geometryRenderer?.activate(this._device);
        }
    }

    /**
     * @en get geometry renderer of this camera
     * @zh 获取这个摄像机的几何体渲染器
     * @returns @en return the geometry renderer @zh 返回几何体渲染器
     */
    get geometryRenderer () {
        return this._geometryRenderer;
    }

    get cameraType () : CameraType {
        return this._cameraType;
    }

    set cameraType (type: CameraType) {
        this._cameraType = type;
    }

    get trackingType () : TrackingType {
        return this._trackingType;
    }

    set trackingType (type: TrackingType) {
        this._trackingType = type;
    }

    /**
     * @en Change the target render window to another one
     * @zh 修改相机的目标渲染窗口
     * @param window The target render window, could be null
     */
    public changeTargetWindow (window: RenderWindow | null = null) {
        if (this._window) {
            this._window.detachCamera(this);
        }
        const win = window || legacyCC.director.root.mainWindow;
        if (win) {
            win.attachCamera(this);
            this.window = win;

            // window size is pre-rotated
            const swapchain = win.swapchain;
            const orientation = swapchain && swapchain.surfaceTransform || SurfaceTransform.IDENTITY;
            if (orientation % 2) this.resize(win.height, win.width);
            else this.resize(win.width, win.height);
        }
    }

    /**
     * @en Detach camera from the render window
     * @zh 将 camera 从渲染窗口移除
     */
    public detachCamera () {
        if (this._window) {
            this._window.detachCamera(this);
        }
    }

    /**
     * @en Transform a screen position (in oriented space) to a world space ray
     * @zh 将一个屏幕空间（在实际朝向下）点转换到世界空间的射线
     * @param out the resulting ray
     * @param x the screen x of the position
     * @param y the screen y of the position
     * @returns the resulting ray
     */
    public screenPointToRay (out: Ray, x: number, y: number): Ray {
        if (!this._node) return null!;

        const width = this.width;
        const height = this.height;
        const cx = this._orientedViewport.x * width;
        const cy = this._orientedViewport.y * height;
        const cw = this._orientedViewport.width * width;
        const ch = this._orientedViewport.height * height;
        const isProj = this._proj === CameraProjection.PERSPECTIVE;
        const ySign = this._device.capabilities.clipSpaceSignY;
        const preTransform = preTransforms[this._curTransform];

        Vec3.set(v_a, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, isProj ? 1 : -1);

        const { x: ox, y: oy } = v_a;
        v_a.x = ox * preTransform[0] + oy * preTransform[2] * ySign;
        v_a.y = ox * preTransform[1] + oy * preTransform[3] * ySign;

        Vec3.transformMat4(isProj ? v_a : out.o, v_a, this._matViewProjInv);

        if (isProj) {
            // camera origin
            this._node.getWorldPosition(v_b);
            Ray.fromPoints(out, v_b, v_a);
        } else {
            Vec3.transformQuat(out.d, Vec3.FORWARD, this._node.worldRotation);
        }

        return out;
    }

    /**
     * @en Transform a screen position (in oriented space) to world space
     * @zh 将一个屏幕空间（在实际朝向下）位置转换到世界空间
     * @param out the resulting vector
     * @param screenPos the screen position to be transformed
     * @returns the resulting vector
     */
    public screenToWorld (out: Vec3, screenPos: Vec3): Vec3 {
        const width = this.width;
        const height = this.height;
        const cx = this._orientedViewport.x * width;
        const cy = this._orientedViewport.y * height;
        const cw = this._orientedViewport.width * width;
        const ch = this._orientedViewport.height * height;
        const ySign = this._device.capabilities.clipSpaceSignY;
        const preTransform = preTransforms[this._curTransform];

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // calculate screen pos in far clip plane
            Vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                1.0);

            // transform to world
            const { x, y } = out;
            out.x = x * preTransform[0] + y * preTransform[2] * ySign;
            out.y = x * preTransform[1] + y * preTransform[3] * ySign;
            Vec3.transformMat4(out, out, this._matViewProjInv);

            // lerp to depth z
            if (this._node) { this._node.getWorldPosition(v_a); }

            Vec3.lerp(out, v_a, out, lerp(this._nearClip / this._farClip, 1, screenPos.z));
        } else {
            Vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                screenPos.z * 2 - 1);

            // transform to world
            const { x, y } = out;
            out.x = x * preTransform[0] + y * preTransform[2] * ySign;
            out.y = x * preTransform[1] + y * preTransform[3] * ySign;
            Vec3.transformMat4(out, out, this._matViewProjInv);
        }

        return out;
    }

    /**
     * @en Transform a world space position to screen space rendered by the camera
     * @zh 将一个世界空间位置转换到相机渲染后的屏幕空间
     * @param out the resulting vector
     * @param worldPos the world position to be transformed
     * @returns the resulting vector
     */
    public worldToScreen (out: Vec3, worldPos: Vec3 | Readonly<Vec3>): Vec3 {
        const ySign = this._device.capabilities.clipSpaceSignY;
        const preTransform = preTransforms[this._curTransform];

        Vec3.transformMat4(out, worldPos, this._matViewProj);

        const { x, y } = out;
        out.x = x * preTransform[0] + y * preTransform[2] * ySign;
        out.y = x * preTransform[1] + y * preTransform[3] * ySign;

        const width = this.width;
        const height = this.height;
        const cx = this._orientedViewport.x * width;
        const cy = this._orientedViewport.y * height;
        const cw = this._orientedViewport.width * width;
        const ch = this._orientedViewport.height * height;

        out.x = cx + (out.x + 1) * 0.5 * cw;
        out.y = cy + (out.y + 1) * 0.5 * ch;
        out.z = out.z * 0.5 + 0.5;

        return out;
    }

    /**
     * @en Transform a world space matrix to screen space rendered by the camera
     * @zh 将一个世界空间矩阵转换到相机渲染后的屏幕空间
     * @param out the resulting matrix
     * @param worldMatrix the world space matrix to be transformed
     * @param width framebuffer width
     * @param height framebuffer height
     * @returns the resulting matrix
     */
    public worldMatrixToScreen (out: Mat4, worldMatrix: Mat4, width: number, height: number) {
        Mat4.multiply(out, this._matViewProj, worldMatrix);
        Mat4.multiply(out, correctionMatrices[this._curTransform], out);

        const halfWidth = width / 2;
        const halfHeight = height / 2;
        Mat4.identity(_tempMat1);
        Mat4.transform(_tempMat1, _tempMat1, Vec3.set(v_a, halfWidth, halfHeight, 0));
        Mat4.scale(_tempMat1, _tempMat1, Vec3.set(v_a, halfWidth, halfHeight, 1));

        Mat4.multiply(out, _tempMat1, out);

        return out;
    }

    /**
     * @en Set exposure with actual value.
     * @zh 设置相机的曝光值
     * @param ev100
     */
    protected setExposure (ev100) {
        this._exposure = 0.833333 / (2.0 ** ev100);
    }

    private updateExposure () {
        const ev100 = Math.log2((this._apertureValue * this._apertureValue) / this._shutterValue * 100.0 / this._isoValue);
        this.setExposure(ev100);
    }
}
