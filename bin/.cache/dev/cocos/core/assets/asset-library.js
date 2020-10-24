(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/decode-uuid.js", "../utils/js.js", "../utils/misc.js", "../load-pipeline/asset-table.js", "../load-pipeline/md5-pipe.js", "../load-pipeline/pack-downloader.js", "../load-pipeline/subpackage-pipe.js", "./asset.js", "../platform/debug.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/decode-uuid.js"), require("../utils/js.js"), require("../utils/misc.js"), require("../load-pipeline/asset-table.js"), require("../load-pipeline/md5-pipe.js"), require("../load-pipeline/pack-downloader.js"), require("../load-pipeline/subpackage-pipe.js"), require("./asset.js"), require("../platform/debug.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.decodeUuid, global.js, global.misc, global.assetTable, global.md5Pipe, global.packDownloader, global.subpackagePipe, global.asset, global.debug, global.defaultConstants, global.globalExports);
    global.assetLibrary = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _decodeUuid, _js, _misc, _assetTable, _md5Pipe, _packDownloader, _subpackagePipe, _asset, debug, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _decodeUuid = _interopRequireDefault(_decodeUuid);
  _md5Pipe = _interopRequireDefault(_md5Pipe);
  debug = _interopRequireWildcard(debug);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /*
  Copyright (c) 2013-2016 Chukong Technologies Inc.
  Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
  http://www.cocos.com
  
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
  */

  /**
   * @category asset
   */
  // tslint:disable: max-line-length
  // configs
  var _libraryBase = '';
  var _rawAssetsBase = ''; // The base dir for raw assets in runtime

  var _uuidToRawAsset = (0, _js.createMap)(true);

  function isScene(asset) {
    return asset && (asset.constructor === _globalExports.legacyCC.SceneAsset || asset instanceof _globalExports.legacyCC.Scene);
  } // types


  function RawAssetEntry(url, type) {
    // @ts-ignore
    this.url = url; // @ts-ignore

    this.type = type;
  } // publics

  /**
   * 管理项目中加载/卸载资源的资源库。
   * @class AssetLibrary
   * @static
   */


  var AssetLibrary = {
    /**
     * 这里保存所有已经加载的场景资源，防止同一个资源在内存中加载出多份拷贝。
     *
     * 这里用不了WeakMap，在浏览器中所有加载过的资源都只能手工调用 unloadAsset 释放。
     *
     * 参考：
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap
     * https://github.com/TooTallNate/node-weak
     *
     * @private
     */
    _uuidToAsset: {},

    /**
     * @callback loadCallback
     * @param {String} error - null or the error info
     * @param {Asset} data - the loaded asset or null
     */

    /**
     * @zh
     * 加载资源。
     * @param {String} uuid
     * @param {loadCallback} callback - 加载完成后执行的回调函数。
     * @param {Object} options
     * @param {Boolean} options.readMainCache - 默认为true。如果为false，则资源及其所有依赖资源将重新加载并从库中创建新实例。
     * @param {Boolean} options.writeMainCache - 默认为true。如果为true，则结果将缓存到 AssetLibrary，并且必须由用户手动卸载。
     * @param {Asset} options.existingAsset - 加载现有资源，此参数仅在编辑器中可用。
     */
    loadAsset: function loadAsset(uuid, callback, options) {
      if (typeof uuid !== 'string') {
        return (0, _misc.callInNextTick)(callback, new Error('[AssetLibrary] uuid must be string'), null);
      } // var readMainCache = typeof (options && options.readMainCache) !== 'undefined' ? readMainCache : true;
      // var writeMainCache = typeof (options && options.writeMainCache) !== 'undefined' ? writeMainCache : true;


      var item = {
        uuid: uuid,
        type: 'uuid'
      };

      if (options && options.existingAsset) {
        item.existingAsset = options.existingAsset;
      }

      _globalExports.legacyCC.loader.load(item, function (error, asset) {
        if (error || !asset) {
          error = new Error('[AssetLibrary] loading JSON or dependencies failed: ' + (error ? error.message : 'Unknown error'));
        } else {
          if (asset.constructor === _globalExports.legacyCC.SceneAsset) {
            if (_defaultConstants.EDITOR && !asset.scene) {
              debug.error('Sorry, the scene data of "%s" is corrupted!', uuid);
            }
          }
        }

        if (callback) {
          callback(error, asset);
        }
      });
    },

    /**
     * @zh
     * 获取资源的 url。
     */
    getLibUrlNoExt: function getLibUrlNoExt(uuid, inRawAssetsDir) {
      if (_defaultConstants.BUILD) {
        uuid = (0, _decodeUuid.default)(uuid);
      }

      var uuids = uuid.split('@').map(function (name) {
        return encodeURIComponent(name);
      });
      uuid = uuids.join('@');
      var base = _defaultConstants.BUILD && inRawAssetsDir ? _rawAssetsBase + 'assets/' : _libraryBase;
      return base + uuid.slice(0, 2) + '/' + uuid;
    },

    /**
     * @zh
     * 在编辑器中查询资源信息。
     * @param uuid 资源的 uuid。
     * @protected
     */
    _queryAssetInfoInEditor: function _queryAssetInfoInEditor(uuid, callback) {
      if (_defaultConstants.EDITOR) {
        EditorExtends.Asset.queryAssetInfo(uuid, function (error, info) {
          if (error) {
            var loadError = new Error('Can not get asset url by uuid "' + uuid + '", the asset may be deleted.');
            loadError.errorCode = 'db.NOTFOUND';
            debug.error(error);
            return callback(loadError);
          }

          var ctor = _globalExports.legacyCC.js.getClassByName(info.type);

          if (ctor) {
            var isRawAsset = !(0, _js.isChildClassOf)(ctor, _asset.Asset);
            var url = "import://".concat(info.uuid.substr(0, 2), "/").concat(info.uuid, ".json");
            callback(null, url, isRawAsset, ctor);
          } else {
            callback(new Error('Can not find asset type ' + info.type));
          }
        });
      } else {
        callback(new Error('Unable to load resource: EditorExtends is not defined.'));
      }
    },

    /**
     * @zh
     * 在运行时获取资源信息。
     */
    _getAssetInfoInRuntime: function _getAssetInfoInRuntime(uuid, result) {
      result = result || {
        url: null,
        raw: false
      };
      var info = _uuidToRawAsset[uuid];

      if (info && !(0, _js.isChildClassOf)(info.type, _globalExports.legacyCC.Asset)) {
        // backward compatibility since 1.10
        result.url = _rawAssetsBase + info.url;
        result.raw = true;
      } else {
        result.url = this.getLibUrlNoExt(uuid) + '.json';
        result.raw = false;
      }

      return result;
    },

    /**
     * @zh
     * 在 setting 中的 uuid。
     */
    _uuidInSettings: function _uuidInSettings(uuid) {
      return uuid in _uuidToRawAsset;
    },

    /**
     * @zh
     * 获取资源信息。
     * @param {String} uuid 资源的 uuid。
     * @param {Function} callback
     * @param {Error} callback.error
     * @param {String} callback.url - the url of raw asset or imported asset
     * @param {Boolean} callback.raw - indicates whether the asset is raw asset
     * @param {Function} callback.ctorInEditor - the actual type of asset, used in editor only
     */
    queryAssetInfo: function queryAssetInfo(uuid, callback) {
      if (_defaultConstants.EDITOR && !_defaultConstants.TEST) {
        this._queryAssetInfoInEditor(uuid, callback);
      } else {
        var info = this._getAssetInfoInRuntime(uuid);

        callback(null, info.url, info.raw);
      }
    },

    /**
     * @en
     * parse uuid out of url
     * @zh
     * 从 url 解析 uuid。
     * @param url 资源地址。
     */
    parseUuidInEditor: function parseUuidInEditor(url) {
      if (_defaultConstants.EDITOR) {
        var uuid = '';
        var isImported = url.startsWith(_libraryBase);

        if (isImported) {
          var dir = _globalExports.legacyCC.path.dirname(url);

          var dirBasename = _globalExports.legacyCC.path.basename(dir);

          var isAssetUrl = dirBasename.length === 2;

          if (isAssetUrl) {
            uuid = _globalExports.legacyCC.path.basename(url);
            var index = uuid.indexOf('.');

            if (index !== -1) {
              uuid = uuid.slice(0, index);
            }
          } else {
            // raw file url
            uuid = dirBasename;
          }
        } // If url is not in the library, just return ""


        return uuid;
      }
    },

    /**
     * @zh
     * 加载 json。
     * @param {String} json
     * @param {loadCallback} callback
     * @return {LoadingHandle}
     * @private
     */
    loadJson: function loadJson(json, callback) {
      var randomUuid = '' + (new Date().getTime() + Math.random());
      var item = {
        uuid: randomUuid,
        type: 'uuid',
        content: json,
        skips: [_globalExports.legacyCC.loader.assetLoader.id, _globalExports.legacyCC.loader.downloader.id]
      };

      _globalExports.legacyCC.loader.load(item, function (error, asset) {
        if (error) {
          error = new Error('[AssetLibrary] loading JSON or dependencies failed: ' + error.message);
        } else {
          if (_defaultConstants.EDITOR || isScene(asset)) {
            var id = _globalExports.legacyCC.loader._getReferenceKey(randomUuid);

            _globalExports.legacyCC.loader.removeItem(id);
          }
        }

        asset._uuid = '';

        if (callback) {
          callback(error, asset);
        }
      });
    },

    /**
     * @en
     * Get the exists asset by uuid.
     * @zh
     * 根据 uuid 获取存在的资源。
     * @param {String} uuid
     * @return {Asset} - 返回存在的资源，若没有加载则返回 null
     * @private
     */
    getAssetByUuid: function getAssetByUuid(uuid) {
      return AssetLibrary._uuidToAsset[uuid] || null;
    },
    // tslint:disable: no-shadowed-variable

    /**
     * @en
     * init the asset library
     * @zh
     * 初始化 AssetLibrary。
     * @method init
     * @param {Object} options
     * @param {String} options.libraryPath - 能接收的任意类型的路径，通常在编辑器里使用绝对的，在网页里使用相对的。
     * @param {Object} options.mountPaths - mount point of actual urls for raw assets (only used in editor)
     * @param {Object} [options.rawAssets] - uuid to raw asset's urls (only used in runtime)
     * @param {String} [options.rawAssetsBase] - base of raw asset's urls (only used in runtime)
     * @param {String} [options.packedAssets] - packed assets (only used in runtime)
     */
    init: function init(options) {
      if (_defaultConstants.EDITOR && _libraryBase) {
        debug.errorID(6402);
        return;
      } // 这里将路径转 url，不使用路径的原因是有的 runtime 不能解析 "\" 符号。
      // 不使用 url.format 的原因是 windows 不支持 file:// 和 /// 开头的协议，所以只能用 replace 操作直接把路径转成 URL。


      var libraryPath = options.libraryPath;
      libraryPath = libraryPath.replace(/\\/g, '/');
      _libraryBase = _globalExports.legacyCC.path.stripSep(libraryPath) + '/';
      _rawAssetsBase = options.rawAssetsBase;
      var md5AssetsMap = options.md5AssetsMap;

      if (md5AssetsMap && md5AssetsMap["import"]) {
        // decode uuid
        var i = 0;
        var uuid = '';
        var md5ImportMap = (0, _js.createMap)(true);
        var md5Entries = md5AssetsMap["import"];

        for (i = 0; i < md5Entries.length; i += 2) {
          uuid = (0, _decodeUuid.default)(md5Entries[i]);
          var uuids = uuid.split('@').map(function (name) {
            return encodeURIComponent(name);
          });
          uuid = uuids.join('@');
          md5ImportMap[uuid] = md5Entries[i + 1];
        }

        var md5RawAssetsMap = (0, _js.createMap)(true);
        md5Entries = md5AssetsMap['raw-assets'];

        for (i = 0; i < md5Entries.length; i += 2) {
          uuid = (0, _decodeUuid.default)(md5Entries[i]);

          var _uuids = uuid.split('@').map(function (name) {
            return encodeURIComponent(name);
          });

          uuid = _uuids.join('@');
          md5RawAssetsMap[uuid] = md5Entries[i + 1];
        }

        var md5Pipe = new _md5Pipe.default(md5ImportMap, md5RawAssetsMap, _libraryBase);

        _globalExports.legacyCC.loader.insertPipeAfter(_globalExports.legacyCC.loader.assetLoader, md5Pipe);

        _globalExports.legacyCC.loader.md5Pipe = md5Pipe;
      }

      var subPackages = options.subPackages;

      if (subPackages) {
        _globalExports.legacyCC.loader.downloader.setSubPackages(subPackages);

        var subPackPipe = new _subpackagePipe.SubPackPipe(subPackages);

        _globalExports.legacyCC.loader.insertPipeAfter(_globalExports.legacyCC.loader.assetLoader, subPackPipe);

        _globalExports.legacyCC.loader.subPackPipe = subPackPipe;
      } // init raw assets


      var assetTables = _globalExports.legacyCC.loader._assetTables; // tslint:disable: forin

      for (var mount in assetTables) {
        assetTables[mount].reset();
      }

      var rawAssets = options.rawAssets;

      if (rawAssets) {
        for (var mountPoint in rawAssets) {
          var assets = rawAssets[mountPoint];

          for (var _uuid in assets) {
            var info = assets[_uuid];
            var url = info[0];
            var typeId = info[1];
            var type = (0, _js._getClassById)(typeId);

            if (!type) {
              debug.error('Cannot get', typeId);
              continue;
            } // backward compatibility since 1.10


            _uuidToRawAsset[_uuid] = new RawAssetEntry(mountPoint + '/' + url, type); // init resources

            var isSubAsset = info[2] === 1;

            if (!assetTables[mountPoint]) {
              assetTables[mountPoint] = new _assetTable.AssetTable();
            }

            assetTables[mountPoint].add(url, _uuid, type, !isSubAsset);
          }
        }
      }

      if (options.packedAssets) {
        (0, _packDownloader.initPacks)(options.packedAssets);
      } // init cc.url


      _globalExports.legacyCC.url._init(options.mountPaths && options.mountPaths.assets || _rawAssetsBase + 'assets');
    }
  }; // 暂时屏蔽，因为目前没有缓存任何asset
  // if (DEV && Asset.prototype._onPreDestroy) {
  //    cc.error('_onPreDestroy of Asset has already defined');
  // }
  // Asset.prototype._onPreDestroy = function () {
  //    if (AssetLibrary._uuidToAsset[this._uuid] === this) {
  //        AssetLibrary.unloadAsset(this);
  //    }
  // };

  _globalExports.legacyCC.AssetLibrary = AssetLibrary;
  var _default = AssetLibrary;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL2Fzc2V0LWxpYnJhcnkudHMiXSwibmFtZXMiOlsiX2xpYnJhcnlCYXNlIiwiX3Jhd0Fzc2V0c0Jhc2UiLCJfdXVpZFRvUmF3QXNzZXQiLCJpc1NjZW5lIiwiYXNzZXQiLCJjb25zdHJ1Y3RvciIsImxlZ2FjeUNDIiwiU2NlbmVBc3NldCIsIlNjZW5lIiwiUmF3QXNzZXRFbnRyeSIsInVybCIsInR5cGUiLCJBc3NldExpYnJhcnkiLCJfdXVpZFRvQXNzZXQiLCJsb2FkQXNzZXQiLCJ1dWlkIiwiY2FsbGJhY2siLCJvcHRpb25zIiwiRXJyb3IiLCJpdGVtIiwiZXhpc3RpbmdBc3NldCIsImxvYWRlciIsImxvYWQiLCJlcnJvciIsIm1lc3NhZ2UiLCJFRElUT1IiLCJzY2VuZSIsImRlYnVnIiwiZ2V0TGliVXJsTm9FeHQiLCJpblJhd0Fzc2V0c0RpciIsIkJVSUxEIiwidXVpZHMiLCJzcGxpdCIsIm1hcCIsIm5hbWUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJqb2luIiwiYmFzZSIsInNsaWNlIiwiX3F1ZXJ5QXNzZXRJbmZvSW5FZGl0b3IiLCJFZGl0b3JFeHRlbmRzIiwiQXNzZXQiLCJxdWVyeUFzc2V0SW5mbyIsImluZm8iLCJsb2FkRXJyb3IiLCJlcnJvckNvZGUiLCJjdG9yIiwianMiLCJnZXRDbGFzc0J5TmFtZSIsImlzUmF3QXNzZXQiLCJzdWJzdHIiLCJfZ2V0QXNzZXRJbmZvSW5SdW50aW1lIiwicmVzdWx0IiwicmF3IiwiX3V1aWRJblNldHRpbmdzIiwiVEVTVCIsInBhcnNlVXVpZEluRWRpdG9yIiwiaXNJbXBvcnRlZCIsInN0YXJ0c1dpdGgiLCJkaXIiLCJwYXRoIiwiZGlybmFtZSIsImRpckJhc2VuYW1lIiwiYmFzZW5hbWUiLCJpc0Fzc2V0VXJsIiwibGVuZ3RoIiwiaW5kZXgiLCJpbmRleE9mIiwibG9hZEpzb24iLCJqc29uIiwicmFuZG9tVXVpZCIsIkRhdGUiLCJnZXRUaW1lIiwiTWF0aCIsInJhbmRvbSIsImNvbnRlbnQiLCJza2lwcyIsImFzc2V0TG9hZGVyIiwiaWQiLCJkb3dubG9hZGVyIiwiX2dldFJlZmVyZW5jZUtleSIsInJlbW92ZUl0ZW0iLCJfdXVpZCIsImdldEFzc2V0QnlVdWlkIiwiaW5pdCIsImVycm9ySUQiLCJsaWJyYXJ5UGF0aCIsInJlcGxhY2UiLCJzdHJpcFNlcCIsInJhd0Fzc2V0c0Jhc2UiLCJtZDVBc3NldHNNYXAiLCJpIiwibWQ1SW1wb3J0TWFwIiwibWQ1RW50cmllcyIsIm1kNVJhd0Fzc2V0c01hcCIsIm1kNVBpcGUiLCJNRDVQaXBlIiwiaW5zZXJ0UGlwZUFmdGVyIiwic3ViUGFja2FnZXMiLCJzZXRTdWJQYWNrYWdlcyIsInN1YlBhY2tQaXBlIiwiU3ViUGFja1BpcGUiLCJhc3NldFRhYmxlcyIsIl9hc3NldFRhYmxlcyIsIm1vdW50IiwicmVzZXQiLCJyYXdBc3NldHMiLCJtb3VudFBvaW50IiwiYXNzZXRzIiwidHlwZUlkIiwiaXNTdWJBc3NldCIsIkFzc2V0VGFibGUiLCJhZGQiLCJwYWNrZWRBc3NldHMiLCJfaW5pdCIsIm1vdW50UGF0aHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJEOzs7QUFnQkE7QUFFQTtBQUVBLE1BQUlBLFlBQVksR0FBRyxFQUFuQjtBQUNBLE1BQUlDLGNBQWMsR0FBRyxFQUFyQixDLENBQTZCOztBQUM3QixNQUFNQyxlQUFlLEdBQUcsbUJBQVUsSUFBVixDQUF4Qjs7QUFFQSxXQUFTQyxPQUFULENBQWtCQyxLQUFsQixFQUF5QjtBQUNyQixXQUFPQSxLQUFLLEtBQUtBLEtBQUssQ0FBQ0MsV0FBTixLQUFzQkMsd0JBQVNDLFVBQS9CLElBQTZDSCxLQUFLLFlBQVlFLHdCQUFTRSxLQUE1RSxDQUFaO0FBQ0gsRyxDQUVEOzs7QUFFQSxXQUFTQyxhQUFULENBQXdCQyxHQUF4QixFQUE2QkMsSUFBN0Is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SUFBSSxDQUFDLENBQUQsQ0FBSixLQUFZLENBQS9COztBQUVBLGdCQUFJLENBQUMyRCxXQUFXLENBQUNLLFVBQUQsQ0FBaEIsRUFBOEI7QUFDMUJMLGNBQUFBLFdBQVcsQ0FBQ0ssVUFBRCxDQUFYLEdBQTBCLElBQUlJLHNCQUFKLEVBQTFCO0FBQ0g7O0FBRURULFlBQUFBLFdBQVcsQ0FBQ0ssVUFBRCxDQUFYLENBQXdCSyxHQUF4QixDQUE0QnRHLEdBQTVCLEVBQWlDSyxLQUFqQyxFQUF1Q0osSUFBdkMsRUFBNkMsQ0FBQ21HLFVBQTlDO0FBQ0g7QUFDSjtBQUNKOztBQUVELFVBQUk3RixPQUFPLENBQUNnRyxZQUFaLEVBQTBCO0FBQ3RCLHVDQUFVaEcsT0FBTyxDQUFDZ0csWUFBbEI7QUFDSCxPQTNGVSxDQTZGWDs7O0FBQ0EzRyw4QkFBU0ksR0FBVCxDQUFhd0csS0FBYixDQUFvQmpHLE9BQU8sQ0FBQ2tHLFVBQVIsSUFBc0JsRyxPQUFPLENBQUNrRyxVQUFSLENBQW1CUCxNQUExQyxJQUFxRDNHLGNBQWMsR0FBRyxRQUF6RjtBQUNIO0FBclZnQixHQUFyQixDLENBd1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUssMEJBQVNNLFlBQVQsR0FBd0JBLFlBQXhCO2lCQUNlQSxZIiwic291cmNlc0NvbnRlbnQiOlsi77u/LypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBhc3NldFxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNvZGVVdWlkIGZyb20gJy4uL3V0aWxzL2RlY29kZS11dWlkJztcclxuaW1wb3J0IHsgX2dldENsYXNzQnlJZCwgY3JlYXRlTWFwLCBpc0NoaWxkQ2xhc3NPZiB9IGZyb20gJy4uL3V0aWxzL2pzJztcclxuaW1wb3J0IHsgY2FsbEluTmV4dFRpY2sgfSBmcm9tICcuLi91dGlscy9taXNjJztcclxuaW1wb3J0IHsgQXNzZXRUYWJsZSB9IGZyb20gJy4uL2xvYWQtcGlwZWxpbmUvYXNzZXQtdGFibGUnO1xyXG5pbXBvcnQgTUQ1UGlwZSBmcm9tICcuLi9sb2FkLXBpcGVsaW5lL21kNS1waXBlJztcclxuaW1wb3J0IHsgaW5pdFBhY2tzIH0gZnJvbSAnLi4vbG9hZC1waXBlbGluZS9wYWNrLWRvd25sb2FkZXInO1xyXG5pbXBvcnQgeyBTdWJQYWNrUGlwZSB9IGZyb20gJy4uL2xvYWQtcGlwZWxpbmUvc3VicGFja2FnZS1waXBlJztcclxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuL2Fzc2V0JztcclxuaW1wb3J0ICogYXMgZGVidWcgZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBFRElUT1IsIFRFU1QsIEJVSUxEIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWxpbmUtbGVuZ3RoXHJcblxyXG4vLyBjb25maWdzXHJcblxyXG5sZXQgX2xpYnJhcnlCYXNlID0gJyc7XHJcbmxldCBfcmF3QXNzZXRzQmFzZSA9ICcnOyAgICAgLy8gVGhlIGJhc2UgZGlyIGZvciByYXcgYXNzZXRzIGluIHJ1bnRpbWVcclxuY29uc3QgX3V1aWRUb1Jhd0Fzc2V0ID0gY3JlYXRlTWFwKHRydWUpO1xyXG5cclxuZnVuY3Rpb24gaXNTY2VuZSAoYXNzZXQpIHtcclxuICAgIHJldHVybiBhc3NldCAmJiAoYXNzZXQuY29uc3RydWN0b3IgPT09IGxlZ2FjeUNDLlNjZW5lQXNzZXQgfHwgYXNzZXQgaW5zdGFuY2VvZiBsZWdhY3lDQy5TY2VuZSk7XHJcbn1cclxuXHJcbi8vIHR5cGVzXHJcblxyXG5mdW5jdGlvbiBSYXdBc3NldEVudHJ5ICh1cmwsIHR5cGUpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIHRoaXMudXJsID0gdXJsO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgdGhpcy50eXBlID0gdHlwZTtcclxufVxyXG5cclxuLy8gcHVibGljc1xyXG5cclxuLyoqXHJcbiAqIOeuoeeQhumhueebruS4reWKoOi9vS/ljbjovb3otYTmupDnmoTotYTmupDlupPjgIJcclxuICogQGNsYXNzIEFzc2V0TGlicmFyeVxyXG4gKiBAc3RhdGljXHJcbiAqL1xyXG5jb25zdCBBc3NldExpYnJhcnkgPSB7XHJcbiAgICAvKipcclxuICAgICAqIOi/memHjOS/neWtmOaJgOacieW3sue7j+WKoOi9veeahOWcuuaZr+i1hOa6kO+8jOmYsuatouWQjOS4gOS4qui1hOa6kOWcqOWGheWtmOS4reWKoOi9veWHuuWkmuS7veaLt+i0neOAglxyXG4gICAgICpcclxuICAgICAqIOi/memHjOeUqOS4jeS6hldlYWtNYXDvvIzlnKjmtY/op4jlmajkuK3miYDmnInliqDovb3ov4fnmoTotYTmupDpg73lj6rog73miYvlt6XosIPnlKggdW5sb2FkQXNzZXQg6YeK5pS+44CCXHJcbiAgICAgKlxyXG4gICAgICog5Y+C6ICD77yaXHJcbiAgICAgKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9XZWFrTWFwXHJcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vVG9vVGFsbE5hdGUvbm9kZS13ZWFrXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgX3V1aWRUb0Fzc2V0OiB7fSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjYWxsYmFjayBsb2FkQ2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBlcnJvciAtIG51bGwgb3IgdGhlIGVycm9yIGluZm9cclxuICAgICAqIEBwYXJhbSB7QXNzZXR9IGRhdGEgLSB0aGUgbG9hZGVkIGFzc2V0IG9yIG51bGxcclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDliqDovb3otYTmupDjgIJcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1dWlkXHJcbiAgICAgKiBAcGFyYW0ge2xvYWRDYWxsYmFja30gY2FsbGJhY2sgLSDliqDovb3lrozmiJDlkI7miafooYznmoTlm57osIPlh73mlbDjgIJcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IG9wdGlvbnMucmVhZE1haW5DYWNoZSAtIOm7mOiupOS4unRydWXjgILlpoLmnpzkuLpmYWxzZe+8jOWImei1hOa6kOWPiuWFtuaJgOacieS+nei1lui1hOa6kOWwhumHjeaWsOWKoOi9veW5tuS7juW6k+S4reWIm+W7uuaWsOWunuS+i+OAglxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBvcHRpb25zLndyaXRlTWFpbkNhY2hlIC0g6buY6K6k5Li6dHJ1ZeOAguWmguaenOS4unRydWXvvIzliJnnu5PmnpzlsIbnvJPlrZjliLAgQXNzZXRMaWJyYXJ577yM5bm25LiU5b+F6aG755Sx55So5oi35omL5Yqo5Y246L2944CCXHJcbiAgICAgKiBAcGFyYW0ge0Fzc2V0fSBvcHRpb25zLmV4aXN0aW5nQXNzZXQgLSDliqDovb3njrDmnInotYTmupDvvIzmraTlj4LmlbDku4XlnKjnvJbovpHlmajkuK3lj6/nlKjjgIJcclxuICAgICAqL1xyXG4gICAgbG9hZEFzc2V0ICh1dWlkOiBTdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgb3B0aW9ucz8pIHtcclxuICAgICAgICBpZiAodHlwZW9mIHV1aWQgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWxsSW5OZXh0VGljayhjYWxsYmFjaywgbmV3IEVycm9yKCdbQXNzZXRMaWJyYXJ5XSB1dWlkIG11c3QgYmUgc3RyaW5nJyksIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB2YXIgcmVhZE1haW5DYWNoZSA9IHR5cGVvZiAob3B0aW9ucyAmJiBvcHRpb25zLnJlYWRNYWluQ2FjaGUpICE9PSAndW5kZWZpbmVkJyA/IHJlYWRNYWluQ2FjaGUgOiB0cnVlO1xyXG4gICAgICAgIC8vIHZhciB3cml0ZU1haW5DYWNoZSA9IHR5cGVvZiAob3B0aW9ucyAmJiBvcHRpb25zLndyaXRlTWFpbkNhY2hlKSAhPT0gJ3VuZGVmaW5lZCcgPyB3cml0ZU1haW5DYWNoZSA6IHRydWU7XHJcbiAgICAgICAgY29uc3QgaXRlbTogYW55ID0ge1xyXG4gICAgICAgICAgICB1dWlkLFxyXG4gICAgICAgICAgICB0eXBlOiAndXVpZCcsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmV4aXN0aW5nQXNzZXQpIHtcclxuICAgICAgICAgICAgaXRlbS5leGlzdGluZ0Fzc2V0ID0gb3B0aW9ucy5leGlzdGluZ0Fzc2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZWdhY3lDQy5sb2FkZXIubG9hZChpdGVtLCAoZXJyb3IsIGFzc2V0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvciB8fCAhYXNzZXQpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEVycm9yKCdbQXNzZXRMaWJyYXJ5XSBsb2FkaW5nIEpTT04gb3IgZGVwZW5kZW5jaWVzIGZhaWxlZDogJyArIChlcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAnVW5rbm93biBlcnJvcicpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChhc3NldC5jb25zdHJ1Y3RvciA9PT0gbGVnYWN5Q0MuU2NlbmVBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFRElUT1IgJiYgIWFzc2V0LnNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnLmVycm9yKCdTb3JyeSwgdGhlIHNjZW5lIGRhdGEgb2YgXCIlc1wiIGlzIGNvcnJ1cHRlZCEnLCB1dWlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnJvciwgYXNzZXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5botYTmupDnmoQgdXJs44CCXHJcbiAgICAgKi9cclxuICAgIGdldExpYlVybE5vRXh0ICh1dWlkLCBpblJhd0Fzc2V0c0Rpcj86IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoQlVJTEQpIHtcclxuICAgICAgICAgICAgdXVpZCA9IGRlY29kZVV1aWQodXVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHV1aWRzID0gdXVpZC5zcGxpdCgnQCcpLm1hcCgobmFtZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHV1aWQgPSB1dWlkcy5qb2luKCdAJyk7XHJcbiAgICAgICAgY29uc3QgYmFzZSA9IChCVUlMRCAmJiBpblJhd0Fzc2V0c0RpcikgPyAoX3Jhd0Fzc2V0c0Jhc2UgKyAnYXNzZXRzLycpIDogX2xpYnJhcnlCYXNlO1xyXG4gICAgICAgIHJldHVybiBiYXNlICsgdXVpZC5zbGljZSgwLCAyKSArICcvJyArIHV1aWQ7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlnKjnvJbovpHlmajkuK3mn6Xor6LotYTmupDkv6Hmga/jgIJcclxuICAgICAqIEBwYXJhbSB1dWlkIOi1hOa6kOeahCB1dWlk44CCXHJcbiAgICAgKiBAcHJvdGVjdGVkXHJcbiAgICAgKi9cclxuICAgIF9xdWVyeUFzc2V0SW5mb0luRWRpdG9yICh1dWlkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgRWRpdG9yRXh0ZW5kcy5Bc3NldC5xdWVyeUFzc2V0SW5mbyh1dWlkLCAoZXJyb3I6IEVycm9yLCBpbmZvOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxvYWRFcnJvcjogYW55ID0gbmV3IEVycm9yKCdDYW4gbm90IGdldCBhc3NldCB1cmwgYnkgdXVpZCBcIicgKyB1dWlkICsgJ1wiLCB0aGUgYXNzZXQgbWF5IGJlIGRlbGV0ZWQuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZEVycm9yLmVycm9yQ29kZSA9ICdkYi5OT1RGT1VORCc7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhsb2FkRXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGN0b3IgPSBsZWdhY3lDQy5qcy5nZXRDbGFzc0J5TmFtZShpbmZvLnR5cGUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc1Jhd0Fzc2V0ID0gIWlzQ2hpbGRDbGFzc09mKGN0b3IsIEFzc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBgaW1wb3J0Oi8vJHtpbmZvLnV1aWQuc3Vic3RyKDAsIDIpfS8ke2luZm8udXVpZH0uanNvbmA7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdXJsLCBpc1Jhd0Fzc2V0LCBjdG9yKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobmV3IEVycm9yKCdDYW4gbm90IGZpbmQgYXNzZXQgdHlwZSAnICsgaW5mby50eXBlKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG5ldyBFcnJvcignVW5hYmxlIHRvIGxvYWQgcmVzb3VyY2U6IEVkaXRvckV4dGVuZHMgaXMgbm90IGRlZmluZWQuJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWcqOi/kOihjOaXtuiOt+WPlui1hOa6kOS/oeaBr+OAglxyXG4gICAgICovXHJcbiAgICBfZ2V0QXNzZXRJbmZvSW5SdW50aW1lICh1dWlkLCByZXN1bHQ/OiBhbnkpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQgfHwge3VybDogbnVsbCwgcmF3OiBmYWxzZX07XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IF91dWlkVG9SYXdBc3NldFt1dWlkXTtcclxuICAgICAgICBpZiAoaW5mbyAmJiAhaXNDaGlsZENsYXNzT2YoaW5mby50eXBlLCBsZWdhY3lDQy5Bc3NldCkpIHtcclxuICAgICAgICAgICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSBzaW5jZSAxLjEwXHJcbiAgICAgICAgICAgIHJlc3VsdC51cmwgPSBfcmF3QXNzZXRzQmFzZSArIGluZm8udXJsO1xyXG4gICAgICAgICAgICByZXN1bHQucmF3ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC51cmwgPSB0aGlzLmdldExpYlVybE5vRXh0KHV1aWQpICsgJy5qc29uJztcclxuICAgICAgICAgICAgcmVzdWx0LnJhdyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5ZyoIHNldHRpbmcg5Lit55qEIHV1aWTjgIJcclxuICAgICAqL1xyXG4gICAgX3V1aWRJblNldHRpbmdzICh1dWlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHV1aWQgaW4gX3V1aWRUb1Jhd0Fzc2V0O1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W6LWE5rqQ5L+h5oGv44CCXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdXVpZCDotYTmupDnmoQgdXVpZOOAglxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGNhbGxiYWNrLmVycm9yXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gY2FsbGJhY2sudXJsIC0gdGhlIHVybCBvZiByYXcgYXNzZXQgb3IgaW1wb3J0ZWQgYXNzZXRcclxuICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FsbGJhY2sucmF3IC0gaW5kaWNhdGVzIHdoZXRoZXIgdGhlIGFzc2V0IGlzIHJhdyBhc3NldFxyXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2suY3RvckluRWRpdG9yIC0gdGhlIGFjdHVhbCB0eXBlIG9mIGFzc2V0LCB1c2VkIGluIGVkaXRvciBvbmx5XHJcbiAgICAgKi9cclxuICAgIHF1ZXJ5QXNzZXRJbmZvICh1dWlkLCBjYWxsYmFjaykge1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgIVRFU1QpIHtcclxuICAgICAgICAgICAgdGhpcy5fcXVlcnlBc3NldEluZm9JbkVkaXRvcih1dWlkLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fZ2V0QXNzZXRJbmZvSW5SdW50aW1lKHV1aWQpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBpbmZvLnVybCwgaW5mby5yYXcpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIHBhcnNlIHV1aWQgb3V0IG9mIHVybFxyXG4gICAgICogQHpoXHJcbiAgICAgKiDku44gdXJsIOino+aekCB1dWlk44CCXHJcbiAgICAgKiBAcGFyYW0gdXJsIOi1hOa6kOWcsOWdgOOAglxyXG4gICAgICovXHJcbiAgICBwYXJzZVV1aWRJbkVkaXRvciAodXJsKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBsZXQgdXVpZCA9ICcnO1xyXG4gICAgICAgICAgICBjb25zdCBpc0ltcG9ydGVkID0gdXJsLnN0YXJ0c1dpdGgoX2xpYnJhcnlCYXNlKTtcclxuICAgICAgICAgICAgaWYgKGlzSW1wb3J0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpciA9IGxlZ2FjeUNDLnBhdGguZGlybmFtZSh1cmwpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlyQmFzZW5hbWUgPSBsZWdhY3lDQy5wYXRoLmJhc2VuYW1lKGRpcik7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNBc3NldFVybCA9IGRpckJhc2VuYW1lLmxlbmd0aCA9PT0gMjtcclxuICAgICAgICAgICAgICAgIGlmIChpc0Fzc2V0VXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXVpZCA9IGxlZ2FjeUNDLnBhdGguYmFzZW5hbWUodXJsKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHV1aWQuaW5kZXhPZignLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZCA9IHV1aWQuc2xpY2UoMCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJhdyBmaWxlIHVybFxyXG4gICAgICAgICAgICAgICAgICAgIHV1aWQgPSBkaXJCYXNlbmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBJZiB1cmwgaXMgbm90IGluIHRoZSBsaWJyYXJ5LCBqdXN0IHJldHVybiBcIlwiXHJcbiAgICAgICAgICAgIHJldHVybiB1dWlkO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWKoOi9vSBqc29u44CCXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30ganNvblxyXG4gICAgICogQHBhcmFtIHtsb2FkQ2FsbGJhY2t9IGNhbGxiYWNrXHJcbiAgICAgKiBAcmV0dXJuIHtMb2FkaW5nSGFuZGxlfVxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgbG9hZEpzb24gKGpzb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgcmFuZG9tVXVpZCA9ICcnICsgKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgKyBNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICBjb25zdCBpdGVtID0ge1xyXG4gICAgICAgICAgICB1dWlkOiByYW5kb21VdWlkLFxyXG4gICAgICAgICAgICB0eXBlOiAndXVpZCcsXHJcbiAgICAgICAgICAgIGNvbnRlbnQ6IGpzb24sXHJcbiAgICAgICAgICAgIHNraXBzOiBbIGxlZ2FjeUNDLmxvYWRlci5hc3NldExvYWRlci5pZCwgbGVnYWN5Q0MubG9hZGVyLmRvd25sb2FkZXIuaWQgXSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxlZ2FjeUNDLmxvYWRlci5sb2FkKGl0ZW0sIChlcnJvciwgYXNzZXQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBFcnJvcignW0Fzc2V0TGlicmFyeV0gbG9hZGluZyBKU09OIG9yIGRlcGVuZGVuY2llcyBmYWlsZWQ6ICcgKyBlcnJvci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChFRElUT1IgfHwgaXNTY2VuZShhc3NldCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IGxlZ2FjeUNDLmxvYWRlci5fZ2V0UmVmZXJlbmNlS2V5KHJhbmRvbVV1aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmxvYWRlci5yZW1vdmVJdGVtKGlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhc3NldC5fdXVpZCA9ICcnO1xyXG4gICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBhc3NldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCB0aGUgZXhpc3RzIGFzc2V0IGJ5IHV1aWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOagueaNriB1dWlkIOiOt+WPluWtmOWcqOeahOi1hOa6kOOAglxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHV1aWRcclxuICAgICAqIEByZXR1cm4ge0Fzc2V0fSAtIOi/lOWbnuWtmOWcqOeahOi1hOa6kO+8jOiLpeayoeacieWKoOi9veWImei/lOWbniBudWxsXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBnZXRBc3NldEJ5VXVpZCAodXVpZCkge1xyXG4gICAgICAgIHJldHVybiBBc3NldExpYnJhcnkuX3V1aWRUb0Fzc2V0W3V1aWRdIHx8IG51bGw7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlOiBuby1zaGFkb3dlZC12YXJpYWJsZVxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGluaXQgdGhlIGFzc2V0IGxpYnJhcnlcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yid5aeL5YyWIEFzc2V0TGlicmFyeeOAglxyXG4gICAgICogQG1ldGhvZCBpbml0XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMubGlicmFyeVBhdGggLSDog73mjqXmlLbnmoTku7vmhI/nsbvlnovnmoTot6/lvoTvvIzpgJrluLjlnKjnvJbovpHlmajph4zkvb/nlKjnu53lr7nnmoTvvIzlnKjnvZHpobXph4zkvb/nlKjnm7jlr7nnmoTjgIJcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zLm1vdW50UGF0aHMgLSBtb3VudCBwb2ludCBvZiBhY3R1YWwgdXJscyBmb3IgcmF3IGFzc2V0cyAob25seSB1c2VkIGluIGVkaXRvcilcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5yYXdBc3NldHNdIC0gdXVpZCB0byByYXcgYXNzZXQncyB1cmxzIChvbmx5IHVzZWQgaW4gcnVudGltZSlcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5yYXdBc3NldHNCYXNlXSAtIGJhc2Ugb2YgcmF3IGFzc2V0J3MgdXJscyAob25seSB1c2VkIGluIHJ1bnRpbWUpXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucGFja2VkQXNzZXRzXSAtIHBhY2tlZCBhc3NldHMgKG9ubHkgdXNlZCBpbiBydW50aW1lKVxyXG4gICAgICovXHJcbiAgICBpbml0IChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUiAmJiBfbGlicmFyeUJhc2UpIHtcclxuICAgICAgICAgICAgZGVidWcuZXJyb3JJRCg2NDAyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6L+Z6YeM5bCG6Lev5b6E6L2sIHVybO+8jOS4jeS9v+eUqOi3r+W+hOeahOWOn+WboOaYr+acieeahCBydW50aW1lIOS4jeiDveino+aekCBcIlxcXCIg56ym5Y+344CCXHJcbiAgICAgICAgLy8g5LiN5L2/55SoIHVybC5mb3JtYXQg55qE5Y6f5Zug5pivIHdpbmRvd3Mg5LiN5pSv5oyBIGZpbGU6Ly8g5ZKMIC8vLyDlvIDlpLTnmoTljY/orq7vvIzmiYDku6Xlj6rog73nlKggcmVwbGFjZSDmk43kvZznm7TmjqXmiorot6/lvoTovazmiJAgVVJM44CCXHJcbiAgICAgICAgbGV0IGxpYnJhcnlQYXRoID0gb3B0aW9ucy5saWJyYXJ5UGF0aDtcclxuICAgICAgICBsaWJyYXJ5UGF0aCA9IGxpYnJhcnlQYXRoLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcclxuICAgICAgICBfbGlicmFyeUJhc2UgPSBsZWdhY3lDQy5wYXRoLnN0cmlwU2VwKGxpYnJhcnlQYXRoKSArICcvJztcclxuXHJcbiAgICAgICAgX3Jhd0Fzc2V0c0Jhc2UgPSBvcHRpb25zLnJhd0Fzc2V0c0Jhc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IG1kNUFzc2V0c01hcCA9IG9wdGlvbnMubWQ1QXNzZXRzTWFwO1xyXG4gICAgICAgIGlmIChtZDVBc3NldHNNYXAgJiYgbWQ1QXNzZXRzTWFwLmltcG9ydCkge1xyXG4gICAgICAgICAgICAvLyBkZWNvZGUgdXVpZFxyXG4gICAgICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgICAgIGxldCB1dWlkID0gJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IG1kNUltcG9ydE1hcCA9IGNyZWF0ZU1hcCh0cnVlKTtcclxuICAgICAgICAgICAgbGV0IG1kNUVudHJpZXMgPSBtZDVBc3NldHNNYXAuaW1wb3J0O1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWQ1RW50cmllcy5sZW5ndGg7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgdXVpZCA9IGRlY29kZVV1aWQobWQ1RW50cmllc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1dWlkcyA9IHV1aWQuc3BsaXQoJ0AnKS5tYXAoKG5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB1dWlkID0gdXVpZHMuam9pbignQCcpO1xyXG4gICAgICAgICAgICAgICAgbWQ1SW1wb3J0TWFwW3V1aWRdID0gbWQ1RW50cmllc1tpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1kNVJhd0Fzc2V0c01hcCA9IGNyZWF0ZU1hcCh0cnVlKTtcclxuICAgICAgICAgICAgbWQ1RW50cmllcyA9IG1kNUFzc2V0c01hcFsncmF3LWFzc2V0cyddO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbWQ1RW50cmllcy5sZW5ndGg7IGkgKz0gMikge1xyXG4gICAgICAgICAgICAgICAgdXVpZCA9IGRlY29kZVV1aWQobWQ1RW50cmllc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1dWlkcyA9IHV1aWQuc3BsaXQoJ0AnKS5tYXAoKG5hbWUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB1dWlkID0gdXVpZHMuam9pbignQCcpO1xyXG4gICAgICAgICAgICAgICAgbWQ1UmF3QXNzZXRzTWFwW3V1aWRdID0gbWQ1RW50cmllc1tpICsgMV07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1kNVBpcGUgPSBuZXcgTUQ1UGlwZShtZDVJbXBvcnRNYXAsIG1kNVJhd0Fzc2V0c01hcCwgX2xpYnJhcnlCYXNlKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MubG9hZGVyLmluc2VydFBpcGVBZnRlcihsZWdhY3lDQy5sb2FkZXIuYXNzZXRMb2FkZXIsIG1kNVBpcGUpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5sb2FkZXIubWQ1UGlwZSA9IG1kNVBpcGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdWJQYWNrYWdlcyA9IG9wdGlvbnMuc3ViUGFja2FnZXM7XHJcbiAgICAgICAgaWYgKHN1YlBhY2thZ2VzKSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmxvYWRlci5kb3dubG9hZGVyLnNldFN1YlBhY2thZ2VzKHN1YlBhY2thZ2VzKTtcclxuICAgICAgICAgICAgY29uc3Qgc3ViUGFja1BpcGUgPSBuZXcgU3ViUGFja1BpcGUoc3ViUGFja2FnZXMpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5sb2FkZXIuaW5zZXJ0UGlwZUFmdGVyKGxlZ2FjeUNDLmxvYWRlci5hc3NldExvYWRlciwgc3ViUGFja1BpcGUpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5sb2FkZXIuc3ViUGFja1BpcGUgPSBzdWJQYWNrUGlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluaXQgcmF3IGFzc2V0c1xyXG5cclxuICAgICAgICBjb25zdCBhc3NldFRhYmxlcyA9IGxlZ2FjeUNDLmxvYWRlci5fYXNzZXRUYWJsZXM7XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6IGZvcmluXHJcbiAgICAgICAgZm9yIChjb25zdCBtb3VudCBpbiBhc3NldFRhYmxlcykge1xyXG4gICAgICAgICAgICBhc3NldFRhYmxlc1ttb3VudF0ucmVzZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJhd0Fzc2V0cyA9IG9wdGlvbnMucmF3QXNzZXRzO1xyXG4gICAgICAgIGlmIChyYXdBc3NldHMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBtb3VudFBvaW50IGluIHJhd0Fzc2V0cykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYXNzZXRzID0gcmF3QXNzZXRzW21vdW50UG9pbnRdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCB1dWlkIGluIGFzc2V0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZm8gPSBhc3NldHNbdXVpZF07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gaW5mb1swXTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlSWQgPSBpbmZvWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBfZ2V0Q2xhc3NCeUlkKHR5cGVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYnVnLmVycm9yKCdDYW5ub3QgZ2V0JywgdHlwZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgc2luY2UgMS4xMFxyXG4gICAgICAgICAgICAgICAgICAgIF91dWlkVG9SYXdBc3NldFt1dWlkXSA9IG5ldyBSYXdBc3NldEVudHJ5KG1vdW50UG9pbnQgKyAnLycgKyB1cmwsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGluaXQgcmVzb3VyY2VzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNTdWJBc3NldCA9IGluZm9bMl0gPT09IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghYXNzZXRUYWJsZXNbbW91bnRQb2ludF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXNzZXRUYWJsZXNbbW91bnRQb2ludF0gPSBuZXcgQXNzZXRUYWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXRUYWJsZXNbbW91bnRQb2ludF0uYWRkKHVybCwgdXVpZCwgdHlwZSwgIWlzU3ViQXNzZXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5wYWNrZWRBc3NldHMpIHtcclxuICAgICAgICAgICAgaW5pdFBhY2tzKG9wdGlvbnMucGFja2VkQXNzZXRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGluaXQgY2MudXJsXHJcbiAgICAgICAgbGVnYWN5Q0MudXJsLl9pbml0KChvcHRpb25zLm1vdW50UGF0aHMgJiYgb3B0aW9ucy5tb3VudFBhdGhzLmFzc2V0cykgfHwgX3Jhd0Fzc2V0c0Jhc2UgKyAnYXNzZXRzJyk7XHJcbiAgICB9LFxyXG59O1xyXG5cclxuLy8g5pqC5pe25bGP6JS977yM5Zug5Li655uu5YmN5rKh5pyJ57yT5a2Y5Lu75L2VYXNzZXRcclxuLy8gaWYgKERFViAmJiBBc3NldC5wcm90b3R5cGUuX29uUHJlRGVzdHJveSkge1xyXG4vLyAgICBjYy5lcnJvcignX29uUHJlRGVzdHJveSBvZiBBc3NldCBoYXMgYWxyZWFkeSBkZWZpbmVkJyk7XHJcbi8vIH1cclxuLy8gQXNzZXQucHJvdG90eXBlLl9vblByZURlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbi8vICAgIGlmIChBc3NldExpYnJhcnkuX3V1aWRUb0Fzc2V0W3RoaXMuX3V1aWRdID09PSB0aGlzKSB7XHJcbi8vICAgICAgICBBc3NldExpYnJhcnkudW5sb2FkQXNzZXQodGhpcyk7XHJcbi8vICAgIH1cclxuLy8gfTtcclxuXHJcbmxlZ2FjeUNDLkFzc2V0TGlicmFyeSA9IEFzc2V0TGlicmFyeTtcclxuZXhwb3J0IGRlZmF1bHQgQXNzZXRMaWJyYXJ5O1xyXG4iXX0=