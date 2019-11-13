/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
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
@ccclass('ForwardFlow')
export class ForwardFlow extends RenderFlow {

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor () {
        super();
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
