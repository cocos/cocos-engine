/**
 * @category pipeline
 */

import { ccclass } from '../../data/class-decorator';
import { RenderPipeline } from '../render-pipeline';
import { UIFlow } from '../ui/ui-flow';
import { ForwardFlow } from './forward-flow';
import { ToneMapFlow } from '../ppfx/tonemap-flow';
import { Root } from '../../root';

/**
 * @en The forward render pipeline
 * @zh 前向渲染管线。
 */
@ccclass('ForwardPipeline')
export class ForwardPipeline extends RenderPipeline {
    public initialize () {
        super.initialize();
        const forwardFlow = new ForwardFlow();
        forwardFlow.initialize(ForwardFlow.initInfo);
        this.addFlow(forwardFlow);
    }

    public activate (root: Root): boolean {
        if (!super.activate(root)) {
            return false;
        }

        const rctx = this._renderContext;

        if (rctx.usePostProcess) {
            const tonemapFlow = new ToneMapFlow();
            tonemapFlow.initialize(ForwardFlow.initInfo);
            this.addFlow(tonemapFlow);
            tonemapFlow.activate(rctx);
        }

        const uiFlow = new UIFlow();
        uiFlow.initialize(UIFlow.initInfo);
        this.addFlow(uiFlow);
        uiFlow.activate(rctx);

        return true;
    }

    public destroy () {
        this._destroy();
    }
}
