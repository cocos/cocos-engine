import { property } from '../../../core/data/class-decorator';
import { ccclass, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.TAA')
@menu('PostProcess/TAA')
@executeInEditMode
export class TAA extends PostProcessSetting {
    @property
    sampleScale = 1

    @property
    feedback = 0.95
}
