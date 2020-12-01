
import Material from './CCMaterial';
import EffectVariant from './effect-variant';
import MaterialPool from './material-pool';

let { ccclass, } = cc._decorator;

/**
 * !#en
 * Material Variant is an extension of the Material Asset.
 * Changes to Material Variant do not affect other Material Variant or Material Asset,
 * and changes to Material Asset are synchronized to the Material Variant.
 * However, when a Material Variant had already modifies a state, the Material Asset state is not synchronized to the Material Variant.
 * !#zh
 * 材质变体是材质资源的一个延伸。
 * 材质变体的修改不会影响到其他的材质变体或者材质资源，而材质资源的修改会同步体现到材质变体上，
 * 但是当材质变体对一个状态修改后，材质资源再对这个状态修改是不会同步到材质变体上的。
 * @class MaterialVariant
 * @extends Material
 */
@ccclass('cc.MaterialVariant')
export default class MaterialVariant extends Material {
    _owner: cc.RenderComponent = null;
    _material: Material = null;

    /**
     * @method createWithBuiltin
     * @param {Material.BUILTIN_NAME} materialName
     * @param {RenderComponent} [owner]
     * @typescript
     * static createWithBuiltin (materialName: string, owner: cc.RenderComponent): MaterialVariant | null
     */
    static createWithBuiltin (materialName: string, owner: cc.RenderComponent): MaterialVariant | null {
        return MaterialVariant.create(Material.getBuiltinMaterial(materialName), owner);
    }

    /**
     * @method create
     * @param {Material} material
     * @param {RenderComponent} [owner]
     * @typescript
     * static create (material: Material, owner: cc.RenderComponent): MaterialVariant | null
     */
    static create (material: Material, owner: cc.RenderComponent): MaterialVariant | null {
        if (!material) return null;
        return MaterialPool.get(material, owner);
    }

    get uuid () {
        return this._material._uuid;
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
