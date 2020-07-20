/**
 * @category pipeline
 */

import { ForwardFlowPriority } from '../forward/enum';
import { RenderFlowType } from '../pipeline-serialization';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { UIStage } from './ui-stage';
import { RenderContext } from '../render-context';
import { ForwardUBOStage } from '../forward/forward-ubo-stage';
import { ForwardCullingStage } from '../forward/forward-culling-stage';

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

        const forwardCullingStage = new ForwardCullingStage();
        forwardCullingStage.initialize(ForwardCullingStage.initInfo);
        this._stages.push(forwardCullingStage);

        const forwardUBOStage = new ForwardUBOStage();
        forwardUBOStage.initialize(ForwardUBOStage.initInfo);
        this._stages.push(forwardUBOStage);

        const uiStage = new UIStage();
        uiStage.initialize(UIStage.initInfo);
        this._stages.push(uiStage);

        return true;
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild (rctx: RenderContext) {
    }

    public render (rctx: RenderContext, view: RenderView) {
        view.camera.update();
        super.render(rctx, view);
    }
}
