import { ccclass, disallowMultiple, executeInEditMode, help, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.FXAA')
@help('cc.FXAA')
@menu('PostProcess/FXAA')
@disallowMultiple
@executeInEditMode
export class FXAA extends PostProcessSetting {
}
