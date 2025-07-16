import { cclegacy } from '../../../core';
import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, rangeMin,
    serializable, slide, tooltip, type, visible } from '../../../core/data/decorators';
import { CCBoolean, CCFloat, CCInteger } from '../../../core/data/utils/attribute';
import { Root } from '../../../root';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.Bloom')
@help('cc.Bloom')
@menu('PostProcess/Bloom')
@disallowMultiple
@executeInEditMode
export class Bloom extends PostProcessSetting {
    @serializable
    protected _enableAlphaMask = false;
    @serializable
    protected _useHdrIlluminance: boolean = false;
    @serializable
    protected _threshold = 0.8;
    @serializable
    protected _iterations = 3;
    @serializable
    protected _intensity = 2.3;

    @tooltip('i18n:bloom.enableAlphaMask')
    @type(CCBoolean)
    set enableAlphaMask (value: boolean) {
        this._enableAlphaMask = value;
    }
    get enableAlphaMask (): boolean {
        return this._enableAlphaMask;
    }

    @tooltip('i18n:bloom.useHdrIlluminance')
    @visible(() => (cclegacy.director.root as Root).pipeline.getMacroBool('CC_USE_FLOAT_OUTPUT'))
    @type(CCBoolean)
    set useHdrIlluminance (value: boolean) {
        this._useHdrIlluminance = value;
    }
    get useHdrIlluminance (): boolean {
        return this._useHdrIlluminance;
    }

    @tooltip('i18n:bloom.threshold')
    @rangeMin(0)
    @type(CCFloat)
    set threshold (value: number) {
        this._threshold = value;
    }
    get threshold (): number {
        return this._threshold;
    }

    @tooltip('i18n:bloom.iterations')
    @slide
    @range([1, 6, 1])
    @type(CCInteger)
    set iterations (value: number) {
        this._iterations = value;
    }
    get iterations (): number {
        return this._iterations;
    }

    @tooltip('i18n:bloom.intensity')
    @rangeMin(0)
    @type(CCFloat)
    set intensity (value: number) {
        this._intensity = value;
    }
    get intensity (): number {
        return this._intensity;
    }
}
