import { Material } from '../../../asset/assets';
import { property } from '../../../core/data/class-decorator';
import { ccclass, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.BlitScreen')
@menu('PostProcess/BlitScreen')
@executeInEditMode
export class BlitScreen extends PostProcessSetting {
    @property(Material)
    _materials: Material[] = []

    @property(Material)
    get materials () {
        return this._materials;
    }
    set materials (v) {
        this._materials = v;
    }
}
