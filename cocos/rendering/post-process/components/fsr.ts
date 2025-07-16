import { CCFloat } from '../../../core';
import { type } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, serializable, slide, tooltip } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.FSR')
@help('cc.FSR')
@menu('PostProcess/FSR')
@disallowMultiple
@executeInEditMode
export class FSR extends PostProcessSetting {
    @serializable
    protected _sharpness = 0.8;

    @tooltip('i18n:fsr.sharpness')
    @slide
    @range([0.0, 1, 0.01])
    @type(CCFloat)
    get sharpness (): number {
        return this._sharpness;
    }
    set sharpness (v: number) {
        this._sharpness = v;
    }
}
