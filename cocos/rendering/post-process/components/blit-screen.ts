import { EDITOR } from 'internal:constants';
import { Material } from '../../../asset/assets';
import { property } from '../../../core/data/class-decorator';
import { ccclass, disallowMultiple, executeInEditMode, help, menu } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.BlitScreenMaterial')
class BlitScreenMaterial {
    @property(Material)
    _material: Material | undefined;

    @property(Material)
    get material () {
        return this._material;
    }
    set material (v) {
        this._material = v;
    }

    @property
    enable = true
}

@ccclass('cc.BlitScreen')
@help('cc.BlitScreen')
@menu('PostProcess/BlitScreen')
@disallowMultiple
@executeInEditMode
export class BlitScreen extends PostProcessSetting {
    @property(Material)
    _activeMaterials: Material[] = []
    @property({ type: Material, visible: false })
    get activeMaterials () {
        return this._activeMaterials;
    }
    set activeMaterials (v) {
        this._activeMaterials = v;
        for (let i = 0; i < this._materials.length; i++) {
            for (let j = 0; j < v.length; j++) {
                if (this._materials[i] && v[j]) {
                    if (this._materials[i].material?.uuid === v[j].uuid) {
                        this._materials[i].material = v[j];
                    }
                }
            }
        }
    }

    @property(BlitScreenMaterial)
    _materials: BlitScreenMaterial[] = []

    @property(BlitScreenMaterial)
    get materials () {
        return this._materials;
    }
    set materials (v) {
        this._materials = v;
        if (EDITOR) {
            setTimeout(() => {
                globalThis.cce.Engine.repaintInEditMode();
            }, 50);
        }
        this.updateActiveMateirals();
    }

    updateActiveMateirals () {
        const materials = this._materials;
        this._activeMaterials.length = 0;
        for (let i = 0; i < materials.length; i++) {
            const m = materials[i];
            if (m.enable && m.material) {
                this._activeMaterials.push(m.material);
            }
        }
    }

    onLoad () {
        this.updateActiveMateirals();
    }
}
