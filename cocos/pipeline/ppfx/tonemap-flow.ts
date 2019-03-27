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

        const material = this._material;
        material.initialize({
            effectName: 'pipeline/tonemap',
            defines: { CC_USE_SMAA: this._pipeline.useSMAA },
        });

        const framebuffer = this._pipeline.root.mainWindow!.framebuffer!;

        this.createStage(ToneMapStage, {
            name: 'ToneMapStage',
            priority: 0,
            framebuffer,
        });

        return true;
    }

    public destroy (): void {
        if (this._material) {
            this._material.destroy();
        }
        this.destroyStages();
    }

    public rebuild () {
        if (this._material) {
            this._material.destroy();
            this._material.initialize({
                effectName: 'pipeline/tonemap',
                defines: { CC_USE_SMAA: this._pipeline.useSMAA },
            });
        }

        for (const stage of this._stages) {
            stage.rebuild();
        }
    }
}
