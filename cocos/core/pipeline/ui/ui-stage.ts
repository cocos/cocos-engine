/**
 * @category pipeline.ui
 */

import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXCommandBufferType, IGFXColor, GFXLoadOp, GFXStoreOp, GFXTextureLayout } from '../../gfx/define';
import { RenderFlow } from '../render-flow';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { legacyCC } from '../../global-exports';

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
        framebuffer: 'window',
    };

    public activate (flow: RenderFlow) {
        super.activate(flow);
        this.createCmdBuffer();

        const device = this._device!;

        // UI uses a exclusive render pass
        const renderPass = device.createRenderPass({
            colorAttachments: [{
                format: device.colorFormat,
                loadOp: GFXLoadOp.LOAD, // shouldn't clear color attachment
                storeOp: GFXStoreOp.STORE,
                sampleCount: 1,
                beginLayout: GFXTextureLayout.PRESENT_SRC,
                endLayout: GFXTextureLayout.PRESENT_SRC,
            }],
            depthStencilAttachment: {
                format : device.depthStencilFormat,
                depthLoadOp : GFXLoadOp.CLEAR,
                depthStoreOp : GFXStoreOp.STORE,
                stencilLoadOp : GFXLoadOp.CLEAR,
                stencilStoreOp : GFXStoreOp.STORE,
                sampleCount : 1,
                beginLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
                endLayout : GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
            },
        });
        this._framebuffer = device.createFramebuffer({
            renderPass,
            colorTextures: [],
            depthStencilTexture: null,
            isOffscreen: false
        });
    }

    public destroy () {

        if (this._framebuffer) {
            this._framebuffer.renderPass!.destroy();
            this._framebuffer.destroy();
        }

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

        let framebuffer = view.window!.framebuffer;
        if (!framebuffer.isOffscreen) {
            framebuffer = this._framebuffer!;
        }
        const cmdBuff = this._cmdBuff!;

        const camera = view.camera!;

        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;
        this._renderArea!.width = vp.width * camera.width;
        this._renderArea!.height = vp.height * camera.height;

        colors[0] = camera.clearColor;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer, this._renderArea!,
            camera.clearFlag, [camera.clearColor], camera.clearDepth, camera.clearStencil);

        this._renderQueues[0].recordCommandBuffer(this._device!, this._framebuffer!.renderPass!, cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device!.queue.submit(bufs);
    }
}
