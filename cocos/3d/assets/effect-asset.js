import RawAsset from "../../assets/CCRawAsset";

export default class EffectAsset extends RawAsset {

    constructor() {
        super();
        this._name = null;
        this._uuid = null;
        this._techniques = null;
        this._properties = null;
        this._defines = null;
        this._dependencies = null;
    }

    get techniques() {
        return this._techniques;
    }

    get properties() {
        return this._properties;
    }

    get defines() {
        return this._defines;
    }

    get dependencies() {
        return this._dependencies;
    }

    setRawJson(json, isBuiltin = false) {
        this._name = json.name;
        // TODO:the uuid of customized effect should be changed later
        this._uuid = isBuiltin ? `builtin-effect-${json.name}` : json.name;
        this._techniques = json.techniques;
        this._properties = json.properties;
        this._defines = json.defines;
        this._dependencies = json.dependencies ? json.dependencies : [];
    }
}
