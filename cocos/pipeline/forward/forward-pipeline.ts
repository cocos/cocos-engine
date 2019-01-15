import { Root } from '../../core/root';
import { GFXBufferUsageBit, GFXMemoryUsageBit } from '../../gfx/define';
import { GFXRenderPass } from '../../gfx/render-pass';
import { RenderPassStage } from '../define';
import { RenderPipeline, UBOGlobal } from '../render-pipeline';
import { ForwardFlow } from './forward-flow';

export enum ForwardFlowPriority {
    FORWARD = 0,
}

export class ForwardPipeline extends RenderPipeline {

    constructor (root: Root) {
        super(root);
    }

    public initialize (): boolean {

        if (!this.createQuadInputAssembler()) {
            return false;
        }

        if (!this.createUBOs()) {
            return false;
        }

        const mainWindow = this._root.mainWindow;
        let windowPass: GFXRenderPass | null = null;

        if (mainWindow) {
            windowPass = mainWindow.renderPass;
        }

        if (!windowPass) {
            console.error('RenderPass of main window is null.');
            return false;
        }

        this.addRenderPass(RenderPassStage.DEFAULT, windowPass);

        // create UBOs
        this._globalUBO = this._root.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: UBOGlobal.SIZE,
        });

        // create flows
        this.createFlow<ForwardFlow>(ForwardFlow, {
            name: 'ForwardFlow',
            priority: ForwardFlowPriority.FORWARD,
        });

        return true;
    }

    public destroy () {
        this.destroyFlows();
        this.clearRenderPasses();
        this.destroyUBOs();
        this.destroyQuadInputAssembler();
    }

}
