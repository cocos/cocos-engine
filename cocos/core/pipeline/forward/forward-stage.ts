/**
 * @category pipeline.forward
 */

import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType, GFXFilter, IGFXColor } from '../../gfx/define';
import { getPhaseID } from '../pass-phase';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderBatchedQueue } from '../render-batched-queue';
import { RenderFlow } from '../render-flow';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

const colors: IGFXColor[] = [];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 前向渲染阶段。
 */
export class ForwardStage extends RenderStage {

    private _opaqueQueue: RenderQueue;
    private _transparentQueue: RenderQueue;
    private _opaqueBatchedQueue: RenderBatchedQueue;
    private _transparentBatchedQueue: RenderBatchedQueue;

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor (flow: RenderFlow) {
        super(flow);

        this._opaqueQueue = new RenderQueue({
            isTransparent: false,
            phases: getPhaseID('default'),
            sortFunc: opaqueCompareFn,
        });
        this._transparentQueue = new RenderQueue({
            isTransparent: true,
            phases: getPhaseID('default') | getPhaseID('planarShadow'),
            sortFunc: transparentCompareFn,
        });
        this._opaqueBatchedQueue = new RenderBatchedQueue();
        this._transparentBatchedQueue = new RenderBatchedQueue();
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染阶段描述信息。
     */
    public initialize (info: IRenderStageInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        return true;
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
        this._transparentBatchedQueue.clear();
        this._opaqueQueue.clear();
        this._transparentQueue.clear();

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
                                pass.batchedBuffer.merge(subModel, ro.model);
                                this._opaqueBatchedQueue.queue.add(pass.batchedBuffer);
                            } else {
                                pass.batchedBuffer.merge(subModel, ro.model);
                                this._transparentBatchedQueue.queue.add(pass.batchedBuffer);
                            }
                        }
                    }
                }
            } else {
                const subModels = ro.model.subModels;
                for (let m = 0; m < subModels.length; ++m) {
                    const subModel = subModels[m];
                    const passes = subModel.passes;
                    for (let p = 0; p < passes.length; ++p) {
                        const pass = subModel.passes[p];
                        const pso = subModel.psos![p];
                        const isTransparent = pso.blendState.targets[0].blend;
                        const hash = (0 << 30) | pass.priority << 16 | subModel.priority << 8 | p;
                        if (isTransparent) {
                            this._transparentQueue.queue.push({
                                hash,
                                depth: ro.depth,
                                shaderId: pso.shader.id,
                                subModel,
                                cmdBuff: subModel.commandBuffers[p],
                            });
                        } else {
                            this._opaqueQueue.queue.push({
                                hash,
                                depth: ro.depth,
                                shaderId: pso.shader.id,
                                subModel,
                                cmdBuff: subModel.commandBuffers[p],
                            });
                        }
                        // this._opaqueQueue.insertRenderPass(ro, m, j);
                        // this._transparentQueue.insertRenderPass(ro, m, j);
                    }
                }
            }
        }
        this._opaqueQueue.sort();
        this._transparentQueue.sort();

        const camera = view.camera;

        const cmdBuff = this._cmdBuff!;

        const vp = camera.viewport;
        this._renderArea.x = vp.x * camera.width;
        this._renderArea.y = vp.y * camera.height;
        this._renderArea.width = vp.width * camera.width * this.pipeline.shadingScale;
        this._renderArea.height = vp.height * camera.height * this.pipeline.shadingScale;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            colors[0] = camera.clearColor;
            if (this._pipeline.isHDR) {
                colors[0] = SRGBToLinear(colors[0]);
                const scale = this._pipeline.fpScale / camera.exposure;
                colors[0].r *= scale;
                colors[0].g *= scale;
                colors[0].b *= scale;
            }
            colors.length = 1;
        }

        if (this._pipeline.usePostProcess) {
            if (!this._pipeline.useMSAA) {
                this._framebuffer = this._pipeline.curShadingFBO;
            } else {
                this._framebuffer = this._pipeline.msaaShadingFBO;
            }
        } else {
            this._framebuffer = view.window!.framebuffer;
        }

        const planarShadow = camera.scene.planarShadows;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea,
            camera.clearFlag, colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(this._opaqueQueue.cmdBuffs.array, this._opaqueQueue.cmdBuffCount);

        this._opaqueBatchedQueue.recordCommandBuffer(cmdBuff);

        cmdBuff.execute(planarShadow.cmdBuffs.array, planarShadow.cmdBuffCount);
        cmdBuff.execute(this._transparentQueue.cmdBuffs.array, this._transparentQueue.cmdBuffCount);

        this._transparentBatchedQueue.recordCommandBuffer(cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device.queue.submit(bufs);

        if (this._pipeline.useMSAA) {
            this._device.blitFramebuffer(
                this._framebuffer,
                this._pipeline.curShadingFBO,
                this._renderArea,
                this._renderArea,
                GFXFilter.POINT);
        }
    }
}
