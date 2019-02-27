import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { ToneMapStage } from './tonemap-stage';

export class ToneMapFlow extends RenderFlow {

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
            effectName: 'builtin-tonemap',
        });

        this._material = material;

        const framebuffer = this._pipeline.root.mainWindow!.framebuffer!;

        this.createStage(ToneMapStage, {
            name: 'ToneMapStage',
            priority: 0,
            framebuffer,
        });

        return true;
    }

    public destroy (): void {
        this.destroyStages();
    }
}
