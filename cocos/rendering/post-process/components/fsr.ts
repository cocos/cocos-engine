import { CCFloat } from '../../../core';
import { type } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu, range, serializable, slide } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.FSR')
@menu('PostProcess/FSR')
@disallowMultiple
@executeInEditMode
export class FSR extends PostProcessSetting {
    @serializable
    _sharpness = 0.2

    @slide
    @range([0.05, 1, 0.01])
    @type(CCFloat)
    get sharpness (): number {
        return this._sharpness;
    }
    set sharpness (v) {
        this._sharpness = v;
    }
}
