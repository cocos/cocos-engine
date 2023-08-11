/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, displayOrder, type, serializable } from 'cc.decorator';
import { SetIndex } from '../define';
import { getPhaseID } from '../pass-phase';
import { renderQueueClearFunc, RenderQueue, convertRenderQueue, renderQueueSortFunc } from '../render-queue';
import { ClearFlagBit, Color, Rect } from '../../gfx';
import { RenderInstancedQueue } from '../render-instanced-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { ForwardStagePriority } from '../enum';
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
import { BatchingSchemes } from '../../render-scene/core/pass';
import { ForwardFlow } from './forward-flow';
import { ForwardPipeline } from './forward-pipeline';
import { RenderQueueDesc, RenderQueueSortMode } from '../pipeline-serialization';
import { PlanarShadowQueue } from '../planar-shadow-queue';
import { UIPhase } from '../ui-phase';
import { Camera } from '../../render-scene/scene';
import { renderProfiler } from '../pipeline-funcs';

const colors: Color[] = [new Color(0, 0, 0, 1)];

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
        ],
    };

    @type([RenderQueueDesc])
    @serializable
    @displayOrder(2)
    protected renderQueues: RenderQueueDesc[] = [];
    protected _renderQueues: RenderQueue[] = [];

    private _renderArea = new Rect();
    private _instancedQueue: RenderInstancedQueue;
    private _phaseID = getPhaseID('default');
    private _clearFlag = 0xffffffff;
    private declare _additiveLightQueue: RenderAdditiveLightQueue;
    private declare _planarQueue: PlanarShadowQueue;
    private declare _uiPhase: UIPhase;

    additiveInstanceQueues: RenderInstancedQueue[] = [];

    constructor () {
        super();
        this._instancedQueue = new RenderInstancedQueue();
        this._uiPhase = new UIPhase();
    }

    public addRenderInstancedQueue (queue: RenderInstancedQueue): void {
        if (this.additiveInstanceQueues.includes(queue)) {
            return;
        }
        this.additiveInstanceQueues.push(queue);
    }

    public removeRenderInstancedQueue (queue: RenderInstancedQueue): void {
        const index = this.additiveInstanceQueues.indexOf(queue);
        if (index > -1) {
            this.additiveInstanceQueues.splice(index, 1);
        }
    }

    public initialize (info: IRenderStageInfo): boolean {
        super.initialize(info);
        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }
        return true;
    }

    public activate (pipeline: ForwardPipeline, flow: ForwardFlow): void {
        super.activate(pipeline, flow);
        for (let i = 0; i < this.renderQueues.length; i++) {
            this._renderQueues[i] = convertRenderQueue(this.renderQueues[i]);
        }

        this._additiveLightQueue = new RenderAdditiveLightQueue(this._pipeline as ForwardPipeline);
        this._planarQueue = new PlanarShadowQueue(this._pipeline);
        this._uiPhase.activate(pipeline);
    }

    public destroy (): void {
        // do nothing
    }

    public render (camera: Camera): void {
        this._instancedQueue.clear();
        const pipeline = this._pipeline as ForwardPipeline;
        const device = pipeline.device;
        this._renderQueues.forEach(renderQueueClearFunc);

        const renderObjects = pipeline.pipelineSceneData.renderObjects;
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
                        const instancedBuffer = pass.getInstancedBuffer();
                        instancedBuffer.merge(subModel, p);
                        this._instancedQueue.queue.add(instancedBuffer);
                    } else {
                        for (k = 0; k < this._renderQueues.length; k++) {
                            this._renderQueues[k].insertRenderPass(ro, m, p);
                        }
                    }
                }
            }
        }

        this._instancedQueue.sort();
        this._renderQueues.forEach(renderQueueSortFunc);

        const cmdBuff = pipeline.commandBuffers[0];
        pipeline.pipelineUBO.updateShadowUBO(camera);

        for (let i = 0; i < this.additiveInstanceQueues.length; i++) {
            this.additiveInstanceQueues[i].uploadBuffers(cmdBuff);
        }

        this._instancedQueue.uploadBuffers(cmdBuff);
        this._additiveLightQueue.gatherLightPasses(camera, cmdBuff);
        this._planarQueue.gatherShadowPasses(camera, cmdBuff);

        if (camera.clearFlag & ClearFlagBit.COLOR) {
            colors[0].x = camera.clearColor.x;
            colors[0].y = camera.clearColor.y;
            colors[0].z = camera.clearColor.z;
            colors[0].w = camera.clearColor.w;
        }
        pipeline.generateRenderArea(camera, this._renderArea);

        const framebuffer = camera.window.framebuffer;
        const renderPass = pipeline.getRenderPass(camera.clearFlag & this._clearFlag, framebuffer);
        cmdBuff.beginRenderPass(
            renderPass,
            framebuffer,
            this._renderArea,
            colors,
            camera.clearDepth,
            camera.clearStencil,
        );
        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);
        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);

        for (let i = 0; i < this.additiveInstanceQueues.length; i++) {
            this.additiveInstanceQueues[i].recordCommandBuffer(device, renderPass, cmdBuff);
        }

        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._additiveLightQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);
        this._planarQueue.recordCommandBuffer(device, renderPass, cmdBuff);
        this._renderQueues[1].recordCommandBuffer(device, renderPass, cmdBuff);
        camera.geometryRenderer?.render(renderPass, cmdBuff, pipeline.pipelineSceneData);
        this._uiPhase.render(camera, renderPass);
        renderProfiler(device, renderPass, cmdBuff, pipeline.profiler, camera);
        cmdBuff.endRenderPass();
    }
}
