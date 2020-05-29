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
import { Light } from '../../../renderer';

/**
 * @zh
 * 前向渲染阶段。
 */
@ccclass('ShadowMapStage')
export class ShadowMapStage extends RenderStage {

     /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor () {
        super();
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
    }  
}