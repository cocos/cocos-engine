/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_SHADOW } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ForwardFlowPriority } from '../forward/enum';
import { ShadowStage } from './shadow-stage';
import { GFXFramebuffer, GFXRenderPass, GFXLoadOp,
    GFXStoreOp, GFXTextureLayout, GFXFormat, GFXTexture,
    GFXTextureType, GFXTextureUsageBit } from '../../gfx';
import { RenderFlowType } from '../pipeline-serialization';
import { RenderView, RenderPipeline } from '../..';
import { PipelineGlobal } from '../global';

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
        priority: ForwardFlowPriority.FORWARD - 1,
        type: RenderFlowType.SCENE,
    };

    private _shadowRenderPass: GFXRenderPass|null = null;
    private _shadowRenderTargets: GFXTexture[] = [];
    private _shadowFrameBuffer: GFXFramebuffer|null = null;
    private _depth: GFXTexture|null = null;

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor () {
        super();
    }

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
        this.destroyStages();
    }

    public render (view: RenderView) {
        view.camera.update();

        this.pipeline.sceneCulling(view);

        this.pipeline.updateUBOs(view);

        super.render(view);
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
    }

    public activate(pipeline: RenderPipeline) {
        super.activate(pipeline);

        const device = PipelineGlobal.device;
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
                    beginLayout : GFXTextureLayout.DEPTH_STENCIL_READONLY_OPTIMAL,
                    endLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                },
            });
        }

        if(this._shadowRenderTargets.length < 1) {
            this._shadowRenderTargets.push(device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.SAMPLED,
                format: GFXFormat.RGBA16F,
                width:this.pipeline.shadowMapSize.x,
                height:this.pipeline.shadowMapSize.y,
            }));
        }

        if(!this._depth) {
            this._depth = device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
                format: GFXFormat.D24S8,
                width:this.pipeline.shadowMapSize.x,
                height:this.pipeline.shadowMapSize.y,
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

            // @ts-ignore
            this.pipeline._shadowFrameBuffer = this.shadowFrameBuffer;
        }

        for (let i = 0; i < this.stages.length; ++i) {
            (this.stages[i] as ShadowStage).setShadowFrameBuffer(this._shadowFrameBuffer);
        }
    }
}