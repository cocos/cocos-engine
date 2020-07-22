/**
 * @category pipeline
 */

import { ForwardFlowPriority } from '../forward/enum';
import { RenderFlowType } from '../pipeline-serialization';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { UIStage } from './ui-stage';
import { RenderContext } from '../render-context';

/**
 * @en The UI render flow
 * @zh UI渲染流程。
 */
export class UIFlow extends RenderFlow {

    public static initInfo: IRenderFlowInfo = {
        name: 'UIFlow',
        priority: ForwardFlowPriority.UI,
        type: RenderFlowType.UI,
    };

    public initialize (info: IRenderFlowInfo): boolean {

        super.initialize(info);

        const uiStage = new UIStage();
        uiStage.initialize(UIStage.initInfo);
        this.addStage(uiStage);

        return true;
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild (rctx: RenderContext) {
    }

    public render (rctx: RenderContext, view: RenderView) {
        view.camera.update();
        rctx.sceneCulling(view);
        rctx.updateUBO(view);
        super.render(rctx, view);
    }
}
