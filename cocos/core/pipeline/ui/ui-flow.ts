/**
 * @category pipeline
 */

import { ForwardFlowPriority } from '../forward/enum';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { UIStage } from './ui-stage';
import { ForwardRenderContext } from '../forward/forward-render-context';
import { RenderFlowType } from '../pipeline-serialization';
import { sceneCulling } from '../forward/scene-culling';

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
        this._stages.push(uiStage);

        return true;
    }

    public destroy () {
        super.destroy();
    }

    public render (rctx: ForwardRenderContext, view: RenderView) {
        view.camera.update();
        sceneCulling(rctx, view);
        rctx.updateUBOs(view);
        super.render(rctx, view);
    }
}
