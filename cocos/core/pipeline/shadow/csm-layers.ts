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
import { DirectionalLight, Camera, Shadows } from '../../renderer/scene';
import { Mat4, Vec3, Vec2 } from '../../math';
import { Frustum, AABB, Sphere } from '../../geometry';
import { getCameraWorldMatrix } from '../scene-culling';
import { RenderPipeline } from '..';

const SHADOW_CSM_LAMBDA = 0.75;
// const _lerpMax: number[] = [0, 0, 0, 0];

const _mat4_trans = new Mat4();
const _matShadowTrans = new Mat4();
const _matShadowView = new Mat4();
const _matShadowProj = new Mat4();
const _matShadowViewProj = new Mat4();
const _matShadowViewProjArbitaryPos = new Mat4();
const _matShadowViewProjArbitaryPosInv = new Mat4();
const _focus = new Vec3(0, 0, 0);
const _projPos = new Vec3();
const _texelSize = new Vec2();
const _projSnap = new Vec3();
const _snap = new Vec3();
const _maxVec3 = new Vec3(10000000, 10000000, 10000000);
const _minVec3 = new Vec3(-10000000, -10000000, -10000000);
const _shadowPos = new Vec3();
const _castLightViewBoundingBox = new AABB();
const _castLightViewBoundingSphere = new Sphere();

class CSMLayerInfo {
    protected _level: number;
    protected _near: number;
    protected _far: number;
    protected _shadowCameraFar: number;

    protected _matShadowView: Mat4 | undefined;
    protected _matShadowProj: Mat4 | undefined;
    protected _matShadowViewProj: Mat4 | undefined;

    protected _validFrustum: Frustum | undefined;

    // test value
    protected _splitFrustum: Frustum | undefined;
    protected _lightViewFrustum: Frustum | undefined;

    constructor (level: number) {
        this._level = level;
        this._near = 0.0;
        this._far = 0.0;
        this._shadowCameraFar = 0.0;
        this._matShadowView = new Mat4();
        this._matShadowProj = new Mat4();
        this._matShadowViewProj = new Mat4();
        this._validFrustum = new Frustum();
        this._validFrustum.accurate = true;

        // test value
        this._splitFrustum = new Frustum();
        this._splitFrustum.accurate = true;
        this._lightViewFrustum = new Frustum();
        this._lightViewFrustum.accurate = true;
    }

    get near () {
        return this._near;
    }
    set near (val) {
        this._near = val;
    }

    get far () {
        return this._far;
    }
    set far (val) {
        this._far = val;
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
        this._validFrustum = val;
    }

    get splitFrustum () {
        return this._splitFrustum;
    }
    set splitFrustum (val) {
        this._splitFrustum = val;
    }

    get lightViewFrustum () {
        return this._lightViewFrustum;
    }
    set lightViewFrustum (val) {
        this._lightViewFrustum = val;
    }
}

/**
 * @en Shadow CSM layer manager
 * @zh CSM阴影图层管理
 */
@ccclass('CSMLayers')
export class CSMLayers {
    protected _pipeline: RenderPipeline | null = null;
    protected _dirLight: DirectionalLight | null = null;
    protected _camera: Camera | null = null;
    protected _shadowInfo: Shadows | null = null;
    protected _shadowCSMLayers: CSMLayerInfo[] = [];
    protected _shadowCSMLevelCount = 0;
    protected _shadowFixedArea: CSMLayerInfo = new CSMLayerInfo(0);

    get shadowCSMLayers () {
        return this._shadowCSMLayers;
    }

    get shadowFixedArea () {
        return this._shadowFixedArea;
    }

    public update (pipeline: RenderPipeline, camera: Camera, dirLight: DirectionalLight, shadowInfo: Shadows) {
        this._pipeline = pipeline;
        this._dirLight = dirLight;
        this._camera = camera;
        this._shadowInfo = shadowInfo;
        this._shadowCSMLevelCount = dirLight.shadowCSMLevel;

        if (!this._shadowInfo.enabled || !dirLight.shadowEnabled) { return; }

        if (dirLight.shadowFixedArea) {
            this._updateFixedArea();
        } else {
            let isRecalculate = false;
            for (let i = 0; i < this._shadowCSMLevelCount; i++) {
                if (this._shadowCSMLayers[i] === undefined) {
                    this._shadowCSMLayers[i] = new CSMLayerInfo(i);
                    isRecalculate = true;
                }
            }

            if (dirLight.shadowCSMValueDirty || isRecalculate) {
                this._splitFrustumLevels();
            }

            this._splitFrustum();
        }
    }

    public shadowFrustumItemToConsole () {
        for (let i = 0; i < this._shadowCSMLevelCount; i++) {
            console.warn(this._dirLight?.node!.name, '._shadowCSMLayers[',
                i, '] = (', this._shadowCSMLayers[i].near, ', ', this._shadowCSMLayers[i].far, ')');
            console.warn(this._camera?.node!.name, '._validFrustum[', i, '] =', this._shadowCSMLayers[i].validFrustum?.toString());
        }
    }

    public destroy () {
        this._dirLight = null;
        this._shadowCSMLevelCount = 0;
        this._shadowCSMLayers.length = 0;
    }

    private _updateFixedArea () {
        if (!this._pipeline || !this._dirLight || !this._camera || !this._shadowInfo) return;
        const dirLight = this._dirLight;
        const device = this._pipeline.device;
        const shadowInfo = this._shadowInfo;
        const x = dirLight.shadowOrthoSize;
        const y = dirLight.shadowOrthoSize;
        const near = dirLight.shadowNear;
        const far = dirLight.shadowFar;
        Mat4.fromRT(_matShadowTrans, dirLight.node!.getWorldRotation(), dirLight.node!.getWorldPosition());
        Mat4.invert(_matShadowView, _matShadowTrans);
        Mat4.ortho(_matShadowProj, -x, x, -y, y, near, far,
            device.capabilities.clipSpaceMinZ, device.capabilities.clipSpaceSignY);
        Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
        shadowInfo.matShadowView = _matShadowView;
        shadowInfo.matShadowProj = _matShadowProj;
        shadowInfo.matShadowViewProj = _matShadowViewProj;

        Frustum.createOrtho(this._shadowFixedArea.validFrustum!, x * 2.0, y * 2.0, near,  far, _matShadowTrans);
    }

    private _splitFrustumLevels () {
        if (!this._dirLight) return;

        const nd = 0.1;
        const fd = this._dirLight.shadowDistance;
        const ratio = fd / nd;
        const level = this._dirLight.shadowCSMLevel;
        this._shadowCSMLayers[0].near = nd;
        for (let i = 1; i < level; i++) {
            // i ÷ numbers of level
            const si = i / level;
            // eslint-disable-next-line no-restricted-properties
            const preNear = SHADOW_CSM_LAMBDA * (nd * Math.pow(ratio, si)) + (1 - SHADOW_CSM_LAMBDA) * (nd + (fd - nd) * si);
            // Slightly increase the overlap to avoid fracture
            const nextFar = preNear * 1.005;
            this._shadowCSMLayers[i].near = preNear;
            this._shadowCSMLayers[i - 1].far = nextFar;
        }
        // numbers of level - 1
        this._shadowCSMLayers[level - 1].far = fd;

        this._dirLight.shadowCSMValueDirty = false;
    }

    private _splitFrustum () {
        if (!this._pipeline || !this._dirLight || !this._camera || !this._shadowInfo) return;

        const device = this._pipeline.device;
        const dirLight = this._dirLight;
        const level = dirLight.shadowCSMLevel;
        const camera = this._camera;
        const invisibleOcclusionRange = dirLight.shadowInvisibleOcclusionRange;
        const shadowMapWidth = this._shadowInfo.size.x;
        for (let i = 0; i < level; i++) {
            const shadowCSMLayer = this._shadowCSMLayers[i]!;
            const splitFrustum = shadowCSMLayer.splitFrustum!;
            const near = shadowCSMLayer.near;
            const far = shadowCSMLayer.far;
            getCameraWorldMatrix(_mat4_trans, camera);
            Frustum.split(splitFrustum, camera, _mat4_trans, near, far);
            shadowCSMLayer.lightViewFrustum = Frustum.clone(splitFrustum);

            // view matrix with range back
            Mat4.fromRT(_matShadowTrans, dirLight.node!.rotation, _focus);
            Mat4.invert(_matShadowView, _matShadowTrans);
            const shadowViewArbitaryPos = _matShadowView.clone();
            shadowCSMLayer.lightViewFrustum.transform(_matShadowView);

            // bounding box in light space
            AABB.fromPoints(_castLightViewBoundingBox, _maxVec3, _minVec3);
            _castLightViewBoundingBox.mergeFrustum(shadowCSMLayer.lightViewFrustum);

            const r = _castLightViewBoundingBox.halfExtents.z;
            shadowCSMLayer.shadowCameraFar = r * 2 + invisibleOcclusionRange;
            const center = _castLightViewBoundingBox.center;
            _shadowPos.set(center.x, center.y, center.z + r + invisibleOcclusionRange);
            Vec3.transformMat4(_shadowPos, _shadowPos, _matShadowTrans);

            Mat4.fromRT(_matShadowTrans, dirLight.node!.rotation, _shadowPos);
            Mat4.invert(_matShadowView, _matShadowTrans);

            // // calculate projection matrix params
            // // min value may lead to some shadow leaks
            // const orthoSizeMin = Vec3.distance(splitFrustum.vertices[0], splitFrustum.vertices[6]);
            // // max value is accurate but poor usage for shadowmap
            // _castLightViewBoundingSphere.center.set(0, 0, 0);
            // _castLightViewBoundingSphere.radius = -1;
            // _castLightViewBoundingSphere.mergePoints(splitFrustum.vertices);
            // const orthoSizeMax = _castLightViewBoundingSphere!.radius * 2;
            // // use lerp(min, accurate_max) to save shadowmap usage
            // const orthoSize = orthoSizeMin * (1 - _lerpMax[i]) + orthoSizeMax * _lerpMax[i];

            const orthoSize = Vec3.distance(shadowCSMLayer.lightViewFrustum.vertices[0], shadowCSMLayer.lightViewFrustum.vertices[6]);

            // snap to whole texels
            const halfOrthoSize = orthoSize * 0.5;
            Mat4.ortho(_matShadowProj, -halfOrthoSize, halfOrthoSize, -halfOrthoSize, halfOrthoSize, 0.1,  shadowCSMLayer.shadowCameraFar,
                device.capabilities.clipSpaceMinZ, device.capabilities.clipSpaceSignY);

            if (shadowMapWidth > 0.0) {
                Mat4.multiply(_matShadowViewProjArbitaryPos, _matShadowProj, shadowViewArbitaryPos);
                Vec3.transformMat4(_projPos, _shadowPos, _matShadowViewProjArbitaryPos);
                const invActualSize = 2.0 / shadowMapWidth;
                _texelSize.set(invActualSize, invActualSize);
                const modX = _projPos.x % _texelSize.x;
                const modY = _projPos.y % _texelSize.y;
                _projSnap.set(_projPos.x - modX, _projPos.y - modY, _projPos.z);
                Mat4.invert(_matShadowViewProjArbitaryPosInv, _matShadowViewProjArbitaryPos);
                Vec3.transformMat4(_snap, _projSnap, _matShadowViewProjArbitaryPosInv);

                Mat4.fromRT(_matShadowTrans, dirLight.node!.rotation, _snap);
                Mat4.invert(_matShadowView, _matShadowTrans);
                Frustum.createOrtho(shadowCSMLayer.validFrustum!, orthoSize, orthoSize, 0.1,  shadowCSMLayer.shadowCameraFar, _matShadowTrans);
            } else {
                for (let i = 0; i < 8; i++) {
                    shadowCSMLayer.validFrustum!.vertices[i].set(0.0, 0.0, 0.0);
                }
                shadowCSMLayer.validFrustum!.updatePlanes();
            }

            Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
            shadowCSMLayer.matShadowView = _matShadowView;
            shadowCSMLayer.matShadowProj = _matShadowProj;
            shadowCSMLayer.matShadowViewProj = _matShadowViewProj;
        }
    }
}
