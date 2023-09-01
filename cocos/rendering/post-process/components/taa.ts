import { property, serializable } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, slide, tooltip } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.TAA')
@help('cc.TAA')
@menu('PostProcess/TAA')
@disallowMultiple
@executeInEditMode
export class TAA extends PostProcessSetting {
    @serializable
    protected _sampleScale = 1;

    @tooltip('i18n:taa.sampleScale')
    @slide
    @range([0.01, 5, 0.01])
    @property
    get sampleScale (): number {
        return this._sampleScale;
    }
    set sampleScale (v: number) {
        this._sampleScale = v;
    }

    @serializable
    protected _feedback = 0.95;
    @tooltip('i18n:taa.feedback')
    @slide
    @range([0.0, 1, 0.01])
    @property
    get feedback (): number {
        return this._feedback;
    }
    set feedback (v: number) {
        this._feedback = v;
    }
}
