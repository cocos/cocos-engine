/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_FORWARD } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { ForwardFlowPriority } from './enum';
import { ForwardStage } from './forward-stage';
import { RenderContext } from '../render-context';
import { ForwardUBOStage } from './forward-ubo-stage';
import { ForwardCullingStage } from './forward-culling-stage';
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

        const forwardCullingStage = new ForwardCullingStage();
        forwardCullingStage.initialize(ForwardCullingStage.initInfo);
        this._stages.push(forwardCullingStage);

        const forwardUBOStage = new ForwardUBOStage();
        forwardUBOStage.initialize(ForwardUBOStage.initInfo);
        this._stages.push(forwardUBOStage);

        const forwardStage = new ForwardStage();
        forwardStage.initialize(ForwardStage.initInfo);
        this._stages.push(forwardStage);
    }

    public render (rctx: RenderContext, view: RenderView) {
        view.camera.update();
        super.render(rctx, view);
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild (rctx: RenderContext) {
    }
}
