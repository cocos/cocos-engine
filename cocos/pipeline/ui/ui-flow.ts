import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { UIStage } from './ui-stage';

export class UIFlow extends RenderFlow {

    constructor (pipeline: RenderPipeline) {
        super(pipeline);
    }

    public initialize (info: IRenderFlowInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        const mainWindow = this._pipeline.root.mainWindow;
        if (!mainWindow || !mainWindow.framebuffer) {
            return false;
        }

        this.createStage(UIStage, {
            name: 'UIStage',
            priority: 0,
            framebuffer:  mainWindow.framebuffer,
        });

        return true;
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild () {
    }

}
