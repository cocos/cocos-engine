/**
 * @category pipeline.shadowMap
 */

import { ccclass, boolean } from '../../../data/class-decorator';
import { GFXCommandBuffer } from '../../../gfx/command-buffer';
import { GFXClearFlag, GFXFilter, IGFXColor } from '../../../gfx/define';
import { Layers } from '../../../scene-graph';
import { SRGBToLinear } from '../../pipeline-funcs';
import { RenderBatchedQueue } from '../../render-batched-queue';
import { RenderFlow } from '../../render-flow';
import { RenderInstancedQueue } from '../../render-instanced-queue';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../../render-stage';
import { RenderView } from '../../render-view';
import { Light, Camera } from '../../../renderer';
import { Material } from '../../../assets/material'
import { RenderTexture } from '../../../assets/render-texture'
import { GFXBufferTextureCopy } from '../../../gfx/define'
import { CameraComponent } from '../../../3d';
import { director } from '../../../director';
import { ForwardStagePriority } from '../../forward/enum';

const readRegions = [new GFXBufferTextureCopy()];
const writeRegions = [new GFXBufferTextureCopy()];
const depthcolors: IGFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 渲染过程阶段。
 */
export enum ShadowMapRenderPassStageB {
    SHADOWMAP = 200,
}

/**
 * @zh
 * 前向渲染阶段。
 */
@ccclass('ShadowMapStageB')
export class ShadowMapStageB extends RenderStage {

    public static initInfo: IRenderStageInfo = {
        name: 'ShadowMapStageA',
        priority: ForwardStagePriority.FORWARD,
        renderQueues: [
            {
                isTransparent: false,
                sortMode: RenderQueueSortMode.FRONT_TO_BACK,
                stages: ['default'],
            },
            {
                isTransparent: true,
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
                stages: ['default', 'planarShadow'],
            },
        ],
    };

    private _renderTarget: RenderTexture|null = null;
    private _width = 512;
    private _height = 512;

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
        director.root!.pipeline.addRenderPass(ShadowMapRenderPassStageB.SHADOWMAP, this._renderTarget!.getGFXWindow()!.renderPass);
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
        this._width = width;
        this._height = height;
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
        const camera = view.camera;

        const cmdBuff = this._cmdBuff!;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea!,
            camera.clearFlag, depthcolors, camera.clearDepth, camera.clearStencil);

        // Commit depth-queue
        this.pipeline.shadowMapQueue.recordCommandBuffer(cmdBuff);

        cmdBuff.endRenderPass();
        cmdBuff.end();

        bufs[0] = cmdBuff;
        this._device!.queue.submit(bufs);

        const readRegion = readRegions[0];
        readRegion.texExtent.width = this._width;
        readRegion.texExtent.height = this._height;

        const writeRegion = writeRegions[0];
        writeRegion.texExtent.width = this._width;
        writeRegion.texExtent.height = this._height;

        const pass = this.pipeline.shadowMapQueue.pass;
        const handle = pass!.getHandle('depth');
        pass!.setUniform(handle!, 0);
        const length = this._width * this._height * 4;
        const buffers: Uint8Array[] = [new Uint8Array(length)];
        director.root!.device.copyFramebufferToBuffer(view.window!.framebuffer, buffers[0].buffer, readRegions);
    }

    public get renderTarget() {
        return this._renderTarget;
    }
}