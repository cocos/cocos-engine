/**
 * @category pipeline
 */

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_FORWARD } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { ForwardFlowPriority } from './enum';
import { ForwardStage } from './forward-stage';
import { ForwardPipeline } from './forward-pipeline';
import { RenderPipeline } from '../render-pipeline';
/**
 * @en The forward flow in forward render pipeline
 * @zh 前向渲染流程。
 */
@ccclass('ForwardFlow')
export class ForwardFlow extends RenderFlow {

    /**
     * @en The shared initialization information of forward render flow
     * @zh 共享的前向渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_FORWARD,
        priority: ForwardFlowPriority.FORWARD,
        stages: []
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const forwardStage = new ForwardStage();
            forwardStage.initialize(ForwardStage.initInfo);
            this._stages.push(forwardStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        pipeline.updateUBOs(view);
        super.render(view);
    }

    public destroy () {
        super.destroy();
    }
}
