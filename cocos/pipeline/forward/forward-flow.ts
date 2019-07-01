/**
 * @category pipeline.forward
 */

import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { ForwardStage } from './forward-stage';

/**
 * @zh
 * 前向阶段优先级。
 */
export enum ForwardStagePriority {
    FORWARD = 0,
}

/**
 * @zh
 * 前向渲染流程。
 */
export class ForwardFlow extends RenderFlow {

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor (pipeline: RenderPipeline) {
        super(pipeline);
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染流程描述信息。
     */
    public initialize (info: IRenderFlowInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        this.createStage(ForwardStage, {
            name: 'ForwardStage',
            priority: ForwardStagePriority.FORWARD,
        });

        return true;
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        this.destroyStages();
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
    }
}
