import RenderSystemActor from "./renderSystemActor";
import { _decorator } from '../../core/data/index';
import Material from "../assets/material";
const { ccclass, property } = _decorator;

@ccclass('cc.RenderableComponent')
export default class RenderableComponent extends RenderSystemActor {
    @property
    _materials = [];

    /**
     * !#en The material of the model
     *
     * !#ch 模型材质
     * @type {Material[]}
     */
    @property
    get materials() {
        for (let i = 0; i < this._materials.length; i++) {
            this._materials[i] = this.getMaterial(i);
        }
        return this._materials;
    }

    get sharedMaterials() {
        return this._materials;
    }

    set materials(val) {
        this._materials = val;
        for (let i = 0; i < val.length; i++) {
            this._onMaterialModified(i, val[i]);
        }
    }

    /**
     * !#en Returns the material corresponding to the sequence number
     *
     * !#ch 返回相对应序号的材质
     * @param {Number} idx - Look for the material list number
     */
    getMaterial(idx) {
        if (idx < 0 || idx >= this._materials.length) {
            return null;
        }

        let instantiated = Material.getInstantiatedMaterial(this._materials[idx], this);
        if (instantiated != this) {
            this._materials[idx] = instantiated;
            this._onMaterialModified(idx, instantiated);
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

        if (val != this._materials[0]) {
            this._onMaterialModified(0, val);
        }
        this._materials[0] = val;
    }
}
