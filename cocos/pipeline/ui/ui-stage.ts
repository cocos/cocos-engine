/**
 * @category pipeline.ui
 */

import { GFXCommandBuffer } from '../../gfx/command-buffer';
import { GFXClearFlag, GFXCommandBufferType } from '../../gfx/define';
import { getPhaseID } from '../pass-phase';
import { RenderQueue, transparentCompareFn } from '../render-queue';
import { IRenderStageInfo, RenderStage } from '../render-stage';
import { RenderView } from '../render-view';

const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * UI渲阶段。
 */
export class UIStage extends RenderStage {

    private _uiQueue: RenderQueue | null = null;

    constructor () {
        super();
    }

    public initialize (info: IRenderStageInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        if (info.framebuffer !== undefined) {
            this._framebuffer = info.framebuffer;
        }

        this._uiQueue = new RenderQueue({
            isTransparent: true,
            phases: getPhaseID('default'),
            sortFunc: transparentCompareFn,
        });

        this._cmdBuff = this._device!.createCommandBuffer({
            allocator: this._device!.commandAllocator,
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

    public rebuild () {
    }

    public render (view: RenderView) {

        this._uiQueue!.clear();

        for (const ro of this._pipeline!.renderObjects) {
            for (let i = 0; i < ro.model.subModelNum; i++) {
                for (let j = 0; j < ro.model.getSubModel(i).passes.length; j++) {
                    this._uiQueue!.insertRenderPass(ro, i, j);
                }
            }
        }
        this._uiQueue!.sort();

        const framebuffer = view.window!.framebuffer;

        const cmdBuff = this._cmdBuff!;

        const camera = view.camera!;

        this._renderArea.width = this.flow.pipeline.root.device.width;
        this._renderArea.height = this.flow.pipeline.root.device.height;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(framebuffer, this._renderArea,
            GFXClearFlag.DEPTH_STENCIL, [], camera.clearDepth, camera.clearStencil);

        cmdBuff.execute(this._uiQueue!.cmdBuffs.array, this._uiQueue!.cmdBuffCount);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device!.queue.submit(bufs);
    }
}
