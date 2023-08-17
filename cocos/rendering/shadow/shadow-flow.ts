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

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_SHADOW, supportsR32FloatTexture, UBOCamera, UBOCSM, UBOGlobal, UBOShadow } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ForwardFlowPriority } from '../enum';
import { ShadowStage } from './shadow-stage';
import { RenderPass, LoadOp, StoreOp,
    Format, Texture, TextureType, TextureUsageBit, ColorAttachment,
    DepthStencilAttachment, RenderPassInfo, TextureInfo, FramebufferInfo, Swapchain,
    Framebuffer, DescriptorSet, API } from '../../gfx';
import { RenderFlowTag } from '../pipeline-serialization';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { RenderPipeline } from '..';
import { PCFType, ShadowType } from '../../render-scene/scene/shadows';
import { Light, LightType } from '../../render-scene/scene/light';
import { Camera } from '../../render-scene/scene';
import { SpotLight } from '../../render-scene/scene/spot-light';

const _validLights: Light[] = [];

/**
 * @en Shadow map render flow
 * @zh 阴影贴图绘制流程
 */
@ccclass('ShadowFlow')
export class ShadowFlow extends RenderFlow {
    /**
     * @en A common initialization info for shadow map render flow
     * @zh 一个通用的 ShadowFlow 的初始化信息对象
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_SHADOW,
        priority: ForwardFlowPriority.SHADOW,
        tag: RenderFlowTag.SCENE,
        stages: [],
    };

    private _shadowRenderPass: RenderPass|null = null;

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            // add shadowMap-stages
            const shadowMapStage = new ShadowStage();
            shadowMapStage.initialize(ShadowStage.initInfo);
            this._stages.push(shadowMapStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline): void {
        super.activate(pipeline);

        // 0: SHADOWMAP_FLOAT, 1: SHADOWMAP_RGBE.
        const isRGBE = supportsR32FloatTexture(pipeline.device) ? 0 : 1;
        pipeline.macros.CC_SHADOWMAP_FORMAT = isRGBE;

        // 0: SHADOWMAP_LINER_DEPTH_OFF, 1: SHADOWMAP_LINER_DEPTH_ON.
        const isLinear = pipeline.device.gfxAPI === API.WEBGL ? 1 : 0;
        pipeline.macros.CC_SHADOWMAP_USE_LINEAR_DEPTH = isLinear;

        // 0: UNIFORM_VECTORS_LESS_EQUAL_64, 1: UNIFORM_VECTORS_GREATER_EQUAL_125.
        pipeline.pipelineSceneData.csmSupported = pipeline.device.capabilities.maxFragmentUniformVectors
            >= (UBOGlobal.COUNT + UBOCamera.COUNT + UBOShadow.COUNT + UBOCSM.COUNT) / 4;
        pipeline.macros.CC_SUPPORT_CASCADED_SHADOW_MAP = pipeline.pipelineSceneData.csmSupported;

        // 0: CC_SHADOW_NONE, 1: CC_SHADOW_PLANAR, 2: CC_SHADOW_MAP
        pipeline.macros.CC_SHADOW_TYPE = 0;

        // 0: PCFType.HARD, 1: PCFType.SOFT, 2: PCFType.SOFT_2X, 3: PCFType.SOFT_4X
        pipeline.macros.CC_DIR_SHADOW_PCF_TYPE = PCFType.HARD;

        // 0: CC_DIR_LIGHT_SHADOW_NONE, 1: CC_DIR_LIGHT_SHADOW_UNIFORM, 2: CC_DIR_LIGHT_SHADOW_CASCADED, 3: CC_DIR_LIGHT_SHADOW_VARIANCE
        pipeline.macros.CC_DIR_LIGHT_SHADOW_TYPE = 0;

        // 0: CC_CASCADED_LAYERS_TRANSITION_OFF, 1: CC_CASCADED_LAYERS_TRANSITION_ON
        pipeline.macros.CC_CASCADED_LAYERS_TRANSITION = 0;

        pipeline.onGlobalPipelineStateChanged();
    }

    public render (camera: Camera): void {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.pipelineSceneData.shadows;
        const csmLayers = pipeline.pipelineSceneData.csmLayers;
        const shadowFrameBufferMap = pipeline.pipelineSceneData.shadowFrameBufferMap;
        const castShadowObjects = csmLayers.castShadowObjects;
        const validPunctualLights = this._pipeline.pipelineSceneData.validPunctualLights;
        if (!shadowInfo.enabled || shadowInfo.type !== ShadowType.ShadowMap) { return; }

        let n = 0;
        let m = 0;
        for (;n < shadowInfo.maxReceived && m < validPunctualLights.length;) {
            const light = validPunctualLights[m];
            if (light.type === LightType.SPOT) {
                const spotLight = light as SpotLight;
                if (spotLight.shadowEnabled) {
                    _validLights.push(light);
                    n++;
                }
            }
            m++;
        }

        if (castShadowObjects.length === 0) {
            this.clearShadowMap(_validLights, camera);
            return;
        }

        if (shadowInfo.shadowMapDirty) { this.resizeShadowMap(); }

        const { mainLight } = camera.scene!;
        if (mainLight && mainLight.shadowEnabled) {
            const globalDS = pipeline.descriptorSet;
            if (!shadowFrameBufferMap.has(mainLight)) {
                this._initShadowFrameBuffer(pipeline, mainLight, camera.window.swapchain);
            }

            const shadowFrameBuffer = shadowFrameBufferMap.get(mainLight);
            if (mainLight.shadowFixedArea) {
                this._renderStage(camera, mainLight, shadowFrameBuffer!, globalDS);
            } else {
                const csmLevel = pipeline.pipelineSceneData.csmSupported ? mainLight.csmLevel : 1;
                for (let i = 0; i < csmLevel; i++) {
                    this._renderStage(camera, mainLight, shadowFrameBuffer!, globalDS, i);
                }
            }
        }

        for (let l = 0; l < _validLights.length; l++) {
            const light = _validLights[l];
            const ds = pipeline.globalDSManager.getOrCreateDescriptorSet(light)!;

            if (!shadowFrameBufferMap.has(light)) {
                this._initShadowFrameBuffer(pipeline, light, camera.window.swapchain);
            }

            const shadowFrameBuffer = shadowFrameBufferMap.get(light);
            this._renderStage(camera, light, shadowFrameBuffer!, ds);
        }

        _validLights.length = 0;
    }

    public destroy (): void {
        super.destroy();
        if (this._pipeline) {
            const shadowFrameBufferMap = this._pipeline.pipelineSceneData.shadowFrameBufferMap;
            const shadowFrameBuffers = Array.from(shadowFrameBufferMap.values());
            for (let i = 0; i < shadowFrameBuffers.length; i++) {
                const frameBuffer = shadowFrameBuffers[i];

                if (!frameBuffer) { continue; }
                const renderTargets = frameBuffer.colorTextures;
                for (let j = 0; j < renderTargets.length; j++) {
                    const renderTarget = renderTargets[j];
                    if (renderTarget) { renderTarget.destroy(); }
                }
                renderTargets.length = 0;

                const depth = frameBuffer.depthStencilTexture;
                if (depth) { depth.destroy(); }

                frameBuffer.destroy();
            }

            shadowFrameBufferMap.clear();
        }

        if (this._shadowRenderPass) { this._shadowRenderPass.destroy(); }
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _initShadowFrameBuffer  (pipeline: RenderPipeline, light: Light, swapchain: Swapchain): void {
        const { device } = pipeline;
        const shadows = pipeline.pipelineSceneData.shadows;
        const shadowMapSize = shadows.size;
        const shadowFrameBufferMap = pipeline.pipelineSceneData.shadowFrameBufferMap;
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;

        if (!this._shadowRenderPass) {
            const colorAttachment = new ColorAttachment();
            colorAttachment.format = format;
            colorAttachment.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment.storeOp = StoreOp.STORE;
            colorAttachment.sampleCount = 1;

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = Format.DEPTH_STENCIL;
            depthStencilAttachment.depthLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.stencilLoadOp = LoadOp.CLEAR;
            depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.sampleCount = 1;

            const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
            this._shadowRenderPass = device.createRenderPass(renderPassInfo);
        }

        const shadowRenderTargets: Texture[] = [];
        shadowRenderTargets.push(device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
            format,
            shadowMapSize.x,
            shadowMapSize.y,
        )));

        const depth = device.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            Format.DEPTH_STENCIL,
            shadowMapSize.x,
            shadowMapSize.y,
        ));

        const shadowFrameBuffer = device.createFramebuffer(new FramebufferInfo(
            this._shadowRenderPass,
            shadowRenderTargets,
            depth,
        ));

        // Cache frameBuffer
        shadowFrameBufferMap.set(light, shadowFrameBuffer);
    }

    private _renderStage (camera: Camera, light: Light, shadowFrameBuffer: Framebuffer, globalDS: DescriptorSet, level = 0): void {
        for (let i = 0; i < this._stages.length; i++) {
            const shadowStage = this._stages[i] as ShadowStage;
            shadowStage.setUsage(globalDS, light, shadowFrameBuffer, level);
            shadowStage.render(camera);
        }
    }

    private clearShadowMap (validLights: Light[], camera: Camera): void {
        const pipeline = this._pipeline;
        const scene = pipeline.pipelineSceneData;

        const { mainLight } = camera.scene!;
        if (mainLight) {
            const globalDS = this._pipeline.descriptorSet;
            if (!scene.shadowFrameBufferMap.has(mainLight)) {
                this._initShadowFrameBuffer(this._pipeline, mainLight, camera.window.swapchain);
            }

            const shadowFrameBuffer = scene.shadowFrameBufferMap.get(mainLight);
            for (let i = 0; i < this._stages.length; i++) {
                const shadowStage = this._stages[i] as ShadowStage;
                shadowStage.setUsage(globalDS, mainLight, shadowFrameBuffer!);
                shadowStage.clearFramebuffer(camera);
            }
        }

        for (let l = 0; l < validLights.length; l++) {
            const light = validLights[l];
            const ds = pipeline.globalDSManager.getOrCreateDescriptorSet(light)!;
            if (!scene.shadowFrameBufferMap.has(light)) {
                this._initShadowFrameBuffer(this._pipeline, light, camera.window.swapchain);
            }

            const shadowFrameBuffer = scene.shadowFrameBufferMap.get(light);
            for (let i = 0; i < this._stages.length; i++) {
                const shadowStage = this._stages[i] as ShadowStage;
                shadowStage.setUsage(ds, light, shadowFrameBuffer!);
                shadowStage.clearFramebuffer(camera);
            }
        }
    }

    private resizeShadowMap (): void {
        const shadows = this._pipeline.pipelineSceneData.shadows;
        const shadowMapSize = shadows.size;
        const pipeline = this._pipeline;
        const device = pipeline.device;
        const shadowFrameBufferMap = pipeline.pipelineSceneData.shadowFrameBufferMap;
        const format = supportsR32FloatTexture(device) ? Format.R32F : Format.RGBA8;

        for (const key of shadowFrameBufferMap.keys()) {
            const frameBuffer = shadowFrameBufferMap.get(key);
            if (!frameBuffer) {
                continue;
            }

            const renderTargets: Texture[] = [];
            renderTargets.push(pipeline.device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                format,
                shadowMapSize.x,
                shadowMapSize.y,
            )));

            const depth = frameBuffer.depthStencilTexture;
            if (depth) { depth.resize(shadowMapSize.x, shadowMapSize.y); }

            const shadowRenderPass = frameBuffer.renderPass;
            frameBuffer.destroy();
            const newFrameBuffer = device.createFramebuffer(new FramebufferInfo(
                shadowRenderPass,
                renderTargets,
                depth,
            ));
            shadowFrameBufferMap.set(key, newFrameBuffer);
        }

        shadows.shadowMapDirty = false;
    }
}
