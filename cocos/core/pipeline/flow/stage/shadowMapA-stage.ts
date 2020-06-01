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

const readRegions = [new GFXBufferTextureCopy()];

/**
 * @zh
 * 渲染过程阶段。
 */
export enum ShadowMapRenderPassStage {
    SHADOWMAP = 200,
}

/**
 * @zh
 * 前向渲染阶段。
 */
@ccclass('ShadowMapStage')
export class ShadowMapStage extends RenderStage {

    private _material: Material = null;
    private _renderTarget: RenderTexture = null;
    private _shadowMapCamera: CameraComponent;

    /**
     * 构造函数。
     * @param flow 渲染阶段。
     */
    constructor (shadowMapCamera: CameraComponent) {
        super();
        this._shadowMapCamera = shadowMapCamera;
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
        this._renderTarget = this._shadowMapCamera.targetTexture;
        director.root.pipeline.addRenderPass(ShadowMapRenderPassStage.SHADOWMAP, this._renderTarget.getGFXWindow().renderPass);
        
    }  
}