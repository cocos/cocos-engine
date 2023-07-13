import { Texture2D } from '../../../asset/assets';
import { CCFloat } from '../../../core';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, help, menu, range, serializable, slide, tooltip, type } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.ColorGrading')
@help('cc.ColorGrading')
@menu('PostProcess/ColorGrading')
@disallowMultiple
@executeInEditMode
export class ColorGrading extends PostProcessSetting {
    @serializable
    protected _contribute = 0.0;
    @serializable
    protected _colorGradingMap: Texture2D | null = null;

    @tooltip('i18n:color_grading.contribute')
    @slide
    @range([0, 1, 0.01])
    @type(CCFloat)
    set contribute (value: number) {
        this._contribute = value;
    }
    get contribute (): number {
        return this._contribute;
    }

    @tooltip('i18n:color_grading.originalMap')
    @type(Texture2D)
    set colorGradingMap (val: Texture2D) {
        this._colorGradingMap = val;
    }
    get colorGradingMap (): Texture2D {
        return this._colorGradingMap!;
    }
}
