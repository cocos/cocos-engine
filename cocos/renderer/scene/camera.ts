import { frustum, ray } from '../../3d/geom-utils';
import { Color, lerp, Mat4, Rect, toRadian, Vec3 } from '../../core/math';
import { GFXClearFlag, IGFXColor } from '../../gfx/define';
import { RenderView } from '../../pipeline/render-view';
import { RenderScene } from './render-scene';
import { INode } from '../../core/utils/interfaces';
import { GFXWindow } from '../../gfx/window';

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
const SHUTERS: number[] = [1.0, 1.0 / 2.0, 1.0 / 4.0, 1.0 / 8.0, 1.0 / 15.0, 1.0 / 30.0, 1.0 / 60.0, 1.0 / 125.0,
    1.0 / 250.0, 1.0 / 500.0, 1.0 / 1000.0, 1.0 / 2000.0, 1.0 / 4000.0];
const ISOS: number[] = [100.0, 200.0, 400.0, 800.0];

export interface ICameraInfo {
    name: string;
    node: INode;
    projection: number;
    targetDisplay?: number;
    window?: GFXWindow;
    priority: number;
    pipeline?: string;
    isUI?: boolean;
    flows?: string[];
}

const v_a = cc.v3();
const v_b = cc.v3();
const _tempMat1 = cc.mat4();
const _tempMat2 = cc.mat4();

export class Camera {

    private _scene: RenderScene;
    private _name: string;
    private _enabled: boolean = false;
    private _proj: CameraProjection;
    private _isWindowSize: boolean = true;
    private _width: number;
    private _height: number;
    private _screenScale: number;
    private _aspect: number;
    private _orthoHeight: number = 10.0;
    private _fov: number = toRadian(45);
    private _nearClip: number = 0.1;
    private _farClip: number = 1000.0;
    private _clearStencil: number = 0;
    private _clearDepth: number = 1.0;
    private _clearFlag: GFXClearFlag = GFXClearFlag.NONE;
    private _clearColor: IGFXColor = { r: 0, g: 0, b: 0, a: 0 };
    private _viewport: Rect = new Rect(0, 0, 1, 1);
    private _isProjDirty = true;
    private _matView: Mat4 = new Mat4();
    private _matProj: Mat4 = new Mat4();
    private _matViewProj: Mat4 = new Mat4();
    private _matViewProjInv: Mat4 = new Mat4();
    private _frustum: frustum = new frustum();
    private _forward: Vec3 = new Vec3();
    private _position: Vec3 = new Vec3();
    private _node: INode | null = null;
    private _view: RenderView;
    private _visibility: number = 0;
    private _priority: number = 0;
    private _aperture: CameraAperture = CameraAperture.F16_0;
    private _apertureValue: number;
    private _shutter: CameraShutter = CameraShutter.D125;
    private _shutterValue: number = 0.0;
    private _iso: CameraISO = CameraISO.ISO100;
    private _isoValue: number = 0.0;
    private _ec: number = 0.0;
    private _exposure: number = 0.0;

    constructor (scene: RenderScene, info: ICameraInfo) {
        this._scene = scene;
        this._name = info.name;
        this._node = info.node;
        this._proj = info.projection;
        this._priority = info.priority || 0;

        this._apertureValue = FSTOPS[this._aperture];
        this._shutterValue = SHUTERS[this._shutter];
        this._isoValue = ISOS[this._iso];
        this.updateExposure();

        this._aspect = this._width = this._height = this._screenScale = 1;

        const isUI = (info.isUI !== undefined ? info.isUI : false);

        this._view = this._scene.root.createView({
            camera: this,
            name: this._name,
            priority: this._priority,
            isUI,
            flows: info.flows,
        });

        this.changeTargetWindow(info.window);

        console.log('Create Camera: ' + this._name + ' ' + this._width + ' x ' + this._height);
    }

    public destroy () {
        this._scene.root.destroyView(this._view);
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
        this._isWindowSize = false;
    }

    public update (forceUpdate = false) { // for lazy eval situations like the in-editor preview
        if (this._node) {
            // view matrix
            if (this._node.hasChanged || forceUpdate) {
                Mat4.invert(this._matView, this.node.worldMatrix);

                this._forward.x = -this._matView.m02;
                this._forward.y = -this._matView.m06;
                this._forward.z = -this._matView.m10;
                this._node.getWorldPosition(this._position);
            }

            // projection matrix
            if (this._isProjDirty) {
                if (this._proj === CameraProjection.PERSPECTIVE) {
                    Mat4.perspective(this._matProj, this._fov, this._aspect, this._nearClip, this._farClip);
                } else {
                    const x = this._orthoHeight * this._aspect;
                    const y = this._orthoHeight;
                    Mat4.ortho(this._matProj, -x, x, -y, y, this._nearClip, this._farClip);
                }
            }

            // view-projection
            if (this._node.hasChanged || this._isProjDirty || forceUpdate) {
                Mat4.multiply(this._matViewProj, this._matProj, this._matView);
                Mat4.invert(this._matViewProjInv, this._matViewProj);
                this._frustum.update(this._matViewProj, this._matViewProjInv);
            }

            this._isProjDirty = false;
        }
    }

    public getSplitFrustum (out: frustum, nearClip: number, farClip: number) {
        if (!this._node) {
            return;
        }

        nearClip = Math.max(nearClip, this._nearClip);
        farClip = Math.min(farClip, this._farClip);

        // view matrix
        Mat4.invert(this._matView,  this.node.worldMatrix);

        // projection matrix
        if (this._proj === CameraProjection.PERSPECTIVE) {
            Mat4.perspective(_tempMat1, this._fov, this._aspect, nearClip, farClip);
        } else {
            const x = this._orthoHeight * this._aspect;
            const y = this._orthoHeight;
            Mat4.ortho(_tempMat1, -x, x, -y, y, nearClip, farClip);
        }

        // view-projection
        Mat4.multiply(_tempMat2, _tempMat1, this._matView);
        Mat4.invert(_tempMat1, _tempMat2);
        out.update(_tempMat2, _tempMat1);
    }

    set screenScale (val) {
        this._screenScale = val;
    }

    get screenScale () {
        return this._screenScale;
    }

    set enabled (val) {
        this._enabled = val;
        this._view.enable(val);
    }

    get enabled () {
        return this._enabled;
    }

    get view (): RenderView {
        return this._view;
    }

    set node (val: INode) {
        this._node = val;
    }

    get node (): INode {
        return this._node!;
    }

    get isWindowSize (): boolean {
        return this._isWindowSize;
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

    set viewport (v: Rect) {
        this._viewport = v;
    }

    get viewport (): Rect {
        return this._viewport;
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

    set clearDepth (val) {
        this._clearDepth = val;
    }

    get clearDepth () {
        return this._clearDepth;
    }

    set clearStencil (val) {
        this._clearStencil = val;
    }

    get clearStencil () {
        return this._clearStencil;
    }

    set clearFlag (val) {
        this._clearFlag = val;
    }

    get clearFlag () {
        return this._clearFlag;
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

    get matViewProj () {
        return this._matViewProj;
    }

    get matViewProjInv () {
        return this._matViewProjInv;
    }

    get frustum () {
        return this._frustum;
    }

    get forward () {
        return this._forward;
    }

    get position () {
        return this._position;
    }

    set visibility (vis) {
        this._visibility = vis;
        this._view.visibility = vis;
    }
    get visibility () {
        return this._visibility;
    }

    get priority (): number {
        return this._view.priority;
    }

    set priority (val: number) {
        this._priority = val;
        this._view.priority = this._priority;
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
        this._shutterValue = SHUTERS[this._shutter];
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

    public changeTargetWindow (window: GFXWindow | null = null) {
        const scene = this._scene;
        const win = window || scene.root.mainWindow;
        if (win) {
            this._width = win.width;
            this._height = win.height;
            this._view.window = win;
        }
        this._aspect = this._width / this._height;
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
        Vec3.transformMat4(v_a, v_a, this._matViewProjInv);

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // camera origin
            if (this._node) { this._node.getWorldPosition(v_b); }
        } else {
            // near plane intersection
            Vec3.set(v_b, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);
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
