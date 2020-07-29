/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_FORWARD } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { ForwardFlowPriority } from './enum';
import { ForwardStage } from './forward-stage';
import { sceneCulling } from './scene-culling';
import { ForwardPipeline } from './forward-pipeline';
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
    };

    public initialize (info: IRenderFlowInfo) {
        super.initialize(info);

        const forwardStage = new ForwardStage();
        forwardStage.initialize(ForwardStage.initInfo);
        this._stages.push(forwardStage);
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        view.camera.update();
        sceneCulling(pipeline, view);
        pipeline.updateUBOs(view);
        super.render(view);
    }

    public destroy () {
        super.destroy();
    }
}
