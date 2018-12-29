import { RenderPipeline } from "../render-pipeline";
import { Root } from "../../../core/root";

export class ForwardPipeline extends RenderPipeline {

    constructor(root: Root) {
        super(root);
    }

    public initialize(): boolean {
        
        return true;
    }

    public destroy(): void {
        this.destroyFlows();
    }
};
