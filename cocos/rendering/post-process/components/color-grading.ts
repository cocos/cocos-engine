import { Texture2D } from '../../../asset/assets';
import { CCFloat, Vec2 } from '../../../core';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu, range, slide, tooltip, type } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.ColorGrading')
@menu('PostProcess/ColorGrading')
@disallowMultiple
@executeInEditMode
export class ColorGrading extends PostProcessSetting {
    //@slide
    //@range([0, 1, 0.01])
    @property
    contribute = 0.0;
    //@tooltip('i18n:color_grading.originalMap')
    @property(Texture2D)
    colorGradingMap: Texture2D | null = null;
    public isSquareMap = false;
    onEnable () {
        super.onEnable();
        if (this.colorGradingMap) {
            this.isSquareMap = this.colorGradingMap.width === this.colorGradingMap.height;
        }
    }
}
