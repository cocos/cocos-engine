/**
 * @category pipeline
 */

import { CCString } from '../data';
import { ccclass, property } from '../data/class-decorator';
import { ccenum } from '../value-types/enum';
import { IRenderPass } from './define';
import { getPhaseID } from './pass-phase';
import { opaqueCompareFn, RenderQueue, transparentCompareFn } from './render-queue';
import { RenderView } from './render-view';
import { legacyCC } from '../global-exports';
import { RenderPipeline } from './render-pipeline';
import { RenderFlow } from '..';

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
    name: string;
    priority: number;
    renderQueues?: RenderQueueDesc[];
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
     * @en Priority of the current stage
     * @zh 当前渲染阶段的优先级。
     */
    public get priority (): number {
        return this._priority;
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
        type: [RenderQueueDesc],
        displayOrder: 2,
        visible: true,
    })
    protected renderQueues: RenderQueueDesc[] = [];

    protected _renderQueues: RenderQueue[] = [];
    protected _pipeline!: RenderPipeline;
    protected _flow!: RenderFlow;

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
    public activate (pipeline: RenderPipeline, flow: RenderFlow) {
        this._pipeline = pipeline;
        this._flow = flow;

        if (!this._pipeline.device) {
            throw new Error('');
        }

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
}

legacyCC.RenderStage = RenderStage;
