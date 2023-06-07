import { Material } from '../../../asset/assets';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.BlitScreenMaterial')
class BlitScreenMaterial {
    @property(Material)
    _material: Material | undefined;

    @property(Material)
    get material (): Material | undefined {
        return this._material;
    }
    set material (v) {
        this._material = v;
    }

    @property
    enable = true
}

@ccclass('cc.BlitScreen')
@menu('PostProcess/BlitScreen')
@disallowMultiple
@executeInEditMode
export class BlitScreen extends PostProcessSetting {
    @property(Material)
    _activeMaterials: Material[] = []
    @property({ type: Material, visible: false })
    get activeMaterials (): Material[] {
        return this._activeMaterials;
    }
    set activeMaterials (v) {
        this._activeMaterials = v;
    }

    @property(BlitScreenMaterial)
    _materials: BlitScreenMaterial[] = []

    @property(BlitScreenMaterial)
    get materials (): BlitScreenMaterial[] {
        return this._materials;
    }
    set materials (v) {
        this._materials = v;
        this.updateActiveMateirals();
    }

    updateActiveMateirals (): void {
        const materials = this._materials;
        this._activeMaterials.length = 0;
        for (let i = 0; i < materials.length; i++) {
            const m = materials[i];
            if (m.enable && m.material) {
                this._activeMaterials.push(m.material);
            }
        }
    }

    onLoad (): void {
        this.updateActiveMateirals();
    }
}
