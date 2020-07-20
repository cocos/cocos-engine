/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { IRenderPipelineInfo, RenderPipeline } from '../render-pipeline';
import { UIFlow } from '../ui/ui-flow';
import { ForwardFlow } from './forward-flow';
import { ToneMapFlow } from '../ppfx/tonemap-flow';
import { RenderContext } from '../render-context';

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {
    public static initInfo: IRenderPipelineInfo = {
    };

    public initialize (info: IRenderPipelineInfo) {
        super.initialize(info);
        const forwardFlow = new ForwardFlow();
        forwardFlow.initialize(ForwardFlow.initInfo);
        this._flows.push(forwardFlow);
    }

    public activate (rctx: RenderContext): boolean {
        if (!super.activate(rctx)) {
            return false;
        }

        if (rctx.usePostProcess) {
            const tonemapFlow = new ToneMapFlow();
            tonemapFlow.initialize(ForwardFlow.initInfo);
            this._flows.push(tonemapFlow);
            tonemapFlow.activate(rctx);
        }

        const uiFlow = new UIFlow();
        uiFlow.initialize(UIFlow.initInfo);
        this._flows.push(uiFlow);
        uiFlow.activate(rctx);

        return true;
    }

    public destroy () {
        this._destroy();
    }
}
