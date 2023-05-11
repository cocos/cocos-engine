import { ccclass, disallowMultiple, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.Fxaa')
@menu('PostProcess/Fxaa')
@disallowMultiple
@executeInEditMode
export class Fxaa extends PostProcessSetting {
}
