/**
 * @packageDocumentation
 * @module pipeline.forward
 */

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_SHADOW, UNIFORM_SHADOWMAP } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ForwardFlowPriority } from '../forward/enum';
import { ShadowStage } from './shadow-stage';
import {  GFXLoadOp, GFXStoreOp, GFXTextureLayout, GFXFormat, GFXTexture,
    GFXTextureType, GFXTextureUsageBit, GFXFilter, GFXAddress } from '../../gfx';
import { RenderFlowTag } from '../pipeline-serialization';
import { RenderView, ForwardPipeline, Vec2 } from '../..';
import { ShadowType } from '../../renderer/scene/shadows';
import { genSamplerHash, samplerLib } from '../../renderer';
import { Light } from '../../renderer/scene/light';
import { lightCollecting, shadowCollecting } from '../forward/scene-culling';

const _samplerInfo = [
    GFXFilter.LINEAR,
    GFXFilter.LINEAR,
    GFXFilter.NONE,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
    GFXAddress.CLAMP,
];

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
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);

        // add shadowMap-stages
        const shadowMapStage = new ShadowStage();
        shadowMapStage.initialize(ShadowStage.initInfo);
        this._stages.push(shadowMapStage);

        return true;
    }

    private _initShadowFrameBuffer (pipeline: ForwardPipeline, light: Light) {
        const device = pipeline.device;
        const shadowMapSize = pipeline.shadows.size;

        const shadowRenderPass = device.createRenderPass({
            colorAttachments: [{
                format: GFXFormat.RGBA8,
                loadOp: GFXLoadOp.CLEAR, // should clear color attachment
                storeOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.UNDEFINED,
                endLayout: GFXTextureLayout.PRESENT_SRC,
            }],
            depthStencilAttachment: {
                format: device.depthStencilFormat,
                depthLoadOp: GFXLoadOp.CLEAR,
                depthStoreOp: GFXStoreOp.STORE,
                stencilLoadOp: GFXLoadOp.CLEAR,
                stencilStoreOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.UNDEFINED,
                endLayout: GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
            },
        });

        const shadowRenderTargets: GFXTexture[] = [];
        shadowRenderTargets.push(device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: shadowMapSize.x,
            height: shadowMapSize.y,
        }));

        const depth = device.createTexture({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
            format: device.depthStencilFormat,
            width: shadowMapSize.x,
            height: shadowMapSize.y,
        });

        const shadowFrameBuffer = device.createFramebuffer({
            renderPass: shadowRenderPass,
            colorTextures: shadowRenderTargets,
            depthStencilTexture: depth,
        });

        // Cache frameBuffer
        pipeline.shadowFrameBufferMap.set(light, shadowFrameBuffer);

        const shadowMapSamplerHash = genSamplerHash(_samplerInfo);
        const shadowMapSampler = samplerLib.getSampler(device, shadowMapSamplerHash);
        pipeline.descriptorSet.bindSampler(UNIFORM_SHADOWMAP.binding, shadowMapSampler);
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;
        if (shadowInfo.type !== ShadowType.ShadowMap) { return; }

        const validLights = lightCollecting(view, shadowInfo.mostReceived);
        shadowCollecting(pipeline, view);

        for (let l = 0; l < validLights.length; l++) {
            const light = validLights[l];

            if (shadowInfo.shadowMapDirty) { this.resizeShadowMap(light, shadowInfo.size); }

            if (!pipeline.shadowFrameBufferMap.has(light)) {
                this._initShadowFrameBuffer(pipeline, light);
            }
            const shadowFrameBuffer = pipeline.shadowFrameBufferMap.get(light);

            for (let i = 0; i < this._stages.length; ++i) {
                const shadowStage = this._stages[i] as ShadowStage;
                shadowStage.setUsage(light, shadowFrameBuffer!);
                shadowStage.render(view);
            }
        }
    }

    private resizeShadowMap (light:Light, size: Vec2) {
        const width = size.x;
        const height = size.y;
        const pipeline = this._pipeline as ForwardPipeline;
        if (pipeline.shadowFrameBufferMap.has(light)) {
            const frameBuffer = pipeline.shadowFrameBufferMap.get(light);

            if(!frameBuffer) { return; }

            const renderTargets = frameBuffer.colorTextures;
            if (renderTargets && renderTargets.length > 0) {
                for (let j = 0; j < renderTargets.length; j++) {
                    const renderTarget = renderTargets[j];
                    if (renderTarget) { renderTarget.resize(width, height); }
                }
            }

            const depth = frameBuffer.depthStencilTexture;
            if (depth) {
                depth.resize(width, height);
            }

            const shadowRenderPass = frameBuffer.renderPass;
            frameBuffer.destroy();
            frameBuffer.initialize({
                renderPass: shadowRenderPass,
                colorTextures: renderTargets,
                depthStencilTexture: depth,
            });
        }
    }
}