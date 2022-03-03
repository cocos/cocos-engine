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
import { DirectionalLight, Camera, Shadows, CSMLevel } from '../../renderer/scene';
import { Mat4, Vec3, Vec2 } from '../../math';
import { Frustum, AABB } from '../../geometry';
import { RenderPipeline } from '..';

const SHADOW_CSM_LAMBDA = 0.75;

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
const _splitFrustum = new Frustum();
_splitFrustum.accurate = true;
const _lightViewFrustum = new Frustum();
_lightViewFrustum.accurate = true;

class CSMLayerInfo {
    protected _level: number;
    protected _splitCameraNear: number;
    protected _splitCameraFar: number;
    protected _shadowCameraFar: number;

    protected _matShadowView: Mat4 | null = null;
    protected _matShadowProj: Mat4 | null = null;
    protected _matShadowViewProj: Mat4 | null = null;

    protected _validFrustum: Frustum | null = null;

    constructor (level: number) {
        this._level = level;
        this._splitCameraNear = 0.0;
        this._splitCameraFar = 0.0;
        this._shadowCameraFar = 0.0;
        this._matShadowView = new Mat4();
        this._matShadowProj = new Mat4();
        this._matShadowViewProj = new Mat4();
        this._validFrustum = new Frustum();
        this._validFrustum.accurate = true;
    }

    public destroy () {
        this._level = 0;
        this._splitCameraNear = 0.0;
        this._splitCameraFar = 0.0;
        this._shadowCameraFar = 0.0;
        this._matShadowView = null;
        this._matShadowProj = null;
        this._matShadowViewProj = null;
        this._validFrustum = null;
    }

    get splitCameraNear () {
        return this._splitCameraNear;
    }
    set splitCameraNear (val) {
        this._splitCameraNear = val;
    }

    get splitCameraFar () {
        return this._splitCameraFar;
    }
    set splitCameraFar (val) {
        this._splitCameraFar = val;
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
    protected _layers: CSMLayerInfo[] = [];
    protected _levelCount = 0;
    protected _fixedArea: CSMLayerInfo | null = null;

    get layers () {
        return this._layers;
    }

    get fixedArea () {
        return this._fixedArea;
    }

    constructor () {
        this._fixedArea = new CSMLayerInfo(0);
    }

    public update (pipeline: RenderPipeline, camera: Camera, dirLight: DirectionalLight, shadowInfo: Shadows) {
        this._pipeline = pipeline;
        this._dirLight = dirLight;
        this._camera = camera;
        this._shadowInfo = shadowInfo;
        this._levelCount = dirLight.shadowCSMLevel;

        if (!this._shadowInfo.enabled || !dirLight.shadowEnabled) { return; }

        if (dirLight.shadowFixedArea) {
            this._updateFixedArea();
        } else {
            let isRecalculate = false;
            for (let i = 0; i < this._levelCount; i++) {
                if (!this._layers[i]) {
                    this._layers[i] = new CSMLayerInfo(i);
                    isRecalculate = true;
                }
            }

            if (dirLight.shadowCSMValueDirty || isRecalculate) {
                this._splitFrustumLevels();
            }

            this._calculateCSM();
        }
    }

    public shadowFrustumItemToConsole () {
        for (let i = 0; i < this._levelCount; i++) {
            console.warn(this._dirLight?.node!.name, '._shadowCSMLayers[',
                i, '] = (', this._layers[i].splitCameraNear, ', ', this._layers[i].splitCameraFar, ')');
            console.warn(this._camera?.node!.name, '._validFrustum[', i, '] =', this._layers[i].validFrustum?.toString());
        }
    }

    public destroy () {
        this._pipeline = null;
        this._dirLight = null;
        this._camera = null;
        this._shadowInfo = null;
        for (let i = 0; i < CSMLevel.level_4; i++) {
            if (this._layers[i]) {
                this._layers[i].destroy();
            }
        }
        this._layers.length = 0;
        this._levelCount = 0;
        this._layers.length = 0;
        this._fixedArea = null;
    }

    private _updateFixedArea () {
        if (!this._pipeline || !this._dirLight || !this._fixedArea) return;
        const dirLight = this._dirLight;
        const device = this._pipeline.device;
        const x = dirLight.shadowOrthoSize;
        const y = dirLight.shadowOrthoSize;
        const near = dirLight.shadowNear;
        const far = dirLight.shadowFar;
        Mat4.fromRT(_matShadowTrans, dirLight.node!.getWorldRotation(), dirLight.node!.getWorldPosition());
        Mat4.invert(_matShadowView, _matShadowTrans);
        Mat4.ortho(_matShadowProj, -x, x, -y, y, near, far,
            device.capabilities.clipSpaceMinZ, device.capabilities.clipSpaceSignY);
        Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
        this._fixedArea.matShadowView = _matShadowView;
        this._fixedArea.matShadowProj = _matShadowProj;
        this._fixedArea.matShadowViewProj = _matShadowViewProj;

        Frustum.createOrtho(this._fixedArea.validFrustum!, x * 2.0, y * 2.0, near,  far, _matShadowTrans);
    }

    private _splitFrustumLevels () {
        if (!this._dirLight) return;

        const nd = 0.1;
        const fd = this._dirLight.shadowDistance;
        const ratio = fd / nd;
        const level = this._dirLight.shadowCSMLevel;
        this._layers[0].splitCameraNear = nd;
        for (let i = 1; i < level; i++) {
            // i ÷ numbers of level
            const si = i / level;
            // eslint-disable-next-line no-restricted-properties
            const preNear = SHADOW_CSM_LAMBDA * (nd * Math.pow(ratio, si)) + (1 - SHADOW_CSM_LAMBDA) * (nd + (fd - nd) * si);
            // Slightly increase the overlap to avoid fracture
            const nextFar = preNear * 1.005;
            this._layers[i].splitCameraNear = preNear;
            this._layers[i - 1].splitCameraFar = nextFar;
        }
        // numbers of level - 1
        this._layers[level - 1].splitCameraFar = fd;

        this._dirLight.shadowCSMValueDirty = false;
    }

    private _calculateCSM () {
        if (!this._pipeline || !this._dirLight || !this._camera || !this._shadowInfo) return;

        const device = this._pipeline.device;
        const dirLight = this._dirLight;
        const level = dirLight.shadowCSMLevel;
        const camera = this._camera;
        const invisibleOcclusionRange = dirLight.shadowInvisibleOcclusionRange;
        const shadowMapWidth = this._shadowInfo.size.x;
        for (let i = 0; i < level; i++) {
            const csmLayer = this._layers[i];
            const near = csmLayer.splitCameraNear;
            const far = csmLayer.splitCameraFar;
            this._getCameraWorldMatrix(_mat4_trans, camera);
            Frustum.split(_splitFrustum, camera, _mat4_trans, near, far);
            Frustum.copy(_lightViewFrustum, _splitFrustum);

            // view matrix with range back
            Mat4.fromRT(_matShadowTrans, dirLight.node!.rotation, _focus);
            Mat4.invert(_matShadowView, _matShadowTrans);
            const shadowViewArbitaryPos = _matShadowView.clone();
            _lightViewFrustum.transform(_matShadowView);

            // bounding box in light space
            AABB.fromPoints(_castLightViewBoundingBox, _maxVec3, _minVec3);
            _castLightViewBoundingBox.mergeFrustum(_lightViewFrustum);
            const orthoSize = Vec3.distance(_lightViewFrustum.vertices[0], _lightViewFrustum.vertices[6]);

            const r = _castLightViewBoundingBox.halfExtents.z;
            csmLayer.shadowCameraFar = r * 2 + invisibleOcclusionRange;
            const center = _castLightViewBoundingBox.center;
            _shadowPos.set(center.x, center.y, center.z + r + invisibleOcclusionRange);
            Vec3.transformMat4(_shadowPos, _shadowPos, _matShadowTrans);

            Mat4.fromRT(_matShadowTrans, dirLight.node!.rotation, _shadowPos);
            Mat4.invert(_matShadowView, _matShadowTrans);

            // snap to whole texels
            const halfOrthoSize = orthoSize * 0.5;
            Mat4.ortho(_matShadowProj, -halfOrthoSize, halfOrthoSize, -halfOrthoSize, halfOrthoSize, 0.1,  csmLayer.shadowCameraFar,
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
                Frustum.createOrtho(csmLayer.validFrustum!, orthoSize, orthoSize, 0.1,  csmLayer.shadowCameraFar, _matShadowTrans);
            } else {
                for (let i = 0; i < 8; i++) {
                    csmLayer.validFrustum!.vertices[i].set(0.0, 0.0, 0.0);
                }
                csmLayer.validFrustum!.updatePlanes();
            }

            Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
            csmLayer.matShadowView = _matShadowView;
            csmLayer.matShadowProj = _matShadowProj;
            csmLayer.matShadowViewProj = _matShadowViewProj;
        }
    }

    private _getCameraWorldMatrix (out: Mat4, camera: Camera) {
        if (!camera.node) { return; }

        const cameraNode = camera.node;
        const position = cameraNode.getWorldPosition();
        const rotation = cameraNode.getWorldRotation();

        Mat4.fromRT(out, rotation, position);
        out.m08 *= -1.0;
        out.m09 *= -1.0;
        out.m10 *= -1.0;
    }
}
