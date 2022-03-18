/****************************************************************************
 Copyright (c) 2021-2022 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

import { AABB, Frustum, intersect, Sphere } from '../../geometry';
import { legacyCC } from '../../global-exports';
import { Mat4, Vec2, Vec3 } from '../../math';
import { Camera, DirectionalLight, Model, RenderScene, Shadows, ShadowType, SKYBOX_FLAG, SubModel } from '../../renderer/scene';
import { IRenderObject, IRenderPass } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { SceneTask, SceneTransversal, SceneVisitor } from './pipeline';
import { TaskType } from './types';

export class RenderObject implements IRenderObject {
    public model: Model;
    public depth: number;
    constructor (model: Model, depth: number) {
        this.model = model;
        this.depth = depth;
    }
}
export class RenderInfo implements IRenderPass {
    public hash = -1;
    public depth = -1;
    public shaderId = -1;
    public subModel;
    public passIdx = -1;
}
export class WebSceneTask extends SceneTask {
    constructor (camera: Camera, visitor: SceneVisitor) {
        super();
        this._scene = camera.scene!;
        this._camera = camera;
        this._visitor = visitor;
    }
    get taskType (): TaskType {
        return TaskType.SYNC;
    }

    protected _updateDirLight (light: DirectionalLight) {
        const shadows = WebSceneTask._sceneData.shadows;

        const dir = light.direction;
        const n = shadows.normal; const d = shadows.distance + 0.001; // avoid z-fighting
        const NdL = Vec3.dot(n, dir); const scale = 1 / NdL;
        const lx = dir.x * scale; const ly = dir.y * scale; const lz = dir.z * scale;
        const nx = n.x; const ny = n.y; const nz = n.z;
        const m = shadows.matLight;
        m.m00 = 1 - nx * lx;
        m.m01 = -nx * ly;
        m.m02 = -nx * lz;
        m.m03 = 0;
        m.m04 = -ny * lx;
        m.m05 = 1 - ny * ly;
        m.m06 = -ny * lz;
        m.m07 = 0;
        m.m08 = -nz * lx;
        m.m09 = -nz * ly;
        m.m10 = 1 - nz * lz;
        m.m11 = 0;
        m.m12 = lx * d;
        m.m13 = ly * d;
        m.m14 = lz * d;
        m.m15 = 1;
    }

    protected _getCameraWorldMatrix (out: Mat4, camera: Camera) {
        if (!camera.node) { return; }

        const cameraNode = camera.node;
        const position = cameraNode.getWorldPosition();
        const rotation = cameraNode.getWorldRotation();

        Mat4.fromRT(out, rotation, position);
        out.m08 *= -1.0;
        out.m09 *= -1.0;
        out.m10 *= -1.0;
    }

    protected _quantizeDirLightShadowCamera (out: Frustum, dirLight: DirectionalLight,
        camera: Camera, shadowInfo: Shadows) {
        const device = legacyCC.director.root.device;
        const _dirLightFrustum = new Frustum();
        const _matShadowTrans = new Mat4();
        const _matShadowView = new Mat4();
        const _matShadowViewInv = new Mat4();
        const _matShadowProj = new Mat4();
        const _matShadowViewProj = new Mat4();
        const _matShadowViewProjArbitaryPos = new Mat4();
        const _matShadowViewProjArbitaryPosInv = new Mat4();
        const _mat4_trans = new Mat4();
        const _validFrustum = new Frustum();
        _validFrustum.accurate = true;
        let _lightViewFrustum = new Frustum();
        _lightViewFrustum.accurate = true;
        const _castLightViewBounds = new AABB();
        const _shadowPos = new Vec3();
        const _cameraBoundingSphere = new Sphere();
        const _projPos = new Vec3();
        const _texelSize = new Vec2();
        const _projSnap = new Vec3();
        const _snap = new Vec3();
        const _focus = new Vec3(0, 0, 0);
        if (dirLight.shadowFixedArea) {
            const x = dirLight.shadowOrthoSize;
            const y = dirLight.shadowOrthoSize;
            const near = dirLight.shadowNear;
            const far = dirLight.shadowFar;
            Mat4.fromRT(_matShadowTrans, dirLight.node!.getWorldRotation(), dirLight.node!.getWorldPosition());
            Mat4.invert(_matShadowView, _matShadowTrans);
            Mat4.ortho(_matShadowProj, -x, x, -y, y, near, far,
                device.capabilities.clipSpaceMinZ, device.capabilities.clipSpaceSignY);
            Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
            Mat4.invert(_matShadowViewInv, _matShadowView);
            shadowInfo.matShadowView = _matShadowView;
            shadowInfo.matShadowProj = _matShadowProj;
            shadowInfo.matShadowViewProj = _matShadowViewProj;

            Frustum.createOrtho(out, x * 2.0, y * 2.0, near,  far, _matShadowViewInv);
        } else {
            const invisibleOcclusionRange = dirLight.shadowInvisibleOcclusionRange;
            const shadowMapWidth = shadowInfo.size.x;

            // Raw data
            this._getCameraWorldMatrix(_mat4_trans, camera);
            Frustum.split(_validFrustum, camera, _mat4_trans, 0.1, dirLight.shadowDistance);
            _lightViewFrustum = Frustum.clone(_validFrustum);

            // view matrix with range back
            Mat4.fromRT(_matShadowTrans, dirLight.node!.rotation, _focus);
            Mat4.invert(_matShadowView, _matShadowTrans);
            Mat4.invert(_matShadowViewInv, _matShadowView);

            const shadowViewArbitaryPos = _matShadowView.clone();
            _lightViewFrustum.transform(_matShadowView);
            // bounding box in light space
            AABB.fromPoints(_castLightViewBounds, new Vec3(10000000, 10000000, 10000000), new Vec3(-10000000, -10000000, -10000000));
            _castLightViewBounds.mergeFrustum(_lightViewFrustum);

            const r = _castLightViewBounds.halfExtents.z * 2.0;
            _shadowPos.set(_castLightViewBounds.center.x, _castLightViewBounds.center.y,
                _castLightViewBounds.center.z + _castLightViewBounds.halfExtents.z + invisibleOcclusionRange);
            Vec3.transformMat4(_shadowPos, _shadowPos, _matShadowViewInv);

            Mat4.fromRT(_matShadowTrans, dirLight.node!.rotation, _shadowPos);
            Mat4.invert(_matShadowView, _matShadowTrans);
            Mat4.invert(_matShadowViewInv, _matShadowView);

            // calculate projection matrix params
            // min value may lead to some shadow leaks
            const orthoSizeMin = Vec3.distance(_validFrustum.vertices[0], _validFrustum.vertices[6]);
            // max value is accurate but poor usage for shadowmap
            _cameraBoundingSphere.center.set(0, 0, 0);
            _cameraBoundingSphere.radius = -1.0;
            _cameraBoundingSphere.mergePoints(_validFrustum.vertices);
            const orthoSizeMax = _cameraBoundingSphere.radius * 2.0;
            // use lerp(min, accurate_max) to save shadowmap usage
            const orthoSize = orthoSizeMin * 0.8 + orthoSizeMax * 0.2;
            shadowInfo.shadowCameraFar = r + invisibleOcclusionRange;

            // snap to whole texels
            const halfOrthoSize = orthoSize * 0.5;
            Mat4.ortho(_matShadowProj, -halfOrthoSize, halfOrthoSize, -halfOrthoSize, halfOrthoSize, 0.1,  shadowInfo.shadowCameraFar,
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
                Mat4.invert(_matShadowViewInv, _matShadowView);
                Frustum.createOrtho(out, orthoSize, orthoSize, 0.1,  shadowInfo.shadowCameraFar, _matShadowViewInv);
            } else {
                for (let i = 0; i < 8; i++) {
                    out.vertices[i].set(0.0, 0.0, 0.0);
                }
                out.updatePlanes();
            }

            Mat4.multiply(_matShadowViewProj, _matShadowProj, _matShadowView);
            shadowInfo.matShadowView = _matShadowView;
            shadowInfo.matShadowProj = _matShadowProj;
            shadowInfo.matShadowViewProj = _matShadowViewProj;
        }
    }

    protected _getRenderObject (model: Model, camera: Camera) {
        let depth = 0;
        if (model.node) {
            const _tempVec3 = new Vec3();
            Vec3.subtract(_tempVec3, model.node.worldPosition, camera.position);
            depth = Vec3.dot(_tempVec3, camera.forward);
        }
        const ro = new RenderObject(model, depth);
        return ro;
    }

    protected _sceneCulling () {
        const scene = this._scene;
        const camera = this._camera;
        const mainLight = scene.mainLight;
        const sceneData = WebSceneTask._sceneData;
        const shadows = sceneData.shadows;
        const skybox = sceneData.skybox;

        const renderObjects = sceneData.renderObjects;
        renderObjects.length = 0;

        const castShadowObjects = sceneData.castShadowObjects;
        castShadowObjects.length = 0;
        let dirShadowObjects: IRenderObject[] | null = null;
        if (shadows.enabled) {
            if (shadows.type === ShadowType.ShadowMap) {
                dirShadowObjects = sceneData.dirShadowObjects;
                dirShadowObjects.length = 0;

                // update dirLightFrustum
                if (mainLight && mainLight.node) {
                    this._quantizeDirLightShadowCamera(this._dirLightFrustum, mainLight, camera, shadows);
                } else {
                    for (let i = 0; i < 8; i++) {
                        this._dirLightFrustum.vertices[i].set(0.0, 0.0, 0.0);
                    }
                    this._dirLightFrustum.updatePlanes();
                }
            }
        }

        if (mainLight) {
            if (shadows.type === ShadowType.Planar) {
                this._updateDirLight(mainLight);
            }
        }

        if (skybox.enabled && skybox.model && (camera.clearFlag & SKYBOX_FLAG)) {
            renderObjects.push(this._getRenderObject(skybox.model, camera));
        }

        const models = scene.models;
        const visibility = camera.visibility;

        for (let i = 0; i < models.length; i++) {
            const model = models[i];

            // filter model by view visibility
            if (model.enabled) {
                if (model.castShadow) {
                    castShadowObjects.push(this._getRenderObject(model, camera));
                }

                if (model.node && ((visibility & model.node.layer) === model.node.layer)
                 || (visibility & model.visFlags)) {
                // shadow render Object
                    if (dirShadowObjects != null && model.castShadow && model.worldBounds) {
                    // frustum culling
                    // eslint-disable-next-line no-lonely-if
                        if (intersect.aabbFrustum(model.worldBounds, this._dirLightFrustum)) {
                            dirShadowObjects.push(this._getRenderObject(model, camera));
                        }
                    }
                    // frustum culling
                    if (model.worldBounds && !intersect.aabbFrustum(model.worldBounds, camera.frustum)) {
                        continue;
                    }

                    renderObjects.push(this._getRenderObject(model, camera));
                }
            }
        }
    }

    public start (): void {
        this._sceneCulling();
    }
    public join (): void {
        // for web-pipeline, do nothing
    }
    public submit (): void {

    }
    get camera () { return this._camera; }
    get scene (): RenderScene {
        return this._scene;
    }
    get visitor () { return this._visitor; }
    get dirLightFrustum () { return this._dirLightFrustum; }
    static GetSceneData () {
        return this._sceneData;
    }
    get sceneData () { return WebSceneTask._sceneData; }
    private _scene: RenderScene;
    private _camera: Camera;
    private _visitor: SceneVisitor;
    private static _sceneData: PipelineSceneData = new PipelineSceneData();
    private _dirLightFrustum = new Frustum();
}

export class WebSceneTransversal extends SceneTransversal {
    constructor (camera: Camera) {
        super();
        this._camera = camera;
        this._scene = camera.scene!;
    }
    public transverse (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._camera, visitor);
    }
    private _scene: RenderScene;
    private _camera: Camera;
}
