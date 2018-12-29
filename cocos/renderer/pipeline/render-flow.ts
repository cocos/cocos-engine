import { RenderStage, RenderStageInfo } from "./render-stage";
import { RenderView } from "./render-view";

export interface RenderFlowInfo {
    name?: string;
    priority: number;
};

export abstract class RenderFlow {

    public abstract initialize(info: RenderFlowInfo): boolean;
    public abstract destroy();

    public render(view: RenderView) {
        for(let i = 0; i < this._stages.length; ++i) {
            this._stages[i].render(view);
        }
    }

    public resize(width, height) {
        
    }

    public createStage<T extends RenderStage>(clazz: new(flow: RenderFlow) => T, info : RenderStageInfo): RenderStage | null {
        let stage: RenderStage = new clazz(this);
        if(stage.initialize(info)) {
            this._stages.push(stage);
            this._stages.sort((a, b) => {
                return a.priority - b.priority;
            });
            
            return stage;
        } else {
            return null;
        }
    }

    public destroyStages() {
        for(let i = 0; i < this._stages.length; ++i) {
            this._stages[i].destroy();
        }
        this._stages = [];
    }

    public get priority(): number {
        return this._priority;
    }

    protected _name: string = "";
    protected _priority: number = 0;
    protected _stages: RenderStage[] = [];
};
