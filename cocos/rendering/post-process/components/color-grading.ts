import { Texture2D } from '../../../asset/assets';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu, range } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.ColorGrading')
@menu('PostProcess/ColorGrading')
@disallowMultiple
@executeInEditMode
export class ColorGrading extends PostProcessSetting {
    @property
    @range([0, 1, 0.01])
    contribute = 1.0
    @property(Texture2D)
    colorGradingMap: Texture2D | null = null;
}
