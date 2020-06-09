import { lerp, Mat4, Rect, toRadian, Vec3, Quat } from '../math';
import { frustum, ray } from '../geometry';

export class ShadowCamera {

    // Node
    private _worldPosition: Vec3 = new Vec3();
    private _worldRotation: Quat = new Quat();
    private _worldScale: Vec3 = new Vec3();
    private _worldTransform: Mat4 = new Mat4();

    // Camera
    private _width: number;
    private _height: number;
    private _aspect: number;
    private _orthoHeight: number = 10.0;
    private _fov: number = toRadian(45);
    private _nearClip: number = 1.0;
    private _farClip: number = 1000.0;
    private _matView: Mat4 = new Mat4();
    private _matViewInv: Mat4 | null = null;
    private _matProj: Mat4 = new Mat4();
    private _matProjInv: Mat4 = new Mat4();
    private _matViewProj: Mat4 = new Mat4();
    private _matViewProjInv: Mat4 = new Mat4();
    private _frustum: frustum = new frustum();
    private _forward: Vec3 = new Vec3();

    public setWorldPosition (val) {
        this._worldPosition = val;
    }

    public getWorldPosition () {
        return this._worldPosition;
    }

    public setWorldRotation (val) {
        this._worldRotation = val;
    }

    public getWorldRotation () {
        return this._worldRotation;
    }

    public setWorldScale (val) {
        this._worldScale = val;
    }

    public getWorldScale () {
        return this._worldScale;
    }

    public getWorldTransform () {
        this.updateWorldTransform();
        return this._worldTransform;
    }

    set orthoHeight (val) {
        this._orthoHeight = val;
    }

    get orthoHeight () {
        return this._orthoHeight;
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
        return this._matViewInv;
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

    constructor () {
        this._aspect = this._width = this._height = 1;
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._aspect = this._width / this._height;
    }

    public updateWorldTransform () {
        Mat4.fromRTS(this._worldTransform, this._worldRotation, this._worldPosition, this._worldScale);
    }

    // for lazy eval situations like the in-editor preview
    public update (forceUpdate = false) {
        // calculate _forward
        {
            Mat4.invert(this._matView, this._worldTransform!);
            this._forward.x = -this._matView.m02;
            this._forward.y = -this._matView.m06;
            this._forward.z = -this._matView.m10;
        }

        // calculate _matProj || _matProjInv
        {
            Mat4.perspective(this._matProj, this._fov, this._aspect, this._nearClip, this._farClip);
            Mat4.invert(this._matProjInv, this._matProj);
        }

        // view-projection
        {
            Mat4.multiply(this._matViewProj, this._matProj, this._matView);
            Mat4.invert(this._matViewProjInv, this._matViewProj);
            this._frustum.update(this._matViewProj, this._matViewProjInv);
        }
    }
}