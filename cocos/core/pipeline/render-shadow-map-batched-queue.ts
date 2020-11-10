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
 * @module pipeline
 */

import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, SetIndex } from './define';
import { Device, RenderPass, Buffer, Shader, CommandBuffer } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassPool, PassView, SubModelPool, SubModelView, ShaderHandle } from '../renderer/core/memory-pools';
import { Pass } from '../renderer/core/pass';
import { RenderInstancedQueue } from './render-instanced-queue';
import { BatchingSchemes } from '../renderer/core/pass';
import { InstancedBuffer } from './instanced-buffer';
import { RenderBatchedQueue } from './render-batched-queue';
import { BatchedBuffer } from './batched-buffer';

/**
 * @zh
 * 阴影渲染队列
 */
export class RenderShadowMapBatchedQueue {
    private _subModelsArray: SubModel[] = [];
    private _passArray: Pass[] = [];
    private _shaderArray: Shader[] = [];
    private _shadowMapBuffer: Buffer | null = null;
    private _phaseID = getPhaseID('shadow-caster');
    private _instancedQueue: RenderInstancedQueue = new RenderInstancedQueue();
    private _batchedQueue: RenderBatchedQueue = new RenderBatchedQueue();

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear (shadowMapBuffer: Buffer) {
        this._subModelsArray.length = 0;
        this._shaderArray.length = 0;
        this._passArray.length = 0;
        this._instancedQueue.clear();
        this._batchedQueue.clear();
        this._shadowMapBuffer = shadowMapBuffer;
    }

    public add (renderObj: IRenderObject, subModelIdx: number, passIdx: number) {
        const subModel = renderObj.model.subModels[subModelIdx];
        const pass = subModel.passes[passIdx];

        if (pass.phase === this._phaseID) {
            if (this._shadowMapBuffer) {
                if (pass.batchingScheme === BatchingSchemes.INSTANCING) {       // instancing
                    const buffer = InstancedBuffer.get(pass);
                    buffer.merge(subModel,  renderObj.model.instancedAttributes, passIdx);
                    this._instancedQueue.queue.add(buffer);
                } else if(pass.batchingScheme === BatchingSchemes.VB_MERGING) { // vb-merging
                    const buffer = BatchedBuffer.get(pass);
                    buffer.merge(subModel, passIdx, renderObj);
                    this._batchedQueue.queue.add(buffer);
                } else {                                                        // standard draw
                    const shader = ShaderPool.get(SubModelPool.get(subModel.handle, SubModelView.SHADER_0 + passIdx) as ShaderHandle);
                    this._subModelsArray.push(subModel);
                    this._shaderArray.push(shader);
                    this._passArray.push(pass);
                }
            } else {
                this._subModelsArray.length = 0;
                this._shaderArray.length = 0;
                this._passArray.length = 0;
                this._instancedQueue.clear();
                this._batchedQueue.clear();
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
            const ia = subModel.inputAssembler!;
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
