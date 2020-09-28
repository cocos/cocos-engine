/**
 * @category pipeline
 */

import { ccclass } from 'cc.decorator';
import { PIPELINE_FLOW_LIGHTING } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { DeferredFlowPriority } from './enum';
import { LightingStage } from './lighting-stage';
import { DeferredPipeline } from './deferred-pipeline';
import { RenderPipeline } from '../render-pipeline';
/**
 * @en The lighting flow in lighting render pipeline
 * @zh 前向渲染流程。
 */
@ccclass('LightingFlow')
export class LightingFlow extends RenderFlow {

    /**
     * @en The shared initialization information of lighting render flow
     * @zh 共享的前向渲染流程初始化参数
     */
    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_LIGHTING,
        priority: DeferredFlowPriority.LIGHTING,
        stages: []
    };

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);
        if (this._stages.length === 0) {
            const lightingStage = new LightingStage();
            lightingStage.initialize(LightingStage.initInfo);
            this._stages.push(lightingStage);
        }
        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as DeferredPipeline;
        pipeline.updateUBOs(view);
        super.render(view);
    }

    public destroy () {
        super.destroy();
    }
}
