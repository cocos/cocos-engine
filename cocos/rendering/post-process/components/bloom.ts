import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, rangeMin, serializable, slide, tooltip, type } from '../../../core/data/decorators';
import { CCFloat, CCInteger } from '../../../core/data/utils/attribute';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.Bloom')
@help('cc.Bloom')
@menu('PostProcess/Bloom')
@disallowMultiple
@executeInEditMode
export class Bloom extends PostProcessSetting {
    @serializable
    protected _threshold = 0.8;
    @serializable
    protected _iterations = 3;
    @serializable
    protected _intensity = 2.3;

    @tooltip('i18n:bloom.threshold')
    @rangeMin(0)
    @type(CCFloat)
    set threshold (value: number) {
        this._threshold = value;
    }
    get threshold () {
        return this._threshold;
    }

    @tooltip('i18n:bloom.iterations')
    @slide
    @range([1, 6, 1])
    @type(CCInteger)
    set iterations (value: number) {
        this._iterations = value;
    }
    get iterations () {
        return this._iterations;
    }

    @tooltip('i18n:bloom.intensity')
    @rangeMin(0)
    @type(CCFloat)
    set intensity (value: number) {
        this._intensity = value;
    }
    get intensity () {
        return this._intensity;
    }
}
