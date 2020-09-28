/**
 * @category pipeline.deferred
 */

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_GBUFFER, UNIFORM_SHADOWMAP, UNIFORM_ALBEDOMAP, UNIFORM_NORMALMAP } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { DeferredFlowPriority } from './enum';
import { GbufferStage } from './gbuffer-stage';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderPipeline } from '../render-pipeline';
import { GFXFramebuffer, GFXRenderPass, GFXLoadOp,
    GFXStoreOp, GFXTextureLayout, GFXFormat, GFXTexture,
    GFXTextureType, GFXTextureUsageBit, GFXColorAttachment, GFXDepthStencilAttachment } from '../../gfx';
/**
 * @en The gbuffer flow in deferred render pipeline
 * @zh 前向渲染流程。
 */
@ccclass('GbufferFlow')
export class GbufferFlow extends RenderFlow {

    /**
     * @en The shared initialization information of gbuffer render flow
     * @zh 共享的前向渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_GBUFFER,
        priority: DeferredFlowPriority.GBUFFER,
        stages: []
    };

    private _gbufferRenderPass: GFXRenderPass|null = null;
    private _gbufferRenderTargets: GFXTexture[] = [];
    private _gbufferFrameBuffer: GFXFramebuffer|null = null;
    private _depth: GFXTexture|null = null;
    private _width: number = 0;
    private _height: number = 0;

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const gbufferStage = new GbufferStage();
            gbufferStage.initialize(GbufferStage.initInfo);
            this._stages.push(gbufferStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);

        const device = pipeline.device;
        this._width = device.width;
        this._height = device.height;

        if(!this._gbufferRenderPass) {

            const colorAttachment0 = new GFXColorAttachment();
            colorAttachment0.format = GFXFormat.RGBA8;
            colorAttachment0.loadOp = GFXLoadOp.CLEAR; // should clear color attachment
            colorAttachment0.storeOp = GFXStoreOp.STORE;
            colorAttachment0.sampleCount = 1;
            colorAttachment0.beginLayout = GFXTextureLayout.UNDEFINED;
            colorAttachment0.endLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const colorAttachment1 = new GFXColorAttachment();
            colorAttachment1.format = GFXFormat.RGBA8;
            colorAttachment1.loadOp = GFXLoadOp.CLEAR; // should clear color attachment
            colorAttachment1.storeOp = GFXStoreOp.STORE;
            colorAttachment1.sampleCount = 1;
            colorAttachment1.beginLayout = GFXTextureLayout.UNDEFINED;
            colorAttachment1.endLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const colorAttachment2 = new GFXColorAttachment();
            colorAttachment2.format = GFXFormat.RGBA8;
            colorAttachment2.loadOp = GFXLoadOp.CLEAR; // should clear color attachment
            colorAttachment2.storeOp = GFXStoreOp.STORE;
            colorAttachment2.sampleCount = 1;
            colorAttachment2.beginLayout = GFXTextureLayout.UNDEFINED;
            colorAttachment2.endLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const colorAttachment3 = new GFXColorAttachment();
            colorAttachment3.format = GFXFormat.RGBA8;
            colorAttachment3.loadOp = GFXLoadOp.CLEAR; // should clear color attachment
            colorAttachment3.storeOp = GFXStoreOp.STORE;
            colorAttachment3.sampleCount = 1;
            colorAttachment3.beginLayout = GFXTextureLayout.UNDEFINED;
            colorAttachment3.endLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;

            const depthStencilAttachment = new GFXDepthStencilAttachment();
            depthStencilAttachment.format = device.depthStencilFormat;
            depthStencilAttachment.depthLoadOp = GFXLoadOp.CLEAR;
            depthStencilAttachment.depthStoreOp = GFXStoreOp.STORE;
            depthStencilAttachment.stencilLoadOp = GFXLoadOp.CLEAR;
            depthStencilAttachment.stencilStoreOp = GFXStoreOp.STORE;
            depthStencilAttachment.sampleCount = 1;
            depthStencilAttachment.beginLayout = GFXTextureLayout.UNDEFINED;
            depthStencilAttachment.endLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;

            this._gbufferRenderPass = device.createRenderPass({
                colorAttachments: [colorAttachment0, colorAttachment1, colorAttachment2, colorAttachment3],
                depthStencilAttachment,
            });
        }

        if(this._gbufferRenderTargets.length < 1) {
            this._gbufferRenderTargets.push(device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: GFXFormat.RGBA8,
                width: this._width,
                height: this._height,
            }));
            this._gbufferRenderTargets.push(device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: GFXFormat.RGBA8,
                width: this._width,
                height: this._height,
            }));
            this._gbufferRenderTargets.push(device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: GFXFormat.RGBA8,
                width: this._width,
                height: this._height,
            }));
            this._gbufferRenderTargets.push(device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: GFXFormat.RGBA8,
                width: this._width,
                height: this._height,
            }));
        }

        if(!this._depth) {
            this._depth = device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
                format: device.depthStencilFormat,
                width: this._width,
                height: this._height,
            });
        }

        if(!this._gbufferFrameBuffer) {
            this._gbufferFrameBuffer = device.createFramebuffer({
                renderPass: this._gbufferRenderPass,
                colorTextures: this._gbufferRenderTargets,
                depthStencilTexture: this._depth,
            });
        }

        for (let i = 0; i < this._stages.length; ++i) {
            (this._stages[i] as GbufferStage).setGbufferFrameBuffer(this._gbufferFrameBuffer);
        }
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as DeferredPipeline;
        pipeline.updateUBOs(view);
        super.render(view);
        // pipeline.descriptorSet.bindTexture(UNIFORM_ALBEDOMAP.binding, this._gbufferFrameBuffer!.colorTextures[0]!);
        // pipeline.descriptorSet.bindTexture(UNIFORM_NORMALMAP.binding, this._gbufferFrameBuffer!.colorTextures[1]!);
    }

    public destroy () {
        super.destroy();
    }
}
