/**
 * @category pipeline.shadowMap
 */

import { ccclass, boolean } from '../../data/class-decorator';
import { GFXCommandBuffer } from '../../gfx/command-buffer';
import {  IGFXColor } from '../../gfx/define';
import { RenderFlow } from '../render-flow';
import { RenderStage } from '../render-stage';
import { RenderView } from '../render-view';
import { RenderShadowMapBatchedQueue } from '../render-shadowMap-batched-queue'

const bufs: GFXCommandBuffer[] = [];

const depthcolors: IGFXColor[] = [ { r: 1, g: 1, b: 1, a: 1 } ];

/**
 * @zh
 * 前向渲染阶段。
 */
@ccclass('ShadowMapStage')
export class ShadowMapStage extends RenderStage {

    private _additiveShadowMapQueue: RenderShadowMapBatchedQueue;
    private _width = 2048;
    private _height = 2048;

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
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
        this._additiveShadowMapQueue = new RenderShadowMapBatchedQueue();
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

        this._additiveShadowMapQueue.clear(this.pipeline.shadowMapBuffer);

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


        const vp = camera.viewport;
        this._renderArea!.x = vp.x * camera.width;
        this._renderArea!.y = vp.y * camera.height;

        this._renderArea!.width = this._width;
        this._renderArea!.height = this._height;

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
}