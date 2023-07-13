import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, slide, tooltip } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.TAA')
@help('cc.TAA')
@menu('PostProcess/TAA')
@disallowMultiple
@executeInEditMode
export class TAA extends PostProcessSetting {
    @property
    _sampleScale = 1

    @tooltip('i18n:taa.sampleScale')
    @slide
    @range([0.01, 5, 0.01])
    @property
    get sampleScale () {
        return this._sampleScale;
    }
    set sampleScale (v) {
        this._sampleScale = v;
    }

    @property
    _feedback = 0.95
    @tooltip('i18n:taa.feedback')
    @slide
    @range([0.0, 1, 0.01])
    @property
    get feedback () {
        return this._feedback;
    }
    set feedback (v) {
        this._feedback = v;
    }
}
