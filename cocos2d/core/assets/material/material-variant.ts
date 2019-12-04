
import Material from './CCMaterial';
import EffectVariant from './effect-variant';
import MaterialPool from './material-pool';

let { ccclass, } = cc._decorator;

@ccclass
export default class MaterialVariant extends Material {
    _owner: cc.RenderComponent = null;
    _material: Material = null;

    static createWithBuiltin (materialName, owner: cc.RenderComponent): MaterialVariant | null {
        return MaterialVariant.create(Material.getBuiltinMaterial(materialName), owner);
    }

    static create (material: Material, owner: cc.RenderComponent): MaterialVariant | null {
        if (!material) return null;
        return MaterialPool.get(material, owner);
    }

    get owner () {
        return this._owner;
    }

    get material () {
        return this._material;
    }

    constructor (material: Material) {
        super();
        this.init(material);
    }

    init (material) {
        this._effect = new EffectVariant(material.effect);
        this._effectAsset = material._effectAsset;
        this._material = material;
    }
}

cc.MaterialVariant = MaterialVariant;
