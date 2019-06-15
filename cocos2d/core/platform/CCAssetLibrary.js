/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var Asset = require('../assets/CCAsset');
var callInNextTick = require('./utils').callInNextTick;
var Loader = require('../load-pipeline/CCLoader');
var AssetTable = require('../load-pipeline/asset-table');
var PackDownloader = require('../load-pipeline/pack-downloader');
var AutoReleaseUtils = require('../load-pipeline/auto-release-utils');
var decodeUuid = require('../utils/decode-uuid');
var MD5Pipe = require('../load-pipeline/md5-pipe');
var SubPackPipe = require('../load-pipeline/subpackage-pipe');
var js = require('./js');

/**
 * The asset library which managing loading/unloading assets in project.
 *
 * @class AssetLibrary
 * @static
 */

// configs

var _libraryBase = '';
var _rawAssetsBase = '';     // The base dir for raw assets in runtime
var _uuidToRawAsset = js.createMap(true);

function isScene (asset) {
    return asset && (asset.constructor === cc.SceneAsset || asset instanceof cc.Scene);
}

// types

function RawAssetEntry (url, type) {
    this.url = url;
    this.type = type;
}

// publics

var AssetLibrary = {
    /**
     * @callback loadCallback
     * @param {String} error - null or the error info
     * @param {Asset} data - the loaded asset or null
     */

    /**
     * @method loadAsset
     * @param {String} uuid
     * @param {loadCallback} callback - the callback function once load finished
     * @param {Object} options
     * @param {Boolean} options.readMainCache - Default is true. If false, the asset and all its depends assets will reload and create new instances from library.
     * @param {Boolean} options.writeMainCache - Default is true. If true, the result will cache to AssetLibrary, and MUST be unload by user manually.
     * @param {Asset} options.existingAsset - load to existing asset, this argument is only available in editor
     * @private
     */
    loadAsset: function (uuid, callback, options) {
        if (typeof uuid !== 'string') {
            return callInNextTick(callback, new Error('[AssetLibrary] uuid must be string'), null);
        }
        // var readMainCache = typeof (options && options.readMainCache) !== 'undefined' ? readMainCache : true;
        // var writeMainCache = typeof (options && options.writeMainCache) !== 'undefined' ? writeMainCache : true;
        var item = {
            uuid: uuid,
            type: 'uuid'
        };
        if (options && options.existingAsset) {
            item.existingAsset = options.existingAsset;
        }
        Loader.load(item, function (error, asset) {
            if (error || !asset) {
                let errorInfo = error ? (error.message || error.errorMessage || error) : 'Unknown error';
                error = new Error(`[AssetLibrary] loading JSON or dependencies failed: ${errorInfo}`);
            }
            else {
                if (asset.constructor === cc.SceneAsset) {
                    if (CC_EDITOR && !asset.scene) {
                        Editor.error('Sorry, the scene data of "%s" is corrupted!', uuid);
                    }
                    else {
                        var key = cc.loader._getReferenceKey(uuid);
                        asset.scene.dependAssets = AutoReleaseUtils.getDependsRecursively(key);
                    }
                }
                if (CC_EDITOR || isScene(asset)) {
                    var id = cc.loader._getReferenceKey(uuid);
                    Loader.removeItem(id);
                }
            }
            if (callback) {
                callback(error, asset);
            }
        });
    },

    getLibUrlNoExt: function (uuid, inRawAssetsDir) {
        if (CC_BUILD) {
            uuid = decodeUuid(uuid);
        }
        var base = (CC_BUILD && inRawAssetsDir) ? (_rawAssetsBase + 'assets/') : _libraryBase;
        return base + uuid.slice(0, 2) + '/' + uuid;
    },

    _queryAssetInfoInEditor: function (uuid, callback) {
        if (CC_EDITOR) {
            Editor.Ipc.sendToMain('scene:query-asset-info-by-uuid', uuid, function (err, info) {
                if (info) {
                    Editor.Utils.UuidCache.cache(info.url, uuid);
                    var ctor = Editor.assets[info.type];
                    if (ctor) {
                        var isRawAsset = !js.isChildClassOf(ctor, Asset);
                        callback(null, info.url, isRawAsset, ctor);
                    }
                    else {
                        callback(new Error('Can not find asset type ' + info.type));
                    }
                }
                else {
                    var error = new Error('Can not get asset url by uuid "' + uuid + '", the asset may be deleted.');
                    error.errorCode = 'db.NOTFOUND';
                    callback(error);
                }
            });
        }
    },

    _getAssetInfoInRuntime: function (uuid, result) {
        result = result || {url: null, raw: false};
        var info = _uuidToRawAsset[uuid];
        if (info && !js.isChildClassOf(info.type, cc.Asset)) {
            // backward compatibility since 1.10
            result.url = _rawAssetsBase + info.url;
            result.raw = true;
        }
        else {
            result.url = this.getLibUrlNoExt(uuid) + '.json';
            result.raw = false;
        }
        return result;
    },

    _uuidInSettings: function (uuid) {
        return uuid in _uuidToRawAsset;
    },

    /**
     * @method queryAssetInfo
     * @param {String} uuid
     * @param {Function} callback
     * @param {Error} callback.error
     * @param {String} callback.url - the url of raw asset or imported asset
     * @param {Boolean} callback.raw - indicates whether the asset is raw asset
     * @param {Function} callback.ctorInEditor - the actual type of asset, used in editor only
     */
    queryAssetInfo: function (uuid, callback) {
        if (CC_EDITOR && !CC_TEST) {
            this._queryAssetInfoInEditor(uuid, callback);
        }
        else {
            var info = this._getAssetInfoInRuntime(uuid);
            callback(null, info.url, info.raw);
        }
    },

    // parse uuid out of url
    parseUuidInEditor: function (url) {
        if (CC_EDITOR) {
            var uuid = '';
            var isImported = url.startsWith(_libraryBase);
            if (isImported) {
                var dir = cc.path.dirname(url);
                var dirBasename = cc.path.basename(dir);

                var isAssetUrl = dirBasename.length === 2;
                if (isAssetUrl) {
                    uuid = cc.path.basename(url);
                    var index = uuid.indexOf('.');
                    if (index !== -1) {
                        uuid = uuid.slice(0, index);
                    }
                }
                else {
                    // raw file url
                    uuid = dirBasename;
                }
            }
            // If url is not in the library, just return ""
            return uuid;
        }
    },

    /**
     * @method loadJson
     * @param {String} json
     * @param {loadCallback} callback
     * @return {LoadingHandle}
     * @private
     */
    loadJson: function (json, callback) {
        var randomUuid = '' + ((new Date()).getTime() + Math.random());
        var item = {
            uuid: randomUuid,
            type: 'uuid',
            content: json,
            skips: [ Loader.assetLoader.id, Loader.downloader.id ]
        };
        Loader.load(item, function (error, asset) {
            if (error) {
                error = new Error('[AssetLibrary] loading JSON or dependencies failed: ' + error.message);
            }
            else {
                if (asset.constructor === cc.SceneAsset) {
                    var key = cc.loader._getReferenceKey(randomUuid);
                    asset.scene.dependAssets = AutoReleaseUtils.getDependsRecursively(key);
                }
                if (CC_EDITOR || isScene(asset)) {
                    var id = cc.loader._getReferenceKey(randomUuid);
                    Loader.removeItem(id);
                }
            }
            asset._uuid = '';
            if (callback) {
                callback(error, asset);
            }
        });
    },

    /**
     * Get the exists asset by uuid.
     *
     * @method getAssetByUuid
     * @param {String} uuid
     * @return {Asset} - the existing asset, if not loaded, just returns null.
     * @private
     */
    getAssetByUuid: function (uuid) {
        return AssetLibrary._uuidToAsset[uuid] || null;
    },

    /**
     * init the asset library
     *
     * @method init
     * @param {Object} options
     * @param {String} options.libraryPath - 能接收的任意类型的路径，通常在编辑器里使用绝对的，在网页里使用相对的。
     * @param {Object} options.mountPaths - mount point of actual urls for raw assets (only used in editor)
     * @param {Object} [options.rawAssets] - uuid to raw asset's urls (only used in runtime)
     * @param {String} [options.rawAssetsBase] - base of raw asset's urls (only used in runtime)
     * @param {String} [options.packedAssets] - packed assets (only used in runtime)
     */
    init: function (options) {
        if (CC_EDITOR && _libraryBase) {
            cc.errorID(6402);
            return;
        }


        // 这里将路径转 url，不使用路径的原因是有的 runtime 不能解析 "\" 符号。
        // 不使用 url.format 的原因是 windows 不支持 file:// 和 /// 开头的协议，所以只能用 replace 操作直接把路径转成 URL。
        var libraryPath = options.libraryPath;
        libraryPath = libraryPath.replace(/\\/g, '/');
        _libraryBase = cc.path.stripSep(libraryPath) + '/';

        _rawAssetsBase = options.rawAssetsBase;

        if (options.subpackages) {
            var subPackPipe = new SubPackPipe(options.subpackages);
            cc.loader.insertPipeAfter(cc.loader.assetLoader, subPackPipe);
            cc.loader.subPackPipe = subPackPipe;
        }
        
        var md5AssetsMap = options.md5AssetsMap;
        if (md5AssetsMap && md5AssetsMap.import) {
            // decode uuid
            var i = 0, uuid = 0;
            var md5ImportMap = js.createMap(true);
            var md5Entries = md5AssetsMap.import;
            for (i = 0; i < md5Entries.length; i += 2) {
                uuid = decodeUuid(md5Entries[i]);
                md5ImportMap[uuid] = md5Entries[i + 1];
            }

            var md5RawAssetsMap = js.createMap(true);
            md5Entries = md5AssetsMap['raw-assets'];
            for (i = 0; i < md5Entries.length; i += 2) {
                uuid = decodeUuid(md5Entries[i]);
                md5RawAssetsMap[uuid] = md5Entries[i + 1];
            }

            var md5Pipe = new MD5Pipe(md5ImportMap, md5RawAssetsMap, _libraryBase);
            cc.loader.insertPipeAfter(cc.loader.assetLoader, md5Pipe);
            cc.loader.md5Pipe = md5Pipe;
        }

        // init raw assets

        var assetTables = Loader._assetTables;
        for (var mount in assetTables) {
            assetTables[mount].reset();
        }
        
        var rawAssets = options.rawAssets;
        if (rawAssets) {
            for (var mountPoint in rawAssets) {
                var assets = rawAssets[mountPoint];
                for (var uuid in assets) {
                    var info = assets[uuid];
                    var url = info[0];
                    var typeId = info[1];
                    var type = cc.js._getClassById(typeId);
                    if (!type) {
                        cc.error('Cannot get', typeId);
                        continue;
                    }
                    // backward compatibility since 1.10
                    _uuidToRawAsset[uuid] = new RawAssetEntry(mountPoint + '/' + url, type);
                    // init resources
                    var ext = cc.path.extname(url);
                    if (ext) {
                        // trim base dir and extname
                        url = url.slice(0, - ext.length);
                    }

                    var isSubAsset = info[2] === 1;
                    if (!assetTables[mountPoint]) {
                        assetTables[mountPoint] = new AssetTable();
                    } 

                    assetTables[mountPoint].add(url, uuid, type, !isSubAsset);
                }
            }
        }

        if (options.packedAssets) {
            PackDownloader.initPacks(options.packedAssets);
        }

        // init cc.url
        cc.url._init((options.mountPaths && options.mountPaths.assets) || _rawAssetsBase + 'assets');
    }

};

// unload asset if it is destoryed

/**
 * !#en Caches uuid to all loaded assets in scenes.
 *
 * !#zh 这里保存所有已经加载的场景资源，防止同一个资源在内存中加载出多份拷贝。
 *
 * 这里用不了WeakMap，在浏览器中所有加载过的资源都只能手工调用 unloadAsset 释放。
 *
 * 参考：
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
 * https://github.com/TooTallNate/node-weak
 *
 * @property {object} _uuidToAsset
 * @private
 */
AssetLibrary._uuidToAsset = {};

//暂时屏蔽，因为目前没有缓存任何asset
//if (CC_DEV && Asset.prototype._onPreDestroy) {
//    cc.error('_onPreDestroy of Asset has already defined');
//}
//Asset.prototype._onPreDestroy = function () {
//    if (AssetLibrary._uuidToAsset[this._uuid] === this) {
//        AssetLibrary.unloadAsset(this);
//    }
//};


// TODO: Add BuiltinManager to handle builtin logic
let _builtins = {
    effect: {},
    material: {}
};

function loadBuiltins (name, type, cb) {
    let dirname = name  + 's';
    let builtin = _builtins[name] = {};
    let internalMountPath = 'internal';
    // internal path will be changed when run simulator
    if (CC_PREVIEW && CC_JSB) {
        internalMountPath = 'temp/internal';
    }
    cc.loader.loadResDir(dirname, type, internalMountPath, () => { }, (err, assets) => {
        if (err) {
            cc.error(err);
        }
        else {
            for (let i = 0; i < assets.length; i++) {
                builtin[`${assets[i].name}`] = assets[i];
            }
        }

        cb();
    });
}

AssetLibrary._loadBuiltins = function (cb) {
    if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
        return cb && cb();
    }

    loadBuiltins('effect', cc.EffectAsset, () => {
        loadBuiltins('material', cc.Material, cb);
    });
};

AssetLibrary.getBuiltin = function (type, name) {
    return _builtins[type][name];
};

AssetLibrary.getBuiltins = function (type) {
    if (!type) return _builtins;
    return _builtins[type];
};
AssetLibrary.resetBuiltins = function () {
    _builtins = {
        effect: {},
        material: {}
    };
};

module.exports = cc.AssetLibrary = AssetLibrary;
