//@ts-check
import { _decorator } from '../../core/data/index';
import { Material } from "../assets/material";
import { Component } from "../../components/component";
const { ccclass, property } = _decorator;

@ccclass('cc.RenderableComponent')
export default class RenderableComponent extends Component {
    /**
     * @type {Material[]}
     */
    @property([Material])
    _materials = [];

    constructor() {
        super();
    }

    @property({
        type: [Material],
        displayName: 'Materials'
    })
    get sharedMaterials() {
        return this._materials;
    }

    set sharedMaterials(val) {
        // 因为现在编辑器的做法是，当这个val传进来时，内部的materials已经被修改了。
        // 我们没办法做到上面的最优化，只能先清理ModelComponent里所有Submodel的材质，再重新关联。
        this._clearMaterials();
        val.forEach((newMaterial, index) => this.setMaterial(newMaterial, index));
    }

    /**
     * !#en The material of the model
     *
     * !#ch 模型材质
     * @type {Material[]}
     */
    get materials() {
        for (let i = 0; i < this._materials.length; i++) {
            this._materials[i] = this.getMaterial(i);
        }
        return this._materials;
    }

    set materials(val) {
        const dLen = val.length - this._materials.length;
        if (dLen > 0) {
            this._materials = this._materials.concat(new Array(dLen).fill(null));
        } else if (dLen < 0) {
            for (let i = -dLen; i < this._materials.length; ++i) {
                this.setMaterial(null, i);
            }
            this._materials = this._materials.splice(-dLen);
        }
    }

    /**
     * !#en Returns the material corresponding to the sequence number
     *
     * !#ch 返回相对应序号的材质
     * @param {Number} idx - Look for the material list number
     */
    getMaterial(idx) {
        if (idx < 0 || idx >= this._materials.length || this._materials[idx] == null) {
            return null;
        }

        let instantiated = Material.getInstantiatedMaterial(this._materials[idx], this);
        if (instantiated !== this._materials[idx]) {
            this.setMaterial(instantiated, idx);
        }

        return this._materials[idx];
    }

    getSharedMaterial(idx) {
        if (idx < 0 || idx >= this._materials.length) {
            return null;
        }
        return this._materials[idx];
    }

    get material() {
        return this.getMaterial(0);
    }

    get sharedMaterial() {
        return this.getSharedMaterial(0);
    }

    set material(val) {
        if (this._materials.length === 1 && this._materials[0] === val) {
            return;
        }
        this.setMaterial(val, 0);
    }

    setMaterial(material, index) {
        this._materials[index] = material;
        this._onMaterialModified(index, material);
    }

    _onMaterialModified(index, material) {

    }

    _clearMaterials() {

    }
}
