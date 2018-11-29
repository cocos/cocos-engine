import Asset from "../../assets/CCAsset";
import { property, ccclass } from "../../core/data/class-decorator";

@ccclass('cc.EffectAsset')
export default class EffectAsset extends Asset {
    @property
    name = '';

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

cc.EffectAsset = EffectAsset;
