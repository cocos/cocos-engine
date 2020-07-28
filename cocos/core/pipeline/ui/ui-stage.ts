/**
 * @category pipeline
 */

import { IGFXColor, IGFXRect } from '../../gfx/define';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardRenderContext } from '../forward/forward-render-context';
import { ForwardStagePriority } from '../forward/enum';

const colors: IGFXColor[] = [];

/**
 * @en The UI render stage
 * @zh UI渲阶段。
 */
export class UIStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'UIStage',
        priority: ForwardStagePriority.UI,
        renderQueues: [{
            isTransparent: true,
            stages: ['default'],
            sortMode: RenderQueueSortMode.BACK_TO_FRONT,
        }],
    };

    private _renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };

    public activate (rctx: ForwardRenderContext) {
        super.activate(rctx);
    }

    public destroy () {
    }

    public render (rctx: ForwardRenderContext, view: RenderView) {
        const isHDR = rctx.isHDR;
        rctx.isHDR = false;

        const device = rctx.device!;
        this._renderQueues[0].clear();

        for (const ro of rctx.renderObjects) {
            for (let i = 0; i < ro.model.subModelNum; i++) {
                for (let j = 0; j < ro.model.getSubModel(i).passes.length; j++) {
                    this._renderQueues[0].insertRenderPass(ro, i, j);
                }
            }
        }
        this._renderQueues[0].sort();

        const camera = view.camera!;
        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width;
        this._renderArea!.height = vp.height * camera.height;

        colors[0] = camera.clearColor;

        const cmdBuff = rctx.commandBuffers[0];

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : rctx.getRenderPass(camera.clearFlag);

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            [camera.clearColor], camera.clearDepth, camera.clearStencil);

        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        device.queue.submit(rctx.commandBuffers);
        rctx.isHDR = isHDR;
    }
}
