
import Material from './CCMaterial';
import EffectVariant from './effect-variant';

let { ccclass,  } = cc._decorator;

@ccclass
export default class MaterialVariant extends Material {
    _owner: cc.RenderComponent = null;
    _material: Material = null;

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
