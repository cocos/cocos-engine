import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType } from '../../gfx/define';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { Camera } from '../../renderer/scene/camera';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

export class ForwardStage extends RenderStage {

    constructor (flow: RenderFlow) {
        super(flow);
    }

    public initialize (info: IRenderStageInfo): boolean {

        if (info.name !== undefined) {
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

    public destroy () {

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public resize (width: number, height: number) {
    }

    public render (view: RenderView) {

        const framebuffer = view.window!.framebuffer;

        const cmdBuff = this._cmdBuff!;
        const queue = this._pipeline.queue;

        const camera = view.camera!;

        this._renderArea.width = camera.width;
        this._renderArea.height = camera.height;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer, this._renderArea,
            [camera.clearColor], camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(queue.cmdBuffs.array, queue.cmdBuffCount);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        this._device.queue.submit([cmdBuff]);
    }
}
