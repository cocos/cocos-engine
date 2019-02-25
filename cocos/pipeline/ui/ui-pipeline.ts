import { Root } from '../../core/root';
import { RenderPassStage } from '../define';
import { RenderPipeline } from '../render-pipeline';
import { RenderView } from '../render-view';
import { UIFlow } from './ui-flow';

export class UIPipeline extends RenderPipeline {

    constructor (root: Root) {
        super(root);
    }

    public initialize (): boolean {

        if (!this.createUBOs()) {
            return false;
        }

        // create flows
        this.createFlow<UIFlow>(UIFlow, {
            name: 'UIFlow',
            priority: 0,
        });

        return true;
    }

    public destroy () {
        this.destroyFlows();
        this.clearRenderPasses();
        this.destroyUBOs();
        this.destroyQuadInputAssembler();
    }

    protected updateUBOs (view: RenderView) {
        // view.camera.matViewProj.m14=1E-100;
        super.updateUBOs(view);
    }
}
