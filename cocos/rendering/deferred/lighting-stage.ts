/*
 Copyright (c) Huawei Technologies Co., Ltd. 2020-2021.
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

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

/**
 * @category pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { Camera } from '../../render-scene/scene';
import { UBODeferredLight, SetIndex, UBOForwardLight, UBOLocal } from '../define';
import { getPhaseID } from '../pass-phase';
import { Color, Rect, Buffer, BufferUsageBit, MemoryUsageBit, BufferInfo, BufferViewInfo, DescriptorSet,
    DescriptorSetLayout, DescriptorSetInfo, PipelineState, ClearFlagBit } from '../../gfx';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { DeferredStagePriority } from '../enum';
import { MainFlow } from './main-flow';
import { DeferredPipeline } from './deferred-pipeline';
import { PlanarShadowQueue } from '../planar-shadow-queue';
import { Material } from '../../asset/assets/material';
import { PipelineStateManager } from '../pipeline-state-manager';
import { intersect, Sphere } from '../../core/geometry';
import { Vec3, Vec4 } from '../../core/math';
import { DeferredPipelineSceneData } from './deferred-pipeline-scene-data';
import { renderQueueClearFunc, RenderQueue, convertRenderQueue, renderQueueSortFunc } from '../render-queue';
import { RenderQueueDesc } from '../pipeline-serialization';
import { UIPhase } from '../ui-phase';
import { Pass } from '../../render-scene/core/pass';

const colors: Color[] = [new Color(0, 0, 0, 1)];

/**
 * @en The lighting render stage
 * @zh 前向渲染阶段。
 */
@ccclass('LightingStage')
export class LightingStage extends RenderStage {
    private _deferredLitsBufs: Buffer = null!;
    private _maxDeferredLights = UBODeferredLight.LIGHTS_PER_PASS;
    private _lightBufferData!: Float32Array;
    private _lightMeterScale = 10000.0;
    private _descriptorSet: DescriptorSet = null!;
    private _descriptorSetLayout!: DescriptorSetLayout;
    private _renderArea = new Rect();
    private declare _planarQueue: PlanarShadowQueue;
    private _uiPhase: UIPhase;

    @type(Material)
    @serializable
    @displayOrder(3)
    private _deferredMaterial: Material | null = null;

    @type([RenderQueueDesc])
    @serializable
    @displayOrder(2)
    private renderQueues: RenderQueueDesc[] = [];
    private _phaseID = getPhaseID('default');
    private _renderQueues: RenderQueue[] = [];

    public static initInfo: IRenderStageInfo = {
        name: 'LightingStage',
        priority: DeferredStagePriority.LIGHTING,
        tag: 0,
    };

    constructor () {
        super();
        this._uiPhase = new UIPhase();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        return true;
    }
    public gatherLights (camera: Camera) {
        const pipeline = this._pipeline as DeferredPipeline;
        const cmdBuff = pipeline.commandBuffers[0];

        const sphereLights = camera.scene!.sphereLights;
        const spotLights = camera.scene!.spotLights;
        const _sphere = Sphere.create(0, 0, 0, 1);
        const _vec4Array = new Float32Array(4);
        const exposure = camera.exposure;

        let idx = 0;
        const elementLen = Vec4.length; // sizeof(vec4) / sizeof(float32)
        const fieldLen = elementLen * this._maxDeferredLights;

        for (let i = 0; i < sphereLights.length && idx < this._maxDeferredLights; i++, ++idx) {
            const light = sphereLights[i];
            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                // cc_lightPos
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 0;
                this._lightBufferData.set(_vec4Array, idx * elementLen);

                // cc_lightColor
                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }

                if (pipeline.pipelineSceneData.isHDR) {
                    _vec4Array[3] = light.luminance * exposure * this._lightMeterScale;
                } else {
                    _vec4Array[3] = light.luminance;
                }

                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 1);

                // cc_lightSizeRangeAngle
                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = 0.0;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 2);
            }
        }

        for (let i = 0; i < spotLights.length && idx < this._maxDeferredLights; i++, ++idx) {
            const light = spotLights[i];
            Sphere.set(_sphere, light.position.x, light.position.y, light.position.z, light.range);
            if (intersect.sphereFrustum(_sphere, camera.frustum)) {
                // cc_lightPos
                Vec3.toArray(_vec4Array, light.position);
                _vec4Array[3] = 1;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 0);

                // cc_lightColor
                Vec3.toArray(_vec4Array, light.color);
                if (light.useColorTemperature) {
                    const tempRGB = light.colorTemperatureRGB;
                    _vec4Array[0] *= tempRGB.x;
                    _vec4Array[1] *= tempRGB.y;
                    _vec4Array[2] *= tempRGB.z;
                }
                if (pipeline.pipelineSceneData.isHDR) {
                    _vec4Array[3] = light.luminance * exposure * this._lightMeterScale;
                } else {
                    _vec4Array[3] = light.luminance;
                }
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 1);

                // cc_lightSizeRangeAngle
                _vec4Array[0] = light.size;
                _vec4Array[1] = light.range;
                _vec4Array[2] = light.spotAngle;
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 2);

                // cc_lightDir
                Vec3.toArray(_vec4Array, light.direction);
                this._lightBufferData.set(_vec4Array, idx * elementLen + fieldLen * 3);
            }
        }

        // the count of lights is set to cc_lightDir[0].w
        const offset = fieldLen * 3 + 3;
        this._lightBufferData.set([idx], offset);

        cmdBuff.updateBuffer(this._deferredLitsBufs, this._lightBufferData);
    }

    protected _createStageDescriptor (pass: Pass) {
        const device = this._pipeline.device;
        let totalSize = Float32Array.BYTES_PER_ELEMENT * 4 * 4 * this._maxDeferredLights;
        totalSize = Math.ceil(totalSize / device.capabilities.uboOffsetAlignment) * device.capabilities.uboOffsetAlignment;

        this._deferredLitsBufs = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
            totalSize,
            device.capabilities.uboOffsetAlignment,
        ));

        const deferredLitsBufView = device.createBuffer(new BufferViewInfo(this._deferredLitsBufs, 0, totalSize));
        this._lightBufferData = new Float32Array(totalSize / Float32Array.BYTES_PER_ELEMENT);

        this._descriptorSet = device.createDescriptorSet(new DescriptorSetInfo(pass.localSetLayout));
        this._descriptorSet.bindBuffer(UBOForwardLight.BINDING, deferredLitsBufView);

        const _localUBO = device.createBuffer(new BufferInfo(
            BufferUsageBit.UNIFORM | BufferUsageBit.TRANSFER_DST,
            MemoryUsageBit.DEVICE,
            UBOLocal.SIZE,
            UBOLocal.SIZE,
        ));
        this._descriptorSet.bindBuffer(UBOLocal.BINDING, _localUBO);
    }

    public activate (pipeline: DeferredPipeline, flow: MainFlow) {
        super.activate(pipeline, flow);
        this._uiPhase.activate(pipeline);

        // activate queue
        for (let i = 0; i < this.renderQueues.length; i++) {
            this._renderQueues[i] = convertRenderQueue(this.renderQueues[i]);
        }

        this._planarQueue = new PlanarShadowQueue(this._pipeline as DeferredPipeline);

        if (this._deferredMaterial) { (pipeline.pipelineSceneData as DeferredPipelineSceneData).deferredLightingMaterial = this._deferredMaterial; }
    }

    public destroy () {
        this._deferredLitsBufs?.destroy();
        this._deferredLitsBufs = null!;
        this._descriptorSet = null!;
    }
    public render (camera: Camera) {
        const pipeline = this._pipeline as DeferredPipeline;
        const device = pipeline.device;

        const cmdBuff = pipeline.commandBuffers[0];
        const sceneData = pipeline.pipelineSceneData;
        const renderObjects = sceneData.renderObjects;

        this._planarQueue.gatherShadowPasses(camera, cmdBuff);

        pipeline.generateRenderArea(camera, this._renderArea);
        // Lighting
        const deferredData = pipeline.getPipelineRenderData();
        const lightingMat = (sceneData as DeferredPipelineSceneData).deferredLightingMaterial;
        const pass = lightingMat.passes[0];
        const shader = pass.getShaderVariant();

        for (let i = 0; i < 3; ++i) {
            pass.descriptorSet.bindTexture(i, deferredData.gbufferRenderTargets[i]);
            pass.descriptorSet.bindSampler(i, deferredData.sampler);
        }
        pass.descriptorSet.bindTexture(3, deferredData.outputDepth);
        pass.descriptorSet.bindSampler(3, deferredData.sampler);
        pass.descriptorSet.update();
        if (!this._descriptorSet) {
            this._createStageDescriptor(pass);
        }
        // light信息
        this.gatherLights(camera);

        if (camera.clearFlag & ClearFlagBit.COLOR) {
            colors[0].x = camera.clearColor.x;
            colors[0].y = camera.clearColor.y;
            colors[0].z = camera.clearColor.z;
        }

        colors[0].w = 0;

        const framebuffer = deferredData.outputFrameBuffer;
        const renderPass = framebuffer.renderPass;

        pipeline.pipelineUBO.updateShadowUBO(camera);

        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea,
            colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.setScissor(pipeline.generateScissor(camera));
        cmdBuff.setViewport(pipeline.generateViewport(camera));
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        const inputAssembler = pipeline.quadIAOffscreen;
        let pso: PipelineState|null = null;
        if (pass != null && shader != null && inputAssembler != null) {
            pso = PipelineStateManager.getOrCreatePipelineState(device, pass, shader, renderPass, inputAssembler);
        }

        if (pso != null) {
            this._descriptorSet.update();
            cmdBuff.bindPipelineState(pso);
            cmdBuff.bindDescriptorSet(SetIndex.MATERIAL, pass.descriptorSet);
            cmdBuff.bindDescriptorSet(SetIndex.LOCAL, this._descriptorSet);
            cmdBuff.bindInputAssembler(inputAssembler);
            cmdBuff.draw(inputAssembler);
        }

        // Transparent
        this._renderQueues.forEach(renderQueueClearFunc);

        let m = 0; let p = 0; let k = 0;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            const subModels = ro.model.subModels;
            for (m = 0; m < subModels.length; ++m) {
                const subModel = subModels[m];
                const passes = subModel.passes;
                for (p = 0; p < passes.length; ++p) {
                    const pass = passes[p];
                    if (pass.phase !== this._phaseID) continue;
                    for (k = 0; k < this._renderQueues.length; k++) {
                        this._renderQueues[k].insertRenderPass(ro, m, p);
                    }
                }
            }
        }
        if (renderObjects.length > 0) {
            this._renderQueues.forEach(renderQueueSortFunc);
            for (let i = 0; i < this._renderQueues.length; i++) {
                this._renderQueues[i].recordCommandBuffer(device, renderPass, cmdBuff);
            }

            // planarQueue
            this._planarQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        }
        camera.geometryRenderer?.render(renderPass, cmdBuff, pipeline.pipelineSceneData);
        this._uiPhase.render(camera, renderPass);
        cmdBuff.endRenderPass();
    }
}
