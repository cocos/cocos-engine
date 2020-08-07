/**
 * @category pipeline
 */

import { ccclass, property } from '../../data/class-decorator';
import { IRenderPass } from '../define';
import { getPhaseID } from '../pass-phase';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { GFXClearFlag, GFXColor, GFXRect } from '../../gfx/define';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderBatchedQueue } from '../render-batched-queue';
import { RenderInstancedQueue } from '../render-instanced-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from './enum';
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
import { InstancedBuffer } from '../instanced-buffer';
import { BatchedBuffer } from '../batched-buffer';
import { BatchingSchemes } from '../../renderer/core/pass';
import { ForwardFlow } from './forward-flow';
import { ForwardPipeline } from './forward-pipeline';
import { RenderQueueDesc, RenderQueueSortMode } from '../pipeline-serialization';

const colors: GFXColor[] = [ { r: 0, g: 0, b: 0, a: 1 } ];

/**
 * @en The forward render stage
 * @zh 前向渲染阶段。
 */
@ccclass('ForwardStage')
export class ForwardStage extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'ForwardStage',
        priority: ForwardStagePriority.FORWARD,
    };

    @property({
        type: [RenderQueueDesc],
        displayOrder: 2,
        visible: true,
    })
    protected renderQueues: RenderQueueDesc[] = [];
    protected _renderQueues: RenderQueue[] = [];

    private _renderArea: GFXRect = { x: 0, y: 0, width: 0, height: 0 };
    private _batchedQueue: RenderBatchedQueue;
    private _instancedQueue: RenderInstancedQueue;
    private _additiveLightQueue: RenderAdditiveLightQueue;
    private _lightPhaseID = getPhaseID('forward-add');

    constructor () {
        super();
        this._batchedQueue = new RenderBatchedQueue();
        this._instancedQueue = new RenderInstancedQueue();
        this._additiveLightQueue = new RenderAdditiveLightQueue();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        this.renderQueues = [
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
        ]

        return true;
    }

    public activate (pipeline: ForwardPipeline, flow: ForwardFlow) {
        super.activate(pipeline, flow);
        for (let i = 0; i < this.renderQueues.length; i++) {
            let phase = 0;
            for (let j = 0; j < this.renderQueues[i].stages.length; j++) {
                phase |= getPhaseID(this.renderQueues[i].stages[j]);
            }
            let sortFunc: (a: IRenderPass, b: IRenderPass) => number = opaqueCompareFn;
            switch (this.renderQueues[i].sortMode) {
                case RenderQueueSortMode.BACK_TO_FRONT:
                    sortFunc = transparentCompareFn;
                    break;
                case RenderQueueSortMode.FRONT_TO_BACK:
                    sortFunc = opaqueCompareFn;
                    break;
            }

            this._renderQueues[i] = new RenderQueue({
                isTransparent: this.renderQueues[i].isTransparent,
                phases: phase,
                sortFunc,
            });
        }
    }

    public destroy () {
    }

    public render (view: RenderView) {

        this._instancedQueue.clear();
        this._batchedQueue.clear();
        const pipeline = this._pipeline as ForwardPipeline;
        const validLights = pipeline.validLights;
        const lightBuffers = pipeline.lightBuffers;
        const lightIndices = pipeline.lightIndices;
        const device = pipeline.device;
        this._additiveLightQueue.clear(validLights, lightBuffers, lightIndices);
        this._renderQueues.forEach(this.renderQueueClearFunc);

        const renderObjects = pipeline.renderObjects;
        const lightIndexOffset = pipeline.lightIndexOffsets;
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
                        if (pass.batchingScheme === BatchingSchemes.INSTANCING) {
                            let instancedBuffer: InstancedBuffer;
                            if (pass.phase === this._lightPhaseID) {
                                for (let l = lightIndexOffset[i]; l < nextLightIndex; ++l) {
                                    const lightIndex = lightIndices[l];
                                    instancedBuffer = InstancedBuffer.get(pass, lightIndex);
                                    instancedBuffer.merge(subModel, ro.model.instancedAttributes, p);
                                }
                            } else {
                                instancedBuffer = InstancedBuffer.get(pass);
                                instancedBuffer.merge(subModel, ro.model.instancedAttributes, p);
                            }
                            this._instancedQueue.queue.add(instancedBuffer!);
                        } else if (pass.batchingScheme === BatchingSchemes.VB_MERGING) {
                            let batchedBuffer: BatchedBuffer;
                            if (pass.phase === this._lightPhaseID) {
                                for (let l = lightIndexOffset[i]; l < nextLightIndex; ++l) {
                                    const lightIndex = lightIndices[l];
                                    batchedBuffer = BatchedBuffer.get(lightIndex, device);
                                    batchedBuffer.merge(subModel, p, ro);
                                }
                            } else {
                                batchedBuffer = BatchedBuffer.get(pass, device);
                                batchedBuffer.merge(subModel, p, ro);
                            }
                            this._batchedQueue.queue.add(batchedBuffer!);
                        } else {
                            for (k = 0; k < this._renderQueues.length; k++) {
                                this._renderQueues[k].insertRenderPass(ro, m, p);
                            }
                            this._additiveLightQueue.add(ro, m, pass, lightIndexOffset[i], nextLightIndex);
                        }
                    }
                }
            } else {
                const subModels = ro.model.subModels;
                for (m = 0; m < subModels.length; m++) {
                    const subModel = subModels[m];
                    for (p = 0; p < subModel.passes.length; p++) {
                        const pass = subModel.passes[p];
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

        const cmdBuff = pipeline.commandBuffers[0];

        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width * pipeline.shadingScale;
        this._renderArea!.height = vp.height * camera.height * pipeline.shadingScale;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            if (pipeline.isHDR) {
                SRGBToLinear(colors[0], camera.clearColor);
                const scale = pipeline.fpScale / camera.exposure;
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

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);

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

        device.queue.submit(pipeline.commandBuffers);
    }

    /**
     * @en Clear the given render queue
     * @zh 清空指定的渲染队列
     * @param rq The render queue
     */
    protected renderQueueClearFunc (rq: RenderQueue) {
        rq.clear();
    }

    /**
     * @en Sort the given render queue
     * @zh 对指定的渲染队列执行排序
     * @param rq The render queue
     */
    protected renderQueueSortFunc (rq: RenderQueue) {
        rq.sort();
    }
}
