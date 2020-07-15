/**
 * @category pipeline
 */

import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { IGFXColor } from '../../gfx/define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { PipelineGlobal } from '../global';

const bufs: GFXCommandBuffer[] = [];
const colors: IGFXColor[] = [];

/**
 * @en The UI render stage
 * @zh UI渲阶段。
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
        framebuffer: 'window',
    };

    public activate (flow: RenderFlow) {
        super.activate(flow);
    }

    public destroy () {
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

        const camera = view.camera!;
        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width;
        this._renderArea!.height = vp.height * camera.height;

        colors[0] = camera.clearColor;

        const cmdBuff = this._pipeline.commandBuffers[0];

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : this._flow.getRenderPass(camera.clearFlag);

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            [camera.clearColor], camera.clearDepth, camera.clearStencil);

        this._renderQueues[0].recordCommandBuffer(PipelineGlobal.device, this._framebuffer!.renderPass!, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        PipelineGlobal.device.queue.submit(this._pipeline.commandBuffers);
    }
}
