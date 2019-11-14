/**
 * @category pipeline.ui
 */

import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType, IGFXColor } from '../../gfx/define';
import { getPhaseID } from '../pass-phase';
import { RenderQueue, transparentCompareFn } from '../render-queue';
import { IRenderStageInfo, RenderStage, RenderQueueSortMode } from '../render-stage';
import { RenderView } from '../render-view';
import { RenderFlow } from '../render-flow';

const bufs: GFXCommandBuffer[] = [];
const colors: IGFXColor[] = [];

/**
 * @zh
 * UI渲阶段。
 */
export class UIStage extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'UIStage',
        priority: 0,
        renderQueues: [{
            isTransparent: true,
            stages: ['default'],
            sortMode: RenderQueueSortMode.BACK_TO_FRONT,
        }],
        framebuffer: 'window'
    };

    constructor () {
        super();
    }

    public activate(flow: RenderFlow) {
        super.activate(flow);
        this._cmdBuff = this._device!.createCommandBuffer({
            allocator: this._device!.commandAllocator,
            type: GFXCommandBufferType.PRIMARY,
        });
    }

    public destroy () {

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }
    }

    public resize (width: number, height: number) {
    }

    public rebuild () {
    }

    public render (view: RenderView) {

        this._renderQueues[0].clear();

        for (const ro of this._pipeline!.renderObjects) {
            for (let i = 0; i < ro.model.subModelNum; i++) {
                for (let j = 0; j < ro.model.getSubModel(i).passes.length; j++) {
                    this._renderQueues[0].insertRenderPass(ro, i, j);
                }
            }
        }
        this._renderQueues[0].sort();

        const framebuffer = view.window!.framebuffer;

        const cmdBuff = this._cmdBuff!;

        const camera = view.camera!;

        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width;
        this._renderArea!.height = vp.height * camera.height;

        colors[0] = camera.clearColor;

        cmdBuff.begin();
<<<<<<< HEAD
        cmdBuff.beginRenderPass(framebuffer, this._renderArea,
            camera.clearFlag, colors, camera.clearDepth, camera.clearStencil);
=======
        cmdBuff.beginRenderPass(framebuffer, this._renderArea!,
            camera.clearFlag, [camera.clearColor], camera.clearDepth, camera.clearStencil);
>>>>>>> fix ci error

        cmdBuff.execute(this._renderQueues[0].cmdBuffs.array, this._renderQueues[0].cmdBuffCount);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device!.queue.submit(bufs);
    }
}
