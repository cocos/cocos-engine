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
import { opaqueCompareFn } from '../render-queue';
import { IRenderPass } from '../define';
import { getPhaseID } from '../pass-phase'
import { Light } from '../../renderer';
import { GFXBuffer } from '../../gfx';
import { RenderLightBatchedQueue } from '../render-light-batched-queue'
import { LightType } from '../../renderer/scene/light';

const colors: IGFXColor[] = [ { r: 0, g: 0, b: 0, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

const myForward_Light_Sphere_Patches = [
    { name: 'CC_FOWARD_ADD', value: true },
];
const myForward_Light_Sport_Patches = [
    { name: 'CC_FOWARD_ADD', value: true },
    { name: 'CC_SPOTLIGHT', value: true },
];

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
    private _lightBatchQueues: RenderLightBatchedQueue[] = [];

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
        this._opaqueBatchedQueue = new RenderBatchedQueue();
        this._opaqueInstancedQueue = new RenderInstancedQueue();
    }

    public activate (flow: RenderFlow) {
        super.activate(flow);
        this.createCmdBuffer();
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
        
        if(this._lightBatchQueues)
        {
            this._lightBatchQueues.forEach(this.lightBatchQueueClearFunc);
            this._lightBatchQueues.length = 0;
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

        this._opaqueInstancedQueue.clear();
        this._opaqueBatchedQueue.clear();
        this._renderQueues.forEach(this.renderQueueClearFunc); 
        this._lightBatchQueues.forEach(this.lightBatchQueueClearFunc);

        const renderObjects = this._pipeline.renderObjects;
        const lightIndexOffset: number[] = this.pipeline.getLightIndexOffsets();
        const lightIndices: number[] = this.pipeline.getLightIndices();
        const validLights: Light[] = this.pipeline.getValidLights();
        const lightBuffers: GFXBuffer[] = this.pipeline.getLightBuffers();

        // update lightbatchQueues length
        for (let l = 0; l < validLights.length; ++l) {
            if (!this._lightBatchQueues[l]) {
                let sortFunc: (a: IRenderPass, b: IRenderPass) => number = opaqueCompareFn;
                this._lightBatchQueues.push(new RenderLightBatchedQueue({
                    isTransparent: false,
                    phases: getPhaseID("forward-add"),
                    sortFunc,
                }));
            }
            // update per-lightBatchQueue UBO
            this._lightBatchQueues[l].updateLightBuffer(lightBuffers[l]);
        }

        let m = 0; let p = 0; let k = 0; let l = 0;
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
                        const pso = subModel.psos![p];
                        if (pass.instancedBuffer) {
                            pass.instancedBuffer.merge(subModel, ro.model.instancedAttributes, pso);
                            this._opaqueInstancedQueue.queue.add(pass.instancedBuffer);
                        } else if (pass.batchedBuffer) {
                            pass.batchedBuffer.merge(subModel, ro, pso);
                            this._opaqueBatchedQueue.queue.add(pass.batchedBuffer);
                        } else {
                            for (k = 0; k < this._renderQueues.length; k++) {
                                this._renderQueues[k].insertRenderPass(ro, m, p);
                            }
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
                                               
                        // Organize light-batched-queues
                        for (l = lightIndexOffset[i]; l < nextLightIndex; l++) {
                            const light = validLights[lightIndices[l]];
                            switch (light.type) {
                                case LightType.SPHERE:
                                    this._lightBatchQueues[lightIndices[l]].add(pass, ro, m, myForward_Light_Sphere_Patches);
                                    break;

                                case LightType.SPOT:
                                    this._lightBatchQueues[lightIndices[l]].add(pass, ro, m, myForward_Light_Sport_Patches);
                                    break;
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
        for (let l = 0; l < this._lightBatchQueues.length; ++l) {
            this._lightBatchQueues[l].recordCommandBuffer(cmdBuff);
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
    
    protected lightBatchQueueClearFunc (rlbq: RenderLightBatchedQueue){
        rlbq.clear();
    }
}
