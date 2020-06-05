/**
 * @category pipeline.forward
 */

import { ccclass } from '../../data/class-decorator';
import { PIPELINE_FLOW_SHADOWMAP } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { ForwardFlowPriority } from '../forward/enum';
import { ShadowMapStageA } from '../flow/stage/shadowMapA-stage';
import { ShadowMapStageB } from '../flow/stage/shadowMapB-stage';
import { CameraComponent } from '../../3d'

/**
 * @zh
 * shadowMap flow
 */
@ccclass('ShadowMapFlow')
export class ShadowMapFlow extends RenderFlow {

    private _frame: number = 0;
    private _shadowMapCamera: CameraComponent|null = null;

    public static initInfo: IRenderFlowInfo = {
        name: PIPELINE_FLOW_SHADOWMAP,
        priority: ForwardFlowPriority.DEPTH,
    };

    /**
     * 构造函数。
     * @param pipeline 渲染管线。
     */
    constructor (shadowMapCamera: CameraComponent) {
        super();
        this._shadowMapCamera = shadowMapCamera;
    }

    public initialize (info: IRenderFlowInfo) {
        super.initialize(info);

        // add shadowMap-stages
        const shadowMapStageA = new ShadowMapStageA(this._shadowMapCamera!);
        shadowMapStageA.initialize(ShadowMapStageA.initInfo);
        this._stages.push(shadowMapStageA);

        // add shadowMap-stages
        const shadowMapStageB = new ShadowMapStageB(this._shadowMapCamera!);
        shadowMapStageB.initialize(ShadowMapStageB.initInfo);
        this._stages.push(shadowMapStageB);
    }

    public render (view: RenderView) {
        this._stages[this._frame % 2].render;

        ++this._frame;
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