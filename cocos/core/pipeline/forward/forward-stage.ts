/**
 * @category pipeline.forward
 */

import { ccclass, boolean } from '../../data/class-decorator';
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
import { opaqueCompareFn, RenderQueue } from '../render-queue';
import { IRenderPass } from '../define';
import { getPhaseID } from '../pass-phase'
import { Light } from '../../renderer';
import { UBOForwardLight } from '../../pipeline/define';
import { GFXBuffer } from '../../gfx';
import { GFXPipelineState } from '../../gfx/pipeline-state';

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
            },
        ],
    };

    private _opaqueBatchedQueue: RenderBatchedQueue;
    private _opaqueInstancedQueue: RenderInstancedQueue;
    private _lightBatchedQueues: RenderQueue[] = [];
    private _lightModelPSO: Array<Array<Array<GFXPipelineState | null>>>;

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
        this._opaqueBatchedQueue = new RenderBatchedQueue();
        this._opaqueInstancedQueue = new RenderInstancedQueue();
        this._lightModelPSO = new Array<Array<Array<GFXPipelineState>>>();
    }

    public activate (flow: RenderFlow) {
        super.activate(flow);
        this.createCmdBuffer();

        const validLights: Light[] = this.flow.pipeline.getValidLights();
        for (let l = 0; l < validLights.length; ++l) {
            let sortFunc: (a: IRenderPass, b: IRenderPass) => number = opaqueCompareFn;
            this._lightBatchedQueues[l] = new RenderQueue({
                isTransparent: false,
                phases: getPhaseID("forward-add"),
                sortFunc,
            });
        }
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

        for (let i = 0; i < this._lightModelPSO.length; ++i) {
            for (let j = 0; j < this._lightModelPSO[i].length; ++j) {
                for (let k = 0; k < this._lightModelPSO[i][j].length; ++k){
                    this._lightModelPSO[i][j][k]!.destroy;
                    this._lightModelPSO[i][j][k] = null;
                }
                this._lightModelPSO[i][j].length = 0;
            }
            this._lightModelPSO[i].length = 0;
        }
        this._lightModelPSO.length = 0;
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

        this._opaqueInstancedQueue.clear();
        this._opaqueBatchedQueue.clear();
        this._renderQueues.forEach(this.renderQueueClearFunc);
        this._lightBatchedQueues.forEach(this.lightBatchedQueueClearFunc);            

        const renderObjects = this._pipeline.renderObjects;
        const lightIndexOffset: number[] = this.flow.pipeline.getLightIndexOffsets();
        const lightIndices: number[] = this.flow.pipeline.getLightIndices();
        const lightBuffers: GFXBuffer[] = this.flow.pipeline.getLightBuffers();
        for (let i = 0; i < renderObjects.length; ++i) {
            const nextLightIndex = i + 1 < renderObjects.length ? lightIndexOffset[i + 1] : lightIndices.length;
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
                        const pass = ro.model.getSubModel(m).passes[p];
                        for (let k = 0; k < this._renderQueues.length; k++) {
                            this._renderQueues[k].insertRenderPass(ro, m, p);
                        }
                                               
                        // Organize light-batched-queues
                        for (let l = lightIndexOffset[i]; l < nextLightIndex; l++) {
                            const lightbuffer = lightBuffers[lightIndices[l]];                      
                            if(pass.phase == getPhaseID("forward-add")){
                                if(this._lightModelPSO[i][m][l]){
                                    const pso = this._lightModelPSO[i][m][l];
                                    const bindingLayout = pso!.pipelineLayout.layouts[0];
                                    if (lightbuffer) { bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, lightbuffer); }
                                    this._lightBatchedQueues[lightIndices[l]].insertRenderPass(ro, m, p);
                                }else{
                                    // @ts-ignore
                                    const pso = ro.model.createPipelineState(pass, m);
                                    this._lightModelPSO[i][m][l] = pso;
                                    const bindingLayout = pso.pipelineLayout.layouts[0];
                                    if (lightbuffer) { bindingLayout.bindBuffer(UBOForwardLight.BLOCK.binding, lightbuffer); }
                                    this._lightBatchedQueues[lightIndices[l]].insertRenderPass(ro, m, p);
                                }                               
                            }                                                       
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

        // Commit light-batched-queues
        for (let l = 0; l < this._lightBatchedQueues.length; ++l) {
            cmdBuff.execute(this._lightBatchedQueues[l].cmdBuffs.array, this._lightBatchedQueues[l].cmdBuffCount);
        }        

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

    protected lightBatchedQueueClearFunc (rq: RenderQueue) {
        rq.clear();
    }
}
