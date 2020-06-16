/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_SHADOWMAP } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { ForwardFlowPriority } from '../forward/enum';
import { ShadowMapStage } from './shadowMap-stage';
import { GFXFramebuffer, GFXBufferTextureCopy } from '../../gfx';
import { director } from '../..';

const readRegions = [new GFXBufferTextureCopy()];

/**
 * @zh
 * shadowMap flow
 */
@ccclass('ShadowMapFlow')
export class ShadowMapFlow extends RenderFlow {

    protected _frame: number = 0;
    protected _shadowMap: GFXFramebuffer[] = [];

    protected updateShadowMap () {
        // 如果上一帧结果被清除，则使用copyFramebuffer
        if (this._stages[this._frame % 2].framebuffer) {
            const shadowMap = this._stages[this._frame % 2].framebuffer!;
            this._shadowMap[this._frame % 2] = shadowMap;
        }

        // sweap buffer
        // @ts-ignore
        this.pipeline.shadowMap = null;
        // @ts-ignore
        director.root!.device.copyFramebufferToBuffer(this._shadowMap[(this._frame + 1) % 2], this.pipeline.shadowMap, readRegions);
    }

    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_SHADOWMAP,
        priority: ForwardFlowPriority.SHADOWMAP,
    };

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor () {
        super();
    }

    public initialize (info: IRenderFlowInfo) {
        super.initialize(info);

        // add shadowMap-stages
        const shadowMapStage_1 = new ShadowMapStage();
        this._stages.push(shadowMapStage_1);

        const shadowMapStage_2 = new ShadowMapStage();
        this._stages.push(shadowMapStage_2);

        this._shadowMap.length = 2;
    }

    public render (view: RenderView) {

        // render One of the FBO
        this.stages[this._frame % 2].render(view);

        // get One of the other FBO
        this.updateShadowMap();

        // control both
        this._frame++;
    }

    /**
     * @zh
     * 销毁函数。
     */
    public destroy () {
        this.destroyStages();
    }

    /**
     * @zh
     * 重构函数。
     */
    public rebuild () {
    }
}