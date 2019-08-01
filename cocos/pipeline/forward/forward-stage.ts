/**
 * @category pipeline.forward
 */

import { ccclass } from '../../core/data/class-decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType, GFXFilter, IGFXColor } from '../../gfx/define';
import { SRGBToLinear } from '../pipeline-funcs';
import { RenderQueue } from '../render-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

const colors: IGFXColor[] = [];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 前向渲染阶段。
 */
@ccclass('ForwardStage')
export class ForwardStage extends RenderStage {

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
    }

    /**
     * @zh
     * 初始化函数。
     * @param info 渲染阶段描述信息。
     */
    public initialize (info: IRenderStageInfo): boolean {

        super.initialize(info);

        this.activate();

        return true;
    }

    public activate () {
        super.activate();
        this._cmdBuff = this._device!.createCommandBuffer({
            allocator: this._device!.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    /**
     * @zh
     * 重置大小。
     * @param width 屏幕宽度。
     * @param height 屏幕高度。
     */
    public resize (width: number, height: number) {
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
    }

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public render (view: RenderView) {

        this._renderQueues.forEach(this.clearRenderQueue);

        for (const ro of this._pipeline!.renderObjects) {
            for (let i = 0; i < ro.model.subModelNum; i++) {
                for (let j = 0; j < ro.model.getSubModel(i).passes.length; j++) {
                    for (const rq of this._renderQueues) {
                        rq.insertRenderPass(ro, i, j);
                    }
                }
            }
        }
        this._renderQueues.forEach(this.sortRenderQueue);

        const camera = view.camera;

        const cmdBuff = this._cmdBuff!;

        const vp = camera.viewport;
        this._renderArea.x = vp.x * camera.width;
        this._renderArea.y = vp.y * camera.height;
        this._renderArea.width = vp.width * camera.width * this.pipeline.shadingScale;
        this._renderArea.height = vp.height * camera.height * this.pipeline.shadingScale;

        if (camera.clearFlag & GFXClearFlag.COLOR) {
            colors[0] = camera.clearColor;
            if (this._pipeline!.isHDR) {
                colors[0] = SRGBToLinear(colors[0]);
                const scale = this._pipeline!.fpScale / camera.exposure;
                colors[0].r *= scale;
                colors[0].g *= scale;
                colors[0].b *= scale;
            }
            colors.length = 1;
        }

        if (this._pipeline!.usePostProcess) {
            if (!this._pipeline!.useMSAA) {
                this._framebuffer = this._pipeline!.getFrameBuffer(this._pipeline!.currShading)!;
            } else {
                this._framebuffer = this._pipeline!.getFrameBuffer('msaa')!;
            }
        } else {
            this._framebuffer = view.window!.framebuffer;
        }

        const planarShadow = camera.scene.planarShadows;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea,
            camera.clearFlag, colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(this._renderQueues[0].cmdBuffs.array, this._renderQueues[0].cmdBuffCount);
        cmdBuff.execute(planarShadow.cmdBuffs.array, planarShadow.cmdBuffCount);
        cmdBuff.execute(this._renderQueues[1].cmdBuffs.array, this._renderQueues[1].cmdBuffCount);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device!.queue.submit(bufs);

        if (this._pipeline!.useMSAA) {
            this._device!.blitFramebuffer(
                this._framebuffer,
                this._pipeline!.getFrameBuffer(this._pipeline!.currShading)!,
                this._renderArea,
                this._renderArea,
                GFXFilter.POINT);
        }
    }

    private clearRenderQueue (rq: RenderQueue) {
        rq.clear();
    }

    private sortRenderQueue (rq: RenderQueue) {
        rq.sort();
    }
}
