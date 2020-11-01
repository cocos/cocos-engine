/**
 * @packageDocumentation
 * @module pipeline
 */

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { IRenderPass, SetIndex } from '../define';
import { getPhaseID } from '../pass-phase';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from '../render-queue';
import { ClearFlag } from '../../gfx/define';
import { Color, Rect } from '../../gfx';
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
import { PlanarShadowQueue } from './planar-shadow-queue';

const colors: Color[] = [ new Color(0, 0, 0, 1) ];

/**
 * @en The forward render stage
 * @zh 前向渲染阶段。
 */
@ccclass('ForwardStage')
export class ForwardStage extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'ForwardStage',
        priority: ForwardStagePriority.FORWARD,
        tag: 0,
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
        ]
    };


    @type([RenderQueueDesc])
    @serializable
    @displayOrder(2)
    protected renderQueues: RenderQueueDesc[] = [];
    protected _renderQueues: RenderQueue[] = [];

    private _renderArea = new Rect();
    private _batchedQueue: RenderBatchedQueue;
    private _instancedQueue: RenderInstancedQueue;
    private _phaseID = getPhaseID('default');
    private declare _additiveLightQueue: RenderAdditiveLightQueue;
    private declare _planarQueue: PlanarShadowQueue;

    constructor () {
        super();
        this._batchedQueue = new RenderBatchedQueue();
        this._instancedQueue = new RenderInstancedQueue();
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }
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

        this._additiveLightQueue = new RenderAdditiveLightQueue(this._pipeline as ForwardPipeline);
        this._planarQueue = new PlanarShadowQueue(this._pipeline as ForwardPipeline);
    }


    public destroy () {
    }

    public render (view: RenderView) {

        this._instancedQueue.clear();
        this._batchedQueue.clear();
        const pipeline = this._pipeline as ForwardPipeline;
        const device = pipeline.device;
        this._renderQueues.forEach(this.renderQueueClearFunc);

        const renderObjects = pipeline.renderObjects;
        let m = 0; let p = 0; let k = 0;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            const subModels = ro.model.subModels;
            for (m = 0; m < subModels.length; ++m) {
                const subModel = subModels[m];
                const passes = subModel.passes;
                for (p = 0; p < passes.length; ++p) {
                    const pass = passes[p];
                    if (pass.phase !== this._phaseID) continue;
                    const batchingScheme = pass.batchingScheme;
                    if (batchingScheme === BatchingSchemes.INSTANCING) {
                        const instancedBuffer = InstancedBuffer.get(pass);
                        instancedBuffer.merge(subModel, ro.model.instancedAttributes, p);
                        this._instancedQueue.queue.add(instancedBuffer);
                    } else if (batchingScheme === BatchingSchemes.VB_MERGING) {
                        const batchedBuffer = BatchedBuffer.get(pass);
                        batchedBuffer.merge(subModel, p, ro);
                        this._batchedQueue.queue.add(batchedBuffer);
                    } else {
                        for (k = 0; k < this._renderQueues.length; k++) {
                            this._renderQueues[k].insertRenderPass(ro, m, p);
                        }
                    }
                }
            }
        }
        this._renderQueues.forEach(this.renderQueueSortFunc);

        const cmdBuff = pipeline.commandBuffers[0];

        this._instancedQueue.uploadBuffers(cmdBuff);
        this._batchedQueue.uploadBuffers(cmdBuff);
        this._additiveLightQueue.gatherLightPasses(view, cmdBuff);
        this._planarQueue.gatherShadowPasses(view, cmdBuff);

        const camera = view.camera;
        const vp = camera.viewport;
        // render area is not oriented
        const w = view.window.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.height : camera.width;
        const h = view.window.hasOnScreenAttachments && device.surfaceTransform % 2 ? camera.width : camera.height;
        this._renderArea!.x = vp.x * w;
        this._renderArea!.y = vp.y * h;
        this._renderArea!.width = vp.width * w * pipeline.shadingScale;
        this._renderArea!.height = vp.height * h * pipeline.shadingScale;

        if (camera.clearFlag & ClearFlag.COLOR) {
            if (pipeline.isHDR) {
                SRGBToLinear(colors[0], camera.clearColor);
                const scale = pipeline.fpScale / camera.exposure;
                colors[0].x *= scale;
                colors[0].y *= scale;
                colors[0].z *= scale;
            } else {
                colors[0].x = camera.clearColor.x;
                colors[0].y = camera.clearColor.y;
                colors[0].z = camera.clearColor.z;
            }
        }

        colors[0].w = camera.clearColor.w;

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);

        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._additiveLightQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._planarQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._renderQueues[1].recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
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
