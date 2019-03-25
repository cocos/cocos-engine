import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { ForwardStage } from './forward-stage';

export enum ForwardStagePriority {
    FORWARD = 0,
}

export class ForwardFlow extends RenderFlow {

    constructor (pipeline: RenderPipeline) {
        super(pipeline);
    }

    public initialize (info: IRenderFlowInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        this.createStage(ForwardStage, {
            name: 'ForwardStage',
            priority: ForwardStagePriority.FORWARD,
        });

        return true;
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild () {
    }
}
