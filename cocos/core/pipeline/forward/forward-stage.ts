/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXFilter, IGFXColor, GFXLoadOp, GFXTextureLayout } from '../../gfx/define';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderBatchedQueue } from '../render-batched-queue';
import { RenderFlow } from '../render-flow';
import { RenderInstancedQueue } from '../render-instanced-queue';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from './enum';
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
import { PipelineGlobal } from '../global';

const colors: IGFXColor[] = [ { r: 0, g: 0, b: 0, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @en The forward render stage
 * @zh 前向渲染阶段。
 */
@ccclass('ForwardStage')
export class ForwardStage extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'ForwardStage',
        priority: ForwardStagePriority.FORWARD,
        renderQueues: [
            {
                isTransparent: false,
                sortMode: RenderQueueSortMode.FRONT_TO_BACK,
                stages: ['default'],
            },
            {
                isTransparent: true,
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
                stages: ['default', 'planarShadow'],
            },
        ],
    };

    private _batchedQueue: RenderBatchedQueue;
    private _instancedQueue: RenderInstancedQueue;
    private _additiveLightQueue: RenderAdditiveLightQueue;

    constructor () {
        super();
        this._batchedQueue = new RenderBatchedQueue();
        this._instancedQueue = new RenderInstancedQueue();
        this._additiveLightQueue = new RenderAdditiveLightQueue();
    }

    public activate (flow: RenderFlow) {
        super.activate(flow);
        this.createCmdBuffer();
    }

    public destroy () {
        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public resize (width: number, height: number) {
    }

    public rebuild () {
    }

    public render (view: RenderView) {

        this._instancedQueue.clear();
        this._batchedQueue.clear();
        const validLights = this.pipeline.validLights;
        const lightBuffers = this.pipeline.lightBuffers;
        const lightIndices = this.pipeline.lightIndices;
        this._additiveLightQueue.clear(validLights, lightBuffers, lightIndices);
        this._renderQueues.forEach(this.renderQueueClearFunc);

        const renderObjects = this._pipeline.renderObjects;
        const lightIndexOffset = this.pipeline.lightIndexOffsets;
        let m = 0; let p = 0; let k = 0;
        for (let i = 0; i < renderObjects.length; ++i) {
            const nextLightIndex = i + 1 < renderObjects.length ? lightIndexOffset[i + 1] : lightIndices.length;
            const ro = renderObjects[i];
            if (ro.model.isDynamicBatching) {
                const subModels = ro.model.subModels;
                for (m = 0; m < subModels.length; ++m) {
                    const subModel = subModels[m];
                    const passes = subModel.passes;
                    for (p = 0; p < passes.length; ++p) {
                        const pass = passes[p];
                        if (pass.instancedBuffer) {
                            pass.instancedBuffer.merge(subModel, ro.model.instancedAttributes, subModel.psoInfos[p]);
                            this._instancedQueue.queue.add(pass.instancedBuffer);
                        } else if (pass.batchedBuffer) {
                            pass.batchedBuffer.merge(subModel, p, ro);
                            this._batchedQueue.queue.add(pass.batchedBuffer);
                        } else {
                            for (k = 0; k < this._renderQueues.length; k++) {
                                this._renderQueues[k].insertRenderPass(ro, m, p);
                            }
                            this._additiveLightQueue.add(ro, m, pass, lightIndexOffset[i], nextLightIndex);
                        }
                    }
                }
            } else {
                for (m = 0; m < ro.model.subModelNum; m++) {
                    for (p = 0; p < ro.model.getSubModel(m).passes.length; p++) {
                        const pass = ro.model.getSubModel(m).passes[p];
                        for (k = 0; k < this._renderQueues.length; k++) {
                            this._renderQueues[k].insertRenderPass(ro, m, p);
                        }
                        this._additiveLightQueue.add(ro, m, pass, lightIndexOffset[i], nextLightIndex);
                    }
                }
            }
        }
        this._renderQueues.forEach(this.renderQueueSortFunc);

        const camera = view.camera;

        const cmdBuff = this._cmdBuff!;

        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width * this.pipeline!.shadingScale;
        this._renderArea!.height = vp.height * camera.height * this.pipeline!.shadingScale;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            if (this._pipeline.isHDR) {
                SRGBToLinear(colors[0], camera.clearColor);
                const scale = this._pipeline.fpScale / camera.exposure;
                colors[0].r *= scale;
                colors[0].g *= scale;
                colors[0].b *= scale;
            } else {
                colors[0].r = camera.clearColor.r;
                colors[0].g = camera.clearColor.g;
                colors[0].b = camera.clearColor.b;
            }
        }

        colors[0].a = camera.clearColor.a;

        let framebuffer = view.window.framebuffer;
        if (this._pipeline.usePostProcess) {
            if (!this._pipeline.useMSAA) {
                framebuffer = this._pipeline.getFrameBuffer(this._pipeline!.currShading)!;
            } else {
                framebuffer = this._pipeline.getFrameBuffer('msaa')!;
            }
        }

        const device = PipelineGlobal.device;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : this._flow.getRenderPass(camera.clearFlag);

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._additiveLightQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        camera.scene!.planarShadows.recordCommandBuffer(device, renderPass, cmdBuff);
        this._renderQueues[1].recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        device.queue.submit(bufs);

        if (this._pipeline.useMSAA) {
            device.blitFramebuffer(
                this._framebuffer!,
                this._pipeline.getFrameBuffer(this._pipeline.currShading)!,
                this._renderArea!,
                this._renderArea!,
                GFXFilter.POINT);
        }
    }
}
