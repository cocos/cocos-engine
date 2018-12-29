import { GFXRenderPass } from "../gfx/gfx-render-pass";
import { GFXFramebuffer } from "../gfx/gfx-framebuffer";
import { RenderView } from "./render-view";

export interface RenderStageInfo {
    name?: string;
    priority: number;
    renderPass: GFXRenderPass;
    framebuffer: GFXFramebuffer;
};

export abstract class RenderStage {

    public abstract initialize(info: RenderStageInfo): boolean;
    public abstract destroy();
    public abstract render(view: RenderView);

    public resize(width, height) {
        
    }

    public get priority(): number {
        return this._priority;
    }

    protected _name: string = "";
    protected _priority: number = 0;
};
