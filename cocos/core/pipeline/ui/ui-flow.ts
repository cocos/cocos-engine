/**
 * UI渲染流程模块
 * @category pipeline.ui
 */

import { UBOGlobal } from '../define';
import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderView } from '../render-view';
import { UIStage } from './ui-stage';
import { RenderQueueSortMode } from '../render-stage';

/**
 * @zh
 * UI渲染流程。
 */
export class UIFlow extends RenderFlow {

    constructor () {
        super();
    }

    public initialize (info: IRenderFlowInfo): boolean {

        super.initialize(info);

        let uiStage = new UIStage();
        uiStage.initialize({
            name: 'UIStage',
            priority: 0,
            renderQueues: [{
                isTransparent: true,
                stages: ['default'],
                sortMode: RenderQueueSortMode.BACK_TO_FRONT,
            }],
            framebuffer: 'window'
        });
        this._stages.push(uiStage);

        return true;
    }

    public destroy () {
        this.destroyStages();
    }

    public rebuild () {
    }

    public render (view: RenderView) {
        const isHDR = this.pipeline.defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2];
        this.pipeline.defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2] = 0;
        const globalUBOBuffer = this.pipeline.globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!;
        globalUBOBuffer.update(this.pipeline.defaultGlobalUBOData.buffer);
        super.render(view);
        this.pipeline.defaultGlobalUBOData[UBOGlobal.EXPOSURE_OFFSET + 2] = isHDR;
        this.pipeline.globalBindings.get(UBOGlobal.BLOCK.name)!.buffer!.update(this.pipeline.defaultGlobalUBOData.buffer);
    }

}
