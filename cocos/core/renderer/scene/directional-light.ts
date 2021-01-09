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

import { Vec3, Vec4 } from '../../math';
import { Ambient } from './ambient';
import { Light, LightType } from './light';
import { LightPool, LightView } from '../core/memory-pools';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();

export class DirectionalLight extends Light {
    public set shadowRange (shadowRange: number) {
        this._shadowRange = shadowRange;
    }

    public get shadowRange () {
        return this._shadowRange;
    }

    public set shadowIntensitywRange (shadowIntensity: number) {
        this._shadowIntensity = shadowIntensity;
    }

    public get shadowIntensity () {
        return this._shadowIntensity;
    }

    public set shadowFadeDistance (shadowFadeDistance: number) {
        this._shadowFadeDistance = shadowFadeDistance;
    }

    public get shadowFadeDistance () {
        return this._shadowFadeDistance;
    }

    public set shadowDistance (shadowDistance: number) {
        this._shadowDistance = shadowDistance;
    }

    public get shadowDistance () {
        return this._shadowDistance;
    }

    public set fadeStart (fadeStart: number) {
        this._fadeStart = fadeStart;
    }

    public get fadeStart () {
        return this._fadeStart;
    }

    public set splits (splits: Vec4) {
        this._splits = splits;
    }

    public get splits () {
        return this._splits;
    }

    public set biasAutoAdjust (biasAutoAdjust: number) {
        this._biasAutoAdjust = biasAutoAdjust;
    }

    public get biasAutoAdjust () {
        return this._biasAutoAdjust;
    }

    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);

    // shadow
    private _shadowRange = 1000.0;
    private _shadowIntensity = 0.0;
    private _shadowFadeDistance = 0.0;
    private _shadowDistance = 0.0;

    // Cascaded shadow map parameters.
    private _fadeStart = 0.8;
    private _splits: Vec4 = new Vec4(1.0, 0.0, 0.0, 0.0);
    private _biasAutoAdjust = 1.0;

    set direction (dir: Vec3) {
        Vec3.normalize(this._dir, dir);
        LightPool.setVec3(this._handle, LightView.DIRECTION, this._dir);
    }

    get direction (): Vec3 {
        return this._dir;
    }

    // in Lux(lx)
    set illuminance (illum: number) {
        LightPool.set(this._handle, LightView.ILLUMINANCE, illum);
    }

    get illuminance (): number {
        return LightPool.get(this._handle, LightView.ILLUMINANCE);
    }

    constructor () {
        super();
    }

    public initialize () {
        super.initialize();
        LightPool.set(this._handle, LightView.ILLUMINANCE, Ambient.SUN_ILLUM);
        LightPool.setVec3(this._handle, LightView.DIRECTION, this._dir);
        LightPool.set(this._handle, LightView.TYPE, LightType.DIRECTIONAL);
    }

    public update () {
        if (this._node && this._node.hasChangedFlags) {
            this.direction = Vec3.transformQuat(_v3, _forward, this._node.worldRotation);
        }
    }
}
