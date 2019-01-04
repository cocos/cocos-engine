import { RenderView } from "./render-view";
import { GFXRenderPass } from "../gfx/render-pass";
import { GFXFramebuffer } from "../gfx/framebuffer";
import { GFXCommandBuffer } from "../gfx/command-buffer";
import { RenderFlow } from "./render-flow";
import { GFXDevice } from "../gfx/device";
import { RenderPipeline } from "./render-pipeline";
import { GFXColor, GFXRect } from "../gfx/define";

export interface RenderStageInfo {
    name?: string;
    priority: number;
    framebuffer: GFXFramebuffer;
};

export abstract class RenderStage {

    constructor(flow: RenderFlow) {
        this._flow = flow;
        this._pipeline = flow.pipeline;
        this._device = flow.device;

        if (!this._flow.pipeline.root.device) {
            throw new Error("");
        }

        this._device = this._flow.pipeline.root.device;
        this._clearColors = [{ r: 0.3, g: 0.6, b: 0.9, a: 1.0 }];
        this._renderArea = { x: 0, y: 0, width: 0, height: 0 };
    }

    public abstract initialize(info: RenderStageInfo): boolean;
    public abstract destroy();
    public abstract render(view: RenderView);

    public setClearColor(color: GFXColor) {
        if (this._clearColors.length > 0) {
            this._clearColors[0] = color;
        } else {
            this._clearColors.push(color);
        }
    }

    public setClearColors(colors: GFXColor[]) {
        this._clearColors = colors;
    }

    public setClearDepth(depth: number) {
        this._clearDepth = depth;
    }

    public setClearStencil(stencil: number) {
        this._clearStencil = stencil;
    }

    public setRenderArea(width: number, height: number) {
        this._renderArea.width = width;
        this._renderArea.height = height;
    }

    public get flow(): RenderFlow {
        return this._flow;
    }

    public get pipeline(): RenderPipeline {
        return this._pipeline;
    }

    public get priority(): number {
        return this._priority;
    }

    public get framebuffer(): GFXFramebuffer | null {
        return this._framebuffer;
    }

    protected _flow: RenderFlow;
    protected _pipeline: RenderPipeline;
    protected _device: GFXDevice;
    protected _name: string = "";
    protected _priority: number = 0;
    protected _framebuffer: GFXFramebuffer | null = null;
    protected _cmdBuff: GFXCommandBuffer | null = null;
    protected _clearColors: GFXColor[];
    protected _clearDepth: number = 1.0;
    protected _clearStencil: number = 0;
    protected _renderArea: GFXRect;
};
