import { IRenderFlowInfo, RenderFlow } from '../render-flow';
import { RenderPipeline } from '../render-pipeline';
import { UIStage } from './ui-stage';
import { RenderView } from '../render-view';
import { UBOGlobal } from '../define';

export class UIFlow extends RenderFlow {

    constructor (pipeline: RenderPipeline) {
        super(pipeline);
    }

    public initialize (info: IRenderFlowInfo): boolean {

        if (info.name !== undefined) {
            this._name = info.name;
        }

        this._priority = info.priority;

        const mainWindow = this._pipeline.root.mainWindow;
        if (!mainWindow || !mainWindow.framebuffer) {
            return false;
        }

        this.createStage(UIStage, {
            name: 'UIStage',
            priority: 0,
            framebuffer:  mainWindow.framebuffer,
        });

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
