/**
 * @category model
 */

import { EDITOR } from 'internal:constants';
import { Material } from '../../assets/material';
import { Component } from '../../components/component';
import { ccclass, property } from '../../data/class-decorator';
import { IMaterialInstanceInfo, MaterialInstance } from '../../renderer/core/material-instance';
import { Model } from '../../renderer/scene/model';
import { Layers } from '../../scene-graph/layers';

const _matInsInfo: IMaterialInstanceInfo = {
    parent: null!,
    owner: null!,
    subModelIdx: 0,
};

@ccclass('cc.RenderableComponent')
export class RenderableComponent extends Component {
    @property({
        type: [Material],
    })
    protected _materials: (Material | null)[] = [];

    @property
    protected _visFlags = Layers.Enum.NONE;

    @property({ visible: false })
    get visibility () {
        return this._visFlags;
    }

    set visibility (val) {
        this._visFlags = val;
        this._onVisibilityChange(val);
    }

    @property({
        type: Material,
        displayName: 'Materials',
    })
    get sharedMaterials () {
        // if we don't create an array copy, the editor will modify the original array directly.
        return EDITOR && this._materials.slice() || this._materials;
    }

    set sharedMaterials (val) {
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== this._materials[i]) {
                this.setMaterial(val[i], i);
            }
        }
        if (val.length < this._materials.length) {
            for (let i = val.length; i < this._materials.length; i++) {
                this.setMaterial(null, i);
            }
            this._materials.splice(val.length);
        }
    }

    /**
     * @en The materials of the model.
     * @zh 模型材质。
     */
    get materials () {
        for (let i = 0; i < this._materials.length; i++) {
            this._materialInstances[i] = this.getMaterialInstance(i) as MaterialInstance;
        }
        return this._materialInstances;
    }

    set materials (val) {
        const dLen = val.length - this._materials.length;
        if (dLen > 0) {
            this._materials.length = val.length;
            this._materialInstances.length = val.length;
        } else if (dLen < 0) {
            for (let i = this._materials.length - dLen; i < this._materials.length; ++i) {
                this.setMaterialInstance(i, null);
            }
        }
        for (let i = 0; i < this._materialInstances.length; i++) {
            // tslint:disable-next-line: triple-equals // both of them may be undefined or null
            if (this._materialInstances[i] != val[i]) {
                this.setMaterialInstance(i, val[i]);
            }
        }
    }

    protected _materialInstances: (MaterialInstance | null)[] = [];
    protected _models: Model[] = [];

    get sharedMaterial () {
        return this.getMaterial(0);
    }

    /**
     * @en Get the shared material asset of the specified sub-model.
     * @zh 获取指定子模型的共享材质资源。
     */
    public getMaterial (idx: number): Material | null {
        if (idx < 0 || idx >= this._materials.length) {
            return null;
        }
        return this._materials[idx];
    }

    /**
     * @en Set the shared material asset of the specified sub-model,
     * new material instance will be created automatically if the sub-model is already using one.
     * @zh 设置指定子模型的 sharedMaterial，如果对应位置有材质实例则会创建一个对应的材质实例。
     */
    public setMaterial (material: Material | null, index: number) {
        if (material && material instanceof MaterialInstance) {
            console.error('Can\'t set a material instance to a sharedMaterial slot');
        }
        this._materials[index] = material;
        const inst = this._materialInstances[index];
        if (inst) {
            if (inst.parent !== this._materials[index]) {
                inst.destroy();
                this._materialInstances[index] = null;
                this._onMaterialModified(index, this._materials[index]);
            }
        } else {
            this._onMaterialModified(index, this._materials[index]);
        }
    }

    get material () {
        return this.getMaterialInstance(0);
    }

    set material (val) {
        if (this._materials.length === 1 && this._materials[0] === val) {
            return;
        }
        this.setMaterialInstance(0, val);
    }

    /**
     * @en Get the material instance of the specified sub-model.
     * @zh 获取指定子模型的材质实例。
     */
    public getMaterialInstance (idx: number): Material | null {
        const mat = this._materials[idx];
        if (!mat) {
            return null;
        }
        if (!this._materialInstances[idx]) {
            _matInsInfo.parent = this._materials[idx]!;
            _matInsInfo.owner = this;
            _matInsInfo.subModelIdx = idx;
            const instantiated = new MaterialInstance(_matInsInfo);
            this.setMaterialInstance(idx, instantiated);
        }
        return this._materialInstances[idx];
    }

    /**
     * @en Set the material instance of the specified sub-model.
     * @zh 获取指定子模型的材质实例。
     */
    public setMaterialInstance (index: number, matInst: Material | null) {
        if (matInst && matInst.parent) {
            if (matInst !== this._materialInstances[index]) {
                this._materialInstances[index] = matInst as MaterialInstance;
                this._onMaterialModified(index, matInst);
            }
        } else {
            if (matInst !== this._materials[index]) {
                this.setMaterial(matInst as Material, index);
            }
        }
    }

    /**
     * @en Get the actual rendering material of the specified sub-model.
     * (material instance if there is one, or the shared material asset)
     * @zh 获取指定位置可供渲染的材质，如果有材质实例则使用材质实例，如果没有则使用材质资源
     */
    public getRenderMaterial (index: number): Material | null {
        return this._materialInstances[index] || this._materials[index];
    }

    public _collectModels (): Model[] {
        return this._models;
    }

    protected _attachToScene () {
    }

    protected _detachFromScene () {
    }

    protected _onMaterialModified (index: number, material: Material | null) {
    }

    protected _onRebuildPSO (index: number, material: Material | null) {
    }

    protected _clearMaterials () {
    }

    protected _onVisibilityChange (val) {
    }
}
