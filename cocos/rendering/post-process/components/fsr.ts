import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu, range, slide } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.FSR')
@menu('PostProcess/FSR')
@disallowMultiple
@executeInEditMode
export class FSR extends PostProcessSetting {
    @slide
    @range([0.05, 1, 0.01])
    @property
    sharpness = 0.2
}
