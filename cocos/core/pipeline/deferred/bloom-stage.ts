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
import { PipelineStateManager } from '..';
import { Material } from '../../assets/material';
import { ClearFlagBit, Color, PipelineState, Rect } from '../../gfx';
import { Pass } from '../../renderer';
import { Camera } from '../../renderer/scene';
import { SetIndex, UNIFORM_BLOOM_TEXTURE_BINDING, UNIFORM_LIGHTING_RESULTMAP_BINDING } from '../define';
import { UIPhase } from '../forward/ui-phase';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { BloomRenderData, DeferredPipeline } from './deferred-pipeline';
import { BLOOM_COMBINEPASS_INDEX, BLOOM_DOWNSAMPLEPASS_INDEX, BLOOM_PREFILTERPASS_INDEX, BLOOM_UPSAMPLEPASS_INDEX, DeferredPipelineSceneData } from './deferred-pipeline-scene-data';
import { DeferredStagePriority } from './enum';
import { MainFlow } from './main-flow';

const colors: Color[] = [new Color(0, 0, 0, 1)];

/**
 * @en The bloom post-process stage
 * @zh Bloom 后处理阶段。
 */
@ccclass('BloomStage')
export class BloomStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'BloomStage',
        priority: DeferredStagePriority.BLOOM,
        tag: 0,
    };


    @type(Material)
    @serializable
    @displayOrder(3)
    private _bloomMaterial: Material | null = null;
    private _renderArea = new Rect();
    private _uiPhase: UIPhase;

    constructor () {
        super();
        this._uiPhase = new UIPhase();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        return true;
    }

    public activate (pipeline: DeferredPipeline, flow: MainFlow) {
        if (DeferredPipeline.bloomSwitch === false) return;

        super.activate(pipeline, flow);
        this._uiPhase.activate(pipeline);
        if (this._bloomMaterial) {
            (pipeline.pipelineSceneData as DeferredPipelineSceneData).deferredBloomMaterial = this._bloomMaterial;
        }
    }

    public destroy () {
    }

    public render (camera: Camera) {
        if (DeferredPipeline.bloomSwitch === false) return;// || camera.name === 'Profiler_Camera') return;

        const pipeline = this._pipeline as DeferredPipeline;
        const bloomData = pipeline.getDeferredRenderData().bloom!;
        const sceneData = pipeline.pipelineSceneData;
        const builtinBloomProcess = (sceneData as DeferredPipelineSceneData).deferredBloomMaterial;

        if (camera.clearFlag & ClearFlagBit.COLOR) {
            colors[0].x = camera.clearColor.x;
            colors[0].y = camera.clearColor.y;
            colors[0].z = camera.clearColor.z;
        }
        colors[0].w = camera.clearColor.w;

        this._prefilterPass(camera, pipeline, bloomData, builtinBloomProcess.passes[BLOOM_PREFILTERPASS_INDEX]);
        this._downsamplePass(camera, pipeline, bloomData, builtinBloomProcess.passes[BLOOM_DOWNSAMPLEPASS_INDEX]);
        this._upsamplePass(camera, pipeline, bloomData, builtinBloomProcess.passes[BLOOM_UPSAMPLEPASS_INDEX]);
        this._combinePass(camera, pipeline, bloomData, builtinBloomProcess.passes[BLOOM_COMBINEPASS_INDEX]);
    }

    private _prefilterPass(camera: Camera, pipeline: DeferredPipeline, bloom: BloomRenderData, pass: Pass) {
        this._renderArea = pipeline.generateRenderArea(camera);
        this._renderArea.width >>= 1;
        this._renderArea.height >>= 1;
        const cmdBuff = pipeline.commandBuffers[0];

        cmdBuff.beginRenderPass(bloom.renderPass!, bloom.prefilterFramebuffer!, this._renderArea, colors, 0, 0);

        let descriptorSet = pipeline.descriptorSet;
        descriptorSet.bindTexture(UNIFORM_LIGHTING_RESULTMAP_BINDING, pipeline.getDeferredRenderData().lightingFrameBuffer?.colorTextures[0]!);
        pipeline.descriptorSet.update();
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);

        const shader = pass.getShaderVariant();
        const inputAssembler = camera.window!.hasOffScreenAttachments ? pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
        let pso: PipelineState | null = null;

        if (pass && shader && inputAssembler) {
            pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloom.renderPass!, inputAssembler);
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        cmdBuff.endRenderPass();
    }

    private _downsamplePass(camera: Camera, pipeline: DeferredPipeline, bloom: BloomRenderData, pass: Pass) {
        const cmdBuff = pipeline.commandBuffers[0];
        const shader = pass.getShaderVariant();
        this._renderArea = pipeline.generateRenderArea(camera);
        this._renderArea.width >>= 1;
        this._renderArea.height >>= 1;

        let textureSize = new Float32Array(2);
        let descriptorSet = pipeline.descriptorSet;

        for (let i = 0; i < bloom.filterPassNum; ++i) {
            textureSize[0] = this._renderArea.width;
            textureSize[1] = this._renderArea.height;
            this._pipeline.pipelineUBO.updateGlobalUBOTextureSize(textureSize);

            this._renderArea.width >>= 1;
            this._renderArea.height >>= 1;
            cmdBuff.beginRenderPass(bloom.renderPass!, bloom.downsampleFramebuffers[i]!,
                this._renderArea, colors, 0, 0);

            if (i === 0) {
                descriptorSet.bindTexture(UNIFORM_BLOOM_TEXTURE_BINDING, bloom.prefiterTex!);
            } else {
                descriptorSet.bindTexture(UNIFORM_BLOOM_TEXTURE_BINDING, bloom.downsampleTexs[i - 1]);
            }
            descriptorSet.update();
            cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);

            const inputAssembler = camera.window!.hasOffScreenAttachments ?
                pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
            let pso: PipelineState | null = null;
            if (pass && shader && inputAssembler) {
                pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloom.renderPass!,
                    inputAssembler);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindInputAssembler(inputAssembler);
                cmdBuff.draw(inputAssembler);
            }

            cmdBuff.endRenderPass();
        }
    }

    private _upsamplePass(camera: Camera, pipeline: DeferredPipeline, bloom: BloomRenderData, pass: Pass) {
        const cmdBuff = pipeline.commandBuffers[0];
        const shader = pass.getShaderVariant();
        this._renderArea = pipeline.generateRenderArea(camera);
        this._renderArea.width >>= bloom.filterPassNum + 1;
        this._renderArea.height >>= bloom.filterPassNum + 1;

        let textureSize = new Float32Array(2);
        let descriptorSet = pipeline.descriptorSet;

        for (let i = 0; i < bloom.filterPassNum; ++i) {
            textureSize[0] = this._renderArea.width;
            textureSize[1] = this._renderArea.height;
            this._pipeline.pipelineUBO.updateGlobalUBOTextureSize(textureSize);

            this._renderArea.width <<= 1;
            this._renderArea.height <<= 1;
            cmdBuff.beginRenderPass(bloom.renderPass!, bloom.upsampleFramebuffers[i], this._renderArea, colors, 0, 0);

            if (i === 0) {
                descriptorSet.bindTexture(UNIFORM_BLOOM_TEXTURE_BINDING, bloom.downsampleTexs[bloom.filterPassNum - 1]);
            } else {
                descriptorSet.bindTexture(UNIFORM_BLOOM_TEXTURE_BINDING, bloom.upsampleTexs[i - 1]);
            }
            descriptorSet.update();
            cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);

            const inputAssembler = camera.window!.hasOffScreenAttachments ?
                pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
            let pso: PipelineState | null = null;
            if (pass && shader && inputAssembler) {
                pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloom.renderPass!,
                    inputAssembler);
                cmdBuff.bindPipelineState(pso);
                cmdBuff.bindInputAssembler(inputAssembler);
                cmdBuff.draw(inputAssembler);
            }

            cmdBuff.endRenderPass();
        }
    }

    private _combinePass(camera: Camera, pipeline: DeferredPipeline, bloom: BloomRenderData, pass: Pass) {
        this._renderArea = pipeline.generateRenderArea(camera);
        const cmdBuff = pipeline.commandBuffers[0];

        cmdBuff.beginRenderPass(bloom.renderPass!, bloom.combineFramebuffer!, this._renderArea, colors, 0, 0);

        let descriptorSet = pipeline.descriptorSet;
        descriptorSet.bindTexture(UNIFORM_LIGHTING_RESULTMAP_BINDING, pipeline.getDeferredRenderData().lightingFrameBuffer?.colorTextures[0]!);
        pipeline.descriptorSet.update();
        descriptorSet.bindTexture(UNIFORM_BLOOM_TEXTURE_BINDING, bloom.upsampleTexs[bloom.filterPassNum - 1]);
        descriptorSet.update();
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, descriptorSet);

        const shader = pass.getShaderVariant();

        const inputAssembler = camera.window!.hasOffScreenAttachments ?
            pipeline.quadIAOffscreen : pipeline.quadIAOnscreen;
        let pso: PipelineState | null = null;
        if (pass && shader && inputAssembler) {
            pso = PipelineStateManager.getOrCreatePipelineState(pipeline.device, pass, shader, bloom.renderPass!,
                inputAssembler);
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        cmdBuff.endRenderPass();
    }
}
