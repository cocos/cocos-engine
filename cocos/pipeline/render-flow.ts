import { RenderStage, RenderStageInfo } from "./render-stage";
import { RenderView } from "./render-view";
import { RenderPipeline } from "./render-pipeline";
import { GFXRenderPass } from "../gfx/render-pass";
import { GFXDevice } from "../gfx/device";

export interface RenderFlowInfo {
    name?: string;
    priority: number;
};

export abstract class RenderFlow {

    constructor(pipeline: RenderPipeline) {
        this._device = pipeline.device;
        this._pipeline = pipeline;
    }

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

    public get device(): GFXDevice {
        return this._device;
    }

    public get pipeline(): RenderPipeline {
        return this._pipeline;
    }

    public get priority(): number {
        return this._priority;
    }

    protected _device: GFXDevice;
    protected _pipeline: RenderPipeline;
    protected _name: string = "";
    protected _priority: number = 0;
    protected _stages: RenderStage[] = [];
    protected _material: null = null;   // TODO
};
