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

import { AABB, intersect } from '../geometry';
import { SetIndex } from './define';
import { CommandBuffer, Device, RenderPass } from '../gfx';
import { InstancedBuffer } from './instanced-buffer';
import { PipelineStateManager } from './pipeline-state-manager';
import { Model, Camera } from '../renderer/scene';
import { RenderInstancedQueue } from './render-instanced-queue';
import { ShadowType } from '../renderer/scene/shadows';
import { Layers } from '../scene-graph/layers';
import { RenderPipeline } from './render-pipeline';

const _ab = new AABB();

export class PlanarShadowQueue {
    private _pendingModels: Model[] = [];
    private _castModels:Model[] = [];
    private _instancedQueue = new RenderInstancedQueue();
    private _pipeline: RenderPipeline;

    constructor (pipeline: RenderPipeline) {
        this._pipeline = pipeline;
    }

    public gatherShadowPasses (camera: Camera, cmdBuff: CommandBuffer) {
        const pipelineSceneData = this._pipeline.pipelineSceneData;
        const pipelineUBO = this._pipeline.pipelineUBO;
        const shadows = pipelineSceneData.shadows;
        this._instancedQueue.clear();
        this._pendingModels.length = 0;
        this._castModels.length = 0;
        if (!shadows.enabled || shadows.type !== ShadowType.Planar) { return; }

        pipelineUBO.updateShadowUBO(camera);

        const scene = camera.scene!;
        const frustum = camera.frustum;
        const shadowVisible =  (camera.visibility & Layers.BitMask.DEFAULT) !== 0;
        if (!scene.mainLight || !shadowVisible) { return; }

        const models = scene.models;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (model.enabled && model.node && model.castShadow) { this._castModels.push(model); }
        }
        const instancedBuffer = InstancedBuffer.get(shadows.instancingMaterial.passes[0]);
        this._instancedQueue.queue.add(instancedBuffer);

        for (let i = 0; i < this._castModels.length; i++) {
            const model = this._castModels[i];
            if (model.worldBounds) {
                AABB.transform(_ab, model.worldBounds, shadows.matLight);
                if (!intersect.aabbFrustum(_ab, frustum)) { continue; }
            }
            if (model.isInstancingEnabled) {
                const subModels = model.subModels;
                for (let m = 0; m < subModels.length; m++) {
                    const subModel = subModels[m];
                    instancedBuffer.merge(subModel, model.instancedAttributes, 0, subModel.planarInstanceShader);
                }
            } else {
                this._pendingModels.push(model);
            }
        }
        this._instancedQueue.uploadBuffers(cmdBuff);
    }

    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer) {
        const shadows = this._pipeline.pipelineSceneData.shadows;

        if (!shadows.enabled || shadows.type !== ShadowType.Planar) { return; }
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        if (!this._pendingModels.length) { return; }
        const pass = shadows.material.passes[0];
        const descriptorSet = pass.descriptorSet;
        cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);

        const modelCount = this._pendingModels.length;
        for (let i = 0; i < modelCount; i++) {
            const model = this._pendingModels[i];
            for (let j = 0; j < model.subModels.length; j++) {
                const subModel = model.subModels[j];
                // This is a temporary solution
                // It should not be written in a fixed way, or modified by the user
                const shader = subModel.planarShader;
                const ia = subModel.inputAssembler;
                const pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader!, renderPass, ia);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
                cmdBuff.bindInputAssembler(ia);
                cmdBuff.draw(ia);
            }
        }
    }
}
