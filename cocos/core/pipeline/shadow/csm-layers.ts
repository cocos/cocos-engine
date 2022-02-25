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

/**
 * @packageDocumentation
 * @module pipeline.forward
 */

import { ccclass } from 'cc.decorator';
import { DirectionalLight, Camera } from '../../renderer/scene';
import { Mat4 } from '../../math/mat4';
import { Frustum } from '../../geometry';
import { getCameraWorldMatrix } from '../scene-culling';

const SHADOW_CSM_LAMBDA = 0.75;

const _mat4_trans = new Mat4();

class CSMLayerInfo {
    protected _level: number | undefined;
    protected _shadowCameraNear: number | undefined;
    protected _shadowCameraFar: number | undefined;

    protected _matShadowView: Mat4 | undefined;
    protected _matShadowProj: Mat4 | undefined;
    protected _matShadowViewProj: Mat4 | undefined;

    protected _validFrustum: Frustum | undefined;

    constructor (level: number) {
        this._level = level;
        this._shadowCameraNear = 0.0;
        this._shadowCameraFar = 0.0;
        this._matShadowView = new Mat4();
        this._matShadowProj = new Mat4();
        this._matShadowViewProj = new Mat4();
        this._validFrustum = new Frustum();
        this._validFrustum.accurate = true;
    }

    get shadowCameraNear () {
        return this._shadowCameraNear;
    }
    set shadowCameraNear (val) {
        this._shadowCameraNear = val;
    }

    get shadowCameraFar () {
        return this._shadowCameraFar;
    }
    set shadowCameraFar (val) {
        this._shadowCameraFar = val;
    }

    get matShadowView () {
        return this._matShadowView;
    }
    set matShadowView (val) {
        this._matShadowView?.set(val!);
    }

    get matShadowProj () {
        return this._matShadowProj;
    }
    set matShadowProj (val) {
        this._matShadowProj?.set(val!);
    }

    get matShadowViewProj () {
        return this._matShadowViewProj;
    }
    set matShadowViewProj (val) {
        this._matShadowViewProj?.set(val!);
    }

    get validFrustum () {
        return this._validFrustum;
    }
    set validFrustum (val) {
        this._validFrustum = Frustum.clone(val!);
    }
}

/**
 * @en Shadow CSM layer manager
 * @zh CSM阴影图层管理
 */
@ccclass('CSMLayers')
export class CSMLayers {
    protected _dirLight: DirectionalLight | null = null;
    protected _camera: Camera | null = null;
    protected _shadowCSMLayers: CSMLayerInfo[] = [];
    protected _shadowCSMLevelCount = 0;

    get shadowCSMLayers () {
        return this._shadowCSMLayers;
    }

    public update (camera: Camera, dirLight: DirectionalLight) {
        this._dirLight = dirLight;
        this._camera = camera;
        this._shadowCSMLevelCount = dirLight.shadowCSMLevel;

        let isRecalculate = false;
        for (let i = 0; i < this._shadowCSMLevelCount; i++) {
            if (this._shadowCSMLayers[i] === undefined) {
                this._shadowCSMLayers[i] = new CSMLayerInfo(i);
                isRecalculate = true;
            }
        }

        if (dirLight.shadowCSMValueDirty || isRecalculate) {
            this._splitFrustumLevels();
            this._splitFrustum();
        }
    }

    public shadowFrustumItemToConsole () {
        for (let i = 0; i < this._shadowCSMLevelCount; i++) {
            console.warn(this._dirLight?.node!.name, '._shadowCSMLayers[',
                i, '] = (', this._shadowCSMLayers[i].shadowCameraNear, ', ', this._shadowCSMLayers[i].shadowCameraFar, ')');
            console.warn(this._camera?.node!.name, '._validFrustum[', i, '] =', this._shadowCSMLayers[i].validFrustum?.toString());
        }
    }

    public destroy () {
        this._dirLight = null;
        this._shadowCSMLevelCount = 0;
        this._shadowCSMLayers.length = 0;
    }

    private _splitFrustumLevels () {
        if (!this._dirLight) return;

        const nd = 0.1;
        const fd = this._dirLight.shadowDistance;
        const ratio = fd / nd;
        const level = this._dirLight.shadowCSMLevel;
        this._shadowCSMLayers[0].shadowCameraNear = nd;
        for (let i = 1; i < level; i++) {
            // i ÷ numbers of level
            const si = i / level;
            // eslint-disable-next-line no-restricted-properties
            const preNear = SHADOW_CSM_LAMBDA * (nd * Math.pow(ratio, si)) + (1 - SHADOW_CSM_LAMBDA) * (nd + (fd - nd) * si);
            // Slightly increase the overlap to avoid fracture
            const nextFar = preNear * 1.005;
            this._shadowCSMLayers[i].shadowCameraNear = preNear;
            this._shadowCSMLayers[i - 1].shadowCameraFar = nextFar;
        }
        // numbers of level - 1
        this._shadowCSMLayers[level - 1].shadowCameraFar = fd;

        this._dirLight.shadowCSMValueDirty = false;
    }

    private _splitFrustum () {
        if (!this._dirLight || !this._camera) return;

        const dirLight = this._dirLight;
        const level = dirLight.shadowCSMLevel;
        const camera = this._camera;
        for (let i = 0; i < level; i++) {
            const _validFrustum = this._shadowCSMLayers[i].validFrustum!;
            const near = this._shadowCSMLayers[i].shadowCameraNear!;
            const far = this._shadowCSMLayers[i].shadowCameraFar!;
            getCameraWorldMatrix(_mat4_trans, camera);
            Frustum.split(_validFrustum, camera, _mat4_trans, near, far);
        }
    }
}
