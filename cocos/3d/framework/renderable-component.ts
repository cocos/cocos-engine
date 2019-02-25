// @ts-check
import { Component } from '../../components/component';
import { _decorator } from '../../core/data/index';
import { Material } from '../assets/material';
const { ccclass, property } = _decorator;

@ccclass('cc.RenderableComponent')
export class RenderableComponent extends Component {
    @property({ type: [Material] })
    private _materials: Array<Material | null> = [];

    constructor () {
        super();
    }

    public onLoad () {
        this.sharedMaterials = this._materials.concat();
    }

    @property({
        type: Material,
        displayName: 'Materials',
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
     * !#en The material of the model
     *
     * !#ch 模型材质
     * @type {Material[]}
     */
    get materials () {
        for (let i = 0; i < this._materials.length; i++) {
            this._materials[i] = this.getMaterial(i)!;
        }
        return this._materials;
    }

    set materials (val) {
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
    public getMaterial (idx: number, inEditor: boolean = false): Material | null {
        const mat = this._materials[idx];
        if (!mat) { return null; }
        const instantiated = Material.getInstantiatedMaterial(mat, this, inEditor);
        if (instantiated !== this._materials[idx]) {
            this.setMaterial(instantiated, idx, !inEditor);
        }
        return this._materials[idx];
    }

    public getSharedMaterial (idx: number): Material | null {
        if (idx < 0 || idx >= this._materials.length) {
            return null;
        }
        return this._materials[idx];
    }

    get material () {
        return this.getMaterial(0);
    }

    set material (val) {
        if (this._materials.length === 1 && this._materials[0] === val) {
            return;
        }
        this.setMaterial(val, 0);
    }

    get sharedMaterial () {
        return this.getSharedMaterial(0);
    }

    public setMaterial (material: Material | null, index: number, notify: boolean = true) {
        this._materials[index] = material;
        if (notify) {
            this._onMaterialModified(index, material);
        }
    }

    protected _onMaterialModified (index: number, material: Material | null) {

    }

    protected _onRebuildPSO (index: number, material: Material | null) {
    }

    protected _clearMaterials () {

    }
}
