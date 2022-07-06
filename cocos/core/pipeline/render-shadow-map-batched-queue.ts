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

import { SubModel } from '../renderer/scene/submodel';
import { SetIndex } from './define';
import { Device, RenderPass, Shader, CommandBuffer } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { Pass, BatchingSchemes } from '../renderer/core/pass';
import { RenderInstancedQueue } from './render-instanced-queue';
import { RenderBatchedQueue } from './render-batched-queue';
import { ShadowType } from '../renderer/scene/shadows';
import { Light, LightType } from '../renderer/scene/light';
import { intersect } from '../geometry';
import { Model } from '../renderer/scene/model';
import { RenderPipeline } from './render-pipeline';
import { Camera, DirectionalLight, SpotLight } from '../renderer/scene';
import { shadowCulling } from './scene-culling';

const _phaseID = getPhaseID('shadow-caster');
const _shadowPassIndices: number[] = [];
function getShadowPassIndex (subModels: SubModel[], shadowPassIndices: number[]) {
    shadowPassIndices.length = 0;
    let hasShadowPass = false;
    for (let j = 0; j < subModels.length; j++) {
        const { passes } = subModels[j];
        let shadowPassIndex = -1;
        for (let k = 0; k < passes.length; k++) {
            if (passes[k].phase === _phaseID) {
                shadowPassIndex = k;
                hasShadowPass = true;
                break;
            }
        }
        shadowPassIndices.push(shadowPassIndex);
    }
    return hasShadowPass;
}

/**
 * @zh
 * 阴影渲染队列
 */
export class RenderShadowMapBatchedQueue {
    private _pipeline: RenderPipeline;
    private _subModelsArray: SubModel[] = [];
    private _passArray: Pass[] = [];
    private _shaderArray: Shader[] = [];
    private _instancedQueue: RenderInstancedQueue;
    private _batchedQueue: RenderBatchedQueue;

    public constructor (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
        this._instancedQueue = new RenderInstancedQueue();
        this._batchedQueue = new RenderBatchedQueue();
    }

    public gatherLightPasses (camera: Camera, light: Light, cmdBuff: CommandBuffer, level = 0) {
        this.clear();

        const sceneData = this._pipeline.pipelineSceneData;
        const shadowInfo = sceneData.shadows;
        if (light && shadowInfo.enabled && shadowInfo.type === ShadowType.ShadowMap) {
            switch (light.type) {
            case LightType.DIRECTIONAL:
                // eslint-disable-next-line no-case-declarations
                const dirLight = light as DirectionalLight;
                if (dirLight.shadowEnabled) {
                    const csmLayers = sceneData.csmLayers;
                    let layer;
                    if (dirLight.shadowFixedArea) {
                        layer = csmLayers.specialLayer;
                    } else {
                        layer = csmLayers.layers[level];
                    }
                    shadowCulling(camera, sceneData, layer);
                    const dirShadowObjects = layer.shadowObjects;
                    for (let i = 0; i < dirShadowObjects.length; i++) {
                        const ro = dirShadowObjects[i];
                        const model = ro.model;
                        if (!getShadowPassIndex(model.subModels, _shadowPassIndices)) { continue; }
                        this.add(model, _shadowPassIndices);
                    }
                }

                break;
            case LightType.SPOT:
                // eslint-disable-next-line no-case-declarations
                const spotLight = light as SpotLight;
                if (spotLight.shadowEnabled) {
                    const castShadowObjects = sceneData.csmLayers.castShadowObjects;
                    for (let i = 0; i < castShadowObjects.length; i++) {
                        const ro = castShadowObjects[i];
                        const model = ro.model;
                        if (!getShadowPassIndex(model.subModels, _shadowPassIndices)) { continue; }
                        if (model.worldBounds) {
                            if (!intersect.aabbFrustum(model.worldBounds, spotLight.frustum)) { continue; }
                        }

                        this.add(model, _shadowPassIndices);
                    }
                }
                break;
            default:
            }

            this._instancedQueue.uploadBuffers(cmdBuff);
            this._batchedQueue.uploadBuffers(cmdBuff);
        }
    }

    /**
     * @zh
     * clear light-Batched-Queue
     */
    public clear () {
        this._subModelsArray.length = 0;
        this._shaderArray.length = 0;
        this._passArray.length = 0;
        this._instancedQueue.clear();
        this._batchedQueue.clear();
    }

    public add (model: Model, _shadowPassIndices: number[]) {
        const subModels = model.subModels;
        for (let j = 0; j < subModels.length; j++) {
            const subModel = subModels[j];
            const shadowPassIdx = _shadowPassIndices[j];
            if (shadowPassIdx < 0) { return; }
            const pass = subModel.passes[shadowPassIdx];
            const batchingScheme = pass.batchingScheme;

            if (batchingScheme === BatchingSchemes.INSTANCING) {            // instancing
                const buffer = pass.getInstancedBuffer();
                buffer.merge(subModel, model.instancedAttributes, shadowPassIdx);
                this._instancedQueue.queue.add(buffer);
            } else if (pass.batchingScheme === BatchingSchemes.VB_MERGING) { // vb-merging
                const buffer = pass.getBatchedBuffer();
                buffer.merge(subModel, shadowPassIdx, model);
                this._batchedQueue.queue.add(buffer);
            } else {
                const shader = subModel.shaders[shadowPassIdx];
                this._subModelsArray.push(subModel);
                if (shader) this._shaderArray.push(shader);
                this._passArray.push(pass);
            }
        }
    }

    /**
     * @zh
     * record CommandBuffer
     */
    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (let i = 0; i < this._subModelsArray.length; ++i) {
            const subModel = this._subModelsArray[i];
            const shader = this._shaderArray[i];
            const pass = this._passArray[i];
            const ia = subModel.inputAssembler;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, ia);
            const descriptorSet = pass.descriptorSet;

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }
}
