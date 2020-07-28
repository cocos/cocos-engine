/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_FORWARD, UNIFORM_SHADOWMAP } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { ForwardFlowPriority } from './enum';
import { ForwardStage } from './forward-stage';
import { ForwardRenderContext } from './forward-render-context';
import { sceneCulling } from './scene-culling';

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

    public render (rctx: ForwardRenderContext, view: RenderView) {
        view.camera.update();
        sceneCulling(rctx, view);
        rctx.updateUBOs(view);
        super.render(rctx, view);
    }

    public destroy () {
        super.destroy();
    }
}
