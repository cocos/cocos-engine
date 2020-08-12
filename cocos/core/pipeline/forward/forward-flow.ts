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
import { RenderAdditiveLightQueue } from '../render-additive-light-queue';
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
    };

    protected _additiveLightQueue!: RenderAdditiveLightQueue;

    public initialize (info: IRenderFlowInfo): boolean {
        super.initialize(info);

        const forwardStage = new ForwardStage();
        forwardStage.initialize(ForwardStage.initInfo);
        this._stages.push(forwardStage);

        return true;
    }

    public activate (pipeline: RenderPipeline) {
        super.activate(pipeline);

        const pl = pipeline as ForwardPipeline;
        this._additiveLightQueue = new RenderAdditiveLightQueue(pl.device, pl.isHDR, pl.fpScale, pl.renderObjects);

        (this._stages[0] as ForwardStage).additiveLightQueue = this._additiveLightQueue;
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        view.camera.update();

        sceneCulling(pipeline, view);
        this._additiveLightQueue.sceneCulling(view);

        pipeline.updateUBOs(view);
        this._additiveLightQueue.updateUBOs(view);

        super.render(view);
    }

    public destroy () {
        super.destroy();
    }
}
