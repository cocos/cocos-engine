/*
 Copyright (c) Huawei Technologies Co., Ltd. 2020-2021.

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
 * @category pipeline
 */

import { ccclass, displayOrder, serializable, type } from 'cc.decorator';
import { Camera } from '../../renderer/scene';
import { SetIndex } from '../define';
import { RenderFlow, RenderPipeline } from '..';
import { Material } from '../../assets/material';
import { BufferInfo, BufferUsageBit, ClearFlagBit, Color, MemoryUsageBit, PipelineState, Rect } from '../../gfx';
import { PipelineStateManager } from '../pipeline-state-manager';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { CommonStagePriority } from '../enum';
import { gfx } from '../..';
import { MAX_BLOOM_FILTER_PASS_NUM } from '../render-pipeline';
import { BLOOM_COMBINEPASS_INDEX, BLOOM_DOWNSAMPLEPASS_INDEX, BLOOM_PREFILTERPASS_INDEX,
    BLOOM_UPSAMPLEPASS_INDEX,
    DeferredPipelineSceneData } from './deferred-pipeline-scene-data';

const colors: Color[] = [new Color(0, 0, 0, 1)];

/**
 * @en The uniform buffer object for bloom
 * @zh Bloom UBO。
 */
class UBOBloom {
    public static readonly TEXTURE_SIZE_OFFSET = 0;
    public static readonly COUNT = UBOBloom.TEXTURE_SIZE_OFFSET + 4;
    public static readonly SIZE = UBOBloom.COUNT * 4;
}

/**
 * @en The bloom post-process stage
 * @zh Bloom 后处理阶段。
 */
@ccclass('BloomStage')
export class BloomStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'BloomStage',
        priority: CommonStagePriority.BLOOM,
        tag: 0,
    };
    public threshold = 1.0;
    public intensity = 0.8;
    public iterations = 2;

    @type(Material)
    @serializable
    @displayOrder(3)
    private _bloomMaterial: Material | null = null;

    private _renderArea = new Rect();
    private _bloomUBO: gfx.Buffer[] = [];

    constructor () {
        super();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        return true;
    }

    public activate (pipeline: RenderPipeline, flow: RenderFlow) {
        super.activate(pipeline, flow);

        if (this._bloomMaterial) { (pipeline.pipelineSceneData as DeferredPipelineSceneData).bloomMaterial = this._bloomMaterial; }
    }

    public destroy () {
    }

    public render (camera: Camera) {
        const pipeline = this._pipeline;
        if (!camera.window?.swapchain && !pipeline.macros.CC_PIPELINE_TYPE) {
            return;
        }
        if (!pipeline.bloomEnabled || camera.scene!.batches.length > 0) return;

        pipeline.generateBloomRenderData();

        if (this._bloomUBO.length === 0) {
            const passNumber = MAX_BLOOM_FILTER_PASS_NUM * 2 + 2;
            for (let i = 0; i < passNumber; ++i) {
                this._bloomUBO[i] = pipeline.device.createBuffer(new BufferInfo(
                    BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
                    MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                    UBOBloom.SIZE,
                    UBOBloom.SIZE,
                ));
            }
        }

        if (camera.clearFlag & ClearFlagBit.COLOR) {
            colors[0].x = camera.clearColor.x;
            colors[0].y = camera.clearColor.y;
            colors[0].z = camera.clearColor.z;
        }
        colors[0].w = camera.clearColor.w;

        this._prefilterPass(camera, pipeline);
        this._downsamplePass(camera, pipeline);
        this._upsamplePass(camera, pipeline);
        this._combinePass(camera, pipeline);
    }

    private _prefilterPass (camera: Camera, pipeline: RenderPipeline) {
        this._renderArea = pipeline.generateRenderArea(camera);
        this._renderArea.width >>= 1;
        this._renderArea.height >>= 1;
        const cmdBuff = pipeline.commandBuffers[0];

        const sceneData = pipeline.pipelineSceneData as DeferredPipelineSceneData;
        const builtinBloomProcess = sceneData.bloomMaterial;
        const pass = builtinBloomProcess.passes[BLOOM_PREFILTERPASS_INDEX];
        const renderData = pipeline.getPipelineRenderData();
        const bloomData = renderData.bloom!;
        const textureSize = new Float32Array(UBOBloom.COUNT);
        textureSize[UBOBloom.TEXTURE_SIZE_OFFSET + 2] = this.threshold;
        cmdBuff.updateBuffer(this._bloomUBO[0], textureSize);

        cmdBuff.beginRenderPass(bloomData.renderPass, bloomData.prefilterFramebuffer, this._renderArea, colors, 0, 0);
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        pass.descriptorSet.bindBuffer(0, this._bloomUBO[0]);
        pass.descriptorSet.bindTexture(1, renderData.outputRenderTargets[0]);
        pass.descriptorSet.bindSampler(1, bloomData.sampler);
        pass.descriptorSet.update();
        cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);

        const inputAssembler = camera.window.swapchain ? pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
        let pso: PipelineState | null = null;

        const shader = pass.getShaderVariant();
        if (pass != null && shader != null && inputAssembler != null) {
            pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloomData.renderPass, inputAssembler);
        }

        if (pso != null) {
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        cmdBuff.endRenderPass();
    }

    private _downsamplePass (camera: Camera, pipeline: RenderPipeline) {
        this._renderArea = pipeline.generateRenderArea(camera);
        this._renderArea.width >>= 1;
        this._renderArea.height >>= 1;
        const cmdBuff = pipeline.commandBuffers[0];
        const sceneData = pipeline.pipelineSceneData as DeferredPipelineSceneData;
        const builtinBloomProcess = sceneData.bloomMaterial;
        const bloomData = pipeline.getPipelineRenderData().bloom!;
        const textureSize = new Float32Array(UBOBloom.COUNT);

        for (let i = 0; i < this.iterations; ++i) {
            textureSize[UBOBloom.TEXTURE_SIZE_OFFSET + 0] = this._renderArea.width;
            textureSize[UBOBloom.TEXTURE_SIZE_OFFSET + 1] = this._renderArea.height;
            cmdBuff.updateBuffer(this._bloomUBO[i + 1], textureSize);

            this._renderArea.width >>= 1;
            this._renderArea.height >>= 1;
            cmdBuff.beginRenderPass(bloomData.renderPass, bloomData.downsampleFramebuffers[i]!, this._renderArea, colors, 0, 0);
            const pass = builtinBloomProcess.passes[BLOOM_DOWNSAMPLEPASS_INDEX + i];
            const shader = pass.getShaderVariant();
            pass.descriptorSet.bindBuffer(0, this._bloomUBO[i + 1]);

            if (i === 0) {
                pass.descriptorSet.bindTexture(1, bloomData.prefiterTex);
            } else {
                pass.descriptorSet.bindTexture(1, bloomData.downsampleTexs[i - 1]);
            }
            pass.descriptorSet.bindSampler(1, bloomData.sampler);
            pass.descriptorSet.update();
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);

            const inputAssembler = camera.window.swapchain ? pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
            let pso: PipelineState | null = null;

            if (pass != null && shader != null && inputAssembler != null) {
                pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloomData.renderPass, inputAssembler);
            }

            if (pso != null) {
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindInputAssembler(inputAssembler);
                cmdBuff.draw(inputAssembler);
            }

            cmdBuff.endRenderPass();
        }
    }

    private _upsamplePass (camera: Camera, pipeline: RenderPipeline) {
        const bloomData = pipeline.getPipelineRenderData().bloom!;
        this._renderArea = pipeline.generateRenderArea(camera);
        this._renderArea.width >>= this.iterations + 1;
        this._renderArea.height >>= this.iterations + 1;
        const cmdBuff = pipeline.commandBuffers[0];
        const sceneData = pipeline.pipelineSceneData  as DeferredPipelineSceneData;
        const builtinBloomProcess = sceneData.bloomMaterial;
        const textureSize = new Float32Array(UBOBloom.COUNT);

        for (let i = 0; i < this.iterations; ++i) {
            const index = i + MAX_BLOOM_FILTER_PASS_NUM + 1;
            textureSize[UBOBloom.TEXTURE_SIZE_OFFSET + 0] = this._renderArea.width;
            textureSize[UBOBloom.TEXTURE_SIZE_OFFSET + 1] = this._renderArea.height;
            cmdBuff.updateBuffer(this._bloomUBO[index], textureSize);

            this._renderArea.width <<= 1;
            this._renderArea.height <<= 1;
            cmdBuff.beginRenderPass(bloomData.renderPass, bloomData.upsampleFramebuffers[this.iterations - 1 - i], this._renderArea, colors, 0, 0);
            const pass = builtinBloomProcess.passes[BLOOM_UPSAMPLEPASS_INDEX + i];
            const shader = pass.getShaderVariant();
            pass.descriptorSet.bindBuffer(0, this._bloomUBO[index]);

            if (i === 0) {
                pass.descriptorSet.bindTexture(1, bloomData.downsampleTexs[this.iterations - 1]);
            } else {
                pass.descriptorSet.bindTexture(1, bloomData.upsampleTexs[this.iterations - i]);
            }
            pass.descriptorSet.bindSampler(1, bloomData.sampler);
            pass.descriptorSet.update();
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);

            const inputAssembler = camera.window.swapchain ? pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
            let pso: PipelineState | null = null;

            if (pass != null && shader != null && inputAssembler != null) {
                pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloomData.renderPass, inputAssembler);
            }

            if (pso != null) {
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindInputAssembler(inputAssembler);
                cmdBuff.draw(inputAssembler);
            }

            cmdBuff.endRenderPass();
        }
    }

    private _combinePass (camera: Camera, pipeline: RenderPipeline) {
        this._renderArea = pipeline.generateRenderArea(camera);

        const cmdBuff = pipeline.commandBuffers[0];
        const sceneData = pipeline.pipelineSceneData as DeferredPipelineSceneData;
        const builtinBloomProcess = sceneData.bloomMaterial;
        const deferredData = pipeline.getPipelineRenderData();
        const bloomData = deferredData.bloom!;
        const uboIndex = MAX_BLOOM_FILTER_PASS_NUM * 2 + 1;
        const textureSize = new Float32Array(UBOBloom.COUNT);
        textureSize[UBOBloom.TEXTURE_SIZE_OFFSET + 3] = this.intensity;
        cmdBuff.updateBuffer(this._bloomUBO[uboIndex], textureSize);

        cmdBuff.beginRenderPass(bloomData.renderPass, bloomData.combineFramebuffer, this._renderArea, colors, 0, 0);
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);
        const pass = builtinBloomProcess.passes[BLOOM_COMBINEPASS_INDEX];
        pass.descriptorSet.bindBuffer(0, this._bloomUBO[uboIndex]);
        pass.descriptorSet.bindTexture(1, deferredData.outputRenderTargets[0]!);
        pass.descriptorSet.bindTexture(2, bloomData.upsampleTexs[0]);
        pass.descriptorSet.bindSampler(1, bloomData.sampler);
        pass.descriptorSet.bindSampler(2, bloomData.sampler);
        pass.descriptorSet.update();
        cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);

        const inputAssembler = camera.window.swapchain ? pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
        let pso: PipelineState | null = null;

        const shader = pass.getShaderVariant();
        if (pass != null && shader != null && inputAssembler != null) {
            pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloomData.renderPass, inputAssembler);
        }

        if (pso != null) {
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        cmdBuff.endRenderPass();
    }
}
