import { frustum, ray } from '../../3d/geom-utils';
import { Mat4, Rect } from '../../core/value-types';
import { color4, lerp, mat4, vec3 } from '../../core/vmath';
import { GFXClearFlag, IGFXColor } from '../../gfx/define';
import { Node } from '../../scene-graph/node';
import { RenderScene } from './render-scene';

export enum CameraProjection {
    PERSPECTIVE,
    ORTHO,
}

const v_a = cc.v3();
const v_b = cc.v3();

export class Camera {

    private _scene: RenderScene;
    private _name: string;
    private _proj: CameraProjection;
    private _width: number;
    private _height: number;
    private _aspect: number;
    private _orthoHeight: number;
    private _fov: number;
    private _nearClip: number;
    private _farClip: number;
    private _clearStencil: number;
    private _clearDepth: number;
    private _clearFlag: GFXClearFlag;
    private _clearColor: IGFXColor = {r: 0, g: 0, b: 0, a: 0};
    private _viewport: Rect = new Rect(0, 0, 1, 1);
    private _matView: mat4 = new Mat4();
    private _matProj: mat4 = new Mat4();
    private _matViewProj: mat4 = new Mat4();
    private _matViewProjInv: mat4 = new Mat4();
    private _frustum: frustum = new frustum();
    private _node: Node | null = null;
    private _visibility: number;

    constructor (scene: RenderScene, name: string) {
        this._scene = scene;
        this._name = name;
        this._proj = CameraProjection.PERSPECTIVE;

        const win = scene.root.mainWindow;
        if (win) {
            this._width = win.width;
            this._height = win.height;
        } else {
            this._width = 1;
            this._height = 1;
        }

        this._aspect = this._width / this._height;
        this._orthoHeight = 10;
        this._fov = Math.PI / 4;
        this._nearClip = 1.0;
        this._farClip = 10000.0;
        this._visibility = 0;

        this._clearDepth = 1;
        this._clearStencil = 0;
        this._clearFlag = GFXClearFlag.COLOR | GFXClearFlag.DEPTH | GFXClearFlag.STENCIL;
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect = this._width / this._height;
    }

    public update () {
        if (!this._node) { return; }
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

        this._frustum.update(this._matViewProj, this._matViewProjInv);
    }

    set node (val: Node) {
        this._node = val;
    }

    get node (): Node {
        return this._node as Node;
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

    set viewport (v) {
        this._viewport = v;
    }

    get viewport () {
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

    public set visibility (vis: number) {
        this._visibility = vis;
    }
    public get visibility (): number {
        return this._visibility;
    }

    /**
     * transform a screen position to a world space ray
     */
    public screenPointToRay (x: number, y: number, out: ray): ray {
        out = out || ray.create();
        this.update();

        const cx = this._viewport.x * this._width;
        const cy = this._viewport.y * this._height;
        const cw = this._viewport.w * this._width;
        const ch = this._viewport.h * this._height;

        // far plane intersection
        vec3.set(v_a, (x - cx) / cw * 2 - 1, (y - cy) / ch * 2 - 1, 1);
        vec3.transformMat4(v_a, v_a, this._matViewProjInv);

        if (this._proj === CameraProjection.PERSPECTIVE) {
            // camera origin
            this.node.getWorldPosition(v_b);
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
        const cw = this._viewport.w * this._width;
        const ch = this._viewport.h * this._height;

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
            this.node.getWorldPosition(v_a);

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
        const cw = this._viewport.w * this._width;
        const ch = this._viewport.h * this._height;

        vec3.transformMat4(out, worldPos, this.matViewProjInv);
        out.x = cx + (out.x + 1) * 0.5 * cw;
        out.y = cy + (out.y + 1) * 0.5 * ch;
        out.z = out.z * 0.5 + 0.5;

        return out;
    }
}
