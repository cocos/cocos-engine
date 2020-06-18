/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXFilter, IGFXColor } from '../../gfx/define';
import { Layers } from '../../scene-graph';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderBatchedQueue } from '../render-batched-queue';
import { RenderFlow } from '../render-flow';
import { RenderInstancedQueue } from '../render-instanced-queue';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from './enum';

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

    private _opaqueBatchedQueue: RenderBatchedQueue;
    private _opaqueInstancedQueue: RenderInstancedQueue;

    constructor () {
        super();
        this._opaqueBatchedQueue = new RenderBatchedQueue();
        this._opaqueInstancedQueue = new RenderInstancedQueue();
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

        this._opaqueInstancedQueue.clear();
        this._opaqueBatchedQueue.clear();
        this._renderQueues.forEach(this.renderQueueClearFunc);

        const renderObjects = this._pipeline.renderObjects;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            if (ro.model.isDynamicBatching) {
                const subModels = ro.model.subModels;
                for (let m = 0; m < subModels.length; ++m) {
                    const subModel = subModels[m];
                    const passes = subModel.passes;
                    for (let p = 0; p < passes.length; ++p) {
                        const pass = passes[p];
                        const pso = subModel.psos![p];
                        if (pass.instancedBuffer) {
                            pass.instancedBuffer.merge(subModel, ro.model.instancedAttributes, pso);
                            this._opaqueInstancedQueue.queue.add(pass.instancedBuffer);
                        } else if (pass.batchedBuffer) {
                            pass.batchedBuffer.merge(subModel, ro, pso);
                            this._opaqueBatchedQueue.queue.add(pass.batchedBuffer);
                        } else {
                            for (let k = 0; k < this._renderQueues.length; k++) {
                                this._renderQueues[k].insertRenderPass(ro, m, p);
                            }
                        }
                    }
                }
            } else {
                for (let m = 0; m < ro.model.subModelNum; m++) {
                    for (let p = 0; p < ro.model.getSubModel(m).passes.length; p++) {
                        for (let k = 0; k < this._renderQueues.length; k++) {
                            this._renderQueues[k].insertRenderPass(ro, m, p);
                        }
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

        if (this._pipeline.usePostProcess) {
            if (!this._pipeline.useMSAA) {
                this._framebuffer = this._pipeline.getFrameBuffer(this._pipeline!.currShading)!;
            } else {
                this._framebuffer = this._pipeline.getFrameBuffer('msaa')!;
            }
        } else {
            this._framebuffer = view.window!.framebuffer;
        }

        const planarShadow = camera.scene!.planarShadows;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea!,
            camera.clearFlag, colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(this._renderQueues[0].cmdBuffs.array, this._renderQueues[0].cmdBuffCount);

        this._opaqueInstancedQueue.recordCommandBuffer(cmdBuff);
        this._opaqueBatchedQueue.recordCommandBuffer(cmdBuff);

        if (camera.visibility & Layers.BitMask.DEFAULT) {
            planarShadow.recordCommandBuffer(cmdBuff);
        }
        cmdBuff.execute(this._renderQueues[1].cmdBuffs.array, this._renderQueues[1].cmdBuffCount);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device!.queue.submit(bufs);

        if (this._pipeline.useMSAA) {
            this._device!.blitFramebuffer(
                this._framebuffer!,
                this._pipeline.getFrameBuffer(this._pipeline.currShading)!,
                this._renderArea!,
                this._renderArea!,
                GFXFilter.POINT);
        }
    }
}
