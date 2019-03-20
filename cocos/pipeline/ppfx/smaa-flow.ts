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

        const material = new cc.Material();
        material.initialize({
            effectName: 'builtin-smaa',
        });

        this._material = material;

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

    public destroy (): void {
        this.destroyStages();
    }
}
