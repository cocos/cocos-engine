/**
 * @category pipeline.forward
 */

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_SHADOW, UNIFORM_SHADOWMAP, SetIndex } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ForwardFlowPriority } from '../forward/enum';
import { GFXFramebuffer, GFXRenderPass, GFXLoadOp,
    GFXStoreOp, GFXTextureLayout, GFXFormat, GFXTexture,
    GFXTextureType, GFXTextureUsageBit } from '../../gfx';
import { RenderFlowTag } from '../pipeline-serialization';
import { RenderView, ForwardPipeline, GFXColor, GFXCommandBuffer, GFXRect } from '../..';
import { ShadowType } from '../../renderer/scene/shadows';
import { shadowCollecting, lightCollecting } from '../forward/scene-culling';
import { RenderShadowMapBatchedQueue } from '../render-shadowMap-batched-queue';
import { Light } from 'cocos/core/renderer';

const colors: GFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

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
    };

    private _additiveShadowQueue!: RenderShadowMapBatchedQueue;
    private _renderArea: GFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _shadowRenderPass: GFXRenderPass|null = null;
    private _shadowRenderTargets: GFXTexture[] = [];
    private _shadowFrameBuffer: GFXFramebuffer|null = null;
    private _depth: GFXTexture|null = null;
    private _width: number = 0;
    private _height: number = 0;

    public activate (pipeline: ForwardPipeline) {
        super.activate(pipeline);

        this._additiveShadowQueue = new RenderShadowMapBatchedQueue(pipeline);

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

        shadowCollecting(pipeline, view);
        const validLights = lightCollecting(view);
        for (let l = 0; l < validLights.length; l++) {
            const light = validLights[l];
            this.draw(light, view, this._shadowRenderPass!, this._shadowFrameBuffer!);
        }

        // binding mainLight shadow map
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

    private draw (light: Light, view: RenderView, renderPass: GFXRenderPass, frameBuffer: GFXFramebuffer) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;

        this._additiveShadowQueue.gatherLightPasses(light);

        const camera = view.camera;

        const cmdBuff = pipeline.commandBuffers[0];

        const vp = camera.viewport;
        const shadowMapSize = shadowInfo.size;
        this._renderArea!.x = vp.x * shadowMapSize.x;
        this._renderArea!.y = vp.y * shadowMapSize.y;
        this._renderArea!.width =  vp.width * shadowMapSize.x * pipeline.shadingScale;
        this._renderArea!.height = vp.height * shadowMapSize.y * pipeline.shadingScale;

        const device = pipeline.device;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, frameBuffer, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        this._additiveShadowQueue.recordCommandBuffer(device, renderPass!, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        device.queue.submit(bufs);
    }
}
