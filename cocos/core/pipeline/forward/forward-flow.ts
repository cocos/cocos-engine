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
     * 初始化函数。
     * @param info 渲染流程描述信息。
     */
    public initialize (info: IRenderFlowInfo): boolean {

        super.initialize(info);

        this.createStage(ForwardStage, {
            flow: this,
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
