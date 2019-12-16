/**
 * @category model
 */

// @ts-check
import { Material } from '../../assets/material';
import { Component } from '../../components/component';
import { _decorator } from '../../data/index';
import { MaterialInstance } from '../../renderer/core/material-instance';
import { Model } from '../../renderer/scene/model';
import { Layers } from '../../scene-graph/layers';
import { IMaterial } from '../../utils/material-interface';
const { ccclass, property } = _decorator;

@ccclass('cc.RenderableComponent')
export class RenderableComponent extends Component {
    @property({
        type: [Material],
        tooltip: '材质',
    })
    protected _materials: Array<Material | null> = [];

    protected _materialInstances: Array<MaterialInstance | null> = [];

    @property
    protected _visFlags = Layers.Enum.NONE;

    protected _models: Model[] = [];

    constructor () {
        super();
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
                this.setMaterial(i, val[i]);
            }
        }
        if (val.length < this._materials.length) {
            for (let i = val.length; i < this._materials.length; i++) {
                this.setMaterial(i, null);
            }
            this._materials.splice(val.length);
        }
    }

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
     * 设置指定的sharedMaterial，如果对应位置有材质实例则会创建一个对应的材质实例
     * @param index 材质序号
     * @param material 材质对象
     */
    public setMaterial (index: number, material: Material | null) {
        this._materials[index] = material;
        if (this._materialInstances[index]) {
            if (this._materialInstances[index]!.parent !== material) {
                this.getMaterialInstance(index);
                this._onMaterialModified(index, material);
            }
        } else {
            this._onMaterialModified(index, material);
        }
    }

    /**
     * @en The material of the model
     * @zh 模型材质。
     * @type {Material[]}
     */
    @property({
        type: Material,
        visible: false,
        animatable: true,
    })
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
     * @param {Number} idx - Look for the material list number
     */
    public getMaterialInstance (idx: number): IMaterial | null {
        const mat = this._materials[idx];
        if (!mat) {
            return null;
        }
        if (this._materialInstances[idx] == null) {
            const instantiated = new MaterialInstance(this._materials[idx]!, this);
            this.setMaterialInstance(idx, instantiated);
        }
        return this._materialInstances[idx];
    }

    /**
     * 设置对应序号的材质实例
     * @param index 材质序号
     * @param matInst 材质实例
     */
    public setMaterialInstance (index: number, matInst: IMaterial | null) {
        if (matInst && matInst.parent) {
            if (matInst !== this._materialInstances[index]) {
                this._materialInstances[index] = matInst as MaterialInstance;
                this._onMaterialModified(index, matInst);
            }
        } else {
            if (matInst !== this._materials[index]) {
                this.setMaterial(index, matInst as Material);
            }
        }
    }

    /**
     * 获取指定位置可供渲染的材质，如果有材质实例则使用材质实例，如果没有则使用材质资源
     * @param index 材质序号
     */
    public getRenderMaterial (index: number): IMaterial | null {
        return this._materialInstances[index] || this._materials[index];
    }

    @property({ visible: false })
    get visibility () {
        return this._visFlags;
    }

    set visibility (val) {
        this._visFlags = val;
        this._onVisiblityChange(val);
    }

    public _collectModels (): Model[] {
        return this._models;
    }

    protected _attachToScene () {
    }

    protected _detachFromScene () {
    }

    protected _onMaterialModified (index: number, material: IMaterial | null) {

    }

    protected _onRebuildPSO (index: number, material: Material | null) {
    }

    protected _clearMaterials () {

    }

    protected _onVisiblityChange (val) {

    }
}
