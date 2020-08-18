/**
 * @category pipeline
 */
import { ccclass } from '../../data/class-decorator';
import { ForwardFlowPriority } from '../forward/enum';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { UIStage } from './ui-stage';
import { RenderFlowTag } from '../pipeline-serialization';
import { sceneCulling } from '../forward/scene-culling';
import { ForwardPipeline } from '../forward/forward-pipeline';

/**
 * @en The UI render flow
 * @zh UI渲染流程。
 */
@ccclass('UIFlow')
export class UIFlow extends RenderFlow {

    public static initInfo: IRenderFlowInfo = {
        name: 'UIFlow',
        priority: ForwardFlowPriority.UI,
        tag: RenderFlowTag.UI,
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

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        view.camera.update();
        sceneCulling(pipeline, view);
        pipeline.updateUBOs(view);
        super.render(view);
    }
}
