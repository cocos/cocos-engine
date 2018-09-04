import { EventEmitter } from '../event-sys';
import resl from '../misc/resl';
import utils from '../misc/utils';

function _createTable() {
  let obj = Object.create(null);
  obj.__tmp__ = undefined;
  delete obj.__tmp__;

  return obj;
}

function _wrapCallback(localID, callback) {
  return function (err, asset) {
    if (err) {
      if (callback) {
        callback(err);
      }
      return;
    }

    if (callback) {
      // if we are requesting subAsset, go get it.
      if (localID) {
        asset = asset.subAsset(localID);
        if (!asset) {
          callback(new Error(`subasset ${localID} not found.`));
          return;
        }
      }
      callback(null, asset);
    }
  };
}

class AssetTask extends EventEmitter {
  constructor() {
    super();
  }

  run(assetMng, uuid, info) {
    assetMng.loadUrls(info.type, info.urls, (err, asset) => {
      // remove loadings
      delete assetMng._loadings[uuid];

      // emit error
      if (err) {
        this.emit('loaded', err);
        return;
      }

      // emit loaded
      asset._uuid = uuid;
      asset._loaded = true;
      assetMng.add(uuid, asset);

      this.emit('loaded', null, asset);
    });
  }
}

export default class AssetMng {
  constructor(app) {
    this._app = app;
    this._loaders = _createTable(); // asset type to loader
    this._assetInfos = _createTable(); // uuid to asset-infos
    this._assets = _createTable(); // uuid to asset
    this._loadings = _createTable(); // uuid to loading tasks
    this._levelInfos = _createTable(); // sceneName to scene file
  }

  registerLoader(type, loader) {
    this._loaders[type] = loader;
  }

  registerAsset(uuid, info) {
    if (this._assetInfos[uuid]) {
      console.warn(`asset ${uuid} already registerred.`);
      return;
    }

    this._assetInfos[uuid] = info;
  }

  registerLevel(name, file) {
    if (this._levelInfos[name]) {
      console.warn(`level ${name} is already registerred.`);
      return;
    }

    this._levelInfos[name] = file;
  }

  loadLevel(name, callback) {
    if (!this._levelInfos[name]) {
      console.error(`Cannot load scene ${name}`);
      callback && callback(new Error('loadFail'), null);
    } else {
      let app = this._app;
      resl({
        manifest: {
          sceneJson: {
            type: 'text',
            parser: JSON.parse,
            src: this._levelInfos[name]
          }
        },
        onDone(data) {
          utils.parseLevel(
            app,
            data.sceneJson,
            (err, level) => {
              callback && callback(err, level);
            }
          );
        },
        onError(err) {
          callback && callback(err, null);
        }
      });
    }
  }

  add(uuid, asset) {
    if (this._assets[uuid]) {
      console.warn(`Failed to add asset ${uuid}, already exists.`);
      return;
    }
    this._assets[uuid] = asset;
  }

  get(uuid) {
    // if this is a sub-asset
    let subIdx = uuid.indexOf('@');

    if (subIdx === -1) {
      return this._assets[uuid];
    }

    let localID = uuid.substring(0, subIdx);
    uuid = uuid.substring(subIdx + 1);

    let asset = this._assets[uuid];
    if (asset && localID) {
      return asset.subAsset(localID);
    }

    return null;
  }

  load(uuid, callback) {
    // if this is a sub-asset
    let subIdx = uuid.indexOf('@');
    let localID;

    if (subIdx !== -1) {
      localID = uuid.substring(0, subIdx);
      uuid = uuid.substring(subIdx + 1);
    }

    // check if asset loaded
    let asset = this._assets[uuid];
    if (asset) {
      // if we already loaded
      if (callback) {
        // if we are requesting subAsset, go get it.
        if (localID) {
          asset = asset.subAsset(localID);
          if (!asset) {
            callback(new Error(`subasset ${localID} not found.`));
            return;
          }
        }

        callback(null, asset);
      }
      return;
    }

    // if this is a loading task
    let task = this._loadings[uuid];
    let taskCallback = _wrapCallback(localID, callback);
    if (task) {
      task.once('loaded', taskCallback);
      return;
    }

    // check if we have asset-info for loading asset
    let info = this._assetInfos[uuid];
    if (!info) {
      if (callback) {
        callback(new Error(`asset info ${uuid} not found, please add it first.`));
      }
      return;
    }

    // create new task
    task = new AssetTask(this);
    this._loadings[uuid] = task;

    task.once('loaded', _wrapCallback(localID, callback));
    task.run(this, uuid, info);
  }

  loadUrls(type, urls, callback) {
    let loader = this._loaders[type];
    if (!loader) {
      if (callback) {
        callback(new Error(`can not find loader for asset type ${type}, please register it first.`));
      }

      return;
    }

    loader(this._app, urls, callback);
  }
}