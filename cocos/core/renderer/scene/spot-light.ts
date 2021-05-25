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
import {
    AABBHandle, AABBPool, AABBView, FrustumHandle, FrustumPool, LightPool, LightView, NULL_HANDLE,
} from '../core/memory-pools';
import { recordFrustumToSharedMemory } from '../../geometry/frustum';

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

    declare protected _hAABB: AABBHandle;
    declare protected _hFrustum: FrustumHandle;

    protected _init (): void {
        super._init();
        if (JSB) {
            this._hAABB = AABBPool.alloc();
            this._hFrustum = FrustumPool.alloc();
            LightPool.set(this._handle, LightView.AABB, this._hAABB);
            LightPool.set(this._handle, LightView.FRUSTUM, this._hFrustum);
        }
    }

    protected _destroy (): void {
        if (JSB) {
            if (this._hAABB) {
                AABBPool.free(this._hAABB);
                this._hAABB = NULL_HANDLE;
            }
            if (this._hFrustum) {
                FrustumPool.free(this._hFrustum);
                this._hFrustum = NULL_HANDLE;
            }
        }
        super._destroy();
    }

    protected _setDirection (dir: Vec3): void {
        this._dir.set(dir);
        if (JSB) {
            LightPool.setVec3(this._handle, LightView.DIRECTION, this._dir);
            this._nativeObj.setDirection(dir);
        }
    }

    protected _update (): void {
        if (JSB) {
            LightPool.setVec3(this._handle, LightView.DIRECTION, this._dir);
            LightPool.setVec3(this._handle, LightView.POSITION, this._pos);
            AABBPool.setVec3(this._hAABB, AABBView.CENTER, this._aabb.center);
            AABBPool.setVec3(this._hAABB, AABBView.HALF_EXTENSION, this._aabb.halfExtents);
            recordFrustumToSharedMemory(this._hFrustum, this._frustum);
            this._nativeObj.setFrustum(this._frustum);
            this._nativeObj.setAABB(this._aabb);
            this._nativeObj.setDirection(this._dir);
            this._nativeObj.setPosition(this._pos);
        }
    }

    get position () {
        return this._pos;
    }

    set size (size: number) {
        this._size = size;
        if (JSB) {
            LightPool.set(this._handle, LightView.SIZE, size);
            this._nativeObj.setSize(size);
        }
    }

    get size (): number {
        return this._size;
    }

    set range (range: number) {
        this._range = range;
        if (JSB) {
            LightPool.set(this._handle, LightView.RANGE, range);
            this._nativeObj.setRange(range);
        }

        this._needUpdate = true;
    }

    get range (): number {
        return this._range;
    }

    set luminance (lum: number) {
        this._luminance = lum;
        if (JSB) {
            LightPool.set(this._handle, LightView.ILLUMINANCE, lum);
            this._nativeObj.setIlluminance(lum);
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
            LightPool.set(this._handle, LightView.SPOT_ANGLE, this._spotAngle);
            this._nativeObj.setAngle(this._spotAngle);
        }

        this._needUpdate = true;
    }

    set aspect (val: number) {
        this._aspect = val;
        if (JSB) {
            LightPool.set(this._handle, LightView.ASPECT, val);
            this._nativeObj.setAspect(val);
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

            this._update();
        }
    }
}
