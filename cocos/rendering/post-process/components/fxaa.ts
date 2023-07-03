import { ccclass, disallowMultiple, executeInEditMode, help, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.Fxaa')
@help('cc.Fxaa')
@menu('PostProcess/Fxaa')
@disallowMultiple
@executeInEditMode
export class Fxaa extends PostProcessSetting {
}
