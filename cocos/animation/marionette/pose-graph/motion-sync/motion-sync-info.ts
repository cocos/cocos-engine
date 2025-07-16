import { ccclass, editable, serializable } from '../../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../../define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}MotionSyncInfo`)
export class MotionSyncInfo {
    @editable
    @serializable
    group = '';
}
