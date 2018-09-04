import Asset from './asset';
import ecsUtils from '../loaders/utils/ecs-utils';

export default class Prefab extends Asset {
  constructor() {
    super();

    this._app = null;
    this._json = null;
    this._assets = null;
  }

  unload() {
    if (!this._loaded) {
      return;
    }

    // TODO: unload all assets referenced by the prefab ??

    super.unload();
  }

  instantiate(modifications, level = null) {
    return ecsUtils.createPrefab(this._app, this._json, modifications, level);
  }
}