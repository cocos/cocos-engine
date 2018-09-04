import Asset from './asset';

export default class Effect extends Asset {
  constructor() {
    super();

    // effect disc
    this._techniques = [];
    this._properties = {};
    this._defines = [];
    this._dependencies = [];
  }

  set techniques(val) {
    this._techniques = val;
  }

  get techniques() {
    return this._techniques;
  }

  set properties(val) {
    this._properties = val;
  }

  get properties() {
    return this._properties;
  }

  set defines(val) {
    this._defines = val;
  }

  get defines() {
    return this._defines;
  }

  set dependencies(val) {
    this._dependencies = val;
  }

  get dependencies() {
    return this._dependencies;
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // TODO: what should we do here ???

    super.unload();
  }
}