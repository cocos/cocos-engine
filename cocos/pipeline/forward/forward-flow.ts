import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
// import { TestStage } from "./test-stage";
import { TestModelStage } from './test-model-stage';
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

        const mainWindow = this._pipeline.root.mainWindow;
        if (!mainWindow || !mainWindow.framebuffer) {
            return false;
        }
        
        this.createStage(ForwardStage, {
            name: 'ForwardStage',
            priority: ForwardStagePriority.FORWARD,
            framebuffer:  mainWindow.framebuffer,
        });

        /*
        this.createStage<TestModelStage>(TestModelStage, {
            name: 'TestModelStage',
            priority: ForwardStagePriority.FORWARD,
            framebuffer:  mainWindow.framebuffer,
        });
        */

        /*
        this.createStage<TestStage>(TestStage, {
            name: 'TestStage',
            priority: ForwardStagePriority.FORWARD,
            framebuffer: mainWindow.framebuffer,
        });
        */

        return true;
    }

    public destroy (): void {
        this.destroyStages();
    }
}
