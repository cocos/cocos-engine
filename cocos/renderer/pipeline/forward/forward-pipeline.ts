import { RenderPipeline } from "../render-pipeline";

export class ForwardPipeline extends RenderPipeline {

    public initialize(): boolean {
        
        return true;
    }

    public destroy(): void {
        this.destroyFlows();
    }
};
