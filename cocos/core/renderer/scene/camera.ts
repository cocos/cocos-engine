import { frustum, ray } from '../../geometry';
import { GFXClearFlag, IGFXColor } from '../../gfx/define';
import { lerp, Mat4, Rect, toRadian, Vec3 } from '../../math';
import { CAMERA_DEFAULT_MASK } from '../../pipeline/define';
import { RenderView } from '../../pipeline/render-view';
import { Node } from '../../scene-graph';
import { RenderScene } from './render-scene';
import { GFXDevice, GFXAPI } from '../../gfx';
import { legacyCC } from '../../global-exports';
import { RenderWindow } from '../../pipeline';

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
    flows?: string[];
}

const v_a = new Vec3();
const v_b = new Vec3();
const _tempMat1 = new Mat4();
const _tempMat2 = new Mat4();

export const SKYBOX_FLAG = GFXClearFlag.STENCIL << 1;

export class Camera {

    public isWindowSize: boolean = true;
    public screenScale: number;
    public clearStencil: number = 0;
    public clearDepth: number = 1.0;
    public clearFlag: GFXClearFlag = GFXClearFlag.NONE;

    private _device: GFXDevice;
    private _scene: RenderScene | null = null;
    private _node: Node | null = null;
    private _name: string | null = null;
    private _enabled: boolean = false;
    private _proj: CameraProjection = -1;
    private _width: number;
    private _height: number;
    private _aspect: number;
    private _orthoHeight: number = 10.0;
    private _fovAxis = CameraFOVAxis.VERTICAL;
    private _fov: number = toRadian(45);
    private _nearClip: number = 1.0;
    private _farClip: number = 1000.0;
    private _clearColor: IGFXColor = { r: 0.2, g: 0.2, b: 0.2, a: 1 };
    private _viewport: Rect = new Rect(0, 0, 1, 1);
    private _isProjDirty = true;
    private _matView: Mat4 = new Mat4();
    private _matViewInv: Mat4 | null = null;
    private _matProj: Mat4 = new Mat4();
    private _matProjInv: Mat4 = new Mat4();
    private _matViewProj: Mat4 = new Mat4();
    private _matViewProjInv: Mat4 = new Mat4();
    private _frustum: frustum = new frustum();
    private _forward: Vec3 = new Vec3();
    private _position: Vec3 = new Vec3();
    private _view: RenderView | null = null;
    private _visibility = CAMERA_DEFAULT_MASK;
    private _priority: number = 0;
    private _aperture: CameraAperture = CameraAperture.F16_0;
    private _apertureValue: number;
    private _shutter: CameraShutter = CameraShutter.D125;
    private _shutterValue: number = 0.0;
    private _iso: CameraISO = CameraISO.ISO100;
    private _isoValue: number = 0.0;
    private _ec: number = 0.0;
    private _exposure: number = 0.0;

    constructor (device: GFXDevice) {
        this._device = device;
        this._apertureValue = FSTOPS[this._aperture];
        this._shutterValue = SHUTTERS[this._shutter];
        this._isoValue = ISOS[this._iso];
        this.updateExposure();

        this._aspect = this._width = this._height = this.screenScale = 1;
    }

    public initialize (info: ICameraInfo) {
        this._name = info.name;
        this._node = info.node;
        this._proj = info.projection;
        this._priority = info.priority || 0;

        this._view = legacyCC.director.root.createView({
            camera: this,
            name: this._name,
            priority: this._priority,
            flows: info.flows,
        });
        this.changeTargetWindow(info.window);

        console.log('Created Camera: ' + this._name + ' ' + this._width + 'x' + this._height);
    }

    public destroy () {
        legacyCC.director.root.destroyView(this._view);
        this._view = null;
        this._name = null;
    }

    public attachToScene (scene: RenderScene) {
        this._scene = scene;
        if (this._view) {
            this._view.enable(true);
        }
    }

    public detachFromScene () {
        this._scene = null;
        if (this._view) {
            this._view.enable(false);
        }
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect = this._width / this._height;
        this._isProjDirty = true;
    }

    public setFixedSize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect = this._width / this._height;
        this.isWindowSize = false;
    }

    public update (forceUpdate = false) { // for lazy eval situations like the in-editor preview
        if (!this._node) return;

        // view matrix
        if (this._node.hasChangedFlags || forceUpdate) {
            Mat4.invert(this._matView, this._node.worldMatrix);

            this._forward.x = -this._matView.m02;
            this._forward.y = -this._matView.m06;
            this._forward.z = -this._matView.m10;
            this._node.getWorldPosition(this._position);
        }

        // projection matrix
        if (this._isProjDirty) {
            let projectionSignY = this._device.screenSpaceSignY;
            if (this._view && this._view.window.hasOffScreenAttachments) {
                projectionSignY *= this._device.UVSpaceSignY; // need flipping if drawing on render targets
            }
            if (this._proj === CameraProjection.PERSPECTIVE) {
                Mat4.perspective(this._matProj, this._fov, this._aspect, this._nearClip, this._farClip,
                    this._fovAxis === CameraFOVAxis.VERTICAL, this._device.clipSpaceMinZ, projectionSignY);
            } else {
                const x = this._orthoHeight * this._aspect;
                const y = this._orthoHeight;
                Mat4.ortho(this._matProj, -x, x, -y, y, this._nearClip, this._farClip,
                    this._device.clipSpaceMinZ, projectionSignY);
            }
            Mat4.invert(this._matProjInv, this._matProj);
        }

        // view-projection
        if (this._node.hasChangedFlags || this._isProjDirty || forceUpdate) {
            Mat4.multiply(this._matViewProj, this._matProj, this._matView);
            Mat4.invert(this._matViewProjInv, this._matViewProj);
            this._frustum.update(this._matViewProj, this._matViewProjInv);
        }

        this._isProjDirty = false;
    }

    public getSplitFrustum (out: frustum, nearClip: number, farClip: number) {
        if (!this._node) return;

        nearClip = Math.max(nearClip, this._nearClip);
        farClip = Math.min(farClip, this._farClip);

        // view matrix
        Mat4.invert(this._matView,  this._node.worldMatrix);

        // projection matrix
        if (this._proj === CameraProjection.PERSPECTIVE) {
            Mat4.perspective(_tempMat1, this._fov, this._aspect, nearClip, farClip,
                this._fovAxis === CameraFOVAxis.VERTICAL, this._device.clipSpaceMinZ, this._device.screenSpaceSignY);
        } else {
            const x = this._orthoHeight * this._aspect;
            const y = this._orthoHeight;
            Mat4.ortho(_tempMat1, -x, x, -y, y, nearClip, farClip,
                this._device.clipSpaceMinZ, this._device.screenSpaceSignY);
        }

        // view-projection
        Mat4.multiply(_tempMat2, _tempMat1, this._matView);
        Mat4.invert(_tempMat1, _tempMat2);
        out.update(_tempMat2, _tempMat1);
    }

    set node (val: Node) {
        this._node = val;
    }

    get node () {
        return this._node!;
    }

    set enabled (val) {
        this._enabled = val;
        if (this._view) {
            this._view.enable(val);
        }
    }

    get enabled () {
        return this._enabled;
    }

    get view (): RenderView {
        return this._view!;
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
        this._clearColor.r = val.r;
        this._clearColor.g = val.g;
        this._clearColor.b = val.b;
        this._clearColor.a = val.a;
    }

    get clearColor () {
        return this._clearColor;
    }

    get viewport () {
        return this._viewport;
    }

    set viewport (val) {
        const signY = this._device.screenSpaceSignY;
        this._viewport.x = val.x;
        if (signY > 0) { this._viewport.y = val.y; }
        else { this._viewport.y = 1 - val.y - val.height; }
        this._viewport.width = val.width;
        this._viewport.height = val.height;
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

    set matView (val) {
        this._matView = val;
    }

    get matView () {
        return this._matView;
    }

    set matViewInv (val: Mat4 | null) {
        this._matViewInv = val;
    }

    get matViewInv () {
        return this._matViewInv || this._node!.worldMatrix;
    }

    set matProj (val) {
        this._matProj = val;
    }

    get matProj () {
        return this._matProj;
    }

    set matProjInv (val) {
        this._matProjInv = val;
    }

    get matProjInv () {
        return this._matProjInv;
    }

    set matViewProj (val) {
        this._matViewProj = val;
    }

    get matViewProj () {
        return this._matViewProj;
    }

    set matViewProjInv (val) {
        this._matViewProjInv = val;
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

    set visibility (vis) {
        this._visibility = vis;
        if (this._view) {
            this._view.visibility = vis;
        }
    }
    get visibility () {
        return this._visibility;
    }

    get priority (): number {
        return this._view ? this._view.priority : -1;
    }

    set priority (val: number) {
        this._priority = val;
        if (this._view) {
            this._view.priority = this._priority;
        }
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

    set flows (val: string[]) {
        if (this._view) {
            this._view.setExecuteFlows(val);
        }
    }

    public changeTargetWindow (window: RenderWindow | null = null) {
        const win = window || legacyCC.director.root.mainWindow;
        if (win && this._view) {
            this._view.window = win;
            this.resize(win.width, win.height);
        }
    }

    /**
     * transform a screen position to a world space ray
     */
    public screenPointToRay (out: ray, x: number, y: number): ray {
        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.width * this._width;
        const ch = this._viewport.height * this._height;

        // far plane intersection
        Vec3.set(v_a, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);
        v_a.y *= this._device.screenSpaceSignY;
        Vec3.transformMat4(v_a, v_a, this._matViewProjInv);

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // camera origin
            if (this._node) { this._node.getWorldPosition(v_b); }
        } else {
            // near plane intersection
            Vec3.set(v_b, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);
            v_b.y *= this._device.screenSpaceSignY;
            Vec3.transformMat4(v_b, v_b, this._matViewProjInv);
        }

        return ray.fromPoints(out, v_b, v_a);
    }

    /**
     * transform a screen position to world space
     */
    public screenToWorld (out: Vec3, screenPos: Vec3): Vec3 {
        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.width * this._width;
        const ch = this._viewport.height * this._height;

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // calculate screen pos in far clip plane
            Vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                1.0,
            );

            // transform to world
            Vec3.transformMat4(out, out, this._matViewProjInv);

            // lerp to depth z
            if (this._node) { this._node.getWorldPosition(v_a); }

            Vec3.lerp(out, v_a, out, lerp(this._nearClip / this._farClip, 1, screenPos.z));
        } else {
            Vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                screenPos.z * 2 - 1,
            );

            // transform to world
            Vec3.transformMat4(out, out, this.matViewProjInv);
        }

        return out;
    }

    /**
     * transform a world space position to screen space
     */
    public worldToScreen (out: Vec3, worldPos: Vec3): Vec3 {
        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.width * this._width;
        const ch = this._viewport.height * this._height;

        Vec3.transformMat4(out, worldPos, this.matViewProj);

        out.x = cx + (out.x + 1) * 0.5 * cw;
        out.y = cy + (out.y + 1) * 0.5 * ch;
        out.z = out.z * 0.5 + 0.5;

        return out;
    }

    private updateExposure () {
        const ev100 = Math.log2((this._apertureValue * this._apertureValue) / this._shutterValue * 100.0 / this._isoValue);
        this._exposure = 0.833333 / Math.pow(2.0, ev100);
    }
}
