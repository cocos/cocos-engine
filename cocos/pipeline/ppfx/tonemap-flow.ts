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
            defines: { CC_USE_SMAA: this._pipeline.useSMAA },
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

    public rebuild () {
        if (this._material) {
            this._material.destroy();
            this._material.initialize({
                effectName: 'builtin-tonemap',
                defines: { CC_USE_SMAA: this._pipeline.useSMAA },
            });
        }

        for (const stage of this._stages) {
            stage.rebuild();
        }
    }
}
