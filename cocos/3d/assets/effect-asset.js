import RawAsset from "../../assets/CCRawAsset";

export default class EffectAsset extends RawAsset {

    constructor() {
        super();
        this._name = null;
        this._uuid = null;
        this._techniques = null;
        this._properties = null;
    }

    get techniques() {
        return this._techniques;
    }

    get properties() {
        return this._properties;
    }

    setRawJson(json, isBuiltin = false) {
        this._name = json.name;
        // TODO:the uuid of customized effect should be changed later
        this._uuid = isBuiltin ? `builtin-effect-${json.name}` : json.name;
        this._techniques = json.techniques;
        this._properties = json.properties || {};
    }
}
