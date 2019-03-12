import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType, IGFXColor, GFXClearFlag } from '../../gfx/define';
import { SRGBToLinear } from '../define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

const colors: IGFXColor[] = [];
const bufs: GFXCommandBuffer[] = [];

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

        const cmdBuff = this._cmdBuff!;
        const queue = this._pipeline.queue;

        const camera = view.camera!;
        const vp = camera.viewport;
        this._renderArea.x = vp.x * camera.width;
        this._renderArea.y = vp.y * camera.height;
        this._renderArea.width = vp.width * camera.width;
        this._renderArea.height = vp.height * camera.height;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            colors[0] = camera.clearColor;
            if (this._pipeline.isHDR) {
                colors[0] = SRGBToLinear(colors[0]);
                const scale = 1.0 / (camera.exposure * this._pipeline.fpScaleInv);
                colors[0].r *= scale;
                colors[0].g *= scale;
                colors[0].b *= scale;
            }
            colors.length = 1;
        }

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea,
            camera.clearFlag, colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(queue.cmdBuffs.array, queue.cmdBuffCount);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device.queue.submit(bufs);
    }
}
