/**
 * @category pipeline.forward
 */

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_SHADOW, UNIFORM_SHADOWMAP } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ForwardFlowPriority } from '../forward/enum';
import { ShadowStage } from './shadow-stage';
import { GFXFramebuffer, GFXRenderPass, GFXLoadOp,
    GFXStoreOp, GFXTextureLayout, GFXFormat, GFXTexture,
    GFXTextureType, GFXTextureUsageBit } from '../../gfx';
import { RenderFlowTag } from '../pipeline-serialization';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { RenderView } from '../render-view';
import { ShadowType } from '../../renderer/scene/shadows';

/**
 * @zh 阴影贴图绘制流程
 */
@ccclass('ShadowFlow')
export class ShadowFlow extends RenderFlow {

    public get shadowFrameBuffer () {
        return this._shadowFrameBuffer;
    }

    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_SHADOW,
        priority: ForwardFlowPriority.SHADOW,
        tag: RenderFlowTag.SCENE,
        stages: []
    };

    private _shadowRenderPass: GFXRenderPass|null = null;
    private _shadowRenderTargets: GFXTexture[] = [];
    private _shadowFrameBuffer: GFXFramebuffer|null = null;
    private _depth: GFXTexture|null = null;
    private _width: number = 0;
    private _height: number = 0;

    public initialize (info: IRenderFlowInfo): boolean{
        super.initialize(info);
        if (this._stages.length === 0) {
            // add shadowMap-stages
            const shadowMapStage = new ShadowStage();
            shadowMapStage.initialize(ShadowStage.initInfo);
            this._stages.push(shadowMapStage);
        }
        return true;
    }

    public activate (pipeline: ForwardPipeline) {
        super.activate(pipeline);

        const device = pipeline.device;
        const shadowMapSize = pipeline.shadows.size;
        this._width = shadowMapSize.x;
        this._height = shadowMapSize.y;

        if(!this._shadowRenderPass) {
            this._shadowRenderPass = device.createRenderPass({
                colorAttachments: [{
                    format: GFXFormat.RGBA8,
                    loadOp: GFXLoadOp.CLEAR, // should clear color attachment
                    storeOp: GFXStoreOp.STORE,
                    sampleCount: 1,
                    beginLayout: GFXTextureLayout.UNDEFINED,
                    endLayout: GFXTextureLayout.PRESENT_SRC,
                }],
                depthStencilAttachment: {
                    format : device.depthStencilFormat,
                    depthLoadOp : GFXLoadOp.CLEAR,
                    depthStoreOp : GFXStoreOp.STORE,
                    stencilLoadOp : GFXLoadOp.CLEAR,
                    stencilStoreOp : GFXStoreOp.STORE,
                    sampleCount : 1,
                    beginLayout : GFXTextureLayout.UNDEFINED,
                    endLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                },
            });
        }

        if(this._shadowRenderTargets.length < 1) {
            this._shadowRenderTargets.push(device.createTexture({
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

        if(!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = device.createFramebuffer({
                renderPass: this._shadowRenderPass,
                colorTextures: this._shadowRenderTargets,
                depthStencilTexture: this._depth,
            });
        }

        for (let i = 0; i < this._stages.length; ++i) {
            (this._stages[i] as ShadowStage).setShadowFrameBuffer(this._shadowFrameBuffer);
        }
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;
        if (shadowInfo.type !== ShadowType.ShadowMap) { return; }

        const shadowMapSize = shadowInfo.size;
        if (this._width !== shadowMapSize.x || this._height !== shadowMapSize.y) {
            this.resizeShadowMap(shadowMapSize.x,shadowMapSize.y);
            this._width = shadowMapSize.x;
            this._height = shadowMapSize.y;
        }

        pipeline.updateUBOs(view);
        super.render(view);
        pipeline.descriptorSet.bindTexture(UNIFORM_SHADOWMAP.binding, this._shadowFrameBuffer!.colorTextures[0]!);
    }

    private resizeShadowMap (width: number, height: number) {
        if (this._depth) {
            this._depth.resize(width, height);
        }

        if (this._shadowRenderTargets.length > 0) {
            for (let i = 0; i< this._shadowRenderTargets.length; i++) {
                const renderTarget = this._shadowRenderTargets[i];
                if (renderTarget) { renderTarget.resize(width, height); }
            }
        }

        if(this._shadowFrameBuffer) {
            this._shadowFrameBuffer.destroy();
            this._shadowFrameBuffer.initialize({
                renderPass: this._shadowRenderPass!,
                colorTextures: this._shadowRenderTargets,
                depthStencilTexture: this._depth,
            });
        }
    }
}
