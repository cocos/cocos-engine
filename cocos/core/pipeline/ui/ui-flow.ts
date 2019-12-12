/**
 * UI渲染流程模块
 * @category pipeline.ui
 */

import { UBOGlobal } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { UIStage } from './ui-stage';
import { RenderQueueSortMode } from '../render-stage';
import { ForwardFlowPriority } from '../forward/enum';
import { RenderFlowType } from '../pipeline-serialization';

/**
 * @zh
 * UI渲染流程。
 */
export class UIFlow extends RenderFlow {

    public static initInfo: IRenderFlowInfo = {
        name: 'UIFlow',
        priority: ForwardFlowPriority.UI,
        type: RenderFlowType.UI,
    };

    constructor () {
        super();
    }

    public initialize (info: IRenderFlowInfo): boolean {

        super.initialize(info);

        let uiStage = new UIStage();
        uiStage.initialize(UIStage.initInfo);
        this._stages.push(uiStage);

        return true;
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild () {
    }

    public render (view: RenderView) {

        view.camera.update();

        this.pipeline.sceneCulling(view);

        this.pipeline.updateUBOs(view);

        const isHDR = this.pipeline.defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2];
        this.pipeline.defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2] = 0;
        const globalUBOBuffer = this.pipeline.globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!;
        globalUBOBuffer.update(this.pipeline.defaultGlobalUBOData.buffer);
        super.render(view);
        this.pipeline.defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2] = isHDR;
        this.pipeline.globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(this.pipeline.defaultGlobalUBOData.buffer);
    }

}
