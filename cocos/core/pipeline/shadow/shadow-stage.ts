/**
 * @packageDocumentation
 * @module pipeline.forward
 */

import { ccclass } from 'cc.decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXColor, GFXRect } from '../../gfx/define';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { ForwardStagePriority } from '../forward/enum';
import { RenderShadowMapBatchedQueue } from '../render-shadowMap-batched-queue';
import { GFXFramebuffer } from '../../gfx/framebuffer';
import { ForwardPipeline } from '../forward/forward-pipeline';
import { SetIndex, UBOShadow } from '../define';

const colors: GFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @en Shadow map render stage
 * @zh 阴影渲染阶段。
 */
@ccclass('ShadowStage')
export class ShadowStage extends RenderStage {
    /**
     * @en A common initialization info for shadow map render stage
     * @zh 一个通用的 ShadowStage 的初始化信息对象
     */
    public static initInfo: IRenderStageInfo = {
        name: 'ShadowStage',
        priority: ForwardStagePriority.FORWARD,
    };

    /**
     * @en Sets the frame buffer for shadow map
     * @zh 设置阴影渲染的 FrameBuffer
     * @param shadowFrameBuffer 
     */
    public setShadowFrameBuffer (shadowFrameBuffer: GFXFramebuffer) {
        this._shadowFrameBuffer = shadowFrameBuffer;
    }

    private _additiveShadowQueue: RenderShadowMapBatchedQueue;
    private _shadowFrameBuffer: GFXFramebuffer | null = null;
    private _renderArea: GFXRect = { x: 0, y: 0, width: 0, height: 0 };

    constructor () {
        super();
        this._additiveShadowQueue = new RenderShadowMapBatchedQueue();
    }

    public destroy () {
    }

    public render (view: RenderView) {
        const pipeline = this._pipeline as ForwardPipeline;
        const shadowInfo = pipeline.shadows;
        this._additiveShadowQueue.clear(pipeline.descriptorSet.getBuffer(UBOShadow.BLOCK.binding));

        if (view.camera.scene?.mainLight) {
            const shadowObjects = pipeline.shadowObjects;
            let m = 0; let p = 0;
            for (let i = 0; i < shadowObjects.length; ++i) {
                const ro = shadowObjects[i];
                const subModels = ro.model.subModels;
                for (m = 0; m < subModels.length; m++) {
                    const passes = subModels[m].passes;
                    for (p = 0; p < passes.length; p++) {
                        this._additiveShadowQueue.add(ro, m, p);
                    }
                }
            }
        }

        const camera = view.camera;

        const cmdBuff = pipeline.commandBuffers[0];

        const shadowMapSize = shadowInfo.size;
        this._renderArea!.x = 0;
        this._renderArea!.y = 0;
        this._renderArea!.width =  shadowMapSize.x * pipeline.shadingScale;
        this._renderArea!.height = shadowMapSize.y * pipeline.shadingScale;

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
