/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType, GFXFilter, IGFXColor } from '../../gfx/define';
import { Layers } from '../../scene-graph';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderBatchedQueue } from '../render-batched-queue';
import { RenderQueue } from '../render-queue';
import { IRenderStageInfo, RenderStage, RenderQueueSortMode } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from './enum';
import { RenderFlow } from '../render-flow';

const colors: IGFXColor[] = [ { r: 0, g: 0, b: 0, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 前向渲染阶段。
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
            }
        ]
    };

    private _opaqueBatchedQueue: RenderBatchedQueue;

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
        this._opaqueBatchedQueue = new RenderBatchedQueue();
    }

    public activate (flow: RenderFlow) {
        super.activate(flow);
        this._createCmdBuffer();
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    /**
     * @zh
     * 重置大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    public resize (width: number, height: number) {
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
    }

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public render (view: RenderView) {

        this._opaqueBatchedQueue.clear();
        this._renderQueues.forEach(this.clearRenderQueue);

        const renderObjects = this._pipeline.renderObjects;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            if (ro.model.isDynamicBatching) {
                for (let m = 0; m < ro.model.subModels.length; ++m) {
                    const subModel = ro.model.subModels[m];
                    const passes = subModel.passes;
                    for (let p = 0; p < passes.length; ++p) {
                        const pass = subModel.passes[p];
                        if (pass.batchedBuffer) {
                            const pso = subModel.psos![p];
                            const isTransparent = pso.blendState.targets[0].blend;
                            if (!isTransparent) {
                                pass.batchedBuffer.merge(subModel, ro, pso);
                                this._opaqueBatchedQueue.queue.add(pass.batchedBuffer);
                            } else {
                                this._renderQueues[1].insertRenderPass(ro, m, p);
                            }
                        }
                    }
                }
            } else {
                for (let i = 0; i < ro.model.subModelNum; i++) {
                    for (let j = 0; j < ro.model.getSubModel(i).passes.length; j++) {
                        for (const rq of this._renderQueues) {
                            rq.insertRenderPass(ro, i, j);
                        }
                    }
                }
            }
        }
        this._renderQueues.forEach(this.sortRenderQueue);

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

        if (this._pipeline.usePostProcess) {
            if (!this._pipeline.useMSAA) {
                this._framebuffer = this._pipeline.getFrameBuffer(this._pipeline!.currShading)!;
            } else {
                this._framebuffer = this._pipeline.getFrameBuffer('msaa')!;
            }
        } else {
            this._framebuffer = view.window!.framebuffer;
        }

        const planarShadow = camera.scene.planarShadows;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea!,
            camera.clearFlag, colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(this._renderQueues[0].cmdBuffs.array, this._renderQueues[0].cmdBuffCount);

        this._opaqueBatchedQueue.recordCommandBuffer(cmdBuff);

        if (camera.visibility & Layers.BitMask.DEFAULT) {
            cmdBuff.execute(planarShadow.cmdBuffs.array, planarShadow.cmdBuffCount);
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

    private _createCmdBuffer () {
        this._cmdBuff = this._device!.createCommandBuffer({
            allocator: this._device!.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });
    }

    private clearRenderQueue (rq: RenderQueue) {
        rq.clear();
    }

    private sortRenderQueue (rq: RenderQueue) {
        rq.sort();
    }
}
