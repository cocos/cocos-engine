/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXFilter, IGFXColor } from '../../gfx/define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { RenderShadowMapBatchedQueue } from '../render-shadowMap-batched-queue';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { PipelineGlobal } from '../global';

const colors: IGFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 阴影渲染阶段。
 */
@ccclass('ShadowStage')
export class ShadowStage extends RenderStage {
    public static initInfo: IRenderStageInfo = {
        name: 'ShadowStage',
        priority: ForwardStagePriority.SHADOW,
        renderQueues: [
            {
                isTransparent: true,
                sortMode: RenderQueueSortMode.FRONT_TO_BACK,
                stages: ['default'],
            },
            {
                isTransparent: false,
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
                stages: ['default'],
            },
        ],
    };

    public setShadowFrameBuffer (shadowFrameBuffer: GFXFramebuffer) {
        this._shadowFrameBuffer = shadowFrameBuffer;
    }

    private _additiveShadowQueue: RenderShadowMapBatchedQueue;
    private _shadowFrameBuffer: GFXFramebuffer|null = null;

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
        this._additiveShadowQueue = new RenderShadowMapBatchedQueue();
    }

    public activate (flow: RenderFlow) {
        super.activate(flow);
        this.createCmdBuffer();
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
        this._additiveShadowQueue.clear(this.pipeline.shadowUBOBuffer);

        const renderObjects = this._pipeline.renderObjects;
        let m = 0; let p = 0;
        for (let i = 1; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            if (ro.model.castShadow) {
                for (m = 0; m < ro.model.subModelNum; m++) {
                    for (p = 0; p < ro.model.getSubModel(m).passes.length; p++) {
                        const pass = ro.model.getSubModel(m).passes[p];
                        this._additiveShadowQueue.add(pass, ro, m);
                    }
                }
            }
        }

        const camera = view.camera;

        const cmdBuff = this._cmdBuff!;

        const vp = camera.viewport;
        this._renderArea!.x = vp.x * this.pipeline.shadowMapSize.x;
        this._renderArea!.y = vp.y * this.pipeline.shadowMapSize.y;
        this._renderArea!.width =  vp.width * this.pipeline.shadowMapSize.x * this.pipeline!.shadingScale;
        this._renderArea!.height = vp.height * this.pipeline.shadowMapSize.y * this.pipeline!.shadingScale;

        const device = PipelineGlobal.device;
        const renderPass = this._shadowFrameBuffer!.renderPass;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(renderPass, this._shadowFrameBuffer!, this._renderArea!,
            colors, camera.clearDepth, camera.clearStencil);

        this._additiveShadowQueue.recordCommandBuffer(device, renderPass!, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        device.queue.submit(bufs);

        if (this._pipeline.useMSAA) {
            device.blitFramebuffer(
                this._framebuffer!,
                this._pipeline.getFrameBuffer(this._pipeline.currShading)!,
                this._renderArea!,
                this._renderArea!,
                GFXFilter.POINT);
        }
    }
}