import { RenderFlow, RenderFlowInfo } from "../render-flow";

export class ForwardFlow extends RenderFlow {

    public initialize(info: RenderFlowInfo): boolean {
        
        if(info.name) {
            this._name = info.name;
        }

        this._priority = info.priority;
        
        return true;
    }

    public destroy(): void {
        this.destroyStages();
    }
};
