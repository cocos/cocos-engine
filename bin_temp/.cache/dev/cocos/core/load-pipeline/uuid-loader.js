(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../utils/js.js", "../platform/debug.js", "./loading-items.js", "./auto-release-utils.js", "./utils.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../utils/js.js"), require("../platform/debug.js"), require("./loading-items.js"), require("./auto-release-utils.js"), require("./utils.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.debug, global.loadingItems, global.autoReleaseUtils, global.utils, global.defaultConstants, global.globalExports);
    global.uuidLoader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, js, _debug, _loadingItems, _autoReleaseUtils, _utils, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isSceneObj = isSceneObj;
  _exports.loadUuid = loadUuid;
  js = _interopRequireWildcard(js);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function isSceneObj(json) {
    var SCENE_ID = 'cc.Scene';
    var PREFAB_ID = 'cc.Prefab';
    return json && (json[0] && json[0].__type__ === SCENE_ID || json[1] && json[1].__type__ === SCENE_ID || json[0] && json[0].__type__ === PREFAB_ID);
  }

  function parseDepends(item, asset, tdInfo, deferredLoadRawAssetsInRuntime) {
    var uuidList = tdInfo.uuidList;
    var objList = tdInfo.uuidObjList;
    var propList = tdInfo.uuidPropList; // @ts-ignore

    var stillUseUrl = tdInfo._stillUseUrl;
    var depends;
    var i, dependUuid; // cache dependencies for auto release

    var dependKeys = item.dependKeys = [];

    if (deferredLoadRawAssetsInRuntime) {
      depends = []; // parse depends assets

      for (i = 0; i < uuidList.length; i++) {
        dependUuid = uuidList[i];
        var obj = objList[i];
        var prop = propList[i];

        var info = _globalExports.legacyCC.AssetLibrary._getAssetInfoInRuntime(dependUuid);

        if (info.raw) {
          // skip preloading raw assets
          var url = info.url;
          obj[prop] = url;
          dependKeys.push(url);
        } else {
          // declare depends assets
          depends.push({
            type: 'uuid',
            uuid: dependUuid,
            deferredLoadRaw: true,
            _owner: obj,
            _ownerProp: prop,
            _stillUseUrl: stillUseUrl[i]
          });
        }
      }
    } else {
      depends = new Array(uuidList.length); // declare depends assets

      for (i = 0; i < uuidList.length; i++) {
        dependUuid = uuidList[i];
        depends[i] = {
          type: 'uuid',
          uuid: dependUuid,
          _owner: objList[i],
          _ownerProp: propList[i],
          _stillUseUrl: stillUseUrl[i]
        };
      } // load native object (Image/Audio) as depends


      if (asset._native && !asset.constructor.preventPreloadNativeObject) {
        depends.push({
          url: asset.nativeUrl,
          _owner: asset,
          _ownerProp: '_nativeAsset'
        });
      }
    }

    return depends;
  }

  function loadDepends(pipeline, item, asset, depends, callback) {
    // Predefine content for dependencies usage
    item.content = asset;
    var dependKeys = item.dependKeys;
    pipeline.flowInDeps(item, depends, function (errors, items) {
      var item, missingAssetReporter;
      var itemsMap = items.map;

      for (var src in itemsMap) {
        item = itemsMap[src];

        if (item.uuid && item.content) {
          item.content._uuid = item.uuid;
        }
      }

      for (var i = 0; i < depends.length; i++) {
        // @ts-ignore
        var loadCallback = function loadCallback(item) {
          var value = item.content; // @ts-ignore

          if (this._stillUseUrl) {
            value = value ? value.nativeUrl : item.rawUrl;
          } // @ts-ignore


          this._owner[this._ownerProp] = value;

          if (item.uuid !== asset._uuid && dependKeys.indexOf(item.id) < 0) {
            dependKeys.push(item.id);
          }
        };

        var dep = depends[i];
        var dependSrc = dep.uuid;
        var dependUrl = dep.url;
        var dependObj = dep._owner;
        var dependProp = dep._ownerProp;
        item = itemsMap[dependUrl];

        if (!item) {
          continue;
        }

        var loadCallbackCtx = dep;

        if (item.complete || item.content) {
          if (item.error) {
            if (_defaultConstants.EDITOR && item.error.errorCode === 'db.NOTFOUND') {
              if (!missingAssetReporter) {
                missingAssetReporter = new EditorExtends.MissingReporter.object(asset);
              }

              missingAssetReporter.stashByOwner(dependObj, dependProp, EditorExtends.serialize.asAsset(dependSrc));
            } else {
              _globalExports.legacyCC._throw(item.error);
            }
          } else {
            loadCallback.call(loadCallbackCtx, item);
          }
        } else {
          // item was removed from cache, but ready in pipeline actually
          var queue = _loadingItems.LoadingItems.getQueue(item);

          if (queue) {
            queue.addListener(dependSrc, loadCallback, loadCallbackCtx);
          }
        }
      }

      if (asset instanceof _globalExports.legacyCC.SceneAsset && asset.scene) {
        (function () {
          var map = Object.create(null);

          for (var _i = 0, l = dependKeys.length; _i < l; _i++) {
            map[dependKeys[_i]] = true;
            (0, _autoReleaseUtils.getDependsRecursively)(dependKeys[_i]).forEach(function (x) {
              map[x] = true;
            });
          }

          asset.scene.dependAssets = Object.keys(map);
        })();
      } // Emit dependency errors in runtime, but not in editor,
      // because editor need to open the scene / prefab to let user fix missing asset issues


      if (_defaultConstants.EDITOR && missingAssetReporter) {
        missingAssetReporter.reportByOwner();
        callback(null, asset);
      } else {
        callback(errors, asset);
      }
    });
  } // can deferred load raw assets in runtime


  function canDeferredLoad(asset, item, isScene) {
    if (_defaultConstants.EDITOR) {
      return false;
    }

    var res = item.deferredLoadRaw;

    if (res) {
      // check if asset support deferred
      if (asset instanceof _globalExports.legacyCC.Asset && asset.constructor.preventDeferredLoadDependents) {
        res = false;
      }
    } else if (isScene) {
      if (asset instanceof _globalExports.legacyCC.SceneAsset || asset instanceof _globalExports.legacyCC.Prefab) {
        res = asset.asyncLoadAssets; //if (res) {
        //    cc.log('deferred load raw assets for ' + item.id);
        //}
      }
    }

    return res;
  }

  var MissingClass;

  function loadUuid(item, callback) {
    if (_defaultConstants.EDITOR) {
      MissingClass = MissingClass || EditorExtends.MissingReporter.classInstance;
    }

    var json;

    if (typeof item.content === 'string') {
      try {
        json = JSON.parse(item.content);

        if (!_defaultConstants.DEBUG && json.keys && json.data) {
          var keys = json.keys;
          json = json.data;
          (0, _utils.decompressJson)(json, keys);
        }
      } catch (e) {
        return new Error((0, _debug.getError)(4923, item.id, e.stack));
      }
    } else if (_typeof(item.content) === 'object') {
      json = item.content;
    } else {
      return new Error((0, _debug.getError)(4924));
    }

    if (json === undefined || json === null) {
      return new Error((0, _debug.getError)(4923, item.id));
    }

    var classFinder;
    var isScene = isSceneObj(json);

    if (isScene) {
      if (_defaultConstants.EDITOR) {
        MissingClass.hasMissingClass = false;

        classFinder = function classFinder(type, data, owner, propName) {
          var res = MissingClass.classFinder(type, data, owner, propName);

          if (res) {
            return res;
          }

          return _globalExports.legacyCC._MissingScript.getMissingWrapper(type, data);
        };

        classFinder.onDereferenced = MissingClass.classFinder.onDereferenced;
      } else {
        classFinder = _globalExports.legacyCC._MissingScript.safeFindClass;
      }
    } else {
      classFinder = function classFinder(id) {
        var cls = js._getClassById(id);

        if (cls) {
          return cls;
        }

        (0, _debug.warnID)(4903, id);
        return Object;
      };
    }

    var tdInfo = _globalExports.legacyCC.deserialize.Details.pool.get();

    var asset;

    try {
      asset = _globalExports.legacyCC.deserialize(json, tdInfo, {
        classFinder: classFinder,
        target: item.existingAsset,
        customEnv: item
      });
    } catch (e) {
      _globalExports.legacyCC.deserialize.Details.pool.put(tdInfo);

      console.error(e);
      return new Error("Failed to load asset ".concat(item.id, ", exception occurs during deserialization: ").concat(_defaultConstants.JSB ? e + '\n' + e.stack : e.stack, ".")); // return new Error(debug.getError(4925, item.id, err));
    }

    asset._uuid = item.uuid;

    if (_defaultConstants.EDITOR && isScene && MissingClass.hasMissingClass) {
      MissingClass.reportMissingClass(asset);
    }

    var deferredLoad = canDeferredLoad(asset, item, isScene);
    var depends = parseDepends(item, asset, tdInfo, deferredLoad);

    _globalExports.legacyCC.deserialize.Details.pool.put(tdInfo);

    var wrappedCallback = function wrappedCallback(err, asset) {
      if (!err && asset.onLoaded) {
        try {
          asset.onLoaded();
        } catch (error) {
          err = error;
        }
      }

      if (_defaultConstants.EDITOR && !isScene) {
        // @ts-ignore
        var propSetter = function propSetter(asset, obj, propName, oldAsset, newAsset) {
          if (oldAsset === newAsset || obj[propName] === newAsset) {
            return;
          }

          if (asset instanceof _globalExports.legacyCC.Material && newAsset instanceof _globalExports.legacyCC.Texture2D) {
            for (var i = 0, l = asset.passes.length; i < l; i++) {
              if (asset.getProperty(propName, i) === oldAsset) {
                asset.setProperty(propName, newAsset, i);
              }
            }
          } else {
            obj[propName] = newAsset;
            asset.onLoaded && asset.onLoaded();
          }

          dependListener.emit(asset._uuid, asset);
          assetListener.emit(asset._uuid, asset);
        };

        var dependListener = _globalExports.legacyCC.AssetLibrary.dependListener;
        var assetListener = _globalExports.legacyCC.AssetLibrary.assetListener;
        ;

        if (dependListener) {
          item.references = {};

          for (var i = 0, l = depends.length; i < l; i++) {
            var dep = depends[i];
            var dependSrc = dep.uuid;

            if (dependSrc) {
              var dependObj = dep._owner;
              var dependProp = dep._ownerProp;
              var onDirty = propSetter.bind(null, asset, dependObj, dependProp);
              dependListener.on(dependSrc, onDirty);
              item.references[dependSrc] = onDirty;
            }
          }
        }
      }

      callback(err, asset);
    };

    if (depends.length === 0) {
      return wrappedCallback(null, asset);
    } // @ts-ignore


    loadDepends(this.pipeline, item, asset, depends, wrappedCallback);
  }

  loadUuid.isSceneObj = isSceneObj;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS91dWlkLWxvYWRlci50cyJdLCJuYW1lcyI6WyJpc1NjZW5lT2JqIiwianNvbiIsIlNDRU5FX0lEIiwiUFJFRkFCX0lEIiwiX190eXBlX18iLCJwYXJzZURlcGVuZHMiLCJpdGVtIiwiYXNzZXQiLCJ0ZEluZm8iLCJkZWZlcnJlZExvYWRSYXdBc3NldHNJblJ1bnRpbWUiLCJ1dWlkTGlzdCIsIm9iakxpc3QiLCJ1dWlkT2JqTGlzdCIsInByb3BMaXN0IiwidXVpZFByb3BMaXN0Iiwic3RpbGxVc2VVcmwiLCJfc3RpbGxVc2VVcmwiLCJkZXBlbmRzIiwiaSIsImRlcGVuZFV1aWQiLCJkZXBlbmRLZXlzIiwibGVuZ3RoIiwib2JqIiwicHJvcCIsImluZm8iLCJsZWdhY3lDQyIsIkFzc2V0TGlicmFyeSIsIl9nZXRBc3NldEluZm9JblJ1bnRpbWUiLCJyYXciLCJ1cmwiLCJwdXNoIiwidHlwZSIsInV1aWQiLCJkZWZlcnJlZExvYWRSYXciLCJfb3duZXIiLCJfb3duZXJQcm9wIiwiQXJyYXkiLCJfbmF0aXZlIiwiY29uc3RydWN0b3IiLCJwcmV2ZW50UHJlbG9hZE5hdGl2ZU9iamVjdCIsIm5hdGl2ZVVybCIsImxvYWREZXBlbmRzIiwicGlwZWxpbmUiLCJjYWxsYmFjayIsImNvbnRlbnQiLCJmbG93SW5EZXBzIiwiZXJyb3JzIiwiaXRlbXMiLCJtaXNzaW5nQXNzZXRSZXBvcnRlciIsIml0ZW1zTWFwIiwibWFwIiwic3JjIiwiX3V1aWQiLCJsb2FkQ2FsbGJhY2siLCJ2YWx1ZSIsInJhd1VybCIsImluZGV4T2YiLCJpZCIsImRlcCIsImRlcGVuZFNyYyIsImRlcGVuZFVybCIsImRlcGVuZE9iaiIsImRlcGVuZFByb3AiLCJsb2FkQ2FsbGJhY2tDdHgiLCJjb21wbGV0ZSIsImVycm9yIiwiRURJVE9SIiwiZXJyb3JDb2RlIiwiRWRpdG9yRXh0ZW5kcyIsIk1pc3NpbmdSZXBvcnRlciIsIm9iamVjdCIsInN0YXNoQnlPd25lciIsInNlcmlhbGl6ZSIsImFzQXNzZXQiLCJfdGhyb3ciLCJjYWxsIiwicXVldWUiLCJMb2FkaW5nSXRlbXMiLCJnZXRRdWV1ZSIsImFkZExpc3RlbmVyIiwiU2NlbmVBc3NldCIsInNjZW5lIiwiT2JqZWN0IiwiY3JlYXRlIiwibCIsImZvckVhY2giLCJ4IiwiZGVwZW5kQXNzZXRzIiwia2V5cyIsInJlcG9ydEJ5T3duZXIiLCJjYW5EZWZlcnJlZExvYWQiLCJpc1NjZW5lIiwicmVzIiwiQXNzZXQiLCJwcmV2ZW50RGVmZXJyZWRMb2FkRGVwZW5kZW50cyIsIlByZWZhYiIsImFzeW5jTG9hZEFzc2V0cyIsIk1pc3NpbmdDbGFzcyIsImxvYWRVdWlkIiwiY2xhc3NJbnN0YW5jZSIsIkpTT04iLCJwYXJzZSIsIkRFQlVHIiwiZGF0YSIsImUiLCJFcnJvciIsInN0YWNrIiwidW5kZWZpbmVkIiwiY2xhc3NGaW5kZXIiLCJoYXNNaXNzaW5nQ2xhc3MiLCJvd25lciIsInByb3BOYW1lIiwiX01pc3NpbmdTY3JpcHQiLCJnZXRNaXNzaW5nV3JhcHBlciIsIm9uRGVyZWZlcmVuY2VkIiwic2FmZUZpbmRDbGFzcyIsImNscyIsImpzIiwiX2dldENsYXNzQnlJZCIsImRlc2VyaWFsaXplIiwiRGV0YWlscyIsInBvb2wiLCJnZXQiLCJ0YXJnZXQiLCJleGlzdGluZ0Fzc2V0IiwiY3VzdG9tRW52IiwicHV0IiwiY29uc29sZSIsIkpTQiIsInJlcG9ydE1pc3NpbmdDbGFzcyIsImRlZmVycmVkTG9hZCIsIndyYXBwZWRDYWxsYmFjayIsImVyciIsIm9uTG9hZGVkIiwicHJvcFNldHRlciIsIm9sZEFzc2V0IiwibmV3QXNzZXQiLCJNYXRlcmlhbCIsIlRleHR1cmUyRCIsInBhc3NlcyIsImdldFByb3BlcnR5Iiwic2V0UHJvcGVydHkiLCJkZXBlbmRMaXN0ZW5lciIsImVtaXQiLCJhc3NldExpc3RlbmVyIiwicmVmZXJlbmNlcyIsIm9uRGlydHkiLCJiaW5kIiwi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QUFqQjtBQUNBLGdCQUFJeUMsU0FBUyxHQUFHRCxHQUFHLENBQUMxQixJQUFwQjs7QUFDQSxnQkFBSTJCLFNBQUosRUFBZTtBQUNYLGtCQUFJRSxTQUFTLEdBQUdILEdBQUcsQ0FBQ3hCLE1BQXBCO0FBQ0Esa0JBQUk0QixVQUFVLEdBQUdKLEdBQUcsQ0FBQ3ZCLFVBQXJCO0FBQ0Esa0JBQUkrRyxPQUFPLEdBQUdaLFVBQVUsQ0FBQ2EsSUFBWCxDQUFnQixJQUFoQixFQUFzQjVJLEtBQXRCLEVBQTZCc0QsU0FBN0IsRUFBd0NDLFVBQXhDLENBQWQ7QUFDQWdGLGNBQUFBLGNBQWMsQ0FBQ00sRUFBZixDQUFrQnpGLFNBQWxCLEVBQTZCdUYsT0FBN0I7QUFDQTVJLGNBQUFBLElBQUksQ0FBQzJJLFVBQUwsQ0FBZ0J0RixTQUFoQixJQUE2QnVGLE9BQTdCO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBQ0R2RyxNQUFBQSxRQUFRLENBQUN5RixHQUFELEVBQU03SCxLQUFOLENBQVI7QUFDSCxLQWhERDs7QUFrREEsUUFBSVUsT0FBTyxDQUFDSSxNQUFSLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3RCLGFBQU84RyxlQUFlLENBQUMsSUFBRCxFQUFPNUgsS0FBUCxDQUF0QjtBQUNILEtBM0lxQyxDQTZJdEM7OztBQUNBa0MsSUFBQUEsV0FBVyxDQUFDLEtBQUtDLFFBQU4sRUFBZ0JwQyxJQUFoQixFQUFzQkMsS0FBdEIsRUFBNkJVLE9BQTdCLEVBQXNDa0gsZUFBdEMsQ0FBWDtBQUNIOztBQUVEakMsRUFBQUEsUUFBUSxDQUFDbEcsVUFBVCxHQUFzQkEsVUFBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBqcyBmcm9tICcuLi91dGlscy9qcyc7XHJcbmltcG9ydCB7X2dldENsYXNzQnlJZH0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBnZXRFcnJvciwgd2FybklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBMb2FkaW5nSXRlbXMgfSBmcm9tICcuL2xvYWRpbmctaXRlbXMnO1xyXG5pbXBvcnQgeyBnZXREZXBlbmRzUmVjdXJzaXZlbHkgfSBmcm9tICcuL2F1dG8tcmVsZWFzZS11dGlscyc7XHJcbmltcG9ydCB7IGRlY29tcHJlc3NKc29uIH0gZnJvbSAnLi91dGlscyc7XHJcbmltcG9ydCB7IEVESVRPUiwgREVCVUcsIEpTQiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBEZXRhaWxzIH0gZnJvbSAnLi4vZGF0YS9kZXNlcmlhbGl6ZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNTY2VuZU9iaiAoanNvbikge1xyXG4gICAgbGV0IFNDRU5FX0lEID0gJ2NjLlNjZW5lJztcclxuICAgIGxldCBQUkVGQUJfSUQgPSAnY2MuUHJlZmFiJztcclxuICAgIHJldHVybiBqc29uICYmIChcclxuICAgICAgICAgICAgICAgKGpzb25bMF0gJiYganNvblswXS5fX3R5cGVfXyA9PT0gU0NFTkVfSUQpIHx8XHJcbiAgICAgICAgICAgICAgIChqc29uWzFdICYmIGpzb25bMV0uX190eXBlX18gPT09IFNDRU5FX0lEKSB8fFxyXG4gICAgICAgICAgICAgICAoanNvblswXSAmJiBqc29uWzBdLl9fdHlwZV9fID09PSBQUkVGQUJfSUQpXHJcbiAgICAgICAgICAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcGFyc2VEZXBlbmRzIChpdGVtLCBhc3NldCwgdGRJbmZvOiBEZXRhaWxzLCBkZWZlcnJlZExvYWRSYXdBc3NldHNJblJ1bnRpbWUpIHtcclxuICAgIGxldCB1dWlkTGlzdCA9IHRkSW5mby51dWlkTGlzdDtcclxuICAgIGxldCBvYmpMaXN0ID0gdGRJbmZvLnV1aWRPYmpMaXN0O1xyXG4gICAgbGV0IHByb3BMaXN0ID0gdGRJbmZvLnV1aWRQcm9wTGlzdDtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGxldCBzdGlsbFVzZVVybCA9IHRkSW5mby5fc3RpbGxVc2VVcmw7XHJcbiAgICBsZXQgZGVwZW5kcztcclxuICAgIGxldCBpLCBkZXBlbmRVdWlkO1xyXG4gICAgLy8gY2FjaGUgZGVwZW5kZW5jaWVzIGZvciBhdXRvIHJlbGVhc2VcclxuICAgIGxldCBkZXBlbmRLZXlzOiBBcnJheTxzdHJpbmc+ID0gaXRlbS5kZXBlbmRLZXlzID0gW107XHJcblxyXG4gICAgaWYgKGRlZmVycmVkTG9hZFJhd0Fzc2V0c0luUnVudGltZSkge1xyXG4gICAgICAgIGRlcGVuZHMgPSBbXTtcclxuICAgICAgICAvLyBwYXJzZSBkZXBlbmRzIGFzc2V0c1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB1dWlkTGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBkZXBlbmRVdWlkID0gdXVpZExpc3RbaV07XHJcbiAgICAgICAgICAgIGxldCBvYmogPSBvYmpMaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgcHJvcCA9IHByb3BMaXN0W2ldO1xyXG4gICAgICAgICAgICBsZXQgaW5mbyA9IGxlZ2FjeUNDLkFzc2V0TGlicmFyeS5fZ2V0QXNzZXRJbmZvSW5SdW50aW1lKGRlcGVuZFV1aWQpO1xyXG4gICAgICAgICAgICBpZiAoaW5mby5yYXcpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNraXAgcHJlbG9hZGluZyByYXcgYXNzZXRzXHJcbiAgICAgICAgICAgICAgICBsZXQgdXJsID0gaW5mby51cmw7XHJcbiAgICAgICAgICAgICAgICBvYmpbcHJvcF0gPSB1cmw7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRLZXlzLnB1c2godXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlY2xhcmUgZGVwZW5kcyBhc3NldHNcclxuICAgICAgICAgICAgICAgIGRlcGVuZHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3V1aWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHV1aWQ6IGRlcGVuZFV1aWQsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWRMb2FkUmF3OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIF9vd25lcjogb2JqLFxyXG4gICAgICAgICAgICAgICAgICAgIF9vd25lclByb3A6IHByb3AsXHJcbiAgICAgICAgICAgICAgICAgICAgX3N0aWxsVXNlVXJsOiBzdGlsbFVzZVVybFtpXVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBkZXBlbmRzID0gbmV3IEFycmF5KHV1aWRMaXN0Lmxlbmd0aCk7XHJcblxyXG4gICAgICAgIC8vIGRlY2xhcmUgZGVwZW5kcyBhc3NldHNcclxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdXVpZExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGVwZW5kVXVpZCA9IHV1aWRMaXN0W2ldO1xyXG4gICAgICAgICAgICBkZXBlbmRzW2ldID0ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ3V1aWQnLFxyXG4gICAgICAgICAgICAgICAgdXVpZDogZGVwZW5kVXVpZCxcclxuICAgICAgICAgICAgICAgIF9vd25lcjogb2JqTGlzdFtpXSxcclxuICAgICAgICAgICAgICAgIF9vd25lclByb3A6IHByb3BMaXN0W2ldLFxyXG4gICAgICAgICAgICAgICAgX3N0aWxsVXNlVXJsOiBzdGlsbFVzZVVybFtpXVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbG9hZCBuYXRpdmUgb2JqZWN0IChJbWFnZS9BdWRpbykgYXMgZGVwZW5kc1xyXG4gICAgICAgIGlmIChhc3NldC5fbmF0aXZlICYmICFhc3NldC5jb25zdHJ1Y3Rvci5wcmV2ZW50UHJlbG9hZE5hdGl2ZU9iamVjdCkge1xyXG4gICAgICAgICAgICBkZXBlbmRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBhc3NldC5uYXRpdmVVcmwsXHJcbiAgICAgICAgICAgICAgICBfb3duZXI6IGFzc2V0LFxyXG4gICAgICAgICAgICAgICAgX293bmVyUHJvcDogJ19uYXRpdmVBc3NldCcsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGVwZW5kcztcclxufVxyXG5cclxuZnVuY3Rpb24gbG9hZERlcGVuZHMgKHBpcGVsaW5lLCBpdGVtLCBhc3NldCwgZGVwZW5kcywgY2FsbGJhY2spIHtcclxuICAgIC8vIFByZWRlZmluZSBjb250ZW50IGZvciBkZXBlbmRlbmNpZXMgdXNhZ2VcclxuICAgIGl0ZW0uY29udGVudCA9IGFzc2V0O1xyXG4gICAgbGV0IGRlcGVuZEtleXMgPSBpdGVtLmRlcGVuZEtleXM7XHJcbiAgICBwaXBlbGluZS5mbG93SW5EZXBzKGl0ZW0sIGRlcGVuZHMsIGZ1bmN0aW9uIChlcnJvcnMsIGl0ZW1zKSB7XHJcbiAgICAgICAgbGV0IGl0ZW0sIG1pc3NpbmdBc3NldFJlcG9ydGVyO1xyXG4gICAgICAgIGxldCBpdGVtc01hcCA9IGl0ZW1zLm1hcDtcclxuICAgICAgICBmb3IgKGxldCBzcmMgaW4gaXRlbXNNYXApIHtcclxuICAgICAgICAgICAgaXRlbSA9IGl0ZW1zTWFwW3NyY107XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnV1aWQgJiYgaXRlbS5jb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmNvbnRlbnQuX3V1aWQgPSBpdGVtLnV1aWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXBlbmRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXAgPSBkZXBlbmRzW2ldO1xyXG4gICAgICAgICAgICBsZXQgZGVwZW5kU3JjID0gZGVwLnV1aWQ7XHJcbiAgICAgICAgICAgIGxldCBkZXBlbmRVcmwgPSBkZXAudXJsO1xyXG4gICAgICAgICAgICBsZXQgZGVwZW5kT2JqID0gZGVwLl9vd25lcjtcclxuICAgICAgICAgICAgbGV0IGRlcGVuZFByb3AgPSBkZXAuX293bmVyUHJvcDtcclxuICAgICAgICAgICAgaXRlbSA9IGl0ZW1zTWFwW2RlcGVuZFVybF07XHJcbiAgICAgICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBsb2FkQ2FsbGJhY2tDdHggPSBkZXA7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgZnVuY3Rpb24gbG9hZENhbGxiYWNrIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBpdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3RpbGxVc2VVcmwpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlID8gdmFsdWUubmF0aXZlVXJsIDogaXRlbS5yYXdVcmw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lclt0aGlzLl9vd25lclByb3BdID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS51dWlkICE9PSBhc3NldC5fdXVpZCAmJiBkZXBlbmRLZXlzLmluZGV4T2YoaXRlbS5pZCkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwZW5kS2V5cy5wdXNoKGl0ZW0uaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXRlbS5jb21wbGV0ZSB8fCBpdGVtLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEVESVRPUiAmJiBpdGVtLmVycm9yLmVycm9yQ29kZSA9PT0gJ2RiLk5PVEZPVU5EJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW1pc3NpbmdBc3NldFJlcG9ydGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtaXNzaW5nQXNzZXRSZXBvcnRlciA9IG5ldyBFZGl0b3JFeHRlbmRzLk1pc3NpbmdSZXBvcnRlci5vYmplY3QoYXNzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pc3NpbmdBc3NldFJlcG9ydGVyLnN0YXNoQnlPd25lcihkZXBlbmRPYmosIGRlcGVuZFByb3AsIEVkaXRvckV4dGVuZHMuc2VyaWFsaXplLmFzQXNzZXQoZGVwZW5kU3JjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZWdhY3lDQy5fdGhyb3coaXRlbS5lcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9hZENhbGxiYWNrLmNhbGwobG9hZENhbGxiYWNrQ3R4LCBpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0ZW0gd2FzIHJlbW92ZWQgZnJvbSBjYWNoZSwgYnV0IHJlYWR5IGluIHBpcGVsaW5lIGFjdHVhbGx5XHJcbiAgICAgICAgICAgICAgICBsZXQgcXVldWUgPSBMb2FkaW5nSXRlbXMuZ2V0UXVldWUoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVldWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBxdWV1ZS5hZGRMaXN0ZW5lcihkZXBlbmRTcmMsIGxvYWRDYWxsYmFjaywgbG9hZENhbGxiYWNrQ3R4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGFzc2V0IGluc3RhbmNlb2YgbGVnYWN5Q0MuU2NlbmVBc3NldCAmJiBhc3NldC5zY2VuZSkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRlcGVuZEtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBtYXBbZGVwZW5kS2V5c1tpXV0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5KGRlcGVuZEtleXNbaV0pLmZvckVhY2goKHgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBtYXBbeF0gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgYXNzZXQuc2NlbmUuZGVwZW5kQXNzZXRzID0gT2JqZWN0LmtleXMobWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW1pdCBkZXBlbmRlbmN5IGVycm9ycyBpbiBydW50aW1lLCBidXQgbm90IGluIGVkaXRvcixcclxuICAgICAgICAvLyBiZWNhdXNlIGVkaXRvciBuZWVkIHRvIG9wZW4gdGhlIHNjZW5lIC8gcHJlZmFiIHRvIGxldCB1c2VyIGZpeCBtaXNzaW5nIGFzc2V0IGlzc3Vlc1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgbWlzc2luZ0Fzc2V0UmVwb3J0ZXIpIHtcclxuICAgICAgICAgICAgbWlzc2luZ0Fzc2V0UmVwb3J0ZXIucmVwb3J0QnlPd25lcigpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBhc3NldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayhlcnJvcnMsIGFzc2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLy8gY2FuIGRlZmVycmVkIGxvYWQgcmF3IGFzc2V0cyBpbiBydW50aW1lXHJcbmZ1bmN0aW9uIGNhbkRlZmVycmVkTG9hZCAoYXNzZXQsIGl0ZW0sIGlzU2NlbmUpIHtcclxuICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgcmVzID0gaXRlbS5kZWZlcnJlZExvYWRSYXc7XHJcbiAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgLy8gY2hlY2sgaWYgYXNzZXQgc3VwcG9ydCBkZWZlcnJlZFxyXG4gICAgICAgIGlmICgoYXNzZXQgaW5zdGFuY2VvZiBsZWdhY3lDQy5Bc3NldCkgJiYgYXNzZXQuY29uc3RydWN0b3IucHJldmVudERlZmVycmVkTG9hZERlcGVuZGVudHMpIHtcclxuICAgICAgICAgICAgcmVzID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNTY2VuZSkge1xyXG4gICAgICAgIGlmIChhc3NldCBpbnN0YW5jZW9mIGxlZ2FjeUNDLlNjZW5lQXNzZXQgfHwgYXNzZXQgaW5zdGFuY2VvZiBsZWdhY3lDQy5QcmVmYWIpIHtcclxuICAgICAgICAgICAgcmVzID0gYXNzZXQuYXN5bmNMb2FkQXNzZXRzO1xyXG4gICAgICAgICAgICAvL2lmIChyZXMpIHtcclxuICAgICAgICAgICAgLy8gICAgY2MubG9nKCdkZWZlcnJlZCBsb2FkIHJhdyBhc3NldHMgZm9yICcgKyBpdGVtLmlkKTtcclxuICAgICAgICAgICAgLy99XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG5cclxubGV0IE1pc3NpbmdDbGFzcztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBsb2FkVXVpZCAoaXRlbSwgY2FsbGJhY2spIHtcclxuICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICBNaXNzaW5nQ2xhc3MgPSBNaXNzaW5nQ2xhc3MgfHwgRWRpdG9yRXh0ZW5kcy5NaXNzaW5nUmVwb3J0ZXIuY2xhc3NJbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQganNvbjtcclxuICAgIGlmICh0eXBlb2YgaXRlbS5jb250ZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGpzb24gPSBKU09OLnBhcnNlKGl0ZW0uY29udGVudCk7XHJcbiAgICAgICAgICAgIGlmICghREVCVUcgJiYganNvbi5rZXlzICYmIGpzb24uZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGtleXMgPSBqc29uLmtleXM7XHJcbiAgICAgICAgICAgICAgICBqc29uID0ganNvbi5kYXRhO1xyXG4gICAgICAgICAgICAgICAgZGVjb21wcmVzc0pzb24oanNvbiwga2V5cyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihnZXRFcnJvcig0OTIzLCBpdGVtLmlkLCBlLnN0YWNrKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAodHlwZW9mIGl0ZW0uY29udGVudCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBqc29uID0gaXRlbS5jb250ZW50O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihnZXRFcnJvcig0OTI0KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGpzb24gPT09IHVuZGVmaW5lZCB8fCBqc29uID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihnZXRFcnJvcig0OTIzLCBpdGVtLmlkKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGNsYXNzRmluZGVyO1xyXG4gICAgbGV0IGlzU2NlbmUgPSBpc1NjZW5lT2JqKGpzb24pO1xyXG4gICAgaWYgKGlzU2NlbmUpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIE1pc3NpbmdDbGFzcy5oYXNNaXNzaW5nQ2xhc3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgY2xhc3NGaW5kZXIgPSBmdW5jdGlvbiAodHlwZSwgZGF0YSwgb3duZXIsIHByb3BOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgcmVzID0gTWlzc2luZ0NsYXNzLmNsYXNzRmluZGVyKHR5cGUsIGRhdGEsIG93bmVyLCBwcm9wTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBsZWdhY3lDQy5fTWlzc2luZ1NjcmlwdC5nZXRNaXNzaW5nV3JhcHBlcih0eXBlLCBkYXRhKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY2xhc3NGaW5kZXIub25EZXJlZmVyZW5jZWQgPSBNaXNzaW5nQ2xhc3MuY2xhc3NGaW5kZXIub25EZXJlZmVyZW5jZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjbGFzc0ZpbmRlciA9IGxlZ2FjeUNDLl9NaXNzaW5nU2NyaXB0LnNhZmVGaW5kQ2xhc3M7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY2xhc3NGaW5kZXIgPSBmdW5jdGlvbiAoaWQpIHtcclxuICAgICAgICAgICAgbGV0IGNscyA9IGpzLl9nZXRDbGFzc0J5SWQoaWQpO1xyXG4gICAgICAgICAgICBpZiAoY2xzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2xzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHdhcm5JRCg0OTAzLCBpZCk7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Q7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdGRJbmZvID0gbGVnYWN5Q0MuZGVzZXJpYWxpemUuRGV0YWlscy5wb29sLmdldCgpO1xyXG5cclxuICAgIGxldCBhc3NldDtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXNzZXQgPSBsZWdhY3lDQy5kZXNlcmlhbGl6ZShqc29uLCB0ZEluZm8sIHtcclxuICAgICAgICAgICAgY2xhc3NGaW5kZXI6IGNsYXNzRmluZGVyLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IGl0ZW0uZXhpc3RpbmdBc3NldCxcclxuICAgICAgICAgICAgY3VzdG9tRW52OiBpdGVtXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxlZ2FjeUNDLmRlc2VyaWFsaXplLkRldGFpbHMucG9vbC5wdXQodGRJbmZvKTtcclxuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgIHJldHVybiBuZXcgRXJyb3IoYEZhaWxlZCB0byBsb2FkIGFzc2V0ICR7aXRlbS5pZH0sIGV4Y2VwdGlvbiBvY2N1cnMgZHVyaW5nIGRlc2VyaWFsaXphdGlvbjogJHtKU0IgPyAoZSArICdcXG4nICsgZS5zdGFjaykgOiBlLnN0YWNrfS5gKTtcclxuICAgICAgICAvLyByZXR1cm4gbmV3IEVycm9yKGRlYnVnLmdldEVycm9yKDQ5MjUsIGl0ZW0uaWQsIGVycikpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzc2V0Ll91dWlkID0gaXRlbS51dWlkO1xyXG5cclxuICAgIGlmIChFRElUT1IgJiYgaXNTY2VuZSAmJiBNaXNzaW5nQ2xhc3MuaGFzTWlzc2luZ0NsYXNzKSB7XHJcbiAgICAgICAgTWlzc2luZ0NsYXNzLnJlcG9ydE1pc3NpbmdDbGFzcyhhc3NldCk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGRlZmVycmVkTG9hZCA9IGNhbkRlZmVycmVkTG9hZChhc3NldCwgaXRlbSwgaXNTY2VuZSk7XHJcbiAgICBsZXQgZGVwZW5kcyA9IHBhcnNlRGVwZW5kcyhpdGVtLCBhc3NldCwgdGRJbmZvLCBkZWZlcnJlZExvYWQpO1xyXG5cclxuICAgIGxlZ2FjeUNDLmRlc2VyaWFsaXplLkRldGFpbHMucG9vbC5wdXQodGRJbmZvKTtcclxuXHJcbiAgICBsZXQgd3JhcHBlZENhbGxiYWNrID0gZnVuY3Rpb24oZXJyLCBhc3NldCkge1xyXG4gICAgICAgIGlmICghZXJyICYmIGFzc2V0Lm9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBhc3NldC5vbkxvYWRlZCgpO1xyXG4gICAgICAgICAgICB9IGNhdGNoKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoRURJVE9SICYmICFpc1NjZW5lKSB7XHJcbiAgICAgICAgICAgIGxldCBkZXBlbmRMaXN0ZW5lciA9IGxlZ2FjeUNDLkFzc2V0TGlicmFyeS5kZXBlbmRMaXN0ZW5lcjtcclxuICAgICAgICAgICAgbGV0IGFzc2V0TGlzdGVuZXIgPSBsZWdhY3lDQy5Bc3NldExpYnJhcnkuYXNzZXRMaXN0ZW5lcjtcclxuXHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgZnVuY3Rpb24gcHJvcFNldHRlciAoYXNzZXQsIG9iaiwgcHJvcE5hbWUsIG9sZEFzc2V0LCBuZXdBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZEFzc2V0ID09PSBuZXdBc3NldCB8fCBvYmpbcHJvcE5hbWVdID09PSBuZXdBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChhc3NldCBpbnN0YW5jZW9mIGxlZ2FjeUNDLk1hdGVyaWFsICYmIG5ld0Fzc2V0IGluc3RhbmNlb2YgbGVnYWN5Q0MuVGV4dHVyZTJEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBhc3NldC5wYXNzZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhc3NldC5nZXRQcm9wZXJ0eShwcm9wTmFtZSwgaSkgPT09IG9sZEFzc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldC5zZXRQcm9wZXJ0eShwcm9wTmFtZSwgbmV3QXNzZXQsIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpbcHJvcE5hbWVdID0gbmV3QXNzZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXQub25Mb2FkZWQgJiYgYXNzZXQub25Mb2FkZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZXBlbmRMaXN0ZW5lci5lbWl0KGFzc2V0Ll91dWlkLCBhc3NldCk7XHJcbiAgICAgICAgICAgICAgICBhc3NldExpc3RlbmVyLmVtaXQoYXNzZXQuX3V1aWQsIGFzc2V0KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkZXBlbmRMaXN0ZW5lcikge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5yZWZlcmVuY2VzID0ge307XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGRlcGVuZHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlcCA9IGRlcGVuZHNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGRlcGVuZFNyYyA9IGRlcC51dWlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZXBlbmRTcmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlcGVuZE9iaiA9IGRlcC5fb3duZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXBlbmRQcm9wID0gZGVwLl9vd25lclByb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBvbkRpcnR5ID0gcHJvcFNldHRlci5iaW5kKG51bGwsIGFzc2V0LCBkZXBlbmRPYmosIGRlcGVuZFByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXBlbmRMaXN0ZW5lci5vbihkZXBlbmRTcmMsIG9uRGlydHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnJlZmVyZW5jZXNbZGVwZW5kU3JjXSA9IG9uRGlydHk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhbGxiYWNrKGVyciwgYXNzZXQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoZGVwZW5kcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gd3JhcHBlZENhbGxiYWNrKG51bGwsIGFzc2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBsb2FkRGVwZW5kcyh0aGlzLnBpcGVsaW5lLCBpdGVtLCBhc3NldCwgZGVwZW5kcywgd3JhcHBlZENhbGxiYWNrKTtcclxufVxyXG5cclxubG9hZFV1aWQuaXNTY2VuZU9iaiA9IGlzU2NlbmVPYmo7XHJcbiJdfQ==