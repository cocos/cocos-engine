import { property } from '../../../core/data/class-decorator';
import { ccclass, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.FSR')
@menu('PostProcess/FSR')
@executeInEditMode
export class FSR extends PostProcessSetting {
    @property
    sharpness = 0.2
}
