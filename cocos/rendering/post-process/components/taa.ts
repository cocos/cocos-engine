import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.TAA')
@menu('PostProcess/TAA')
@disallowMultiple
@executeInEditMode
export class TAA extends PostProcessSetting {
    @property
    sampleScale = 1

    @property
    feedback = 0.95
}
