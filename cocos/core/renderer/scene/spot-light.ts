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

import { JSB } from 'internal:constants';
import { AABB, Frustum } from '../../geometry';
import { Mat4, Quat, Vec3 } from '../../math';
import { Light, LightType, nt2lm } from './light';
import { NativeSpotLight } from './native-scene';

const _forward = new Vec3(0, 0, -1);
const _qt = new Quat();
const _matView = new Mat4();
const _matProj = new Mat4();
const _matViewProj = new Mat4();
const _matViewProjInv = new Mat4();

export class SpotLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);

    protected _range = 5.0;

    protected _spotAngle: number = Math.cos(Math.PI / 6);

    protected _pos: Vec3;

    protected _aabb: AABB;

    protected _frustum: Frustum;

    protected _angle = 0;

    protected _needUpdate = false;

    protected _size = 0.15;

    protected _luminance = 0;

    protected _aspect = 0;

    protected _init (): void {
        super._init();
        if (JSB) {
            const nativeSpotLight = this._nativeObj! as NativeSpotLight;
            nativeSpotLight.setAABB(this._aabb.native);
            nativeSpotLight.setFrustum(this._frustum);
            nativeSpotLight.setDirection(this._dir);
            nativeSpotLight.setPosition(this._pos);
        }
    }

    protected _destroy (): void {
        super._destroy();
    }

    protected _setDirection (dir: Vec3): void {
        this._dir.set(dir);
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setDirection(dir);
        }
    }

    get position () {
        return this._pos;
    }

    set size (size: number) {
        this._size = size;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setSize(size);
        }
    }

    get size (): number {
        return this._size;
    }

    set range (range: number) {
        this._range = range;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setRange(range);
        }

        this._needUpdate = true;
    }

    get range (): number {
        return this._range;
    }

    set luminance (lum: number) {
        this._luminance = lum;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setIlluminance(lum);
        }
    }

    get luminance (): number {
        return this._luminance;
    }

    get direction (): Vec3 {
        return this._dir;
    }

    get spotAngle () {
        return this._spotAngle;
    }

    set spotAngle (val: number) {
        this._angle = val;
        this._spotAngle = Math.cos(val * 0.5);
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setAngle(this._spotAngle);
        }

        this._needUpdate = true;
    }

    set aspect (val: number) {
        this._aspect = val;
        if (JSB) {
            (this._nativeObj! as NativeSpotLight).setAspect(val);
        }

        this._needUpdate = true;
    }

    get aspect (): number {
        return this._aspect;
    }

    get aabb () {
        return this._aabb;
    }

    get frustum () {
        return this._frustum;
    }

    constructor () {
        super();
        this._aabb = AABB.create();
        this._frustum = Frustum.create();
        this._pos = new Vec3();
        this._type = LightType.SPOT;
    }

    public initialize () {
        super.initialize();

        const size = 0.15;
        this.size = size;
        this.aspect = 1.0;
        this.luminance = 1700 / nt2lm(size);
        this.range = Math.cos(Math.PI / 6);
        this._setDirection(new Vec3(1.0, -1.0, -1.0));
    }

    public update () {
        if (this._node && (this._node.hasChangedFlags || this._needUpdate)) {
            this._node.getWorldPosition(this._pos);
            Vec3.transformQuat(this._dir, _forward, this._node.getWorldRotation(_qt));
            Vec3.normalize(this._dir, this._dir);

            AABB.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range);

            // view matrix
            this._node.getWorldRT(_matView);
            Mat4.invert(_matView, _matView);

            Mat4.perspective(_matProj, this._angle, 1.0, 0.001, this._range);

            // view-projection
            Mat4.multiply(_matViewProj, _matProj, _matView);
            // Mat4.invert(_matViewProjInv, _matViewProj);

            this._frustum.update(_matViewProj, _matViewProjInv);

            this._needUpdate = false;
        }
    }
}
