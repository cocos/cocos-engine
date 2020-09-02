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
import { Light } from 'cocos/core/renderer/scene';
import { pipeline } from 'exports/base';

const colors: GFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh 阴影贴图绘制流程
 */
@ccclass('ShadowFlow')
export class ShadowFlow extends RenderFlow {

    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_SHADOW,
        priority: ForwardFlowPriority.SHADOW,
        tag: RenderFlowTag.SCENE,
    };

    //private _shadowRenderPass: GFXRenderPass|null = null;
    private _shadowRenderPassMap: Map<Light, GFXRenderPass> = new Map();
    //private _shadowRenderTargets: GFXTexture[] = [];
    private _shadowRenderTargetsMap: Map<Light, GFXTexture[]> = new Map();
    //private _shadowFrameBuffer: GFXFramebuffer|null = null;
    //private _depth: GFXTexture|null = null;
    private _depthMap: Map<Light, GFXTexture> = new Map();

    private _additiveShadowQueue!: RenderShadowMapBatchedQueue;
    private _renderArea: GFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _width: number = 0;
    private _height: number = 0;

    private init (pipeline: ForwardPipeline, validLights: Light[]) {
        if (!this._additiveShadowQueue) { this._additiveShadowQueue = new RenderShadowMapBatchedQueue(pipeline); }
        pipeline.shadowFrameBufferMap.clear();

        const device = pipeline.device;
        const shadowMapSize = pipeline.shadows.size;
        this._width = shadowMapSize.x;
        this._height = shadowMapSize.y;

        for (let l = 0; l < validLights.length; l++) {
            const light = validLights[l];

            if(!this._shadowRenderPassMap.has(light)) {
                const renderPass = device.createRenderPass({
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

                this._shadowRenderPassMap.set(light, renderPass);
            }

            if(!this._shadowRenderTargetsMap.has(light)) {
                const renderTargets: GFXTexture[] = [];
                renderTargets.push(device.createTexture({
                    type: GFXTextureType.TEX2D,
                    usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                    format: GFXFormat.RGBA8,
                    width: this._width,
                    height: this._height,
                }));

                this._shadowRenderTargetsMap.set(light, renderTargets);
            }

            if(!this._depthMap.has(light)) {
                const depth = device.createTexture({
                    type: GFXTextureType.TEX2D,
                    usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT,
                    format: device.depthStencilFormat,
                    width: this._width,
                    height: this._height,
                });

                this._depthMap.set(light, depth);
            }

            if(!pipeline.shadowFrameBufferMap.has(light)) {
                const shadowRenderPass = this._shadowRenderPassMap.get(light);
                const shadowRenderTargets = this._shadowRenderTargetsMap.get(light);
                const depth = this._depthMap.get(light);
                const frameBuffer = device.createFramebuffer({
                    renderPass: shadowRenderPass!,
                    colorTextures: shadowRenderTargets!,
                    depthStencilTexture: depth!,
                });

                pipeline.shadowFrameBufferMap.set(light, frameBuffer);
            }
        }
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;
        if (shadowInfo.type !== ShadowType.ShadowMap) { return; }

        const validLights = lightCollecting(view);
        this.init(pipeline, validLights);

        const shadowMapSize = shadowInfo.size;
        if (this._width !== shadowMapSize.x || this._height !== shadowMapSize.y) {
            this.resizeShadowMap(shadowMapSize.x,shadowMapSize.y, validLights);
            this._width = shadowMapSize.x;
            this._height = shadowMapSize.y;
        }

        shadowCollecting(pipeline, view);
        for (let l = 0; l < validLights.length; l++) {
            const light = validLights[l];
            const frameBuffer = pipeline.shadowFrameBufferMap.get(light);
            this.draw(light, view, frameBuffer!);

            if (l === 0) {
                // binding mainLight shadow map
                pipeline.descriptorSet.bindTexture(UNIFORM_SHADOWMAP.binding, pipeline.shadowFrameBufferMap.get(light)!.colorTextures[0]!);
            }
        }
    }

    private resizeShadowMap (width: number, height: number, validLights: Light[]) {

        for (let i = 0; i < validLights.length; i++) {
            const light = validLights[i];

            const depth = this._depthMap.get(light);
            if (depth) {
                depth.resize(width, height);
            }

            const renderTargets = this._shadowRenderTargetsMap.get(light);
            if (renderTargets && renderTargets.length > 0) {
                for (let j = 0; j < renderTargets.length; j++) {
                    const renderTarget = renderTargets[j];
                    if (renderTarget) { renderTarget.resize(width, height); }
                }
            }

            const frameBuffer = (this._pipeline as ForwardPipeline).shadowFrameBufferMap.get(light);
            if(frameBuffer) {
                frameBuffer.destroy();
                const shadowRenderPass = this._shadowRenderPassMap.get(light);
                const shadowRenderTargets = this._shadowRenderTargetsMap.get(light);
                const depth = this._depthMap.get(light);
                frameBuffer.initialize({
                    renderPass: shadowRenderPass!,
                    colorTextures: shadowRenderTargets!,
                    depthStencilTexture: depth!,
                });
            }
        }
    }

    private draw (light: Light, view: RenderView, frameBuffer: GFXFramebuffer) {
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
        const renderPass = frameBuffer.renderPass;

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
