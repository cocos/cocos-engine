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
import {
    lerp, Mat4, Rect, toRadian, Vec3, IVec4Like,
} from '../../math';
import { CAMERA_DEFAULT_MASK } from '../../pipeline/define';
import { Node } from '../../scene-graph';
import { RenderScene } from './render-scene';
import { legacyCC } from '../../global-exports';
import { RenderWindow } from '../core/render-window';
import { preTransforms } from '../../math/mat4';
import { warnID } from '../../platform/debug';

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
}

const v_a = new Vec3();
const v_b = new Vec3();
const _tempMat1 = new Mat4();

export const SKYBOX_FLAG = ClearFlagBit.STENCIL << 1;

const correctionMatrices: Mat4[] = [];

export class Camera {
    public isWindowSize = true;
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
    private _ec = 0.0;
    private _window: RenderWindow | null = null;
    private _width = 1;
    private _height = 1;
    private _clearFlag = ClearFlagBit.NONE;
    private _clearDepth = 1.0;
    private _visibility = CAMERA_DEFAULT_MASK;
    private _exposure = 0;
    private _clearStencil = 0;
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
     * this exposure value corresponding to default standard camera exposure parameters
     */
    public static get standardExposureValue () {
        return 1.0 / 38400.0;
    }

    /**
     * luminance unit scale used by area lights
     */
    public static get standardLightMeterScale () {
        return 10000.0;
    }

    public initialize (info: ICameraInfo) {
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

    public destroy () {
        if (this._window) {
            this._window.detachCamera(this);
            this.window = null!;
        }
        this._name = null;
    }

    public attachToScene (scene: RenderScene) {
        this._enabled = true;
        this._scene = scene;
    }

    public detachFromScene () {
        this._enabled = false;
        this._scene = null;
    }

    public resize (width: number, height: number) {
        if (!this._window) return;

        this._width = width;
        this._width = width;
        this._height = height;
        this._aspect = (width * this._viewport.width) / (height * this._viewport.height);
        this._isProjDirty = true;
    }

    public setFixedSize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._updateAspect();
        this.isWindowSize = false;
    }

    // Editor specific gizmo camera logic
    public syncCameraEditor (camera) {
        if (EDITOR) {
            this.position = camera.position;
            this.forward = camera.forward;
            this._matView = camera.matView;
            this._matProj = camera.matProj;
            this._matProjInv = camera.matProjInv;
            this._matViewProj = camera.matViewProj;
            if (JSB) {
                this._nativeObj!.matProj = this._matProj;
                this._nativeObj!.matProjInv = this._matProjInv;
                this._nativeObj!.matView = this._matView;
                this._nativeObj!.matViewProj = this._matViewProj;
            }
        }
    }

    public update (forceUpdate = false) { // for lazy eval situations like the in-editor preview
        if (!this._node) return;

        let viewProjDirty = false;
        // view matrix
        if (this._node.hasChangedFlags || forceUpdate) {
            Mat4.invert(this._matView, this._node.worldMatrix);
            this._forward.x = -this._matView.m02;
            this._forward.y = -this._matView.m06;
            this._forward.z = -this._matView.m10;
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

    set node (val: Node) {
        this._node = val;
    }

    get node () {
        return this._node!;
    }

    set enabled (val) {
        this._enabled = val;
    }

    get enabled () {
        return this._enabled;
    }

    set orthoHeight (val) {
        this._orthoHeight = val;
        this._isProjDirty = true;
    }

    get orthoHeight () {
        return this._orthoHeight;
    }

    set projectionType (val) {
        this._proj = val;
        this._isProjDirty = true;
    }

    get projectionType () {
        return this._proj;
    }

    set fovAxis (axis) {
        this._fovAxis = axis;
        this._isProjDirty = true;
    }

    get fovAxis () {
        return this._fovAxis;
    }

    set fov (fov) {
        this._fov = fov;
        this._isProjDirty = true;
    }

    get fov () {
        return this._fov;
    }

    set nearClip (nearClip) {
        this._nearClip = nearClip;
        this._isProjDirty = true;
    }

    get nearClip () {
        return this._nearClip;
    }

    set farClip (farClip) {
        this._farClip = farClip;
        this._isProjDirty = true;
    }

    get farClip () {
        return this._farClip;
    }

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
     * Pre-rotated (i.e. always in identity/portrait mode) if possible.
     */
    get viewport () {
        return this._viewport;
    }

    set viewport (val) {
        warnID(8302);
        this.setViewportInOrientedSpace(val);
    }

    /**
     * Set the viewport in oriented space (local to screen rotations)
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

    get scene () {
        return this._scene;
    }

    get name () {
        return this._name;
    }

    get width () {
        return this._width;
    }

    get height () {
        return this._height;
    }

    get aspect () {
        return this._aspect;
    }

    get matView () {
        return this._matView;
    }

    get matProj () {
        return this._matProj;
    }

    get matProjInv () {
        return this._matProjInv;
    }

    get matViewProj () {
        return this._matViewProj;
    }

    get matViewProjInv () {
        return this._matViewProjInv;
    }

    set frustum (val) {
        this._frustum = val;
    }

    get frustum () {
        return this._frustum;
    }

    set window (val) {
        this._window = val;
    }

    get window () {
        return this._window!;
    }

    set forward (val) {
        this._forward = val;
    }

    get forward () {
        return this._forward;
    }

    set position (val) {
        this._position = val;
    }

    get position () {
        return this._position;
    }

    set visibility (vis: number) {
        this._visibility = vis;
    }
    get visibility (): number {
        return this._visibility;
    }

    get priority (): number {
        return this._priority;
    }

    set priority (val: number) {
        this._priority = val;
    }

    set aperture (val: CameraAperture) {
        this._aperture = val;
        this._apertureValue = FSTOPS[this._aperture];
        this.updateExposure();
    }

    get aperture (): CameraAperture {
        return this._aperture;
    }

    get apertureValue (): number {
        return this._apertureValue;
    }

    set shutter (val: CameraShutter) {
        this._shutter = val;
        this._shutterValue = SHUTTERS[this._shutter];
        this.updateExposure();
    }

    get shutter (): CameraShutter {
        return this._shutter;
    }

    get shutterValue (): number {
        return this._shutterValue;
    }

    set iso (val: CameraISO) {
        this._iso = val;
        this._isoValue = ISOS[this._iso];
        this.updateExposure();
    }

    get iso (): CameraISO {
        return this._iso;
    }

    get isoValue (): number {
        return this._isoValue;
    }

    set ec (val: number) {
        this._ec = val;
    }

    get ec (): number {
        return this._ec;
    }

    get exposure (): number {
        return this._exposure;
    }

    get clearFlag () : ClearFlags {
        return this._clearFlag;
    }

    set clearFlag (flag: ClearFlags) {
        this._clearFlag = flag;
    }

    get clearDepth () : number {
        return this._clearDepth;
    }

    set clearDepth (depth: number) {
        this._clearDepth = depth;
    }

    get clearStencil () : number {
        return this._clearStencil;
    }

    set clearStencil (stencil: number) {
        this._clearStencil = stencil;
    }

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

    public detachCamera () {
        if (this._window) {
            this._window.detachCamera(this);
        }
    }

    /**
     * transform a screen position (in oriented space) to a world space ray
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
     * transform a screen position (in oriented space) to world space
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
     * transform a world space position to screen space
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
     * transform a world space matrix to screen space
     * @param {Mat4} out the resulting vector
     * @param {Mat4} worldMatrix the world space matrix to be transformed
     * @param {number} width framebuffer width
     * @param {number} height framebuffer height
     * @returns {Mat4} the resulting vector
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

    protected setExposure (ev100) {
        this._exposure = 0.833333 / (2.0 ** ev100);
    }

    private updateExposure () {
        const ev100 = Math.log2((this._apertureValue * this._apertureValue) / this._shutterValue * 100.0 / this._isoValue);
        this.setExposure(ev100);
    }
}
