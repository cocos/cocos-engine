/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

import { Frustum, intersect } from '../../core/geometry';
import { Vec3 } from '../../core/math';
import { RenderScene } from '../../render-scene';
import { Camera, Model, ShadowType, SKYBOX_FLAG } from '../../render-scene/scene';
import { IRenderObject, IRenderPass, UBOShadow } from '../define';
import { PipelineSceneData } from '../pipeline-scene-data';
import { SceneTask, SceneTransversal, SceneVisitor } from './pipeline';
import { TaskType } from './types';
import { PipelineUBO } from '../pipeline-ubo';

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

export class WebSceneTask implements SceneTask {
    constructor (scneData: PipelineSceneData, ubo: PipelineUBO, camera: Camera | null, visitor: SceneVisitor) {
        if (camera) {
            this._scene = camera.scene!;
            this._camera = camera;
        }
        this._visitor = visitor;
        this._sceneData = scneData;
        this._ubo = ubo;
    }
    get taskType (): TaskType {
        return TaskType.SYNC;
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
        if (!this.camera) { return; }
        const scene = this.renderScene;
        const camera = this.camera;
        const mainLight = scene!.mainLight;
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

        if (skybox.enabled && skybox.model && (camera.clearFlag & SKYBOX_FLAG)) {
            renderObjects.push(this._getRenderObject(skybox.model, camera));
        }

        const models = scene!.models;
        const visibility = camera.visibility;

        for (let i = 0; i < models.length; i++) {
            const model = models[i];

            // filter model by view visibility
            if (model.enabled) {
                if (scene && scene.isCulledByLod(camera, model)) {
                    continue;
                }

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
    get renderScene () {
        return this._scene;
    }
    get visitor () { return this._visitor; }
    get dirLightFrustum () { return this._dirLightFrustum; }
    get sceneData (): PipelineSceneData { return this._sceneData; }
    private _scene: RenderScene | null = null;
    private _camera: Camera | null = null;
    private _visitor: SceneVisitor;
    private _sceneData: PipelineSceneData;
    private _dirLightFrustum = new Frustum();
    protected _ubo: PipelineUBO;
}

export class WebSceneTransversal implements SceneTransversal {
    public preRenderPass (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._sceneData, this._ubo, this._camera, visitor);
    }
    public postRenderPass (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._sceneData, this._ubo, this._camera, visitor);
    }
    constructor (camera: Camera | null, sceneData: PipelineSceneData, ubo: PipelineUBO) {
        this._camera = camera;
        if (camera) this._scene = camera.scene!;
        this._sceneData = sceneData;
        this._ubo = ubo;
    }
    public transverse (visitor: SceneVisitor): SceneTask {
        return new WebSceneTask(this._sceneData, this._ubo, this._camera, visitor);
    }
    protected _scene: RenderScene | null = null;
    protected _camera: Camera | null = null;
    protected _ubo: PipelineUBO;
    protected _sceneData: PipelineSceneData;
}
