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
import { RenderScene } from '../../renderer';
import { Camera, DirectionalLight, Model, Shadows, ShadowType, SKYBOX_FLAG, SubModel } from '../../renderer/scene';
import { IRenderObject, IRenderPass, UBOShadow } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { SceneTask, SceneTransversal, SceneVisitor } from './pipeline';
import { TaskType } from './types';
import { PipelineUBO } from './ubos';

export class RenderObject implements IRenderObject {
    public model: Model;
    public depth: number;
    constructor (model: Model, depth: number) {
        this.model = model;
        this.depth = depth;
    }
}
export class RenderInfo implements IRenderPass {
    public priority = 0;
    public hash = -1;
    public depth = -1;
    public shaderId = -1;
    public subModel;
    public passIdx = -1;
}
export class WebSceneTask extends SceneTask {
    constructor (scneData: PipelineSceneData, ubo: PipelineUBO, camera: Camera, visitor: SceneVisitor) {
        super();
        this._scene = camera.scene!;
        this._camera = camera;
        this._visitor = visitor;
        this._sceneData = scneData;
        this._ubo = ubo;
    }
    get taskType (): TaskType {
        return TaskType.SYNC;
    }

    protected _updateDirLight (light: DirectionalLight) {
        const shadows = this._sceneData.shadows;

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
        this._ubo.updateShadowUBORange(UBOShadow.MAT_LIGHT_PLANE_PROJ_OFFSET, shadows.matLight);
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
        const sceneData = this._sceneData;
        const shadows = sceneData.shadows;
        const skybox = sceneData.skybox;
        const csmLayers = sceneData.csmLayers;
        const renderObjects = sceneData.renderObjects;
        renderObjects.length = 0;

        const castShadowObjects = csmLayers.castShadowObjects;
        castShadowObjects.length = 0;
        const csmLayerObjects = csmLayers.layerObjects;
        csmLayerObjects.clear();

        if (shadows.enabled) {
            this._ubo.updateShadowUBORange(UBOShadow.SHADOW_COLOR_OFFSET, shadows.shadowColor);
            if (shadows.type === ShadowType.ShadowMap) {
                // update CSM layers
                if (mainLight && mainLight.node) {
                    csmLayers.update(sceneData, camera);
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
                    csmLayerObjects.push(this._getRenderObject(model, camera));
                }

                if (model.node && ((visibility & model.node.layer) === model.node.layer)
                 || (visibility & model.visFlags)) {
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
    get sceneData (): PipelineSceneData { return this._sceneData; }
    private _scene: RenderScene;
    private _camera: Camera;
    private _visitor: SceneVisitor;
    private _sceneData: PipelineSceneData;
    private _dirLightFrustum = new Frustum();
    protected _ubo: PipelineUBO;
}

export class WebSceneTransversal extends SceneTransversal {
    public preRenderPass (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._sceneData, this._ubo, this._camera, visitor);
    }
    public postRenderPass (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._sceneData, this._ubo, this._camera, visitor);
    }
    constructor (camera: Camera, sceneData: PipelineSceneData, ubo: PipelineUBO) {
        super();
        this._camera = camera;
        this._scene = camera.scene!;
        this._sceneData = sceneData;
        this._ubo = ubo;
    }
    public transverse (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._sceneData, this._ubo, this._camera, visitor);
    }
    protected _scene: RenderScene;
    protected _camera: Camera;
    protected _ubo: PipelineUBO;
    protected _sceneData: PipelineSceneData;
}
