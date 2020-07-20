/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { ToneMapStage } from './tonemap-stage';
import { PIPELINE_FLOW_TONEMAP } from '../define';
import { ForwardFlowPriority } from '../forward/enum';
import { RenderContext } from '../render-context';

/**
 * @en The tone mapping render flow
 * @zh 色调映射渲染流程。
 */
@ccclass('ToneMapFlow')
export class ToneMapFlow extends RenderFlow {

    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_TONEMAP,
        priority: ForwardFlowPriority.FORWARD + 1,
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);

        const toneStage = new ToneMapStage();
        toneStage.initialize(ToneMapStage.initInfo);
        this._stages.push(toneStage);

        return true;
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild (rctx: RenderContext) {
        for (const stage of this._stages) {
            stage.rebuild(rctx);
        }
    }
}
