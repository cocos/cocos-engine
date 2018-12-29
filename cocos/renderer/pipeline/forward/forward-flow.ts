import { RenderFlow, RenderFlowInfo } from "../render-flow";
import { GFXRenderPass } from "../../gfx/gfx-render-pass";
import { RenderPipeline } from "../render-pipeline";

export class ForwardFlow extends RenderFlow {

    constructor(pipeline: RenderPipeline) {
        super(pipeline);
    }

    public initialize(info: RenderFlowInfo): boolean {
        
        if(info.name) {
            this._name = info.name;
        }

        this._priority = info.priority;

        let device = this._pipeline.root.device;
        if(!device) {
            return false;
        }

        //this._pipeline.root.mainWindow;
        //this._renderPass = 
        
        return true;
    }

    public destroy(): void {
        this.destroyStages();
    }

    private _renderPass: GFXRenderPass | null = null;
};
