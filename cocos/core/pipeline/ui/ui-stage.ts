/**
 * @category pipeline
 */

import { IGFXColor, IGFXRect } from '../../gfx/define';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { UIFlow } from './ui-flow';
import { ForwardPipeline } from '../forward/forward-pipeline';

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

    public activate (pipeline: ForwardPipeline, flow: UIFlow) {
        super.activate(pipeline, flow);
    }

    public destroy () {
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const isHDR = pipeline.isHDR;
        pipeline.isHDR = false;

        const device = pipeline.device;
        this._renderQueues[0].clear();

        for (const ro of pipeline.renderObjects) {
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

        const cmdBuff = pipeline.commandBuffers[0];

        const framebuffer = view.window.framebuffer;
        const renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea!,
            [camera.clearColor], camera.clearDepth, camera.clearStencil);

        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        device.queue.submit(pipeline.commandBuffers);
        pipeline.isHDR = isHDR;
    }
}
