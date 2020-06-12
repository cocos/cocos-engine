/**
 * @category pipeline.shadowMap
 */

import { ccclass, boolean } from '../../../data/class-decorator';
import { GFXCommandBuffer } from '../../../gfx/command-buffer';
import {  IGFXColor } from '../../../gfx/define';
import { RenderFlow } from '../../render-flow';
import { IRenderStageInfo, RenderQueueSortMode, RenderStage } from '../../render-stage';
import { RenderView } from '../../render-view';
import { RenderTexture } from '../../../assets/render-texture'
import { GFXBufferTextureCopy } from '../../../gfx/define'
import { director } from '../../../director';
import { ForwardStagePriority } from '../../forward/enum';
import { RenderShadowMapBatchedQueue } from '../../render-shadowMap-batched-queue'

const readRegions = [new GFXBufferTextureCopy()];
const writeRegions = [new GFXBufferTextureCopy()];
const depthcolors: IGFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];
const bufs: GFXCommandBuffer[] = [];

/**
 * @zh
 * 渲染过程阶段。
 */
export enum ShadowMapRenderPassStageA {
    SHADOWMAP = 200,
}

/**
 * @zh
 * 前向渲染阶段。
 */
@ccclass('ShadowMapStageA')
export class ShadowMapStageA extends RenderStage {

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

    private _additiveShadowMapQueue: RenderShadowMapBatchedQueue;
    private _renderTarget: RenderTexture|null  = null;
    private _width = 2048;
    private _height = 2048;

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
        this._additiveShadowMapQueue = new RenderShadowMapBatchedQueue();
        director.root!.pipeline.addRenderPass(ShadowMapRenderPassStageA.SHADOWMAP, this._renderTarget!.getGFXWindow()!.renderPass);
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

        this._additiveShadowMapQueue.clear(this.pipeline.shadowMapUBO);

        const renderObjects = this._pipeline.renderObjects;
        for (let i = 0; i < renderObjects.length; ++i) {
            const ro = renderObjects[i];
            if(ro.model.castShadow) {
                const subModels = ro.model.subModels;
                for (let m = 0; m < subModels.length; ++m) {
                    const subModel = subModels[m];
                    const passes = subModel.passes;
                    for (let p = 0; p < passes.length; ++p) {
                        // tslint:disable-next-line: no-shadowed-variable
                        const pass = passes[p];
                        this._additiveShadowMapQueue.add(pass, ro, m);
                    }
                }
            }
        }

        const device = this._device!;
        const renderPass = this._framebuffer!.renderPass!;
        const camera = view.camera;

        const cmdBuff = this._cmdBuff!;

        cmdBuff.begin();
        cmdBuff.beginRenderPass(this._framebuffer!, this._renderArea!,
            camera.clearFlag, depthcolors, camera.clearDepth, camera.clearStencil);

        // Commit depth-queue
        this._additiveShadowMapQueue.recordCommandBuffer(device, renderPass, cmdBuff);

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

        const pass = this._additiveShadowMapQueue.pass;
        const handle = pass!.getHandle('depth');
        pass!.setUniform(handle!, 0);
        const length = this._width * this._height * 4;
        const buffers: Uint8Array[] = [new Uint8Array(length)];
        director.root!.device.copyFramebufferToBuffer(view.window!.framebuffer, buffers[0].buffer, readRegions);
    }

    public get renderTarget () {
        return this._renderTarget;
    }
}