/**
 * @category pipeline
 */

import { CCString } from '../data';
import { ccclass, property } from '../data/class-decorator';
import { GFXCommandBuffer } from '../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType, IGFXColor, IGFXRect } from '../gfx/define';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { Pass } from '../renderer/core/pass';
import { ccenum } from '../value-types/enum';
import { IRenderPass, RenderPassStage } from './define';
import { getPhaseID } from './pass-phase';
import { RenderFlow } from './render-flow';
import { RenderPipeline } from './render-pipeline';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from './render-queue';
import { RenderView } from './render-view';
import { IPSOCreateInfo } from '../renderer';
import { legacyCC } from '../global-exports';
import { PipelineGlobal } from './global';

const _colors: IGFXColor[] = [ { r: 0, g: 0, b: 0, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

export enum RenderQueueSortMode {
    FRONT_TO_BACK,
    BACK_TO_FRONT,
}

ccenum(RenderQueueSortMode);

/**
 * @en The render stage information descriptor
 * @zh 渲染阶段描述信息。
 */
export interface IRenderStageInfo {
    name?: string;
    priority: number;
    renderQueues?: RenderQueueDesc[];
    framebuffer?: string;
}

/**
 * @en The render queue descriptor
 * @zh 渲染队列描述信息
 */
@ccclass('RenderQueueDesc')
class RenderQueueDesc {

    /**
     * @en Whether the render queue is a transparent queue
     * @zh 当前队列是否是半透明队列
     */
    @property
    public isTransparent: boolean = false;

    /**
     * @en The sort mode of the render queue
     * @zh 渲染队列的排序模式
     */
    @property({ type: RenderQueueSortMode })
    public sortMode: RenderQueueSortMode = RenderQueueSortMode.FRONT_TO_BACK;

    /**
     * @en The stages using this queue
     * @zh 使用当前渲染队列的阶段列表
     */
    @property({ type: [CCString] })
    public stages: string[] = [];
}

/**
 * @en The render stage actually renders render objects to the output window or other [[GFXFrameBuffer]].
 * Typically, a render stage collects render objects it's responsible for, clear the camera,
 * record and execute command buffer, and at last present the render result.
 * @zh 渲染阶段是实质上的渲染执行者，它负责收集渲染数据并执行渲染将渲染结果输出到屏幕或其他 [[GFXFrameBuffer]] 中。
 * 典型的渲染阶段会收集它所管理的渲染对象，按照 [[Camera]] 的清除标记进行清屏，记录并执行渲染指令缓存，并最终呈现渲染结果。
 */
@ccclass('RenderStage')
export abstract class RenderStage {

    /**
     * @en The render flow the current stage belongs to
     * @zh 当前渲染阶段所归属的渲染流程。
     */
    public get flow (): RenderFlow {
        return this._flow;
    }

    /**
     * @en The render pipeline the current stage belongs to
     * @zh 当前渲染阶段所归属的渲染管线。
     */
    public get pipeline (): RenderPipeline {
        return this._pipeline;
    }

    /**
     * @en Priority of the current stage
     * @zh 当前渲染阶段的优先级。
     */
    public get priority (): number {
        return this._priority;
    }

    /**
     * @en The frame buffer used by the current stage
     * @zh 当前渲染阶段所使用的帧缓冲
     */
    public get framebuffer (): GFXFramebuffer | null {
        return this._framebuffer;
    }

    /**
     * @en Name
     * @zh 名称。
     */
    @property({
        displayOrder: 0,
        visible: true,
    })
    protected _name: string = '';

    @property({
        displayOrder: 1,
        visible: true,
    })
    protected _priority: number = 0;

    @property({
        displayOrder: 2,
        visible: true,
    })
    protected frameBuffer: string = '';

    @property({
        type: [RenderQueueDesc],
        displayOrder: 3,
        visible: true,
    })
    protected renderQueues: RenderQueueDesc[] = [];

    protected _renderQueues: RenderQueue[] = [];

    protected _flow: RenderFlow = null!;

    protected _pipeline: RenderPipeline = null!;

    protected _framebuffer: GFXFramebuffer | null = null;

    /**
     * @en The list of clear colors
     * @zh 清空颜色数组。
     */
    protected _clearColors: IGFXColor[] | null = null;

    /**
     * @en The clear depth
     * @zh 清空深度。
     */
    protected _clearDepth: number = 1.0;

    /**
     * @en The clear stencil mask
     * @zh 清空模板。
     */
    protected _clearStencil: number = 0;

    /**
     * @en The render area rect
     * @zh 渲染区域。
     */
    protected _renderArea: IGFXRect | null = null;

    /**
     * @en The render pass of this stage
     * @zh 着色过程。
     */
    protected _pass: Pass | null = null;

    /**
     * @en The pipeline state object.
     * @zh GFX管线状态。
     */
    protected _psoCreateInfo: IPSOCreateInfo | null = null;

    /**
     * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
     * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
     * @param info The render stage information
     */
    public initialize (info: IRenderStageInfo): boolean {
        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        if (info.framebuffer) {
            this.frameBuffer = info.framebuffer;
        }

        if (info.renderQueues) {
            this.renderQueues = info.renderQueues;
        }

        return true;
    }

    /**
     * @en Activate the current render stage in the given render flow
     * @zh 为指定的渲染流程开启当前渲染阶段
     * @param flow The render flow to activate this render stage
     */
    public activate (flow: RenderFlow) {
        this._flow = flow;
        this._pipeline = flow.pipeline;

        if (!PipelineGlobal.device) {
            throw new Error('');
        }

        this._clearColors = [{ r: 0.3, g: 0.6, b: 0.9, a: 1.0 }];
        this._renderArea = { x: 0, y: 0, width: 0, height: 0 };

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

        if (this.frameBuffer === 'window') {
            this._framebuffer = PipelineGlobal.root.mainWindow!.framebuffer;
        } else {
            this._framebuffer = this._flow.pipeline.getFrameBuffer(this.frameBuffer)!;
        }
    }

    /**
     * @en Destroy function
     * @zh 销毁函数。
     */
    public abstract destroy ();

    /**
     * @en Render function
     * @zh 渲染函数。
     * @param view The render view
     */
    public abstract render (view: RenderView);

    /**
     * @en Reset the size.
     * @zh 重置大小。
     * @param width The screen width
     * @param height The screen height
     */
    public abstract resize (width: number, height: number);

    /**
     * @en Rebuild function.
     * @zh 重构函数。
     */
    public abstract rebuild ();

    /**
     * @en Set the clear color
     * @zh 设置清空颜色。
     * @param color The clear color
     */
    public setClearColor (color: IGFXColor) {
        if (this._clearColors!.length > 0) {
            this._clearColors![0] = color;
        } else {
            this._clearColors!.push(color);
        }
    }

    /**
     * @en The the entire list of clear colors
     * @zh 设置清空颜色数组。
     * @param colors The clear colors
     */
    public setClearColors (colors: IGFXColor[]) {
        this._clearColors = colors;
    }

    /**
     * @en Set clear depth
     * @zh 设置清空深度。
     * @param depth The clear depth
     */
    public setClearDepth (depth: number) {
        this._clearDepth = depth;
    }

    /**
     * @en Set clear stencil mask
     * @zh 设置清空模板。
     * @param stencil The clear stencil mask
     */
    public setClearStencil (stencil: number) {
        this._clearStencil = stencil;
    }

    /**
     * @en Set the render area rect size
     * @zh 设置渲染区域。
     * @param width The render area width
     * @param height The render area height
     */
    public setRenderArea (width: number, height: number) {
        this._renderArea!.width = width;
        this._renderArea!.height = height;
    }

    /**
     * @en Sort all render queues
     * @zh 对所有渲染队列进行排序
     */
    public sortRenderQueue () {
        this._renderQueues.forEach(this.renderQueueClearFunc);
        const renderObjects = this._pipeline.renderObjects;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            for (let l = 0; l < ro.model.subModelNum; l++) {
                for (let j = 0; j < ro.model.getSubModel(l).passes.length; j++) {
                    for (let k = 0; k < this._renderQueues.length; k++) {
                        this._renderQueues[k].insertRenderPass(ro, l, j);
                    }
                }
            }
        }
        this._renderQueues.forEach(this.renderQueueSortFunc);
    }

    /**
     * @en Execute the command buffers collected in all render queue for the given render view and submit.
     * @zh 基于指定的渲染视图执行所有渲染队列中收集的命令缓冲并提交渲染
     * @param view The render view
     */
    public executeCommandBuffer (view: RenderView) {
        const camera = view.camera;

        const cmdBuff = this._pipeline.commandBuffers[0];

        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width * this.pipeline!.shadingScale;
        this._renderArea!.height = vp.height * camera.height * this.pipeline!.shadingScale;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            _colors[0].a = camera.clearColor.a;
            _colors[0].r = camera.clearColor.r;
            _colors[0].g = camera.clearColor.g;
            _colors[0].b = camera.clearColor.b;
        }
        if (!this._framebuffer) {
            this._framebuffer = view.window.framebuffer;
        }
        const renderPass = this._framebuffer.renderPass;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, this._framebuffer!, this._renderArea!, _colors, camera.clearDepth, camera.clearStencil);

        for (let i = 0; i < this._renderQueues.length; i++) {
            this._renderQueues[i].recordCommandBuffer(PipelineGlobal.device, this._framebuffer.renderPass!, cmdBuff);
        }

        cmdBuff.endRenderPass();
        cmdBuff.end();

        PipelineGlobal.device.queue.submit(this._pipeline.commandBuffers);
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

legacyCC.RenderStage = RenderStage;
