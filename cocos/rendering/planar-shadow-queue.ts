/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/

import { cclegacy, geometry } from '../core';
import { isEnableEffect, SetIndex } from './define';
import { CommandBuffer, Device, RenderPass, Shader } from '../gfx';
import { PipelineStateManager } from './pipeline-state-manager';
import { Model, Camera, SubModel } from '../render-scene/scene';
import { RenderInstancedQueue } from './render-instanced-queue';
import { ShadowType } from '../render-scene/scene/shadows';
import { Layers } from '../scene-graph/layers';
import { PipelineRuntime } from './custom/pipeline';
import { BatchingSchemes, Pass } from '../render-scene/core/pass';
import { getPhaseID } from './pass-phase';

const _ab = new geometry.AABB();
let _phaseID = getPhaseID('planar-shadow');
function getPlanarShadowPassIndex (subModel: SubModel): number {
    const passes = subModel.passes;
    const r = cclegacy.rendering;
    if (isEnableEffect()) _phaseID = r.getPhaseID(r.getPassID('default'), 'planar-shadow');
    for (let k = 0; k < passes.length; k++) {
        if (((!r || !r.enableEffectImport) && passes[k].phase === _phaseID)
        || (isEnableEffect() && passes[k].phaseID === _phaseID)) {
            return k;
        }
    }
    return -1;
}

export class PlanarShadowQueue {
    private _subModelArray: SubModel[] = [];
    private _shaderArray: Shader[] = [];
    private _passArray: Pass[] = [];
    private _castModels: Model[] = [];
    private _instancedQueue = new RenderInstancedQueue();
    private _pipeline: PipelineRuntime;

    constructor (pipeline: PipelineRuntime) {
        this._pipeline = pipeline;
    }

    /**
     * @en
     * clear planar-shadow queue
     * @zh
     * 清除 planar-shadow 渲染队列数据
     */
    public clear (): void {
        this._subModelArray.length = 0;
        this._shaderArray.length = 0;
        this._passArray.length = 0;
        this._instancedQueue.clear();
        this._castModels.length = 0;
    }

    public gatherShadowPasses (camera: Camera, cmdBuff: CommandBuffer): void {
        this.clear();
        const pipelineSceneData = this._pipeline.pipelineSceneData;
        const shadows = pipelineSceneData.shadows;
        if (!shadows.enabled || shadows.type !== ShadowType.Planar || shadows.normal.length() < 0.000001) { return; }

        const scene = camera.scene!;
        const frustum = camera.frustum;
        const shadowVisible =  (camera.visibility & Layers.BitMask.DEFAULT) !== 0;
        if (!scene.mainLight || !shadowVisible) { return; }

        const models = scene.models;
        const visibility = camera.visibility;
        for (let i = 0; i < models.length; i++) {
            const model = models[i];
            if (scene.isCulledByLod(camera, model)) {
                continue;
            }
            if (model.enabled && model.node && model.castShadow
                && (model.node && ((visibility & model.node.layer) === model.node.layer))) {
                this._castModels.push(model);
            }
        }

        for (let i = 0; i < this._castModels.length; i++) {
            const model = this._castModels[i];
            if (model.worldBounds) {
                geometry.AABB.transform(_ab, model.worldBounds, shadows.matLight);
                if (!geometry.intersect.aabbFrustum(_ab, frustum)) { continue; }
            }

            const subModels = model.subModels;
            for (let j = 0; j < subModels.length; j++) {
                const subModel = subModels[j];
                const shadowPassIdx = getPlanarShadowPassIndex(subModel);
                if (shadowPassIdx < 0) {
                    this._subModelArray.push(subModel);
                    const planarShader = shadows.getPlanarShader(subModel.patches);
                    if (!planarShader) { continue; }
                    this._shaderArray.push(planarShader);
                    this._passArray.push(shadows.material.passes[0]);
                    continue;
                }

                const pass = subModel.passes[shadowPassIdx];
                const batchingScheme = pass.batchingScheme;
                if (batchingScheme === BatchingSchemes.INSTANCING) {
                    const buffer = pass.getInstancedBuffer();
                    buffer.merge(subModel, shadowPassIdx);
                    this._instancedQueue.queue.add(buffer);
                } else {
                    const shader = subModel.shaders[shadowPassIdx];
                    this._subModelArray.push(subModel);
                    if (shader) this._shaderArray.push(shader);
                    this._passArray.push(pass);
                }
            }
        }
        this._instancedQueue.uploadBuffers(cmdBuff);
    }

    public recordCommandBuffer (device: Device, renderPass: RenderPass, cmdBuff: CommandBuffer): void {
        const shadows = this._pipeline.pipelineSceneData.shadows;

        if (!shadows.enabled || shadows.type !== ShadowType.Planar) { return; }
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (let i = 0; i < this._subModelArray.length; ++i) {
            const subModel = this._subModelArray[i];
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
