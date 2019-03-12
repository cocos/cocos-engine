import { frustum, ray } from '../../3d/geom-utils';
import { Mat4, Rect, Vec3 } from '../../core/value-types';
import { lerp, mat4, toRadian, vec3 } from '../../core/vmath';
import { GFXClearFlag, IGFXColor } from '../../gfx/define';
import { RenderView } from '../../pipeline/render-view';
import { Node } from '../../scene-graph/node';
import { RenderScene } from './render-scene';

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
    node: Node;
    projection: number;
    targetDisplay: number;
    priority: number;
    pipeline?: string;
    isUI?: boolean;
}

const v_a = cc.v3();
const v_b = cc.v3();

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
    private _clearColor: IGFXColor = {r: 0, g: 0, b: 0, a: 0};
    private _viewport: Rect = new Rect(0, 0, 1, 1);
    private _matView: Mat4 = new Mat4();
    private _matProj: Mat4 = new Mat4();
    private _matViewProj: Mat4 = new Mat4();
    private _matViewProjInv: Mat4 = new Mat4();
    private _frustum: frustum = new frustum();
    private _forward: Vec3 = new Vec3();
    private _position: Vec3 = new Vec3();
    private _node: Node | null = null;
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

        this._aspect = this._width = this._height = this._screenScale = 1;

        const isUI = (info.isUI !== undefined ? info.isUI : false);

        this._view = scene.root.createView({
            camera: this,
            name: this._name,
            priority: this._priority,
            isUI,
        });

        this.changeTargetDisplay(info.targetDisplay);
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect = this._width / this._height;
    }

    public setFixedSize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect = this._width / this._height;
        this._isWindowSize = false;
    }

    public update () {
        if (!this._node) {
            return;
        }

        // view matrix
        this.node.getWorldRT(this._matView);
        mat4.invert(this._matView, this._matView);

        // projection matrix
        if (this._proj === CameraProjection.PERSPECTIVE) {
            mat4.perspective(this._matProj, this._fov, this._aspect, this._nearClip, this._farClip);
        } else {
            const x = this._orthoHeight * this._aspect;
            const y = this._orthoHeight;
            mat4.ortho(this._matProj, -x, x, -y, y, this._nearClip, this._farClip);
        }

        // view-projection
        mat4.mul(this._matViewProj, this._matProj, this._matView);
        mat4.invert(this._matViewProjInv, this._matViewProj);

        vec3.set(
            this._forward,
            -this._matView.m02,
            -this._matView.m06,
            -this._matView.m10,
        );
        this._node.getWorldPosition(this._position);

        this._frustum.update(this._matViewProj, this._matViewProjInv);

        const ev100 = Math.log2((this._apertureValue * this._apertureValue) / this._shutterValue * 100.0 / this._isoValue);
        this._exposure = 0.833333 / Math.pow(2.0, ev100);
    }

    set screenScale (val) {
        this._screenScale = val;
    }

    get screenScale () {
        return this._screenScale;
    }

    set enabled (val) {
        this._enabled = val;
    }

    get enabled () {
        return this._enabled;
    }

    get view (): RenderView {
        return this._view;
    }

    set node (val: Node) {
        this._node = val;
    }

    get node (): Node {
        return this._node!;
    }

    get isWindowSize (): boolean {
        return this._isWindowSize;
    }

    set orthoHeight (val) {
        this._orthoHeight = val;
    }

    get orthoHeight () {
        return this._orthoHeight;
    }

    set projectionType (val) {
        this._proj = val;
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
    }

    get fov () {
        return this._fov;
    }

    set nearClip (nearClip) {
        this._nearClip = nearClip;
    }

    get nearClip () {
        return this._nearClip;
    }

    set farClip (farClip) {
        this._farClip = farClip;
    }

    get farClip () {
        return this._farClip;
    }

    set clearColor (val) {
        this._clearColor = val;
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

    public changeTargetDisplay (val: number) {
        const scene = this._scene;
        const win = scene.root.windows[val] || scene.root.mainWindow;
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
        vec3.set(v_a, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);
        vec3.transformMat4(v_a, v_a, this._matViewProjInv);

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // camera origin
            if (this._node) { this._node.getWorldPosition(v_b); }
        } else {
            // near plane intersection
            vec3.set(v_b, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, -1);
            vec3.transformMat4(v_b, v_b, this._matViewProjInv);
        }

        return ray.fromPoints(out, v_b, v_a);
    }

    /**
     * transform a screen position to world space
     */
    public screenToWorld (out: vec3, screenPos: vec3): vec3 {
        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.width * this._width;
        const ch = this._viewport.height * this._height;

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // calculate screen pos in far clip plane
            vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                1.0,
            );

            // transform to world
            vec3.transformMat4(out, out, this._matViewProjInv);

            // lerp to depth z
            if (this._node) { this._node.getWorldPosition(v_a); }

            vec3.lerp(out, v_a, out, lerp(this._nearClip / this._farClip, 1, screenPos.z));
        } else {
            vec3.set(out,
                (screenPos.x - cx) / cw * 2 - 1,
                (screenPos.y - cy) / ch * 2 - 1,
                screenPos.z * 2 - 1,
            );

            // transform to world
            vec3.transformMat4(out, out, this.matViewProjInv);
        }

        return out;
    }

    /**
     * transform a world space position to screen space
     */
    public worldToScreen (out: vec3, worldPos: vec3): vec3 {
        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.width * this._width;
        const ch = this._viewport.height * this._height;

        vec3.transformMat4(out, worldPos, this.matViewProj);
        out.x = cx + (out.x + 1) * 0.5 * cw;
        out.y = cy + (out.y + 1) * 0.5 * ch;
        out.z = out.z * 0.5 + 0.5;

        return out;
    }
}
