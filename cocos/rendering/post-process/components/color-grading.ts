import { Texture2D } from '../../../asset/assets';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.ColorGrading')
@menu('PostProcess/ColorGrading')
@disallowMultiple
@executeInEditMode
export class ColorGrading extends PostProcessSetting {
    @property
    contribute = 0.2
    @property(Texture2D)
    colorGradingMap: Texture2D | null = null;
}
