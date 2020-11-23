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
import { Framebuffer, RenderPass, LoadOp,
    StoreOp, TextureLayout, Format, Texture,
    TextureType, TextureUsageBit, ColorAttachment, DepthStencilAttachment, RenderPassInfo, TextureInfo, FramebufferInfo } from '../../gfx';
import { UNIFORM_LIGHTING_RESULTMAP_BINDING } from '../define';
import { genSamplerHash, samplerLib } from '../../renderer/core/sampler-lib';
import { Address, Filter} from '../../gfx/define';

/**
 * @en The lighting flow in lighting render pipeline
 * @zh 前向渲染流程。
 */
@ccclass('LightingFlow')
export class LightingFlow extends RenderFlow {

    private _lightingRenderPass: RenderPass|null = null;
    private _lightingRenderTargets: Texture[] = [];
    protected _lightingFrameBuffer: Framebuffer|null = null;
    private _depth: Texture|null = null;
    private _width: number = 0;
    private _height: number = 0;

    /**
     * @en The shared initialization information of lighting render flow
     * @zh 共享的前向渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_LIGHTING,
        priority: DeferredFlowPriority.LIGHTING,
        stages: []
    };

    get lightingFrameBuffer (): Framebuffer {
        return this._lightingFrameBuffer!;
    }

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
            const colorAttachment = new ColorAttachment();
            colorAttachment.format = Format.RGBA32F;
            colorAttachment.loadOp = LoadOp.CLEAR; // should clear color attachment
            colorAttachment.storeOp = StoreOp.STORE;
            colorAttachment.sampleCount = 1;
            colorAttachment.beginLayout = TextureLayout.UNDEFINED;
            colorAttachment.endLayout = TextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const depthStencilAttachment = new DepthStencilAttachment();
            depthStencilAttachment.format = device.depthStencilFormat;
            depthStencilAttachment.depthLoadOp = LoadOp.LOAD;
            depthStencilAttachment.depthStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.stencilLoadOp = LoadOp.DISCARD;
            depthStencilAttachment.stencilStoreOp = StoreOp.DISCARD;
            depthStencilAttachment.sampleCount = 1;
            depthStencilAttachment.beginLayout = TextureLayout.UNDEFINED;
            depthStencilAttachment.endLayout = TextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

            const renderPassInfo = new RenderPassInfo([colorAttachment], depthStencilAttachment);
            this._lightingRenderPass = device.createRenderPass(renderPassInfo);
        }

        if(this._lightingRenderTargets.length < 1) {
            this._lightingRenderTargets.push(device.createTexture(new TextureInfo(
                TextureType.TEX2D,
                TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                Format.RGBA32F,
                this._width,
                this._height,
            )));
        }

        if(!this._depth) {
            this._depth = (this.pipeline as DeferredPipeline).gbufferDepth;
        }

        if(!this._lightingFrameBuffer) {
            this._lightingFrameBuffer = device.createFramebuffer(new FramebufferInfo(
                this._lightingRenderPass,
                this._lightingRenderTargets,
                this._depth,
            ));
        }

        pipeline.descriptorSet.bindTexture(UNIFORM_LIGHTING_RESULTMAP_BINDING, this._lightingFrameBuffer!.colorTextures[0]!);

        const samplerHash = genSamplerHash([
            Filter.LINEAR,
            Filter.LINEAR,
            Filter.NONE,
            Address.CLAMP,
            Address.CLAMP,
            Address.CLAMP,
        ]);
        const sampler = samplerLib.getSampler(device, samplerHash);
        pipeline.descriptorSet.bindSampler(UNIFORM_LIGHTING_RESULTMAP_BINDING, sampler);
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
