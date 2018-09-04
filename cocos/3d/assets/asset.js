let _internal_id = -1;

export default class Asset {
  constructor() {
    ++_internal_id;

    this._uuid = `internal-${_internal_id}`;
    this._name = '';
    this._loaded = false;

    // TODO
    // this._caches = {}; // downloaded caches (for reload)
  }

  get uuid() {
    return this._uuid;
  }

  get name() {
    return this._name;
  }

  /**
   * Overwrite this if you have sub-assets
   */
  subAsset(/*localID*/) {
    return null;
  }

  unload() {
    this._loaded = false;
  }

  reload() {
  }

  clone() {
  }
}