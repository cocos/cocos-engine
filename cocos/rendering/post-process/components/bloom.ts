import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu, range, slide, tooltip, type } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.Bloom')
@menu('PostProcess/Bloom')
@disallowMultiple
@executeInEditMode
export class Bloom extends PostProcessSetting {
    @property
    threshold = 0.1;
    @property
    iterations = 2;
    @property
    intensity = 0.8;
}
