/**
 * @category model
 */

// @ts-check
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
        tooltip: '材质',
    })
    protected _materials: Array<Material | null> = [];

    @property
    protected _visFlags = Layers.Enum.NONE;

    @property({ visible: false })
    get visibility () {
        return this._visFlags;
    }

    set visibility (val) {
        this._visFlags = val;
        this._onVisiblityChange(val);
    }

    @property({
        type: Material,
        displayName: 'Materials',
        tooltip: '源材质',
        animatable: false,
    })
    get sharedMaterials () {
        // if we don't create an array copy, the editor will modify the original array directly.
        return this._materials.slice();
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
     * @en The material of the model
     * @zh 模型材质。
     */
    // @property({
    //     type: Material,
    //     visible: false,
    //     animatable: true,
    // })
    get materials () {
        for (let i = 0; i < this._materials.length; i++) {
            this._materialInstances[i] = this.getMaterialInstance(i) as MaterialInstance;
        }
        return this._materials;
    }

    set materials (val) {
        const dLen = val.length - this._materials.length;
        if (dLen > 0) {
            this._materials = this._materials.concat(new Array(dLen).fill(null));
        } else if (dLen < 0) {
            for (let i = -dLen; i < this._materials.length; ++i) {
                this.setMaterialInstance(i, null);
            }
            this._materials = this._materials.splice(-dLen);
        }
    }

    protected _materialInstances: Array<MaterialInstance | null> = [];
    protected _models: Model[] = [];

    get sharedMaterial () {
        return this.getMaterial(0);
    }

    /**
     * 获取指定的sharedMaterial
     * @param idx 材质序号
     */
    public getMaterial (idx: number): Material | null {
        if (idx < 0 || idx >= this._materials.length) {
            return null;
        }
        return this._materials[idx];
    }

    /**
     * 设置指定的 sharedMaterial，如果对应位置有材质实例则会创建一个对应的材质实例
     * @param index 材质序号
     * @param material 材质对象
     */
    public setMaterial (material: Material | null, index: number) {
        if (material && material instanceof MaterialInstance) {
            console.error('Can\'t set a material instance to a sharedMaterial slot');
        }
        this._materials[index] = material;
        if (this._materialInstances[index]) {
            if (this._materialInstances[index]!.parent !== this._materials[index]) {
                this._materialInstances[index]!.destroy();
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
     * @en Returns the material instance corresponding to the sequence number
     * @zh 获取相对应序号的材质实例。
     * @param idx Look for the material list number
     */
    public getMaterialInstance (idx: number): Material | null {
        const mat = this._materials[idx];
        if (!mat) {
            return null;
        }
        if (this._materialInstances[idx] == null) {
            _matInsInfo.parent = this._materials[idx]!;
            _matInsInfo.owner = this;
            _matInsInfo.subModelIdx = idx;
            const instantiated = new MaterialInstance(_matInsInfo);
            this.setMaterialInstance(idx, instantiated);
        }
        return this._materialInstances[idx];
    }

    /**
     * 设置对应序号的材质实例
     * @param index 材质序号
     * @param matInst 材质实例
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
     * 获取指定位置可供渲染的材质，如果有材质实例则使用材质实例，如果没有则使用材质资源
     * @param index 材质序号
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

    protected _onVisiblityChange (val) {
    }
}
