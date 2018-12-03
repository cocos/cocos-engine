import Asset from "../../assets/CCAsset";
import { property, ccclass } from "../../core/data/class-decorator";

@ccclass('cc.EffectAsset')
class EffectAsset extends Asset {
    @property
    techniques = [];

    @property
    properties = {};

    @property
    shaders = [];

    onLoaded() {
        let lib = cc.game._renderer._programLib;
        this.shaders.forEach(s => lib.define(s));
    }
}

let effects = EffectAsset._effects = {};
EffectAsset.register = function(asset) {
    effects[asset.name] = asset;
};
EffectAsset.remove = function(name) {
    if (effects[name]) { delete effects[name]; return; }
    for (let n in effects) {
        if (effects[n]._uuid === name) {
            delete effects[n];
            return;
        }
    }
};
EffectAsset.get = function(name) {
    return effects[name];
};
EffectAsset.getAll = function() {
    return effects;
};

export default EffectAsset;
cc.EffectAsset = EffectAsset;
