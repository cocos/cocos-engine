import { RenderStage, RenderStageInfo } from "../render-stage";
import { RenderFlow } from "../render-flow";
import { GFXCommandBuffer } from "../../gfx/command-buffer";
import { RenderView } from "../render-view";
import { GFXFramebuffer } from "../../gfx/framebuffer";
import { GFXCommandBufferType } from "../../gfx/gfx-define";
import { GFXInputAssembler } from "../../gfx/input-assembler";

export class ForwardStage extends RenderStage {

    constructor(flow: RenderFlow) {
        super(flow);
    }

    public initialize(info: RenderStageInfo): boolean {

        if(info.name) {
            this._name = info.name;
        }

        this._priority = info.priority;
        this._framebuffer = info.framebuffer;

        this._cmdBuff = this._device.createCommandBuffer({
            allocator: this._device.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });

        return true;
    }

    public destroy() {

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public render(view: RenderView) {
        let cmdBuff = <GFXCommandBuffer>this._cmdBuff;
        this._renderArea.width = view.width;
        this._renderArea.height = view.height;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(<GFXFramebuffer>this._framebuffer, this._renderArea, this._clearColors, this._clearDepth, this._clearStencil);
        cmdBuff.draw(<GFXInputAssembler>this._pipeline.quadIA);
        cmdBuff.endRenderPass();
        cmdBuff.end();

        this._device.queue.submit([cmdBuff]);
    }
};
