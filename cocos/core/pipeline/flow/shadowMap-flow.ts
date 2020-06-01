/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_FORWARD } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { ForwardFlowPriority } from '../forward/enum';
import { ForwardStage } from '../forward/forward-stage';

/**
 * @zh
 * shadowMap flow
 */
@ccclass('ShadowMapFlow')
export class ShadowMapFlow extends RenderFlow {

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor () {
        super();
    }

    public initialize (info: IRenderFlowInfo) {
        super.initialize(info);
        // add shadowMap-stages
    }

    public render (view: RenderView) {

        //view.camera.update();

        // this.pipeline.sceneCulling(view);

        // this.pipeline.updateUBOs(view);

        //this.pipeline.updateShadowUBOs(view);

        //super.render(view);
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        this.destroyStages();
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
    }
}