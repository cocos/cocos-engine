/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXColor, GFXRect } from '../../gfx/define';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { RenderShadowMapBatchedQueue } from '../render-shadowMap-batched-queue';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { SetIndex } from '../define';
import { ShadowFlow } from './shadow-flow';

const colors: GFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 阴影渲染阶段。
 */
@ccclass('ShadowStage')
export class ShadowStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'ShadowStage',
        priority: ForwardStagePriority.FORWARD,
    };

    public setShadowFrameBuffer (shadowFrameBuffer: GFXFramebuffer) {
        this._shadowFrameBuffer = shadowFrameBuffer;
    }

    private _additiveShadowQueue!: RenderShadowMapBatchedQueue;
    private _shadowFrameBuffer: GFXFramebuffer | null = null;
    private _renderArea: GFXRect = { x: 0, y: 0, width: 0, height: 0 };

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
    }

    public activate (pipeline: ForwardPipeline, flow: ShadowFlow) {
        super.activate(pipeline, flow);
        this._additiveShadowQueue = new RenderShadowMapBatchedQueue(pipeline);
    }

    /**
     * @zh
     * 渲染函数。
     * @param view 渲染视图。
     */
    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;

        this._additiveShadowQueue.gatherLightPasses(view.camera!.scene!.mainLight!);

        const camera = view.camera;

        const cmdBuff = pipeline.commandBuffers[0];

        const vp = camera.viewport;
        const shadowMapSize = shadowInfo.size;
        this._renderArea!.x = vp.x * shadowMapSize.x;
        this._renderArea!.y = vp.y * shadowMapSize.y;
        this._renderArea!.width =  vp.width * shadowMapSize.x * pipeline.shadingScale;
        this._renderArea!.height = vp.height * shadowMapSize.y * pipeline.shadingScale;

        const device = pipeline.device;
        const renderPass = this._shadowFrameBuffer!.renderPass;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer!, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        cmdBuff.bindDescriptorSet(SetIndex.GLOBAL, pipeline.descriptorSet);

        this._additiveShadowQueue.recordCommandBuffer(device, renderPass!, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        device.queue.submit(bufs);
    }
}
