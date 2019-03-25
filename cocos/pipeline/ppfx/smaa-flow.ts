import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { SMAABlendStage } from './smaa-blend-stage';
import { SMAAEdgeStage } from './smaa-edge-stage';

export class SMAAEdgeFlow extends RenderFlow {

    constructor (pipeline: RenderPipeline) {
        super(pipeline);
    }

    public initialize (info: IRenderFlowInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        const smaaMtl = this._material;
        smaaMtl._uuid = 'smaa-material';
        smaaMtl.initialize({
            effectName: 'builtin-smaa',
        });

        this.createStage(SMAAEdgeStage, {
            name: 'SMAAEdgeStage',
            priority: 0,
            framebuffer: this._pipeline.smaaEdgeFBO,
        });

        this.createStage(SMAABlendStage, {
            name: 'SMAABlendStage',
            priority: 0,
            framebuffer: this._pipeline.smaaBlendFBO,
        });

        return true;
    }

    public destroy () {

        if (this._material) {
            this._material.destroy();
        }

        this.destroyStages();
    }

    public rebuild () {
    }
}
