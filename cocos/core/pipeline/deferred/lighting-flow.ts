/**
 * @category pipeline
 */

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_LIGHTING } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { DeferredFlowPriority } from './enum';
import { LightingStage } from './lighting-stage';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderPipeline } from '../render-pipeline';
import { GFXFramebuffer, GFXRenderPass, GFXLoadOp,
    GFXStoreOp, GFXTextureLayout, GFXFormat, GFXTexture,
    GFXTextureType, GFXTextureUsageBit, GFXColorAttachment, GFXDepthStencilAttachment, GFXRenderPassInfo, GFXTextureInfo, GFXFramebufferInfo } from '../../gfx';
import { UNIFORM_LIGHTING_RESULTMAP_BINDING } from '../define';

    /**
 * @en The lighting flow in lighting render pipeline
 * @zh 前向渲染流程。
 */
@ccclass('LightingFlow')
export class LightingFlow extends RenderFlow {

    private _lightingRenderPass: GFXRenderPass|null = null;
    private _lightingRenderTargets: GFXTexture[] = [];
    protected _lightingFrameBuffer: GFXFramebuffer|null = null;
    private _depth: GFXTexture|null = null;
    private _width: number = 0;
    private _height: number = 0;

    get lightingFrameBuffer (): GFXFramebuffer {
        return this._lightingFrameBuffer!;
    }

    /**
     * @en The shared initialization information of lighting render flow
     * @zh 共享的前向渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_LIGHTING,
        priority: DeferredFlowPriority.LIGHTING,
        stages: []
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const lightingStage = new LightingStage();
            lightingStage.initialize(LightingStage.initInfo);
            this._stages.push(lightingStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);

        const device = pipeline.device;
        this._width = device.width;
        this._height = device.height;

        if(!this._lightingRenderPass) {
            const colorAttachment = new GFXColorAttachment();
            colorAttachment.format = GFXFormat.RGBA32F;
            colorAttachment.loadOp = GFXLoadOp.CLEAR; // should clear color attachment
            colorAttachment.storeOp = GFXStoreOp.STORE;
            colorAttachment.sampleCount = 1;
            colorAttachment.beginLayout = GFXTextureLayout.UNDEFINED;
            colorAttachment.endLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const depthStencilAttachment = new GFXDepthStencilAttachment();
            depthStencilAttachment.format = device.depthStencilFormat;
            depthStencilAttachment.depthLoadOp = GFXLoadOp.LOAD;
            depthStencilAttachment.depthStoreOp = GFXStoreOp.DISCARD;
            depthStencilAttachment.stencilLoadOp = GFXLoadOp.DISCARD;
            depthStencilAttachment.stencilStoreOp = GFXStoreOp.DISCARD;
            depthStencilAttachment.sampleCount = 1;
            depthStencilAttachment.beginLayout = GFXTextureLayout.UNDEFINED;
            depthStencilAttachment.endLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

            const renderPassInfo = new GFXRenderPassInfo([colorAttachment], depthStencilAttachment);
            this._lightingRenderPass = device.createRenderPass(renderPassInfo);
        }

        if(this._lightingRenderTargets.length < 1) {
            this._lightingRenderTargets.push(device.createTexture(new GFXTextureInfo(
                GFXTextureType.TEX2D,
                GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                GFXFormat.RGBA32F,
                this._width,
                this._height,
            )));
        }

        if(!this._depth) {
            this._depth = (this.pipeline as DeferredPipeline).gbufferDepth;
        }

        if(!this._lightingFrameBuffer) {
            this._lightingFrameBuffer = device.createFramebuffer(new GFXFramebufferInfo(
                this._lightingRenderPass,
                this._lightingRenderTargets,
                this._depth,
            ));
        }
        pipeline.descriptorSet.bindTexture(UNIFORM_LIGHTING_RESULTMAP_BINDING, this._lightingFrameBuffer!.colorTextures[0]!);
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as DeferredPipeline;
        pipeline.updateUBOs(view);
        super.render(view);
    }

    public destroy () {
        super.destroy();
    }
}
