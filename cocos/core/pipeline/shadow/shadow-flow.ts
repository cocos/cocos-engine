/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_SHADOW, UNIFORM_SHADOWMAP } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ForwardFlowPriority } from '../forward/enum';
import { ShadowStage } from './shadow-stage';
import { GFXFramebuffer, GFXRenderPass, GFXLoadOp,
    GFXStoreOp, GFXTextureLayout, GFXFormat, GFXTexture,
    GFXTextureType, GFXTextureUsageBit } from '../../gfx';
import { RenderFlowType } from '../pipeline-serialization';
import { RenderView, ForwardPipeline } from '../..';
import { sceneCulling } from '../forward/scene-culling';

const colorMipmapLevels: number[] = [];

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
        type: RenderFlowType.SCENE,
    };

    private _shadowRenderPass: GFXRenderPass|null = null;
    private _shadowRenderTargets: GFXTexture[] = [];
    private _shadowFrameBuffer: GFXFramebuffer|null = null;
    private _depth: GFXTexture|null = null;

    public initialize (info: IRenderFlowInfo) {
        super.initialize(info);

        // add shadowMap-stages
        const shadowMapStage = new ShadowStage();
        shadowMapStage.initialize(ShadowStage.initInfo);
        this._stages.push(shadowMapStage);
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        super.destroy();
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        view.camera.update();
        sceneCulling(pipeline, view);
        pipeline.updateUBOs(view);
        super.render(view);
        const shadowmapUniform = pipeline.globalBindings.get(UNIFORM_SHADOWMAP.name);
        if (shadowmapUniform) {
            shadowmapUniform.texture = this._shadowFrameBuffer?.colorTextures[0]!;
        }
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
    }

    public activate (pipeline: ForwardPipeline) {
        super.activate(pipeline);

        const device = pipeline.device;
        const shadowMapSize = pipeline.shadowMapSize;

        if(!this._shadowRenderPass) {
            this._shadowRenderPass = device.createRenderPass({
                colorAttachments: [{
                    format: GFXFormat.RGBA16F,
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
                    beginLayout : GFXTextureLayout.DEPTH_STENCIL_READONLY_OPTIMAL,
                    endLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                },
            });
        }

        if(this._shadowRenderTargets.length < 1) {
            this._shadowRenderTargets.push(device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: GFXFormat.RGBA16F,
                width: shadowMapSize.x,
                height: shadowMapSize.y,
            }));
        }

        if(!this._depth) {
            this._depth = device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
                format: GFXFormat.D24S8,
                width: shadowMapSize.x,
                height: shadowMapSize.y,
            });
        }

        if(!this._shadowFrameBuffer) {
            this._shadowFrameBuffer = device.createFramebuffer({
                renderPass: this._shadowRenderPass,
                colorTextures: this._shadowRenderTargets,
                colorMipmapLevels,
                depthStencilTexture: this._depth,
                depStencilMipmapLevel: 0,
            });
        }

        for (let i = 0; i < this._stages.length; ++i) {
            (this._stages[i] as ShadowStage).setShadowFrameBuffer(this._shadowFrameBuffer);
        }
    }
}
