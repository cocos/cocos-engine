/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../gfx/command-buffer';
import { SubModel } from '../renderer/scene/submodel';
import { IRenderObject, SetIndex } from './define';
import { GFXDevice, GFXRenderPass, GFXBuffer, GFXShader } from '../gfx';
import { getPhaseID } from './pass-phase';
import { PipelineStateManager } from './pipeline-state-manager';
import { DSPool, ShaderPool, PassHandle, PassPool, PassView, SubModelPool, SubModelView, ShaderHandle } from '../renderer/core/memory-pools';
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
    private _passArray: PassHandle[] = [];
    private _shaderArray: GFXShader[] = [];
    private _shadowMapBuffer: GFXBuffer | null = null;
    private _phaseID = getPhaseID('shadow-add');
    private _instancedQueue: RenderInstancedQueue = new RenderInstancedQueue();
    private _batchedQueue: RenderBatchedQueue = new RenderBatchedQueue();

    /**
     * @zh
     * clear ligth-Batched-Queue
     */
    public clear (shadowMapBuffer: GFXBuffer) {
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
                    this._passArray.push(pass.handle);
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
    public recordCommandBuffer (device: GFXDevice, renderPass: GFXRenderPass, cmdBuff: GFXCommandBuffer) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (let i = 0; i < this._subModelsArray.length; ++i) {
            const subModel = this._subModelsArray[i];
            const shader = this._shaderArray[i];
            const hPass = this._passArray[i];
            const ia = subModel.inputAssembler!;
            const pso = PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, ia);
            const descriptorSet = DSPool.get(PassPool.get(hPass, PassView.DESCRIPTOR_SET));

            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, subModel.descriptorSet);
            cmdBuff.bindInputAssembler(ia);
            cmdBuff.draw(ia);
        }
    }
}
