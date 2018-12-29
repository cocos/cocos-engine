import { RenderView } from "./render-view";
import { RenderFlow, RenderFlowInfo } from "./render-flow";
import { GFXDevice } from "../gfx/gfx-device";
import { Root } from "../../core/root";

export abstract class RenderPipeline {

    constructor(root: Root) {
        this._root = root;
    }

    public abstract initialize(): boolean;
    public abstract destroy();

    public render(view: RenderView) {
        for (let i = 0; i < this._flows.length; ++i) {
            this._flows[i].render(view);
        }
    }

    public resize(width, height) {

    }

    public createFlow<T extends RenderFlow>(clazz: new (pipeline: RenderPipeline) => T, info: RenderFlowInfo): RenderFlow | null {
        let flow: RenderFlow = new clazz(this);
        if (flow.initialize(info)) {
            this._flows.push(flow);
            this._flows.sort((a: RenderFlow, b: RenderFlow) => {
                return a.priority - b.priority;
            });

            return flow;
        } else {
            return null;
        }
    }

    public destroyFlows() {
        for (let i = 0; i < this._flows.length; ++i) {
            this._flows[i].destroy();
        }
        this._flows = [];
    }

    public get root(): Root {
        return this._root;
    }

    public get flows(): RenderFlow[] {
        return this._flows;
    }

    protected _root: Root;
    protected _flows: RenderFlow[] = [];
};
