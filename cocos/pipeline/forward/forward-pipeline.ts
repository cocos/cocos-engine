import { RenderPipeline, RenderPassStage, UBOGlobal } from "../render-pipeline";
import { Root } from "../../core/root";
import { ForwardFlow } from "./forward-flow";
import { GFXRenderPass } from "../../gfx/render-pass";
import { GFXBufferUsageBit, GFXMemoryUsageBit } from "../../gfx/define";

export enum ForwardFlowPriority {
    FORWARD = 0,
};

export class ForwardPipeline extends RenderPipeline {

    constructor(root: Root) {
        super(root);
    }

    public initialize(): boolean {
        
        if(!this.createQuadInputAssembler()) {
            return false;
        }

        if(!this.createUBOs()) {
            return false;
        }

        let mainWindow = this._root.mainWindow;
        let windowPass: GFXRenderPass | null = null;

        if(mainWindow) {
            windowPass = mainWindow.renderPass;
        }

        if(!windowPass) {
            console.error("RenderPass of main window is null.");
            return false;
        }

        this.addRenderPass(RenderPassStage.WINDOW, windowPass);

        // create UBOs
        this._globalUBO = this._root.device.createBuffer({
            usage: GFXBufferUsageBit.UNIFORM | GFXBufferUsageBit.TRANSFER_DST,
            memUsage: GFXMemoryUsageBit.HOST,
            size: UBOGlobal.SIZE,
        });

        // create flows
        this.createFlow<ForwardFlow>(ForwardFlow, {
            name: "ForwardFlow",
            priority: ForwardFlowPriority.FORWARD,
        });

        return true;
    }

    public destroy() {
        this.destroyFlows();
        this.clearRenderPasses();
        this.destroyUBOs();
        this.destroyQuadInputAssembler();
    }

};
