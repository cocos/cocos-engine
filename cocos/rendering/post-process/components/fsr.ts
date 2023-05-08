import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.FSR')
@menu('PostProcess/FSR')
@disallowMultiple
@executeInEditMode
export class FSR extends PostProcessSetting {
    @property
    sharpness = 0.2
}
