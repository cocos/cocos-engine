(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../assets/sprite-atlas.js", "../assets/asset.js", "../assets/sprite-frame.js", "../assets/texture-2d.js", "../assets/texture-cube.js", "../utils/js.js", "../utils/misc.js", "./asset-loader.js", "./asset-table.js", "./auto-release-utils.js", "./downloader.js", "./loader.js", "./loading-items.js", "./pipeline.js", "./released-asset-checker.js", "../default-constants.js", "../global-exports.js", "../platform/debug.js", "../utils/path.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../assets/sprite-atlas.js"), require("../assets/asset.js"), require("../assets/sprite-frame.js"), require("../assets/texture-2d.js"), require("../assets/texture-cube.js"), require("../utils/js.js"), require("../utils/misc.js"), require("./asset-loader.js"), require("./asset-table.js"), require("./auto-release-utils.js"), require("./downloader.js"), require("./loader.js"), require("./loading-items.js"), require("./pipeline.js"), require("./released-asset-checker.js"), require("../default-constants.js"), require("../global-exports.js"), require("../platform/debug.js"), require("../utils/path.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.spriteAtlas, global.asset, global.spriteFrame, global.texture2d, global.textureCube, global.js, global.misc, global.assetLoader, global.assetTable, global.autoReleaseUtils, global.downloader, global.loader, global.loadingItems, global.pipeline, global.releasedAssetChecker, global.defaultConstants, global.globalExports, global.debug, global.path);
    global.CCLoader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _spriteAtlas, _asset, _spriteFrame, _texture2d, _textureCube, _js, _misc, _assetLoader, _assetTable, _autoReleaseUtils, _downloader, _loader, _loadingItems, _pipeline, _releasedAssetChecker, _defaultConstants, _globalExports, _debug, path) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.loader = _exports.CCLoader = void 0;
  _assetLoader = _interopRequireDefault(_assetLoader);
  _downloader = _interopRequireDefault(_downloader);
  _loader = _interopRequireDefault(_loader);
  _releasedAssetChecker = _interopRequireDefault(_releasedAssetChecker);
  path = _interopRequireWildcard(path);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var assetTables = Object.create(null);
  assetTables.assets = new _assetTable.AssetTable();
  assetTables.internal = new _assetTable.AssetTable();

  function getXMLHttpRequest() {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
  }

  var _info = {
    url: null,
    raw: false
  };
  /*
   * @en Convert a resources by finding its real url with uuid, otherwise we will use the uuid or raw url as its url<br>
   * So we gurantee there will be url in result
   * @zh 通过使用 uuid 查找资源的真实 url 来转换资源，否则将使用 uuid 或原始 url 作为其 url<br>
   * 所以可以保证结果中会有 url
   * @param res
   */

  function getResWithUrl(res) {
    var id;
    var result;
    var isUuid;

    if (_typeof(res) === 'object') {
      result = res;

      if (res.url) {
        return result;
      } else {
        id = res.uuid;
      }
    } else {
      result = {};
      id = res;
    }

    isUuid = result.type ? result.type === 'uuid' : _globalExports.legacyCC.AssetLibrary._uuidInSettings(id);

    _globalExports.legacyCC.AssetLibrary._getAssetInfoInRuntime(id, _info);

    result.url = !isUuid ? id : _info.url;

    if (_info.url && result.type === 'uuid' && _info.raw) {
      result.type = null;
      result.isRawAsset = true;
    } else if (!isUuid) {
      result.isRawAsset = true;
    }

    return result;
  }

  var _sharedResources = [];
  var _sharedList = [];
  /**
   * @en Loader for resource loading process. The engine automatically initialize its singleton object {{loader}}.
   * @zh 资源加载管理器，引擎会自动创建一个单例对象 {{loader}}。
   */

  var CCLoader = /*#__PURE__*/function (_Pipeline) {
    _inherits(CCLoader, _Pipeline);

    /**
     * @en Gets a new XMLHttpRequest instance.
     * @zh 获取一个新的 XMLHttpRequest 的实例。
     */

    /**
     * @en The asset loader in loader's pipeline, it's by default the first pipe.<br>
     * It's used to identify an asset's type, and determine how to download it.
     * @zh loader 中的资源加载器，默认情况下是最先加载的。<br>
     * 用于标识资源的类型，并确定如何加载此资源。
     */

    /**
     * @en The md5 pipe in loader's pipeline, it could be absent if the project isn't build with md5 option.<br>
     * It's used to modify the url to the real downloadable url with md5 suffix.
     * @zh loader 中的 md5 加载管道，如果项目没有使用 md5 构建，则此项可能不存在。<br>
     * 用于修改带有 md5 后缀的真实可下载的 URL 。
     */

    /**
     * @en
     * The downloader in loader's pipeline, it's by default the second pipe.<br>
     * It's used to download files with several handlers: pure text, image, script, audio, font, uuid.<br>
     * You can add your own download function with addDownloadHandlers
     * @zh
     * loader 中的资源下载程序，默认情况下是第二个加载的。<br>
     * 它用于下载带有多个处理程序的文件：纯文本，图像，脚本，音频，字体，uuid。<br>
     * 您可以使用 addDownloadHandlers 来添加自己的下载函数
     */

    /**
     * @en
     * The loader in loader's pipeline, it's by default the third pipe.<br>
     * It's used to parse downloaded content with several handlers: JSON, image, plist, fnt, uuid.<br>
     * You can add your own download function with addLoadHandlers
     * @zh
     * loader 中的资源下载程序，默认情况下是第三个加载的。<br>
     * 它用于解析下载的内容及多个处理程序的文件：纯文本，图像，脚本，音频，字体，uuid。<br>
     * 您可以使用 addLoadHandlers 来添加自己的下载函数
     */

    /**
     * @en The default progression callback during the loading process, 
     * if no progression callback is passed to {{load}} function, then this default callback will be used.
     * @zh Loader 默认的进度回调函数，如果在调用 {{load}} 函数时没有指定进度回调函数的话，会调用默认进度回调函数。
     */
    function CCLoader() {
      var _this;

      _classCallCheck(this, CCLoader);

      var assetLoader = new _assetLoader.default();
      var downloader = new _downloader.default(); // tslint:disable-next-line: no-shadowed-letiable

      var loader = new _loader.default();
      _this = _possibleConstructorReturn(this, _getPrototypeOf(CCLoader).call(this, [assetLoader, downloader, loader]));
      _this.getXMLHttpRequest = void 0;
      _this.assetLoader = void 0;
      _this.md5Pipe = void 0;
      _this.downloader = void 0;
      _this.loader = void 0;
      _this.onProgress = void 0;
      _this._assetTables = void 0;
      _this._autoReleaseSetting = void 0;
      _this._releasedAssetChecker_DEBUG = void 0;
      _this.getXMLHttpRequest = getXMLHttpRequest;
      _this.assetLoader = assetLoader;
      _this.md5Pipe = null;
      _this.downloader = downloader;
      _this.loader = loader;
      _this.onProgress = null;
      _this._assetTables = assetTables; // assets to release automatically

      _this._autoReleaseSetting = (0, _js.createMap)(true);

      if (_defaultConstants.DEBUG) {
        _this._releasedAssetChecker_DEBUG = new _releasedAssetChecker.default();
      }

      return _this;
    }
    /**
     * @en Initialize with director
     * @zh 使用 {{director}} 初始化
     * @param director The director instance of engine
     */


    _createClass(CCLoader, [{
      key: "init",
      value: function init(director) {
        if (_defaultConstants.DEBUG) {
          var self = this;
          director.on(_globalExports.legacyCC.Director.EVENT_AFTER_UPDATE, function () {
            self._releasedAssetChecker_DEBUG.checkCouldRelease(self._cache);
          });
        }
      }
      /**
       * @en Add custom supported types handler or modify existing type handler for download process.
       * @zh 为下载程序添加自定义支持的类型处理程序或修改现有的类型处理程序。
       * @example
       * ```ts
       *  loader.addDownloadHandlers({
       *      // This will match all url with `.scene` extension or all url with `scene` type
       *      'scene' : function (url, callback) {}
       *  });
       * ```
       * @param extMap Handlers for corresponding type in a map
       */

    }, {
      key: "addDownloadHandlers",
      value: function addDownloadHandlers(extMap) {
        this.downloader.addHandlers(extMap);
      }
      /**
       * @en Add custom supported types handler or modify existing type handler for load process.
       * @zh 为加载程序添加自定义支持的类型处理程序或修改现有的类型处理程序。
       * @example
       * ```ts
       *  loader.addLoadHandlers({
       *      // This will match all url with `.scene` extension or all url with `scene` type
       *      'scene' : function (url, callback) {}
       *  });
       * ```
       * @param extMap Handlers for corresponding type in a map
       */

    }, {
      key: "addLoadHandlers",
      value: function addLoadHandlers(extMap) {
        this.loader.addHandlers(extMap);
      } // tslint:disable: max-line-length

      /**
       * @en
       * Load resources with a progression callback and a complete callback.<br>
       * The progression callback is the same as Pipeline's [[LoadingItems.onProgress]] <br>
       * The complete callback is almost the same as Pipeline's [[LoadingItems.onComplete]] <br>
       * The only difference is when user pass a single url as resources, the complete callback will set its result directly as the second parameter.
       * @zh
       * 使用进度回调和完整回调加载资源。<br>
       * 进度回调与 Pipeline 的 [[LoadingItems.onProgress]] 相同<br>
       * 完整的回调与 Pipeline 的 [[LoadingItems.onComplete]] 几乎相同<br>
       * 唯一的区别是当用户将单个 URL 作为资源传递时，完整的回调将其结果直接设置为第二个参数。
       * @example
       * ```TypeScript
       * import { loader, log, Texture2D } from 'cc';
       * loader.load('a.png', function (err, tex) {
       *     log('Result should be a texture: ' + (tex instanceof Texture2D));
       * });
       *
       * loader.load('http://example.com/a.png', function (err, tex) {
       *     log('Should load a texture from external url: ' + (tex instanceof Texture2D));
       * });
       *
       * loader.load({url: 'http://example.com/getImageREST?file=a.png', type: 'png'}, function (err, tex) {
       *     log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof Texture2D));
       * });
       *
       * loader.load(['a.png', 'b.json'], function (errors, results) {
       *     if (errors) {
       *         for (let i = 0; i < errors.length; i++) {
       *             log('Error url [' + errors[i] + ']: ' + results.getError(errors[i]));
       *         }
       *     }
       *     let aTex = results.getContent('a.png');
       *     let bJsonObj = results.getContent('b.json');
       * });
       * ```
       * @param resources - Url list or load request list
       * @param progressCallback - Progression callback
       * @param {Number} progressCallback.completedCount - The number of the items that are already completed
       * @param {Number} progressCallback.totalCount - The total number of the items
       * @param {Object} progressCallback.item - The latest item which flow out the pipeline
       * @param completeCallback - Completion callback
       */

    }, {
      key: "load",
      value: function load(resources, progressCallback, completeCallback) {
        if (_defaultConstants.DEV && !resources) {
          return (0, _debug.error)('[loader.load] resources must be non-nil.');
        }

        if (completeCallback === undefined) {
          completeCallback = progressCallback;
          progressCallback = this.onProgress || null;
        }

        var self = this;
        var singleRes = false;
        var resList;
        var res;

        if (resources instanceof Array) {
          resList = resources;
        } else {
          if (resources) {
            singleRes = true;
            resList = [resources];
          } else {
            resList = [];
          }
        }

        _sharedResources.length = 0; // tslint:disable-next-line: prefer-for-of

        for (var i = 0; i < resList.length; ++i) {
          var resource = resList[i]; // Backward compatibility

          if (resource && resource.id) {
            (0, _debug.warnID)(4920, resource.id);

            if (!resource.uuid && !resource.url) {
              resource.url = resource.id;
            }
          }

          res = getResWithUrl(resource);

          if (!res.url && !res.uuid) {
            continue;
          }

          var item = this._cache[res.url];

          _sharedResources.push(item || res);
        }

        var queue = _loadingItems.LoadingItems.create(this, progressCallback, function (errors, items) {
          (0, _misc.callInNextTick)(function () {
            if (completeCallback) {
              if (singleRes) {
                var id = res.url;
                completeCallback.call(self, items.getError(id), items.getContent(id));
              } else {
                completeCallback.call(self, errors, items);
              }

              completeCallback = null;
            }

            items.destroy();
          });
        });

        _loadingItems.LoadingItems.initQueueDeps(queue);

        queue.append(_sharedResources);
        _sharedResources.length = 0;
      }
      /**
       * @en See: {{Pipeline.flowInDeps}}
       * @zh 参考：{{Pipeline.flowInDeps}}
       */

    }, {
      key: "flowInDeps",
      value: function flowInDeps(owner, urlList, callback) {
        _sharedList.length = 0; // tslint:disable-next-line: prefer-for-of

        for (var i = 0; i < urlList.length; ++i) {
          var res = getResWithUrl(urlList[i]);

          if (!res.url && !res.uuid) {
            continue;
          }

          var item = this._cache[res.url];

          if (item) {
            _sharedList.push(item);
          } else {
            _sharedList.push(res);
          }
        } // @ts-ignore


        var queue = _loadingItems.LoadingItems.create(this, owner ? function (completedCount, totalCount, item) {
          // @ts-ignore
          if (queue._ownerQueue && queue._ownerQueue.onProgress) {
            // @ts-ignore
            queue._ownerQueue._childOnProgress(item);
          }
        } : null, function (errors, items) {
          callback(errors, items); // Clear deps because it's already done
          // Each item will only flowInDeps once, so it's still safe here

          if (owner && owner.deps) {
            owner.deps.length = 0;
          }

          items.destroy();
        });

        if (owner) {
          var ownerQueue = _loadingItems.LoadingItems.getQueue(owner); // Set the root ownerQueue, if no ownerQueue defined in ownerQueue, it's the root


          queue._ownerQueue = ownerQueue && ownerQueue._ownerQueue || ownerQueue;
        }

        var accepted = queue.append(_sharedList, owner);
        _sharedList.length = 0;
        return accepted;
      }
    }, {
      key: "loadRes",

      /**
       * @en
       * Load assets from the "resources" folder inside the "assets" folder of your project.<br>
       * <br>
       * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
       * @zh
       * 从项目的 “assets” 文件夹下的 “resources” 文件夹中加载资源<br>
       * <br>
       * 注意：Creator 中的所有资源 URL 都使用正斜杠，使用反斜杠的 URL 将不起作用。
       * @param url - The url of the asset to be loaded, this url should be related path without file extension to the `resources` folder.
       * @param type - If type is provided, only asset for correspond type will be loaded
       * @param progressCallback - Progression callback
       * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
       * @param {Number} progressCallback.totalCount - The total number of the items.
       * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
       * @param completeCallback - Completion callback
       * @param {Error} completeCallback.error - The error info or null if loaded successfully.
       * @param {Object} completeCallback.resource - The loaded resource if it can be found otherwise returns null.
       *
       * @example
       * ```ts
       * import { loader, error, log, Prefab, SpriteFrame } from 'cc';
       * // load the prefab (project/assets/resources/misc/character/cocos) from resources folder
       * loader.loadRes('misc/character/cocos', function (err, prefab) {
       *     if (err) {
       *         error(err.message || err);
       *         return;
       *     }
       *     log('Result should be a prefab: ' + (prefab instanceof Prefab));
       * });
       *
       * // load the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
       * loader.loadRes('imgs/cocos', SpriteFrame, function (err, spriteFrame) {
       *     if (err) {
       *         error(err.message || err);
       *         return;
       *     }
       *     log('Result should be a sprite frame: ' + (spriteFrame instanceof SpriteFrame));
       * });
       * ```
       */
      value: function loadRes(url, type, mount, progressCallback, completeCallback) {
        if (arguments.length !== 5) {
          completeCallback = progressCallback;
          progressCallback = mount;
          mount = 'assets';
        }

        var args = this._parseLoadResArgs(type, progressCallback, completeCallback);

        type = args.type;
        progressCallback = args.onProgress;
        completeCallback = args.onComplete;
        var self = this;

        var uuid = self._getResUuid(url, type, mount, true);

        if (uuid) {
          this.load({
            type: 'uuid',
            uuid: uuid
          }, progressCallback, function (err, asset) {
            if (asset) {
              // should not release these assets, even if they are static referenced in the scene.
              self.setAutoReleaseRecursively(uuid, false);
            }

            if (completeCallback) {
              completeCallback(err, asset);
            }
          });
        } else {
          self._urlNotFound(url, type, completeCallback);
        }
      }
      /**
       * @en
       * Load all assets in a folder inside the "assets/resources" folder of your project.<br>
       * <br>
       * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
       * @zh
       * 将所有资产加载到项目 “assets / resources” 文件夹中
       * <br>
       * 注意：Creator 中的所有资源 URL 都使用正斜杠，使用反斜杠的 URL 将不起作用。
       * @param url The url of the directory to be loaded, this url should be related path to the `resources` folder.
       * @param type - If type is provided, only assets for correspond type will be loaded
       * @param progressCallback - Progression callback
       * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
       * @param {Number} progressCallback.totalCount - The total number of the items.
       * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
       * @param completeCallback - Completion callback
       * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
       *                                         with the error. If all assets are loaded successfully, error will be null.
       * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
       *                                             If nothing to load, assets will be an empty array.
       * @param {string[]} completeCallback.urls - An array that lists all the URLs of loaded assets.
       *
       * @example
       * ```ts
       * import { loader, error, Texture2D } from 'cc';
       * // load the texture (resources/imgs/cocos.png) and the corresponding sprite frame
       * loader.loadResDir('imgs/cocos', function (err, assets) {
       *     if (err) {
       *         error(err);
       *         return;
       *     }
       *     let texture = assets[0];
       *     let spriteFrame = assets[1];
       * });
       *
       * // load all textures in "resources/imgs/"
       * loader.loadResDir('imgs', Texture2D, function (err, textures) {
       *     let texture1 = textures[0];
       *     let texture2 = textures[1];
       * });
       *
       * // load all JSONs in "resources/data/"
       * loader.loadResDir('data', function (err, objects, urls) {
       *     let data = objects[0];
       *     let url = urls[0];
       * });
       * ```
       */

    }, {
      key: "loadResDir",
      value: function loadResDir(url, type, mount, progressCallback, completeCallback) {
        if (arguments.length !== 5) {
          completeCallback = progressCallback;
          progressCallback = mount;
          mount = 'assets';
        }

        if (!assetTables[mount]) {
          return;
        }

        var args = this._parseLoadResArgs(type, progressCallback, completeCallback);

        type = args.type;
        progressCallback = args.onProgress;
        completeCallback = args.onComplete;
        var urls = [];
        var uuids = assetTables[mount].getUuidArray(url, type, urls);

        this._loadResUuids(uuids, progressCallback, function (errors, assetRes, urlRes) {
          // The spriteFrame url in spriteAtlas will be removed after build project
          // To show users the exact structure in asset panel, we need to return the spriteFrame assets in spriteAtlas
          var assetResLength = assetRes.length;

          for (var i = 0; i < assetResLength; ++i) {
            if (assetRes[i] instanceof _spriteAtlas.SpriteAtlas) {
              var spriteFrames = assetRes[i].getSpriteFrames(); // tslint:disable: forin

              for (var k in spriteFrames) {
                var sf = spriteFrames[k];
                assetRes.push(sf);

                if (urlRes) {
                  urlRes.push("".concat(urlRes[i], "/").concat(sf.name));
                }
              }
            }
          }

          if (completeCallback) {
            completeCallback(errors, assetRes, urlRes);
          }
        }, urls);
      }
      /**
       * @en This method is like [[loadRes]] except that it accepts array of url.
       * @zh 此方法除了接受 URL 数组参数外，与 [[loadRes]] 方法相同。
       *
       * @param url The url array of assets to be loaded, this url should be related path without extension to the `resources` folder.
       * @param type - If type is provided, only assets for correspond type will be loaded
       * @param progressCallback - Progression callback
       * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
       * @param {Number} progressCallback.totalCount - The total number of the items.
       * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
       * @param completeCallback - Completion callback
       * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
       *                                         with the error. If all assets are loaded successfully, error will be null.
       * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
       *                                                     If nothing to load, assets will be an empty array.
       * @example
       * ```ts
       * import { loader, error, SpriteFrame } from 'cc';
       * // load the SpriteFrames from resources folder
       * let spriteFrames;
       * let urls = ['misc/characters/character_01', 'misc/weapons/weapons_01'];
       * loader.loadResArray(urls, SpriteFrame, function (err, assets) {
       *     if (err) {
       *         error(err);
       *         return;
       *     }
       *     spriteFrames = assets;
       *     // ...
       * });
       * ```
       */

    }, {
      key: "loadResArray",
      value: function loadResArray(urls, type, mount, progressCallback, completeCallback) {
        if (arguments.length !== 5) {
          completeCallback = progressCallback;
          progressCallback = mount;
          mount = 'assets';
        }

        var args = this._parseLoadResArgs(type, progressCallback, completeCallback);

        type = args.type;
        progressCallback = args.onProgress;
        completeCallback = args.onComplete;
        var uuids = []; // tslint:disable: prefer-for-of

        for (var i = 0; i < urls.length; i++) {
          var _url = urls[i];

          var uuid = this._getResUuid(_url, type, mount, true);

          if (uuid) {
            uuids.push(uuid);
          } else {
            this._urlNotFound(_url, type, completeCallback);

            return;
          }
        }

        this._loadResUuids(uuids, progressCallback, completeCallback);
      }
      /**
       * @en
       * Get resource data by id. <br>
       * When you load resources with [[load]] or [[loadRes]],
       * the url will be the unique identity of the resource.
       * After loaded, you can acquire them by passing the url to this API.
       * @zh
       * 根据 ID 获取资源数据。<br>
       * 当使用 [[load]] 或 [[loadRes]] 来加载资源时，<br>
       * URL 将是资源的唯一标识。<br>
       * 在完成加载之后，你可以通过将 URL 传递给此 API 来获取它们。
       * @param url The asset url, it should be related path without extension to the `resources` folder.
       * @param type If type is provided, the asset for correspond type will be returned
       */

    }, {
      key: "getRes",
      value: function getRes(url, type) {
        var item = this._cache[url];

        if (!item) {
          var uuid = this._getResUuid(url, type, null, true);

          if (uuid) {
            var ref = this._getReferenceKey(uuid);

            item = this._cache[ref];
          } else {
            return null;
          }
        }

        if (item && item.alias) {
          item = item.alias;
        }

        return item && item.complete ? item.content : null;
      }
      /**
       * @en Get total resources count in loader.
       * @zh 获取加载的总资源数量
       */

    }, {
      key: "getResCount",
      value: function getResCount() {
        return Object.keys(this._cache).length;
      }
      /**
       * @en
       * Get all resource dependencies of the requested asset in an array, including itself.<br>
       * The owner parameter accept the following types: 1. The asset itself; 2. The resource url; 3. The asset's uuid.<br>
       * The returned array stores the dependencies with their uuids, after retrieve dependencies,<br>
       * you can release them, access dependent assets by passing the uuid to [[getRes]], or other stuffs you want.<br>
       * For release all dependencies of an asset, please refer to [[release]]
       * Here is some examples:
       * @zh
       * 获取一个指定资源的所有依赖资源，包含它自身，并保存在数组中返回。<br>
       * owner 参数接收以下几种类型：1. 资源 asset 对象；2. 资源目录下的 url；3. 资源的 uuid。<br>
       * 返回的数组将仅保存依赖资源的 uuid，获取这些 uuid 后，你可以从 loader 释放这些资源；通过 [[getRes]] 获取某个资源或者进行其他你需要的操作。<br>
       * 想要释放一个资源及其依赖资源，可以参考 [[release]]。<br>
       * 下面是一些示例代码：
       * @example
       * ```ts
       * import { loader, Texture2D } from 'cc';
       * // Release all dependencies of a loaded prefab
       * let deps = loader.getDependsRecursively(prefab);
       * loader.release(deps);
       * // Retrieve all dependent textures
       * let deps = loader.getDependsRecursively('prefabs/sample');
       * let textures = [];
       * for (let i = 0; i < deps.length; ++i) {
       *     let item = loader.getRes(deps[i]);
       *     if (item instanceof Texture2D) {
       *         textures.push(item);
       *     }
       * }
       * ```
       * @param owner - The asset itself or the asset url or the asset uuid
       */

    }, {
      key: "getDependsRecursively",
      value: function getDependsRecursively(owner) {
        if (owner) {
          var key = this._getReferenceKey(owner);

          var assets = (0, _autoReleaseUtils.getDependsRecursively)(key);
          assets.push(key);
          return assets;
        } else {
          return [];
        }
      }
      /**
       * @en
       * Release the content of an asset or an array of assets by uuid.<br>
       * This method will not only remove the cache of the asset in loader, but also clean up its content.<br>
       * For example, if you release a texture, the texture asset and its gl texture data will be freed up.<br>
       * In complexe project, you can use this function with [[getDependsRecursively]] to free up memory in critical circumstances.<br>
       * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.<br>
       * If you only want to remove the cache of an asset, please use [[Pipeline.removeItem]]
       * @zh
       * 通过 id（通常是资源 url）来释放一个资源或者一个资源数组。<br>
       * 这个方法不仅会从 loader 中删除资源的缓存引用，还会清理它的资源内容。<br>
       * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。<br>
       * 在复杂项目中，我们建议你结合 [[getDependsRecursively]] 来使用，便于在设备内存告急的情况下更快地释放不再需要的资源的内存。<br>
       * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。<br>
       * 如果你只想删除一个资源的缓存引用，请使用 [[Pipeline.removeItem]]
       *
       * @example
       * ```ts
       * // Release a texture which is no longer need
       * loader.release(texture);
       * // Release all dependencies of a loaded prefab
       * let deps = loader.getDependsRecursively('prefabs/sample');
       * loader.release(deps);
       * // If there is no instance of this prefab in the scene, the prefab and its dependencies like textures, sprite frames, etc, will be freed up.
       * // If you have some other nodes share a texture in this prefab, you can skip it in two ways:
       * // 1. Forbid auto release a texture before release
       * loader.setAutoRelease(texture2d, false);
       * // 2. Remove it from the dependencies array
       * let deps = loader.getDependsRecursively('prefabs/sample');
       * let index = deps.indexOf(texture2d._uuid);
       * if (index !== -1)
       *     deps.splice(index, 1);
       * loader.release(deps);
       * ```
       * @param asset Asset or assets to be released
       */

    }, {
      key: "release",
      value: function release(asset) {
        if (Array.isArray(asset)) {
          for (var i = 0; i < asset.length; i++) {
            var key = asset[i];
            this.release(key);
          }
        } else if (asset) {
          var id = this._getReferenceKey(asset);

          var item = this.getItem(id);

          if (item) {
            var removed = this.removeItem(id);
            asset = item.content;

            if (asset instanceof _asset.Asset) {
              var nativeUrl = asset.nativeUrl;

              if (nativeUrl) {
                this.release(nativeUrl); // uncache loading item of native asset
              }

              asset.destroy();
            }

            if (_defaultConstants.DEBUG && removed) {
              this._releasedAssetChecker_DEBUG.setReleased(item, id);
            }
          }
        }
      }
      /**
       * @en Release the asset by its object. Refer to {{release}} for detailed informations.
       * @zh 通过资源对象自身来释放资源。详细信息请参考 {{release}}
       * @param asset The asset to be released
       */

    }, {
      key: "releaseAsset",
      value: function releaseAsset(asset) {
        var uuid = asset._uuid;

        if (uuid) {
          this.release(uuid);
        }
      }
      /**
       * @en Release the asset loaded by {{loadRes}}. Refer to {{release}} for detailed informations.
       * @zh 释放通过 {{loadRes}} 加载的资源。详细信息请参考 {{release}}
       * @param url The asset url, it should be related path without extension to the `resources` folder.
       * @param type If type is provided, the asset for correspond type will be returned
       */

    }, {
      key: "releaseRes",
      value: function releaseRes(url, type, mount) {
        var uuid = this._getResUuid(url, type, mount, true);

        if (uuid) {
          this.release(uuid);
        } else {
          (0, _debug.errorID)(4914, url);
        }
      }
      /**
       * @en Release the all assets loaded by {{loadResDir}}. Refer to {{release}} for detailed informations.
       * @zh 释放通过 {{loadResDir}} 加载的资源。详细信息请参考 {{release}}
       * @param url The url of the directory to release, it should be related path to the `resources` folder.
       * @param type If type is provided, the asset for correspond type will be returned
       */

    }, {
      key: "releaseResDir",
      value: function releaseResDir(url, type, mount) {
        mount = mount || 'assets';

        if (!assetTables[mount]) {
          return;
        }

        var uuids = assetTables[mount].getUuidArray(url, type);

        for (var i = 0; i < uuids.length; i++) {
          var uuid = uuids[i];
          this.release(uuid);
        }
      }
      /**
       * @en Resource all assets. Refer to {{release}} for detailed informations.
       * @zh 释放所有资源。详细信息请参考 {{release}}
       */

    }, {
      key: "releaseAll",
      value: function releaseAll() {
        for (var id in this._cache) {
          this.release(id);
        }
      } // AUTO RELEASE
      // override

    }, {
      key: "removeItem",
      value: function removeItem(key) {
        var removed = _pipeline.Pipeline.prototype.removeItem.call(this, key);

        delete this._autoReleaseSetting[key];
        return removed;
      }
      /**
       * @en
       * Indicates whether to release the asset when loading a new scene.<br>
       * By default, when loading a new scene, all assets in the previous scene will be released or preserved<br>
       * according to whether the previous scene checked the "Auto Release Assets" option.<br>
       * On the other hand, assets dynamically loaded by using `loader.loadRes` or `loader.loadResDir`<br>
       * will not be affected by that option, remain not released by default.<br>
       * Use this API to change the default behavior on a single asset, to force preserve or release specified asset when scene switching.<br>
       * <br>
       * See: {{setAutoReleaseRecursively}}, {{isAutoRelease}}
       * @zh
       * 设置当场景切换时是否自动释放资源。<br>
       * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。<br>
       * 而使用 `loader.loadRes` 或 `loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
       * 使用这个 API 可以在单个资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
       * <br>
       * 参考：{{setAutoReleaseRecursively}}，{{isAutoRelease}}
       *
       * @example
       * ```ts
       * // auto release the texture event if "Auto Release Assets" disabled in current scene
       * loader.setAutoRelease(texture2d, true);
       * // don't release the texture even if "Auto Release Assets" enabled in current scene
       * loader.setAutoRelease(texture2d, false);
       * // first parameter can be url
       * loader.setAutoRelease(audioUrl, false);
       * ```
       * @param assetOrUrlOrUuid - The asset or its url or its uuid
       * @param autoRelease - Whether to release automatically during scene switch
       */

    }, {
      key: "setAutoRelease",
      value: function setAutoRelease(assetOrUrlOrUuid, autoRelease) {
        var key = this._getReferenceKey(assetOrUrlOrUuid);

        if (key) {
          this._autoReleaseSetting[key] = !!autoRelease;
        } else if (_defaultConstants.DEV) {
          (0, _debug.warnID)(4902);
        }
      }
      /**
       * @en
       * Indicates whether to release the asset and its referenced other assets when loading a new scene.<br>
       * By default, when loading a new scene, all assets in the previous scene will be released or preserved<br>
       * according to whether the previous scene checked the "Auto Release Assets" option.<br>
       * On the other hand, assets dynamically loaded by using `loader.loadRes` or `loader.loadResDir`<br>
       * will not be affected by that option, remain not released by default.<br>
       * Use this API to change the default behavior on the specified asset and its recursively referenced assets, to force preserve or release specified asset when scene switching.<br>
       * <br>
       * See: {{setAutoRelease}}, {{isAutoRelease}}
       * @zh
       * 设置当场景切换时是否自动释放资源及资源引用的其它资源。<br>
       * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。<br>
       * 而使用 `loader.loadRes` 或 `loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
       * 使用这个 API 可以在指定资源及资源递归引用到的所有资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
       * <br>
       * 参考：{{setAutoRelease}}，{{isAutoRelease}}
       *
       * @example
       * ```ts
       * // auto release the SpriteFrame and its Texture event if "Auto Release Assets" disabled in current scene
       * loader.setAutoReleaseRecursively(spriteFrame, true);
       * // don't release the SpriteFrame and its Texture even if "Auto Release Assets" enabled in current scene
       * loader.setAutoReleaseRecursively(spriteFrame, false);
       * // don't release the Prefab and all the referenced assets
       * loader.setAutoReleaseRecursively(prefab, false);
       * ```
       * @param assetOrUrlOrUuid - The asset or its url or its uuid
       * @param autoRelease - Whether to release automatically during scene switch
       */

    }, {
      key: "setAutoReleaseRecursively",
      value: function setAutoReleaseRecursively(assetOrUrlOrUuid, autoRelease) {
        autoRelease = !!autoRelease;

        var key = this._getReferenceKey(assetOrUrlOrUuid);

        if (key) {
          this._autoReleaseSetting[key] = autoRelease;
          var depends = (0, _autoReleaseUtils.getDependsRecursively)(key);

          for (var i = 0; i < depends.length; i++) {
            var depend = depends[i];
            this._autoReleaseSetting[depend] = autoRelease;
          }
        } else if (_defaultConstants.DEV) {
          (0, _debug.warnID)(4902);
        }
      }
      /**
       * @en Returns whether the asset is configured as auto released, despite how "Auto Release Assets" property is set on scene asset.<br>
       * <br>
       * See: {{setAutoRelease}}, {{setAutoReleaseRecursively}}
       * @zh 返回指定的资源是否有被设置为自动释放，不论场景的“Auto Release Assets”如何设置。<br>
       * <br>
       * 参考：{{setAutoRelease}}，{{setAutoReleaseRecursively}}
       * @param {Asset|string} assetOrUrl - asset object or the raw asset's url
       * @returns {Boolean}
       */

    }, {
      key: "isAutoRelease",
      value: function isAutoRelease(assetOrUrl) {
        var key = this._getReferenceKey(assetOrUrl);

        if (key) {
          return !!this._autoReleaseSetting[key];
        }

        return false;
      }
      /**
       * @en Retrieve asset's uuid
       * @zh 获取资源的 uuid
       */

    }, {
      key: "_getResUuid",
      value: function _getResUuid(url, type, mount, quiet) {
        mount = mount || 'assets';
        var uuid = '';

        if (_defaultConstants.EDITOR) {
          var info = EditorExtends.Asset.getAssetInfoFromUrl("db://".concat(mount, "/resources/").concat(url));
          uuid = info ? info.uuid : '';
        } else {
          var assetTable = assetTables[mount];

          if (url && assetTable) {
            // Ignore parameter
            var index = url.indexOf('?');

            if (index !== -1) {
              url = url.substr(0, index);
            }

            uuid = assetTable.getUuid(url, type);

            if (!uuid) {
              var extname = path.extname(url);

              if (extname) {
                // strip extname
                url = url.slice(0, -extname.length);
                uuid = assetTable.getUuid(url, type);

                if (uuid && !quiet) {
                  (0, _debug.warnID)(4901, url, extname);
                }
              }
            }
          }
        }

        if (!uuid && type) {
          if ((0, _js.isChildClassOf)(type, _spriteFrame.SpriteFrame) || (0, _js.isChildClassOf)(type, _texture2d.Texture2D) || (0, _js.isChildClassOf)(type, _textureCube.TextureCube)) {
            (0, _debug.warnID)(4934);
          }
        }

        return uuid;
      }
      /**
       * @en Find the asset's reference id in loader, asset could be asset object, asset uuid or asset url
       * @zh 在 laoder 中找到资源的引用 id ，参数可以是资源对象、资源的 uuid 或者是资源的 url
       */

    }, {
      key: "_getReferenceKey",
      value: function _getReferenceKey(assetOrUrlOrUuid) {
        var key;

        if (_typeof(assetOrUrlOrUuid) === 'object') {
          key = assetOrUrlOrUuid._uuid || null;
        } else if (typeof assetOrUrlOrUuid === 'string') {
          key = this._getResUuid(assetOrUrlOrUuid, undefined, undefined, true) || assetOrUrlOrUuid;
        }

        if (!key) {
          (0, _debug.warnID)(4800, assetOrUrlOrUuid);
          return key;
        }

        _globalExports.legacyCC.AssetLibrary._getAssetInfoInRuntime(key, _info);

        return this._cache[_info.url] ? _info.url : key;
      } // Operation when complete the request without found any asset

    }, {
      key: "_urlNotFound",
      value: function _urlNotFound(url, type, completeCallback) {
        (0, _misc.callInNextTick)(function () {
          url = _globalExports.legacyCC.url.normalize(url);
          var info = "".concat(type ? (0, _js.getClassName)(type) : 'Asset', " in \"resources/").concat(url, "\" does not exist.");

          if (completeCallback) {
            completeCallback(new Error(info), []);
          }
        });
      }
    }, {
      key: "_parseLoadResArgs",
      value: function _parseLoadResArgs(type, onProgress, onComplete) {
        if (onComplete === undefined) {
          var isValidType = (0, _js.isChildClassOf)(type, _globalExports.legacyCC.RawAsset);

          if (onProgress) {
            onComplete = onProgress;

            if (isValidType) {
              onProgress = this.onProgress || null;
            }
          } else if (onProgress === undefined && !isValidType) {
            onComplete = type;
            onProgress = this.onProgress || null;
            type = null;
          }

          if (onProgress !== undefined && !isValidType) {
            onProgress = type;
            type = null;
          }
        }

        return {
          type: type,
          onProgress: onProgress,
          onComplete: onComplete
        };
      } // Load assets with uuids

    }, {
      key: "_loadResUuids",
      value: function _loadResUuids(uuids, progressCallback, completeCallback, urls) {
        if (uuids.length > 0) {
          var self = this;
          var res = uuids.map(function (uuid) {
            return {
              type: 'uuid',
              uuid: uuid
            };
          });
          this.load(res, progressCallback, function (errors, items) {
            if (completeCallback) {
              var assetRes = [];
              var urlRes = urls && [];

              for (var i = 0; i < res.length; ++i) {
                var uuid = res[i].uuid;

                var id = self._getReferenceKey(uuid);

                var item = items.getContent(id);

                if (item) {
                  // should not release these assets, even if they are static referenced in the scene.
                  self.setAutoReleaseRecursively(uuid, false);
                  assetRes.push(item);

                  if (urlRes) {
                    urlRes.push(urls[i]);
                  }
                }
              }

              if (urls) {
                completeCallback(errors, assetRes, urlRes);
              } else {
                completeCallback(errors, assetRes);
              }
            }
          });
        } else {
          if (completeCallback) {
            (0, _misc.callInNextTick)(function () {
              if (urls) {
                completeCallback(null, [], []);
              } else {
                completeCallback(null, []);
              }
            });
          }
        }
      }
    }]);

    return CCLoader;
  }(_pipeline.Pipeline);
  /**
   * Singleton object of CCLoader
   */


  _exports.CCLoader = CCLoader;
  var loader = _globalExports.legacyCC.loader = new CCLoader();
  _exports.loader = loader;

  if (_defaultConstants.EDITOR) {
    _globalExports.legacyCC.loader.refreshUrl = function (uuid, oldUrl, newUrl) {
      var item = this._cache[uuid];

      if (item) {
        item.url = newUrl;
      }

      item = this._cache[oldUrl];

      if (item) {
        item.id = newUrl;
        item.url = newUrl;
        this._cache[newUrl] = item;
        delete this._cache[oldUrl];
      }
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9DQ0xvYWRlci50cyJdLCJuYW1lcyI6WyJhc3NldFRhYmxlcyIsIk9iamVjdCIsImNyZWF0ZSIsImFzc2V0cyIsIkFzc2V0VGFibGUiLCJpbnRlcm5hbCIsImdldFhNTEh0dHBSZXF1ZXN0Iiwid2luZG93IiwiWE1MSHR0cFJlcXVlc3QiLCJBY3RpdmVYT2JqZWN0IiwiX2luZm8iLCJ1cmwiLCJyYXciLCJnZXRSZXNXaXRoVXJsIiwicmVzIiwiaWQiLCJyZXN1bHQiLCJpc1V1aWQiLCJ1dWlkIiwidHlwZSIsImxlZ2FjeUNDIiwiQXNzZXRMaWJyYXJ5IiwiX3V1aWRJblNldHRpbmdzIiwiX2dldEFzc2V0SW5mb0luUnVudGltZSIsImlzUmF3QXNzZXQiLCJfc2hhcmVkUmVzb3VyY2VzIiwiX3NoYXJlZExpc3QiLCJDQ0xvYWRlciIsImFzc2V0TG9hZGVyIiwiQXNzZXRMb2FkZXIiLCJkb3dubG9hZGVyIiwiRG93bmxvYWRlciIsImxvYWRlciIsIkxvYWRlciIsIm1kNVBpcGUiLCJvblByb2dyZXNzIiwiX2Fzc2V0VGFibGVzIiwiX2F1dG9SZWxlYXNlU2V0dGluZyIsIl9yZWxlYXNlZEFzc2V0Q2hlY2tlcl9ERUJVRyIsIkRFQlVHIiwiUmVsZWFzZWRBc3NldENoZWNrZXIiLCJkaXJlY3RvciIsInNlbGYiLCJvbiIsIkRpcmVjdG9yIiwiRVZFTlRfQUZURVJfVVBEQVRFIiwiY2hlY2tDb3VsZFJlbGVhc2UiLCJfY2FjaGUiLCJleHRNYXAiLCJhZGRIYW5kbGVycyIsInJlc291cmNlcyIsInByb2dyZXNzQ2FsbGJhY2siLCJjb21wbGV0ZUNhbGxiYWNrIiwiREVWIiwidW5kZWZpbmVkIiwic2luZ2xlUmVzIiwicmVzTGlzdCIsIkFycmF5IiwibGVuZ3RoIiwiaSIsInJlc291cmNlIiwiaXRlbSIsInB1c2giLCJxdWV1ZSIsIkxvYWRpbmdJdGVtcyIsImVycm9ycyIsIml0ZW1zIiwiY2FsbCIsImdldEVycm9yIiwiZ2V0Q29udGVudCIsImRlc3Ryb3kiLCJpbml0UXVldWVEZXBzIiwiYXBwZW5kIiwib3duZXIiLCJ1cmxMaXN0IiwiY2FsbGJhY2siLCJjb21wbGV0ZWRDb3VudCIsInRvdGFsQ291bnQiLCJfb3duZXJRdWV1ZSIsIl9jaGlsZE9uUHJvZ3Jlc3MiLCJkZXBzIiwib3duZXJRdWV1ZSIsImdldFF1ZXVlIiwiYWNjZXB0ZWQiLCJtb3VudCIsImFyZ3VtZW50cyIsImFyZ3MiLCJfcGFyc2VMb2FkUmVzQXJncyIsIm9uQ29tcGxldGUiLCJfZ2V0UmVzVXVpZCIsImxvYWQiLCJlcnIiLCJhc3NldCIsInNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHkiLCJfdXJsTm90Rm91bmQiLCJ1cmxzIiwidXVpZHMiLCJnZXRVdWlkQXJyYXkiLCJfbG9hZFJlc1V1aWRzIiwiYXNzZXRSZXMiLCJ1cmxSZXMiLCJhc3NldFJlc0xlbmd0aCIsIlNwcml0ZUF0bGFzIiwic3ByaXRlRnJhbWVzIiwiZ2V0U3ByaXRlRnJhbWVzIiwiayIsInNmIiwibmFtZSIsInJlZiIsIl9nZXRSZWZlcmVuY2VLZXkiLCJhbGlhcyIsImNvbXBsZXRlIiwiY29udGVudCIsImtleXMiLCJrZXkiLCJpc0FycmF5IiwicmVsZWFzZSIsImdldEl0ZW0iLCJyZW1vdmVkIiwicmVtb3ZlSXRlbSIsIkFzc2V0IiwibmF0aXZlVXJsIiwic2V0UmVsZWFzZWQiLCJfdXVpZCIsIlBpcGVsaW5lIiwicHJvdG90eXBlIiwiYXNzZXRPclVybE9yVXVpZCIsImF1dG9SZWxlYXNlIiwiZGVwZW5kcyIsImRlcGVuZCIsImFzc2V0T3JVcmwiLCJxdWlldCIsIkVESVRPUiIsImluZm8iLCJFZGl0b3JFeHRlbmRzIiwiZ2V0QXNzZXRJbmZvRnJvbVVybCIsImFzc2V0VGFibGUiLCJpbmRleCIsImluZGV4T2YiLCJzdWJzdHIiLCJnZXRVdWlkIiwiZXh0bmFtZSIsInBhdGgiLCJzbGljZSIsIlNwcml0ZUZyYW1lIiwiVGV4dHVyZTJEIiwiVGV4dHVyZUN1YmUiLCJub3JtYWxpemUiLCJFcnJvciIsImlzVmFsaWRUeXBlIiwiUmF3QXNzZXQiLCJtYXAiLCJyZWZyZXNoVXJsIiwib2xkVXJsIiwibmV3VXJsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0RBLE1BQU1BLFdBQVcsR0FBR0MsTUFBTSxDQUFDQyxNQUFQLENBQWMsSUFBZCxDQUFwQjtBQUNBRixFQUFBQSxXQUFXLENBQUNHLE1BQVosR0FBcUIsSUFBSUMsc0JBQUosRUFBckI7QUFDQUosRUFBQUEsV0FBVyxDQUFDSyxRQUFaLEdBQXVCLElBQUlELHNCQUFKLEVBQXZCOztBQUVBLFdBQVNFLGlCQUFULEdBQThCO0FBQzFCLFdBQU9DLE1BQU0sQ0FBQ0MsY0FBUCxHQUF3QixJQUFJRCxNQUFNLENBQUNDLGNBQVgsRUFBeEIsR0FBc0QsSUFBSUMsYUFBSixDQUFrQixnQkFBbEIsQ0FBN0Q7QUFDSDs7QUFFRCxNQUFNQyxLQUFLLEdBQUc7QUFBRUMsSUFBQUEsR0FBRyxFQUFFLElBQVA7QUFBYUMsSUFBQUEsR0FBRyxFQUFFO0FBQWxCLEdBQWQ7QUFFQTs7Ozs7Ozs7QUFPQSxXQUFTQyxhQUFULENBQXdCQyxHQUF4QixFQUE2QjtBQUN6QixRQUFJQyxFQUFKO0FBQ0EsUUFBSUMsTUFBSjtBQUNBLFFBQUlDLE1BQUo7O0FBQ0EsUUFBSSxRQUFPSCxHQUFQLE1BQWUsUUFBbkIsRUFBNkI7QUFDekJFLE1BQUFBLE1BQU0sR0FBR0YsR0FBVDs7QUFDQSxVQUFJQSxHQUFHLENBQUNILEdBQVIsRUFBYTtBQUNULGVBQU9LLE1BQVA7QUFDSCxPQUZELE1BR0s7QUFDREQsUUFBQUEsRUFBRSxHQUFHRCxHQUFHLENBQUNJLElBQVQ7QUFDSDtBQUNKLEtBUkQsTUFTSztBQUNERixNQUFBQSxNQUFNLEdBQUcsRUFBVDtBQUNBRCxNQUFBQSxFQUFFLEdBQUdELEdBQUw7QUFDSDs7QUFDREcsSUFBQUEsTUFBTSxHQUFH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QUFJMkMsSUFBSixFQUFVO0FBQ04zQyxnQkFBQUEsZ0JBQWdCLENBQUMsSUFBRCxFQUFPLEVBQVAsRUFBVyxFQUFYLENBQWhCO0FBQ0gsZUFGRCxNQUdLO0FBQ0RBLGdCQUFBQSxnQkFBZ0IsQ0FBQyxJQUFELEVBQU8sRUFBUCxDQUFoQjtBQUNIO0FBQ0osYUFQRDtBQVFIO0FBQ0o7QUFDSjs7OztJQW4rQnlCd0Usa0I7QUFzK0I5Qjs7Ozs7O0FBR08sTUFBTTVGLE1BQU0sR0FBR1osd0JBQVNZLE1BQVQsR0FBa0IsSUFBSUwsUUFBSixFQUFqQzs7O0FBRVAsTUFBSXlHLHdCQUFKLEVBQVk7QUFDUmhILDRCQUFTWSxNQUFULENBQWdCd0gsVUFBaEIsR0FBNkIsVUFBVXRJLElBQVYsRUFBZ0J1SSxNQUFoQixFQUF3QkMsTUFBeEIsRUFBZ0M7QUFDekQsVUFBSTdGLElBQUksR0FBRyxLQUFLZCxNQUFMLENBQVk3QixJQUFaLENBQVg7O0FBQ0EsVUFBSTJDLElBQUosRUFBVTtBQUNOQSxRQUFBQSxJQUFJLENBQUNsRCxHQUFMLEdBQVcrSSxNQUFYO0FBQ0g7O0FBRUQ3RixNQUFBQSxJQUFJLEdBQUcsS0FBS2QsTUFBTCxDQUFZMEcsTUFBWixDQUFQOztBQUNBLFVBQUk1RixJQUFKLEVBQVU7QUFDTkEsUUFBQUEsSUFBSSxDQUFDOUMsRUFBTCxHQUFVMkksTUFBVjtBQUNBN0YsUUFBQUEsSUFBSSxDQUFDbEQsR0FBTCxHQUFXK0ksTUFBWDtBQUNBLGFBQUszRyxNQUFMLENBQVkyRyxNQUFaLElBQXNCN0YsSUFBdEI7QUFDQSxlQUFPLEtBQUtkLE1BQUwsQ0FBWTBHLE1BQVosQ0FBUDtBQUNIO0FBQ0osS0FiRDtBQWNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgbG9hZGVyXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgU3ByaXRlQXRsYXMgfSBmcm9tICcuLi9hc3NldHMvc3ByaXRlLWF0bGFzJztcclxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuLi9hc3NldHMvYXNzZXQnO1xyXG5pbXBvcnQgeyBSYXdBc3NldCB9IGZyb20gJy4uL2Fzc2V0cy9yYXctYXNzZXQnXHJcbmltcG9ydCB7IFNwcml0ZUZyYW1lIH0gZnJvbSAnLi4vYXNzZXRzL3Nwcml0ZS1mcmFtZSc7XHJcbmltcG9ydCB7IFRleHR1cmUyRCB9IGZyb20gJy4uL2Fzc2V0cy90ZXh0dXJlLTJkJztcclxuaW1wb3J0IHsgVGV4dHVyZUN1YmUgfSBmcm9tICcuLi9hc3NldHMvdGV4dHVyZS1jdWJlJztcclxuaW1wb3J0IHsgY3JlYXRlTWFwLCBnZXRDbGFzc05hbWUsIGlzQ2hpbGRDbGFzc09mIH0gZnJvbSAnLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBjYWxsSW5OZXh0VGljayB9IGZyb20gJy4uL3V0aWxzL21pc2MnO1xyXG5pbXBvcnQgQXNzZXRMb2FkZXIgZnJvbSAnLi9hc3NldC1sb2FkZXInO1xyXG5pbXBvcnQgeyBBc3NldFRhYmxlIH0gZnJvbSAnLi9hc3NldC10YWJsZSc7XHJcbmltcG9ydCB7IGdldERlcGVuZHNSZWN1cnNpdmVseSB9IGZyb20gJy4vYXV0by1yZWxlYXNlLXV0aWxzJztcclxuaW1wb3J0IHsgTG9hZENvbXBsZXRlQ2FsbGJhY2ssIExvYWRQcm9ncmVzc0NhbGxiYWNrIH0gZnJvbSAnLi9jYWxsYmFjay1wYXJhbXMnO1xyXG5pbXBvcnQgRG93bmxvYWRlciBmcm9tICcuL2Rvd25sb2FkZXInO1xyXG5pbXBvcnQgTG9hZGVyIGZyb20gJy4vbG9hZGVyJztcclxuaW1wb3J0IHsgTG9hZGluZ0l0ZW1zIH0gZnJvbSAnLi9sb2FkaW5nLWl0ZW1zJztcclxuaW1wb3J0IHsgUGlwZWxpbmUgfSBmcm9tICcuL3BpcGVsaW5lJztcclxuaW1wb3J0IFJlbGVhc2VkQXNzZXRDaGVja2VyIGZyb20gJy4vcmVsZWFzZWQtYXNzZXQtY2hlY2tlcic7XHJcbmltcG9ydCB7IERFQlVHLCBFRElUT1IsIERFViB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyB3YXJuSUQsIGVycm9ySUQsIGVycm9yIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJy4uL3V0aWxzL3BhdGgnO1xyXG5cclxuY29uc3QgYXNzZXRUYWJsZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG5hc3NldFRhYmxlcy5hc3NldHMgPSBuZXcgQXNzZXRUYWJsZSgpO1xyXG5hc3NldFRhYmxlcy5pbnRlcm5hbCA9IG5ldyBBc3NldFRhYmxlKCk7XHJcblxyXG5mdW5jdGlvbiBnZXRYTUxIdHRwUmVxdWVzdCAoKSB7XHJcbiAgICByZXR1cm4gd2luZG93LlhNTEh0dHBSZXF1ZXN0ID8gbmV3IHdpbmRvdy5YTUxIdHRwUmVxdWVzdCgpIDogbmV3IEFjdGl2ZVhPYmplY3QoJ01TWE1MMi5YTUxIVFRQJyk7XHJcbn1cclxuXHJcbmNvbnN0IF9pbmZvID0geyB1cmw6IG51bGwsIHJhdzogZmFsc2UgfTtcclxuXHJcbi8qXHJcbiAqIEBlbiBDb252ZXJ0IGEgcmVzb3VyY2VzIGJ5IGZpbmRpbmcgaXRzIHJlYWwgdXJsIHdpdGggdXVpZCwgb3RoZXJ3aXNlIHdlIHdpbGwgdXNlIHRoZSB1dWlkIG9yIHJhdyB1cmwgYXMgaXRzIHVybDxicj5cclxuICogU28gd2UgZ3VyYW50ZWUgdGhlcmUgd2lsbCBiZSB1cmwgaW4gcmVzdWx0XHJcbiAqIEB6aCDpgJrov4fkvb/nlKggdXVpZCDmn6Xmib7otYTmupDnmoTnnJ/lrp4gdXJsIOadpei9rOaNoui1hOa6kO+8jOWQpuWImeWwhuS9v+eUqCB1dWlkIOaIluWOn+WniyB1cmwg5L2c5Li65YW2IHVybDxicj5cclxuICog5omA5Lul5Y+v5Lul5L+d6K+B57uT5p6c5Lit5Lya5pyJIHVybFxyXG4gKiBAcGFyYW0gcmVzXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRSZXNXaXRoVXJsIChyZXMpIHtcclxuICAgIGxldCBpZDtcclxuICAgIGxldCByZXN1bHQ7XHJcbiAgICBsZXQgaXNVdWlkO1xyXG4gICAgaWYgKHR5cGVvZiByZXMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcmVzO1xyXG4gICAgICAgIGlmIChyZXMudXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZCA9IHJlcy51dWlkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgIGlkID0gcmVzO1xyXG4gICAgfVxyXG4gICAgaXNVdWlkID0gcmVzdWx0LnR5cGUgPyByZXN1bHQudHlwZSA9PT0gJ3V1aWQnIDogbGVnYWN5Q0MuQXNzZXRMaWJyYXJ5Ll91dWlkSW5TZXR0aW5ncyhpZCk7XHJcbiAgICBsZWdhY3lDQy5Bc3NldExpYnJhcnkuX2dldEFzc2V0SW5mb0luUnVudGltZShpZCwgX2luZm8pO1xyXG4gICAgcmVzdWx0LnVybCA9ICFpc1V1aWQgPyBpZCA6IF9pbmZvLnVybDtcclxuICAgIGlmIChfaW5mby51cmwgJiYgcmVzdWx0LnR5cGUgPT09ICd1dWlkJyAmJiBfaW5mby5yYXcpIHtcclxuICAgICAgICByZXN1bHQudHlwZSA9IG51bGw7XHJcbiAgICAgICAgcmVzdWx0LmlzUmF3QXNzZXQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoIWlzVXVpZCkge1xyXG4gICAgICAgIHJlc3VsdC5pc1Jhd0Fzc2V0ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmNvbnN0IF9zaGFyZWRSZXNvdXJjZXM6IGFueSA9IFtdO1xyXG5jb25zdCBfc2hhcmVkTGlzdDogYW55ID0gW107XHJcblxyXG4vKipcclxuICogQGVuIExvYWRlciBmb3IgcmVzb3VyY2UgbG9hZGluZyBwcm9jZXNzLiBUaGUgZW5naW5lIGF1dG9tYXRpY2FsbHkgaW5pdGlhbGl6ZSBpdHMgc2luZ2xldG9uIG9iamVjdCB7e2xvYWRlcn19LlxyXG4gKiBAemgg6LWE5rqQ5Yqg6L29566h55CG5Zmo77yM5byV5pOO5Lya6Ieq5Yqo5Yib5bu65LiA5Liq5Y2V5L6L5a+56LGhIHt7bG9hZGVyfX3jgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDQ0xvYWRlciBleHRlbmRzIFBpcGVsaW5lIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXRzIGEgbmV3IFhNTEh0dHBSZXF1ZXN0IGluc3RhbmNlLlxyXG4gICAgICogQHpoIOiOt+WPluS4gOS4quaWsOeahCBYTUxIdHRwUmVxdWVzdCDnmoTlrp7kvovjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFhNTEh0dHBSZXF1ZXN0OiBGdW5jdGlvbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYXNzZXQgbG9hZGVyIGluIGxvYWRlcidzIHBpcGVsaW5lLCBpdCdzIGJ5IGRlZmF1bHQgdGhlIGZpcnN0IHBpcGUuPGJyPlxyXG4gICAgICogSXQncyB1c2VkIHRvIGlkZW50aWZ5IGFuIGFzc2V0J3MgdHlwZSwgYW5kIGRldGVybWluZSBob3cgdG8gZG93bmxvYWQgaXQuXHJcbiAgICAgKiBAemggbG9hZGVyIOS4reeahOi1hOa6kOWKoOi9veWZqO+8jOm7mOiupOaDheWGteS4i+aYr+acgOWFiOWKoOi9veeahOOAgjxicj5cclxuICAgICAqIOeUqOS6juagh+ivhui1hOa6kOeahOexu+Wei++8jOW5tuehruWumuWmguS9leWKoOi9veatpOi1hOa6kOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXNzZXRMb2FkZXI6IEFzc2V0TG9hZGVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBtZDUgcGlwZSBpbiBsb2FkZXIncyBwaXBlbGluZSwgaXQgY291bGQgYmUgYWJzZW50IGlmIHRoZSBwcm9qZWN0IGlzbid0IGJ1aWxkIHdpdGggbWQ1IG9wdGlvbi48YnI+XHJcbiAgICAgKiBJdCdzIHVzZWQgdG8gbW9kaWZ5IHRoZSB1cmwgdG8gdGhlIHJlYWwgZG93bmxvYWRhYmxlIHVybCB3aXRoIG1kNSBzdWZmaXguXHJcbiAgICAgKiBAemggbG9hZGVyIOS4reeahCBtZDUg5Yqg6L29566h6YGT77yM5aaC5p6c6aG555uu5rKh5pyJ5L2/55SoIG1kNSDmnoTlu7rvvIzliJnmraTpobnlj6/og73kuI3lrZjlnKjjgII8YnI+XHJcbiAgICAgKiDnlKjkuo7kv67mlLnluKbmnIkgbWQ1IOWQjue8gOeahOecn+WunuWPr+S4i+i9veeahCBVUkwg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtZDVQaXBlOiBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZG93bmxvYWRlciBpbiBsb2FkZXIncyBwaXBlbGluZSwgaXQncyBieSBkZWZhdWx0IHRoZSBzZWNvbmQgcGlwZS48YnI+XHJcbiAgICAgKiBJdCdzIHVzZWQgdG8gZG93bmxvYWQgZmlsZXMgd2l0aCBzZXZlcmFsIGhhbmRsZXJzOiBwdXJlIHRleHQsIGltYWdlLCBzY3JpcHQsIGF1ZGlvLCBmb250LCB1dWlkLjxicj5cclxuICAgICAqIFlvdSBjYW4gYWRkIHlvdXIgb3duIGRvd25sb2FkIGZ1bmN0aW9uIHdpdGggYWRkRG93bmxvYWRIYW5kbGVyc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiBsb2FkZXIg5Lit55qE6LWE5rqQ5LiL6L2956iL5bqP77yM6buY6K6k5oOF5Ya15LiL5piv56ys5LqM5Liq5Yqg6L2955qE44CCPGJyPlxyXG4gICAgICog5a6D55So5LqO5LiL6L295bim5pyJ5aSa5Liq5aSE55CG56iL5bqP55qE5paH5Lu277ya57qv5paH5pys77yM5Zu+5YOP77yM6ISa5pys77yM6Z+z6aKR77yM5a2X5L2T77yMdXVpZOOAgjxicj5cclxuICAgICAqIOaCqOWPr+S7peS9v+eUqCBhZGREb3dubG9hZEhhbmRsZXJzIOadpea3u+WKoOiHquW3seeahOS4i+i9veWHveaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZG93bmxvYWRlcjogRG93bmxvYWRlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGxvYWRlciBpbiBsb2FkZXIncyBwaXBlbGluZSwgaXQncyBieSBkZWZhdWx0IHRoZSB0aGlyZCBwaXBlLjxicj5cclxuICAgICAqIEl0J3MgdXNlZCB0byBwYXJzZSBkb3dubG9hZGVkIGNvbnRlbnQgd2l0aCBzZXZlcmFsIGhhbmRsZXJzOiBKU09OLCBpbWFnZSwgcGxpc3QsIGZudCwgdXVpZC48YnI+XHJcbiAgICAgKiBZb3UgY2FuIGFkZCB5b3VyIG93biBkb3dubG9hZCBmdW5jdGlvbiB3aXRoIGFkZExvYWRIYW5kbGVyc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiBsb2FkZXIg5Lit55qE6LWE5rqQ5LiL6L2956iL5bqP77yM6buY6K6k5oOF5Ya15LiL5piv56ys5LiJ5Liq5Yqg6L2955qE44CCPGJyPlxyXG4gICAgICog5a6D55So5LqO6Kej5p6Q5LiL6L2955qE5YaF5a655Y+K5aSa5Liq5aSE55CG56iL5bqP55qE5paH5Lu277ya57qv5paH5pys77yM5Zu+5YOP77yM6ISa5pys77yM6Z+z6aKR77yM5a2X5L2T77yMdXVpZOOAgjxicj5cclxuICAgICAqIOaCqOWPr+S7peS9v+eUqCBhZGRMb2FkSGFuZGxlcnMg5p2l5re75Yqg6Ieq5bex55qE5LiL6L295Ye95pWwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsb2FkZXI6IExvYWRlcjtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBkZWZhdWx0IHByb2dyZXNzaW9uIGNhbGxiYWNrIGR1cmluZyB0aGUgbG9hZGluZyBwcm9jZXNzLCBcclxuICAgICAqIGlmIG5vIHByb2dyZXNzaW9uIGNhbGxiYWNrIGlzIHBhc3NlZCB0byB7e2xvYWR9fSBmdW5jdGlvbiwgdGhlbiB0aGlzIGRlZmF1bHQgY2FsbGJhY2sgd2lsbCBiZSB1c2VkLlxyXG4gICAgICogQHpoIExvYWRlciDpu5jorqTnmoTov5vluqblm57osIPlh73mlbDvvIzlpoLmnpzlnKjosIPnlKgge3tsb2FkfX0g5Ye95pWw5pe25rKh5pyJ5oyH5a6a6L+b5bqm5Zue6LCD5Ye95pWw55qE6K+d77yM5Lya6LCD55So6buY6K6k6L+b5bqm5Zue6LCD5Ye95pWw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvblByb2dyZXNzOiBGdW5jdGlvbiB8IG51bGw7XHJcblxyXG4gICAgcHVibGljIF9hc3NldFRhYmxlczogYW55O1xyXG4gICAgcHJpdmF0ZSBfYXV0b1JlbGVhc2VTZXR0aW5nOiBhbnk7XHJcbiAgICBwcml2YXRlIF9yZWxlYXNlZEFzc2V0Q2hlY2tlcl9ERUJVRzogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBjb25zdCBhc3NldExvYWRlciA9IG5ldyBBc3NldExvYWRlcigpO1xyXG4gICAgICAgIGNvbnN0IGRvd25sb2FkZXIgPSBuZXcgRG93bmxvYWRlcigpO1xyXG4gICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tc2hhZG93ZWQtbGV0aWFibGVcclxuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgTG9hZGVyKCk7XHJcblxyXG4gICAgICAgIHN1cGVyKFtcclxuICAgICAgICAgICAgYXNzZXRMb2FkZXIsXHJcbiAgICAgICAgICAgIGRvd25sb2FkZXIsXHJcbiAgICAgICAgICAgIGxvYWRlcixcclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRYTUxIdHRwUmVxdWVzdCA9IGdldFhNTEh0dHBSZXF1ZXN0O1xyXG5cclxuICAgICAgICB0aGlzLmFzc2V0TG9hZGVyID0gYXNzZXRMb2FkZXI7XHJcbiAgICAgICAgdGhpcy5tZDVQaXBlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRvd25sb2FkZXIgPSBkb3dubG9hZGVyO1xyXG4gICAgICAgIHRoaXMubG9hZGVyID0gbG9hZGVyO1xyXG5cclxuICAgICAgICB0aGlzLm9uUHJvZ3Jlc3MgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLl9hc3NldFRhYmxlcyA9IGFzc2V0VGFibGVzO1xyXG4gICAgICAgIC8vIGFzc2V0cyB0byByZWxlYXNlIGF1dG9tYXRpY2FsbHlcclxuICAgICAgICB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmcgPSBjcmVhdGVNYXAodHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWxlYXNlZEFzc2V0Q2hlY2tlcl9ERUJVRyA9IG5ldyBSZWxlYXNlZEFzc2V0Q2hlY2tlcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbml0aWFsaXplIHdpdGggZGlyZWN0b3JcclxuICAgICAqIEB6aCDkvb/nlKgge3tkaXJlY3Rvcn19IOWIneWni+WMllxyXG4gICAgICogQHBhcmFtIGRpcmVjdG9yIFRoZSBkaXJlY3RvciBpbnN0YW5jZSBvZiBlbmdpbmVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXQgKGRpcmVjdG9yKSB7XHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBkaXJlY3Rvci5vbihsZWdhY3lDQy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYuX3JlbGVhc2VkQXNzZXRDaGVja2VyX0RFQlVHLmNoZWNrQ291bGRSZWxlYXNlKHNlbGYuX2NhY2hlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFkZCBjdXN0b20gc3VwcG9ydGVkIHR5cGVzIGhhbmRsZXIgb3IgbW9kaWZ5IGV4aXN0aW5nIHR5cGUgaGFuZGxlciBmb3IgZG93bmxvYWQgcHJvY2Vzcy5cclxuICAgICAqIEB6aCDkuLrkuIvovb3nqIvluo/mt7vliqDoh6rlrprkuYnmlK/mjIHnmoTnsbvlnovlpITnkIbnqIvluo/miJbkv67mlLnnjrDmnInnmoTnsbvlnovlpITnkIbnqIvluo/jgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIGxvYWRlci5hZGREb3dubG9hZEhhbmRsZXJzKHtcclxuICAgICAqICAgICAgLy8gVGhpcyB3aWxsIG1hdGNoIGFsbCB1cmwgd2l0aCBgLnNjZW5lYCBleHRlbnNpb24gb3IgYWxsIHVybCB3aXRoIGBzY2VuZWAgdHlwZVxyXG4gICAgICogICAgICAnc2NlbmUnIDogZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHt9XHJcbiAgICAgKiAgfSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqIEBwYXJhbSBleHRNYXAgSGFuZGxlcnMgZm9yIGNvcnJlc3BvbmRpbmcgdHlwZSBpbiBhIG1hcFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkRG93bmxvYWRIYW5kbGVycyAoZXh0TWFwOiBNYXA8c3RyaW5nLCBGdW5jdGlvbj4pIHtcclxuICAgICAgICB0aGlzLmRvd25sb2FkZXIuYWRkSGFuZGxlcnMoZXh0TWFwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBZGQgY3VzdG9tIHN1cHBvcnRlZCB0eXBlcyBoYW5kbGVyIG9yIG1vZGlmeSBleGlzdGluZyB0eXBlIGhhbmRsZXIgZm9yIGxvYWQgcHJvY2Vzcy5cclxuICAgICAqIEB6aCDkuLrliqDovb3nqIvluo/mt7vliqDoh6rlrprkuYnmlK/mjIHnmoTnsbvlnovlpITnkIbnqIvluo/miJbkv67mlLnnjrDmnInnmoTnsbvlnovlpITnkIbnqIvluo/jgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIGxvYWRlci5hZGRMb2FkSGFuZGxlcnMoe1xyXG4gICAgICogICAgICAvLyBUaGlzIHdpbGwgbWF0Y2ggYWxsIHVybCB3aXRoIGAuc2NlbmVgIGV4dGVuc2lvbiBvciBhbGwgdXJsIHdpdGggYHNjZW5lYCB0eXBlXHJcbiAgICAgKiAgICAgICdzY2VuZScgOiBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge31cclxuICAgICAqICB9KTtcclxuICAgICAqIGBgYFxyXG4gICAgICogQHBhcmFtIGV4dE1hcCBIYW5kbGVycyBmb3IgY29ycmVzcG9uZGluZyB0eXBlIGluIGEgbWFwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyAgYWRkTG9hZEhhbmRsZXJzIChleHRNYXA6IE1hcDxzdHJpbmcsIEZ1bmN0aW9uPikge1xyXG4gICAgICAgIHRoaXMubG9hZGVyLmFkZEhhbmRsZXJzKGV4dE1hcCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBMb2FkIHJlc291cmNlcyB3aXRoIGEgcHJvZ3Jlc3Npb24gY2FsbGJhY2sgYW5kIGEgY29tcGxldGUgY2FsbGJhY2suPGJyPlxyXG4gICAgICogVGhlIHByb2dyZXNzaW9uIGNhbGxiYWNrIGlzIHRoZSBzYW1lIGFzIFBpcGVsaW5lJ3MgW1tMb2FkaW5nSXRlbXMub25Qcm9ncmVzc11dIDxicj5cclxuICAgICAqIFRoZSBjb21wbGV0ZSBjYWxsYmFjayBpcyBhbG1vc3QgdGhlIHNhbWUgYXMgUGlwZWxpbmUncyBbW0xvYWRpbmdJdGVtcy5vbkNvbXBsZXRlXV0gPGJyPlxyXG4gICAgICogVGhlIG9ubHkgZGlmZmVyZW5jZSBpcyB3aGVuIHVzZXIgcGFzcyBhIHNpbmdsZSB1cmwgYXMgcmVzb3VyY2VzLCB0aGUgY29tcGxldGUgY2FsbGJhY2sgd2lsbCBzZXQgaXRzIHJlc3VsdCBkaXJlY3RseSBhcyB0aGUgc2Vjb25kIHBhcmFtZXRlci5cclxuICAgICAqIEB6aFxyXG4gICAgICog5L2/55So6L+b5bqm5Zue6LCD5ZKM5a6M5pW05Zue6LCD5Yqg6L296LWE5rqQ44CCPGJyPlxyXG7CoMKgwqDCoMKgKiDov5vluqblm57osIPkuI4gUGlwZWxpbmUg55qEIFtbTG9hZGluZ0l0ZW1zLm9uUHJvZ3Jlc3NdXSDnm7jlkIw8YnI+XHJcbsKgwqDCoMKgwqAqIOWujOaVtOeahOWbnuiwg+S4jiBQaXBlbGluZSDnmoQgW1tMb2FkaW5nSXRlbXMub25Db21wbGV0ZV1dIOWHoOS5juebuOWQjDxicj5cclxuwqDCoMKgwqDCoCog5ZSv5LiA55qE5Yy65Yir5piv5b2T55So5oi35bCG5Y2V5LiqIFVSTCDkvZzkuLrotYTmupDkvKDpgJLml7bvvIzlrozmlbTnmoTlm57osIPlsIblhbbnu5Pmnpznm7TmjqXorr7nva7kuLrnrKzkuozkuKrlj4LmlbDjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGBUeXBlU2NyaXB0XHJcbiAgICAgKiBpbXBvcnQgeyBsb2FkZXIsIGxvZywgVGV4dHVyZTJEIH0gZnJvbSAnY2MnO1xyXG4gICAgICogbG9hZGVyLmxvYWQoJ2EucG5nJywgZnVuY3Rpb24gKGVyciwgdGV4KSB7XHJcbiAgICAgKiAgICAgbG9nKCdSZXN1bHQgc2hvdWxkIGJlIGEgdGV4dHVyZTogJyArICh0ZXggaW5zdGFuY2VvZiBUZXh0dXJlMkQpKTtcclxuICAgICAqIH0pO1xyXG4gICAgICpcclxuICAgICAqIGxvYWRlci5sb2FkKCdodHRwOi8vZXhhbXBsZS5jb20vYS5wbmcnLCBmdW5jdGlvbiAoZXJyLCB0ZXgpIHtcclxuICAgICAqICAgICBsb2coJ1Nob3VsZCBsb2FkIGEgdGV4dHVyZSBmcm9tIGV4dGVybmFsIHVybDogJyArICh0ZXggaW5zdGFuY2VvZiBUZXh0dXJlMkQpKTtcclxuICAgICAqIH0pO1xyXG4gICAgICpcclxuICAgICAqIGxvYWRlci5sb2FkKHt1cmw6ICdodHRwOi8vZXhhbXBsZS5jb20vZ2V0SW1hZ2VSRVNUP2ZpbGU9YS5wbmcnLCB0eXBlOiAncG5nJ30sIGZ1bmN0aW9uIChlcnIsIHRleCkge1xyXG4gICAgICogICAgIGxvZygnU2hvdWxkIGxvYWQgYSB0ZXh0dXJlIGZyb20gUkVTVGZ1bCBBUEkgYnkgc3BlY2lmeSB0aGUgdHlwZTogJyArICh0ZXggaW5zdGFuY2VvZiBUZXh0dXJlMkQpKTtcclxuICAgICAqIH0pO1xyXG4gICAgICpcclxuICAgICAqIGxvYWRlci5sb2FkKFsnYS5wbmcnLCAnYi5qc29uJ10sIGZ1bmN0aW9uIChlcnJvcnMsIHJlc3VsdHMpIHtcclxuICAgICAqICAgICBpZiAoZXJyb3JzKSB7XHJcbiAgICAgKiAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgKiAgICAgICAgICAgICBsb2coJ0Vycm9yIHVybCBbJyArIGVycm9yc1tpXSArICddOiAnICsgcmVzdWx0cy5nZXRFcnJvcihlcnJvcnNbaV0pKTtcclxuICAgICAqICAgICAgICAgfVxyXG4gICAgICogICAgIH1cclxuICAgICAqICAgICBsZXQgYVRleCA9IHJlc3VsdHMuZ2V0Q29udGVudCgnYS5wbmcnKTtcclxuICAgICAqICAgICBsZXQgYkpzb25PYmogPSByZXN1bHRzLmdldENvbnRlbnQoJ2IuanNvbicpO1xyXG4gICAgICogfSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqIEBwYXJhbSByZXNvdXJjZXMgLSBVcmwgbGlzdCBvciBsb2FkIHJlcXVlc3QgbGlzdFxyXG4gICAgICogQHBhcmFtIHByb2dyZXNzQ2FsbGJhY2sgLSBQcm9ncmVzc2lvbiBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2suY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2sudG90YWxDb3VudCAtIFRoZSB0b3RhbCBudW1iZXIgb2YgdGhlIGl0ZW1zXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gcHJvZ3Jlc3NDYWxsYmFjay5pdGVtIC0gVGhlIGxhdGVzdCBpdGVtIHdoaWNoIGZsb3cgb3V0IHRoZSBwaXBlbGluZVxyXG4gICAgICogQHBhcmFtIGNvbXBsZXRlQ2FsbGJhY2sgLSBDb21wbGV0aW9uIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsb2FkIChyZXNvdXJjZXM6IHN0cmluZ3xzdHJpbmdbXXxPYmplY3QsIHByb2dyZXNzQ2FsbGJhY2s/OiBGdW5jdGlvbnxudWxsLCBjb21wbGV0ZUNhbGxiYWNrPzogRnVuY3Rpb258bnVsbCkge1xyXG4gICAgICAgIGlmIChERVYgJiYgIXJlc291cmNlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gZXJyb3IoJ1tsb2FkZXIubG9hZF0gcmVzb3VyY2VzIG11c3QgYmUgbm9uLW5pbC4nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjb21wbGV0ZUNhbGxiYWNrID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IHByb2dyZXNzQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgPSB0aGlzLm9uUHJvZ3Jlc3MgfHwgbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIGxldCBzaW5nbGVSZXM6IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBsZXQgcmVzTGlzdDogQXJyYXk8c3RyaW5nfE9iamVjdD47XHJcbiAgICAgICAgbGV0IHJlcztcclxuICAgICAgICBpZiAocmVzb3VyY2VzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgcmVzTGlzdCA9IHJlc291cmNlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNvdXJjZXMpIHtcclxuICAgICAgICAgICAgICAgIHNpbmdsZVJlcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXNMaXN0ID0gW3Jlc291cmNlc107XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXNMaXN0ID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9zaGFyZWRSZXNvdXJjZXMubGVuZ3RoID0gMDtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc0xpc3QubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVzb3VyY2U6IGFueSA9IHJlc0xpc3RbaV07XHJcbiAgICAgICAgICAgIC8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHlcclxuICAgICAgICAgICAgaWYgKHJlc291cmNlICYmIHJlc291cmNlLmlkKSB7XHJcbiAgICAgICAgICAgICAgICB3YXJuSUQoNDkyMCwgcmVzb3VyY2UuaWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXNvdXJjZS51dWlkICYmICFyZXNvdXJjZS51cmwpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvdXJjZS51cmwgPSByZXNvdXJjZS5pZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXMgPSBnZXRSZXNXaXRoVXJsKHJlc291cmNlKTtcclxuICAgICAgICAgICAgaWYgKCFyZXMudXJsICYmICFyZXMudXVpZCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMuX2NhY2hlW3Jlcy51cmxdO1xyXG4gICAgICAgICAgICBfc2hhcmVkUmVzb3VyY2VzLnB1c2goaXRlbSB8fCByZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgcXVldWUgPSBMb2FkaW5nSXRlbXMuY3JlYXRlKHRoaXMsIHByb2dyZXNzQ2FsbGJhY2ssIChlcnJvcnMsIGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxJbk5leHRUaWNrKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNpbmdsZVJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHJlcy51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2suY2FsbChzZWxmLCBpdGVtcy5nZXRFcnJvcihpZCksIGl0ZW1zLmdldENvbnRlbnQoaWQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2suY2FsbChzZWxmLCBlcnJvcnMsIGl0ZW1zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBMb2FkaW5nSXRlbXMuaW5pdFF1ZXVlRGVwcyhxdWV1ZSk7XHJcbiAgICAgICAgcXVldWUuYXBwZW5kKF9zaGFyZWRSZXNvdXJjZXMpO1xyXG4gICAgICAgIF9zaGFyZWRSZXNvdXJjZXMubGVuZ3RoID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZWU6IHt7UGlwZWxpbmUuZmxvd0luRGVwc319XHJcbiAgICAgKiBAemgg5Y+C6ICD77yae3tQaXBlbGluZS5mbG93SW5EZXBzfX1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGZsb3dJbkRlcHMgKG93bmVyLCB1cmxMaXN0LCBjYWxsYmFjaykge1xyXG4gICAgICAgIF9zaGFyZWRMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBwcmVmZXItZm9yLW9mXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1cmxMaXN0Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcyA9IGdldFJlc1dpdGhVcmwodXJsTGlzdFtpXSk7XHJcbiAgICAgICAgICAgIGlmICghcmVzLnVybCAmJiAhcmVzLnV1aWQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9jYWNoZVtyZXMudXJsXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIF9zaGFyZWRMaXN0LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBfc2hhcmVkTGlzdC5wdXNoKHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGNvbnN0IHF1ZXVlID0gTG9hZGluZ0l0ZW1zLmNyZWF0ZSh0aGlzLCBvd25lciA/IChjb21wbGV0ZWRDb3VudCwgdG90YWxDb3VudCwgaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGlmIChxdWV1ZS5fb3duZXJRdWV1ZSAmJiBxdWV1ZS5fb3duZXJRdWV1ZS5vblByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBxdWV1ZS5fb3duZXJRdWV1ZS5fY2hpbGRPblByb2dyZXNzKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSA6IG51bGwsIChlcnJvcnMsIGl0ZW1zKSA9PiB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycm9ycywgaXRlbXMpO1xyXG4gICAgICAgICAgICAvLyBDbGVhciBkZXBzIGJlY2F1c2UgaXQncyBhbHJlYWR5IGRvbmVcclxuICAgICAgICAgICAgLy8gRWFjaCBpdGVtIHdpbGwgb25seSBmbG93SW5EZXBzIG9uY2UsIHNvIGl0J3Mgc3RpbGwgc2FmZSBoZXJlXHJcbiAgICAgICAgICAgIGlmIChvd25lciAmJiBvd25lci5kZXBzKSB7XHJcbiAgICAgICAgICAgICAgICBvd25lci5kZXBzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbXMuZGVzdHJveSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChvd25lcikge1xyXG4gICAgICAgICAgICBjb25zdCBvd25lclF1ZXVlID0gTG9hZGluZ0l0ZW1zLmdldFF1ZXVlKG93bmVyKTtcclxuICAgICAgICAgICAgLy8gU2V0IHRoZSByb290IG93bmVyUXVldWUsIGlmIG5vIG93bmVyUXVldWUgZGVmaW5lZCBpbiBvd25lclF1ZXVlLCBpdCdzIHRoZSByb290XHJcbiAgICAgICAgICAgIHF1ZXVlLl9vd25lclF1ZXVlID0gKG93bmVyUXVldWUgJiYgb3duZXJRdWV1ZS5fb3duZXJRdWV1ZSkgfHwgb3duZXJRdWV1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYWNjZXB0ZWQgPSBxdWV1ZS5hcHBlbmQoX3NoYXJlZExpc3QsIG93bmVyKTtcclxuICAgICAgICBfc2hhcmVkTGlzdC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHJldHVybiBhY2NlcHRlZDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgbG9hZFJlczxUPiAoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgdHlwZTogQ29uc3RydWN0b3I8VD4sXHJcbiAgICAgICAgbW91bnQ6IHN0cmluZyxcclxuICAgICAgICBwcm9ncmVzc0NhbGxiYWNrOiBMb2FkUHJvZ3Jlc3NDYWxsYmFjayxcclxuICAgICAgICBjb21wbGV0ZUNhbGxiYWNrOiBMb2FkQ29tcGxldGVDYWxsYmFjazxUPixcclxuICAgICk7XHJcblxyXG4gICAgcHVibGljIGxvYWRSZXM8VD4gKFxyXG4gICAgICAgIHVybDogc3RyaW5nLFxyXG4gICAgICAgIHR5cGU6IENvbnN0cnVjdG9yPFQ+LFxyXG4gICAgICAgIHByb2dyZXNzQ2FsbGJhY2s6IExvYWRQcm9ncmVzc0NhbGxiYWNrLFxyXG4gICAgICAgIGNvbXBsZXRlQ2FsbGJhY2s6IExvYWRDb21wbGV0ZUNhbGxiYWNrPFQ+LFxyXG4gICAgKTtcclxuXHJcbiAgICBwdWJsaWMgbG9hZFJlczxUPiAoXHJcbiAgICAgICAgdXJsOiBzdHJpbmcsXHJcbiAgICAgICAgdHlwZTogQ29uc3RydWN0b3I8VD4sXHJcbiAgICAgICAgY29tcGxldGVDYWxsYmFjazogTG9hZENvbXBsZXRlQ2FsbGJhY2s8VD4sXHJcbiAgICApO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBMb2FkIGFzc2V0cyBmcm9tIHRoZSBcInJlc291cmNlc1wiIGZvbGRlciBpbnNpZGUgdGhlIFwiYXNzZXRzXCIgZm9sZGVyIG9mIHlvdXIgcHJvamVjdC48YnI+XHJcbiAgICAgKiA8YnI+XHJcbiAgICAgKiBOb3RlOiBBbGwgYXNzZXQgVVJMcyBpbiBDcmVhdG9yIHVzZSBmb3J3YXJkIHNsYXNoZXMsIFVSTHMgdXNpbmcgYmFja3NsYXNoZXMgd2lsbCBub3Qgd29yay5cclxuICAgICAqIEB6aFxyXG4gICAgICog5LuO6aG555uu55qEIOKAnGFzc2V0c+KAnSDmlofku7blpLnkuIvnmoQg4oCccmVzb3VyY2Vz4oCdIOaWh+S7tuWkueS4reWKoOi9vei1hOa6kDxicj5cclxuICAgICAqIDxicj5cclxuICAgICAqIOazqOaEj++8mkNyZWF0b3Ig5Lit55qE5omA5pyJ6LWE5rqQIFVSTCDpg73kvb/nlKjmraPmlpzmnaDvvIzkvb/nlKjlj43mlpzmnaDnmoQgVVJMIOWwhuS4jei1t+S9nOeUqOOAglxyXG4gICAgICogQHBhcmFtIHVybCAtIFRoZSB1cmwgb2YgdGhlIGFzc2V0IHRvIGJlIGxvYWRlZCwgdGhpcyB1cmwgc2hvdWxkIGJlIHJlbGF0ZWQgcGF0aCB3aXRob3V0IGZpbGUgZXh0ZW5zaW9uIHRvIHRoZSBgcmVzb3VyY2VzYCBmb2xkZXIuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSAtIElmIHR5cGUgaXMgcHJvdmlkZWQsIG9ubHkgYXNzZXQgZm9yIGNvcnJlc3BvbmQgdHlwZSB3aWxsIGJlIGxvYWRlZFxyXG4gICAgICogQHBhcmFtIHByb2dyZXNzQ2FsbGJhY2sgLSBQcm9ncmVzc2lvbiBjYWxsYmFja1xyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2suY29tcGxldGVkQ291bnQgLSBUaGUgbnVtYmVyIG9mIHRoZSBpdGVtcyB0aGF0IGFyZSBhbHJlYWR5IGNvbXBsZXRlZC5cclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBwcm9ncmVzc0NhbGxiYWNrLnRvdGFsQ291bnQgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBwcm9ncmVzc0NhbGxiYWNrLml0ZW0gLSBUaGUgbGF0ZXN0IGl0ZW0gd2hpY2ggZmxvdyBvdXQgdGhlIHBpcGVsaW5lLlxyXG4gICAgICogQHBhcmFtIGNvbXBsZXRlQ2FsbGJhY2sgLSBDb21wbGV0aW9uIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0ge0Vycm9yfSBjb21wbGV0ZUNhbGxiYWNrLmVycm9yIC0gVGhlIGVycm9yIGluZm8gb3IgbnVsbCBpZiBsb2FkZWQgc3VjY2Vzc2Z1bGx5LlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGNvbXBsZXRlQ2FsbGJhY2sucmVzb3VyY2UgLSBUaGUgbG9hZGVkIHJlc291cmNlIGlmIGl0IGNhbiBiZSBmb3VuZCBvdGhlcndpc2UgcmV0dXJucyBudWxsLlxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgbG9hZGVyLCBlcnJvciwgbG9nLCBQcmVmYWIsIFNwcml0ZUZyYW1lIH0gZnJvbSAnY2MnO1xyXG4gICAgICogLy8gbG9hZCB0aGUgcHJlZmFiIChwcm9qZWN0L2Fzc2V0cy9yZXNvdXJjZXMvbWlzYy9jaGFyYWN0ZXIvY29jb3MpIGZyb20gcmVzb3VyY2VzIGZvbGRlclxyXG4gICAgICogbG9hZGVyLmxvYWRSZXMoJ21pc2MvY2hhcmFjdGVyL2NvY29zJywgZnVuY3Rpb24gKGVyciwgcHJlZmFiKSB7XHJcbiAgICAgKiAgICAgaWYgKGVycikge1xyXG4gICAgICogICAgICAgICBlcnJvcihlcnIubWVzc2FnZSB8fCBlcnIpO1xyXG4gICAgICogICAgICAgICByZXR1cm47XHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogICAgIGxvZygnUmVzdWx0IHNob3VsZCBiZSBhIHByZWZhYjogJyArIChwcmVmYWIgaW5zdGFuY2VvZiBQcmVmYWIpKTtcclxuICAgICAqIH0pO1xyXG4gICAgICpcclxuICAgICAqIC8vIGxvYWQgdGhlIHNwcml0ZSBmcmFtZSBvZiAocHJvamVjdC9hc3NldHMvcmVzb3VyY2VzL2ltZ3MvY29jb3MucG5nKSBmcm9tIHJlc291cmNlcyBmb2xkZXJcclxuICAgICAqIGxvYWRlci5sb2FkUmVzKCdpbWdzL2NvY29zJywgU3ByaXRlRnJhbWUsIGZ1bmN0aW9uIChlcnIsIHNwcml0ZUZyYW1lKSB7XHJcbiAgICAgKiAgICAgaWYgKGVycikge1xyXG4gICAgICogICAgICAgICBlcnJvcihlcnIubWVzc2FnZSB8fCBlcnIpO1xyXG4gICAgICogICAgICAgICByZXR1cm47XHJcbiAgICAgKiAgICAgfVxyXG4gICAgICogICAgIGxvZygnUmVzdWx0IHNob3VsZCBiZSBhIHNwcml0ZSBmcmFtZTogJyArIChzcHJpdGVGcmFtZSBpbnN0YW5jZW9mIFNwcml0ZUZyYW1lKSk7XHJcbiAgICAgKiB9KTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbG9hZFJlcyAodXJsOiBzdHJpbmcsIHR5cGU6IEZ1bmN0aW9uLCBtb3VudDogc3RyaW5nIHwgRnVuY3Rpb24sIHByb2dyZXNzQ2FsbGJhY2s/OiBGdW5jdGlvbiwgY29tcGxldGVDYWxsYmFjaz86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDUpIHtcclxuICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IHByb2dyZXNzQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgPSBtb3VudCBhcyBGdW5jdGlvbjtcclxuICAgICAgICAgICAgbW91bnQgPSAnYXNzZXRzJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYXJncyA9IHRoaXMuX3BhcnNlTG9hZFJlc0FyZ3ModHlwZSwgcHJvZ3Jlc3NDYWxsYmFjaywgY29tcGxldGVDYWxsYmFjayk7XHJcbiAgICAgICAgdHlwZSA9IGFyZ3MudHlwZTtcclxuICAgICAgICBwcm9ncmVzc0NhbGxiYWNrID0gYXJncy5vblByb2dyZXNzO1xyXG4gICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sgPSBhcmdzLm9uQ29tcGxldGU7XHJcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgY29uc3QgdXVpZCA9IHNlbGYuX2dldFJlc1V1aWQodXJsLCB0eXBlLCBtb3VudCwgdHJ1ZSk7XHJcbiAgICAgICAgaWYgKHV1aWQpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd1dWlkJyxcclxuICAgICAgICAgICAgICAgICAgICB1dWlkLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAoZXJyLCBhc3NldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgbm90IHJlbGVhc2UgdGhlc2UgYXNzZXRzLCBldmVuIGlmIHRoZXkgYXJlIHN0YXRpYyByZWZlcmVuY2VkIGluIHRoZSBzY2VuZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5KHV1aWQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBsZXRlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayhlcnIsIGFzc2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHNlbGYuX3VybE5vdEZvdW5kKHVybCwgdHlwZSwgY29tcGxldGVDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBMb2FkIGFsbCBhc3NldHMgaW4gYSBmb2xkZXIgaW5zaWRlIHRoZSBcImFzc2V0cy9yZXNvdXJjZXNcIiBmb2xkZXIgb2YgeW91ciBwcm9qZWN0Ljxicj5cclxuICAgICAqIDxicj5cclxuICAgICAqIE5vdGU6IEFsbCBhc3NldCBVUkxzIGluIENyZWF0b3IgdXNlIGZvcndhcmQgc2xhc2hlcywgVVJMcyB1c2luZyBiYWNrc2xhc2hlcyB3aWxsIG5vdCB3b3JrLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbmiYDmnInotYTkuqfliqDovb3liLDpobnnm64g4oCcYXNzZXRzIC8gcmVzb3VyY2Vz4oCdIOaWh+S7tuWkueS4rVxyXG7CoMKgwqDCoMKgKiA8YnI+XHJcbiAgICAgKiDms6jmhI/vvJpDcmVhdG9yIOS4reeahOaJgOaciei1hOa6kCBVUkwg6YO95L2/55So5q2j5pac5p2g77yM5L2/55So5Y+N5pac5p2g55qEIFVSTCDlsIbkuI3otbfkvZznlKjjgIJcclxuICAgICAqIEBwYXJhbSB1cmwgVGhlIHVybCBvZiB0aGUgZGlyZWN0b3J5IHRvIGJlIGxvYWRlZCwgdGhpcyB1cmwgc2hvdWxkIGJlIHJlbGF0ZWQgcGF0aCB0byB0aGUgYHJlc291cmNlc2AgZm9sZGVyLlxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBJZiB0eXBlIGlzIHByb3ZpZGVkLCBvbmx5IGFzc2V0cyBmb3IgY29ycmVzcG9uZCB0eXBlIHdpbGwgYmUgbG9hZGVkXHJcbiAgICAgKiBAcGFyYW0gcHJvZ3Jlc3NDYWxsYmFjayAtIFByb2dyZXNzaW9uIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3NDYWxsYmFjay5jb21wbGV0ZWRDb3VudCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkLlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2sudG90YWxDb3VudCAtIFRoZSB0b3RhbCBudW1iZXIgb2YgdGhlIGl0ZW1zLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb2dyZXNzQ2FsbGJhY2suaXRlbSAtIFRoZSBsYXRlc3QgaXRlbSB3aGljaCBmbG93IG91dCB0aGUgcGlwZWxpbmUuXHJcbiAgICAgKiBAcGFyYW0gY29tcGxldGVDYWxsYmFjayAtIENvbXBsZXRpb24gY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGNvbXBsZXRlQ2FsbGJhY2suZXJyb3IgLSBJZiBvbmUgb2YgdGhlIGFzc2V0IGZhaWxlZCwgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIGlzIGltbWVkaWF0ZWx5IGNhbGxlZFxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGVycm9yLiBJZiBhbGwgYXNzZXRzIGFyZSBsb2FkZWQgc3VjY2Vzc2Z1bGx5LCBlcnJvciB3aWxsIGJlIG51bGwuXHJcbiAgICAgKiBAcGFyYW0ge0Fzc2V0W118QXJyYXl9IGNvbXBsZXRlQ2FsbGJhY2suYXNzZXRzIC0gQW4gYXJyYXkgb2YgYWxsIGxvYWRlZCBhc3NldHMuXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIG5vdGhpbmcgdG8gbG9hZCwgYXNzZXRzIHdpbGwgYmUgYW4gZW1wdHkgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBjb21wbGV0ZUNhbGxiYWNrLnVybHMgLSBBbiBhcnJheSB0aGF0IGxpc3RzIGFsbCB0aGUgVVJMcyBvZiBsb2FkZWQgYXNzZXRzLlxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgbG9hZGVyLCBlcnJvciwgVGV4dHVyZTJEIH0gZnJvbSAnY2MnO1xyXG4gICAgICogLy8gbG9hZCB0aGUgdGV4dHVyZSAocmVzb3VyY2VzL2ltZ3MvY29jb3MucG5nKSBhbmQgdGhlIGNvcnJlc3BvbmRpbmcgc3ByaXRlIGZyYW1lXHJcbiAgICAgKiBsb2FkZXIubG9hZFJlc0RpcignaW1ncy9jb2NvcycsIGZ1bmN0aW9uIChlcnIsIGFzc2V0cykge1xyXG4gICAgICogICAgIGlmIChlcnIpIHtcclxuICAgICAqICAgICAgICAgZXJyb3IoZXJyKTtcclxuICAgICAqICAgICAgICAgcmV0dXJuO1xyXG4gICAgICogICAgIH1cclxuICAgICAqICAgICBsZXQgdGV4dHVyZSA9IGFzc2V0c1swXTtcclxuICAgICAqICAgICBsZXQgc3ByaXRlRnJhbWUgPSBhc3NldHNbMV07XHJcbiAgICAgKiB9KTtcclxuICAgICAqXHJcbiAgICAgKiAvLyBsb2FkIGFsbCB0ZXh0dXJlcyBpbiBcInJlc291cmNlcy9pbWdzL1wiXHJcbiAgICAgKiBsb2FkZXIubG9hZFJlc0RpcignaW1ncycsIFRleHR1cmUyRCwgZnVuY3Rpb24gKGVyciwgdGV4dHVyZXMpIHtcclxuICAgICAqICAgICBsZXQgdGV4dHVyZTEgPSB0ZXh0dXJlc1swXTtcclxuICAgICAqICAgICBsZXQgdGV4dHVyZTIgPSB0ZXh0dXJlc1sxXTtcclxuICAgICAqIH0pO1xyXG4gICAgICpcclxuICAgICAqIC8vIGxvYWQgYWxsIEpTT05zIGluIFwicmVzb3VyY2VzL2RhdGEvXCJcclxuICAgICAqIGxvYWRlci5sb2FkUmVzRGlyKCdkYXRhJywgZnVuY3Rpb24gKGVyciwgb2JqZWN0cywgdXJscykge1xyXG4gICAgICogICAgIGxldCBkYXRhID0gb2JqZWN0c1swXTtcclxuICAgICAqICAgICBsZXQgdXJsID0gdXJsc1swXTtcclxuICAgICAqIH0pO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBsb2FkUmVzRGlyICh1cmw6IHN0cmluZywgdHlwZT86IEZ1bmN0aW9uLCBtb3VudD8sIHByb2dyZXNzQ2FsbGJhY2s/OiBGdW5jdGlvbiwgY29tcGxldGVDYWxsYmFjaz86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDUpIHtcclxuICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IHByb2dyZXNzQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgPSBtb3VudDtcclxuICAgICAgICAgICAgbW91bnQgPSAnYXNzZXRzJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghYXNzZXRUYWJsZXNbbW91bnRdKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICBjb25zdCBhcmdzID0gdGhpcy5fcGFyc2VMb2FkUmVzQXJncyh0eXBlLCBwcm9ncmVzc0NhbGxiYWNrLCBjb21wbGV0ZUNhbGxiYWNrKTtcclxuICAgICAgICB0eXBlID0gYXJncy50eXBlO1xyXG4gICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgPSBhcmdzLm9uUHJvZ3Jlc3M7XHJcbiAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IGFyZ3Mub25Db21wbGV0ZTtcclxuXHJcbiAgICAgICAgY29uc3QgdXJscyA9IFtdO1xyXG4gICAgICAgIGNvbnN0IHV1aWRzID0gYXNzZXRUYWJsZXNbbW91bnRdLmdldFV1aWRBcnJheSh1cmwsIHR5cGUsIHVybHMpO1xyXG4gICAgICAgIHRoaXMuX2xvYWRSZXNVdWlkcyh1dWlkcywgcHJvZ3Jlc3NDYWxsYmFjaywgKGVycm9ycywgYXNzZXRSZXMsIHVybFJlcykgPT4ge1xyXG4gICAgICAgICAgICAvLyBUaGUgc3ByaXRlRnJhbWUgdXJsIGluIHNwcml0ZUF0bGFzIHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBidWlsZCBwcm9qZWN0XHJcbiAgICAgICAgICAgIC8vIFRvIHNob3cgdXNlcnMgdGhlIGV4YWN0IHN0cnVjdHVyZSBpbiBhc3NldCBwYW5lbCwgd2UgbmVlZCB0byByZXR1cm4gdGhlIHNwcml0ZUZyYW1lIGFzc2V0cyBpbiBzcHJpdGVBdGxhc1xyXG4gICAgICAgICAgICBjb25zdCBhc3NldFJlc0xlbmd0aCA9IGFzc2V0UmVzLmxlbmd0aDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhc3NldFJlc0xlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzZXRSZXNbaV0gaW5zdGFuY2VvZiBTcHJpdGVBdGxhcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwcml0ZUZyYW1lcyA9IGFzc2V0UmVzW2ldLmdldFNwcml0ZUZyYW1lcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlOiBmb3JpblxyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgayBpbiBzcHJpdGVGcmFtZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2YgPSBzcHJpdGVGcmFtZXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFzc2V0UmVzLnB1c2goc2YpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXJsUmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmxSZXMucHVzaChgJHt1cmxSZXNbaV19LyR7c2YubmFtZX1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY29tcGxldGVDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayhlcnJvcnMsIGFzc2V0UmVzLCB1cmxSZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdXJscyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhpcyBtZXRob2QgaXMgbGlrZSBbW2xvYWRSZXNdXSBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGFycmF5IG9mIHVybC5cclxuICAgICAqIEB6aCDmraTmlrnms5XpmaTkuobmjqXlj5cgVVJMIOaVsOe7hOWPguaVsOWklu+8jOS4jiBbW2xvYWRSZXNdXSDmlrnms5Xnm7jlkIzjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSB1cmwgYXJyYXkgb2YgYXNzZXRzIHRvIGJlIGxvYWRlZCwgdGhpcyB1cmwgc2hvdWxkIGJlIHJlbGF0ZWQgcGF0aCB3aXRob3V0IGV4dGVuc2lvbiB0byB0aGUgYHJlc291cmNlc2AgZm9sZGVyLlxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBJZiB0eXBlIGlzIHByb3ZpZGVkLCBvbmx5IGFzc2V0cyBmb3IgY29ycmVzcG9uZCB0eXBlIHdpbGwgYmUgbG9hZGVkXHJcbiAgICAgKiBAcGFyYW0gcHJvZ3Jlc3NDYWxsYmFjayAtIFByb2dyZXNzaW9uIGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gcHJvZ3Jlc3NDYWxsYmFjay5jb21wbGV0ZWRDb3VudCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkLlxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IHByb2dyZXNzQ2FsbGJhY2sudG90YWxDb3VudCAtIFRoZSB0b3RhbCBudW1iZXIgb2YgdGhlIGl0ZW1zLlxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHByb2dyZXNzQ2FsbGJhY2suaXRlbSAtIFRoZSBsYXRlc3QgaXRlbSB3aGljaCBmbG93IG91dCB0aGUgcGlwZWxpbmUuXHJcbiAgICAgKiBAcGFyYW0gY29tcGxldGVDYWxsYmFjayAtIENvbXBsZXRpb24gY2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7RXJyb3J9IGNvbXBsZXRlQ2FsbGJhY2suZXJyb3IgLSBJZiBvbmUgb2YgdGhlIGFzc2V0IGZhaWxlZCwgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIGlzIGltbWVkaWF0ZWx5IGNhbGxlZFxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGggdGhlIGVycm9yLiBJZiBhbGwgYXNzZXRzIGFyZSBsb2FkZWQgc3VjY2Vzc2Z1bGx5LCBlcnJvciB3aWxsIGJlIG51bGwuXHJcbiAgICAgKiBAcGFyYW0ge0Fzc2V0W118QXJyYXl9IGNvbXBsZXRlQ2FsbGJhY2suYXNzZXRzIC0gQW4gYXJyYXkgb2YgYWxsIGxvYWRlZCBhc3NldHMuXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSWYgbm90aGluZyB0byBsb2FkLCBhc3NldHMgd2lsbCBiZSBhbiBlbXB0eSBhcnJheS5cclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgbG9hZGVyLCBlcnJvciwgU3ByaXRlRnJhbWUgfSBmcm9tICdjYyc7XHJcbiAgICAgKiAvLyBsb2FkIHRoZSBTcHJpdGVGcmFtZXMgZnJvbSByZXNvdXJjZXMgZm9sZGVyXHJcbiAgICAgKiBsZXQgc3ByaXRlRnJhbWVzO1xyXG4gICAgICogbGV0IHVybHMgPSBbJ21pc2MvY2hhcmFjdGVycy9jaGFyYWN0ZXJfMDEnLCAnbWlzYy93ZWFwb25zL3dlYXBvbnNfMDEnXTtcclxuICAgICAqIGxvYWRlci5sb2FkUmVzQXJyYXkodXJscywgU3ByaXRlRnJhbWUsIGZ1bmN0aW9uIChlcnIsIGFzc2V0cykge1xyXG4gICAgICogICAgIGlmIChlcnIpIHtcclxuICAgICAqICAgICAgICAgZXJyb3IoZXJyKTtcclxuICAgICAqICAgICAgICAgcmV0dXJuO1xyXG4gICAgICogICAgIH1cclxuICAgICAqICAgICBzcHJpdGVGcmFtZXMgPSBhc3NldHM7XHJcbiAgICAgKiAgICAgLy8gLi4uXHJcbiAgICAgKiB9KTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbG9hZFJlc0FycmF5ICh1cmxzOiBzdHJpbmdbXSwgdHlwZT86IEZ1bmN0aW9uLCBtb3VudD8sIHByb2dyZXNzQ2FsbGJhY2s/OiBGdW5jdGlvbiwgY29tcGxldGVDYWxsYmFjaz86IEZ1bmN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDUpIHtcclxuICAgICAgICAgICAgY29tcGxldGVDYWxsYmFjayA9IHByb2dyZXNzQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sgPSBtb3VudDtcclxuICAgICAgICAgICAgbW91bnQgPSAnYXNzZXRzJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFyZ3MgPSB0aGlzLl9wYXJzZUxvYWRSZXNBcmdzKHR5cGUsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2spO1xyXG4gICAgICAgIHR5cGUgPSBhcmdzLnR5cGU7XHJcbiAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjayA9IGFyZ3Mub25Qcm9ncmVzcztcclxuICAgICAgICBjb21wbGV0ZUNhbGxiYWNrID0gYXJncy5vbkNvbXBsZXRlO1xyXG5cclxuICAgICAgICBjb25zdCB1dWlkczogYW55ID0gW107XHJcbiAgICAgICAgLy8gdHNsaW50OmRpc2FibGU6IHByZWZlci1mb3Itb2ZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVybHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdXJsID0gdXJsc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgdXVpZCA9IHRoaXMuX2dldFJlc1V1aWQodXJsLCB0eXBlLCBtb3VudCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgICAgICB1dWlkcy5wdXNoKHV1aWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdXJsTm90Rm91bmQodXJsLCB0eXBlLCBjb21wbGV0ZUNhbGxiYWNrKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9sb2FkUmVzVXVpZHModXVpZHMsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2spO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgcmVzb3VyY2UgZGF0YSBieSBpZC4gPGJyPlxyXG4gICAgICogV2hlbiB5b3UgbG9hZCByZXNvdXJjZXMgd2l0aCBbW2xvYWRdXSBvciBbW2xvYWRSZXNdXSxcclxuICAgICAqIHRoZSB1cmwgd2lsbCBiZSB0aGUgdW5pcXVlIGlkZW50aXR5IG9mIHRoZSByZXNvdXJjZS5cclxuICAgICAqIEFmdGVyIGxvYWRlZCwgeW91IGNhbiBhY3F1aXJlIHRoZW0gYnkgcGFzc2luZyB0aGUgdXJsIHRvIHRoaXMgQVBJLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmoLnmja4gSUQg6I635Y+W6LWE5rqQ5pWw5o2u44CCPGJyPlxyXG4gICAgICog5b2T5L2/55SoIFtbbG9hZF1dIOaIliBbW2xvYWRSZXNdXSDmnaXliqDovb3otYTmupDml7bvvIw8YnI+XHJcbiAgICAgKiBVUkwg5bCG5piv6LWE5rqQ55qE5ZSv5LiA5qCH6K+G44CCPGJyPlxyXG4gICAgICog5Zyo5a6M5oiQ5Yqg6L295LmL5ZCO77yM5L2g5Y+v5Lul6YCa6L+H5bCGIFVSTCDkvKDpgJLnu5nmraQgQVBJIOadpeiOt+WPluWug+S7rOOAglxyXG4gICAgICogQHBhcmFtIHVybCBUaGUgYXNzZXQgdXJsLCBpdCBzaG91bGQgYmUgcmVsYXRlZCBwYXRoIHdpdGhvdXQgZXh0ZW5zaW9uIHRvIHRoZSBgcmVzb3VyY2VzYCBmb2xkZXIuXHJcbiAgICAgKiBAcGFyYW0gdHlwZSBJZiB0eXBlIGlzIHByb3ZpZGVkLCB0aGUgYXNzZXQgZm9yIGNvcnJlc3BvbmQgdHlwZSB3aWxsIGJlIHJldHVybmVkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSZXM8VCA9IGFueT4gKHVybDogc3RyaW5nLCB0eXBlPzogRnVuY3Rpb24pOiBUIHwgbnVsbCB7XHJcbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jYWNoZVt1cmxdO1xyXG4gICAgICAgIGlmICghaXRlbSkge1xyXG4gICAgICAgICAgICBjb25zdCB1dWlkID0gdGhpcy5fZ2V0UmVzVXVpZCh1cmwsIHR5cGUsIG51bGwsIHRydWUpO1xyXG4gICAgICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVmID0gdGhpcy5fZ2V0UmVmZXJlbmNlS2V5KHV1aWQpO1xyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuX2NhY2hlW3JlZl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXRlbSAmJiBpdGVtLmFsaWFzKSB7XHJcbiAgICAgICAgICAgIGl0ZW0gPSBpdGVtLmFsaWFzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKGl0ZW0gJiYgaXRlbS5jb21wbGV0ZSkgPyBpdGVtLmNvbnRlbnQgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0b3RhbCByZXNvdXJjZXMgY291bnQgaW4gbG9hZGVyLlxyXG4gICAgICogQHpoIOiOt+WPluWKoOi9veeahOaAu+i1hOa6kOaVsOmHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UmVzQ291bnQgKCk6IE51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2NhY2hlKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCBhbGwgcmVzb3VyY2UgZGVwZW5kZW5jaWVzIG9mIHRoZSByZXF1ZXN0ZWQgYXNzZXQgaW4gYW4gYXJyYXksIGluY2x1ZGluZyBpdHNlbGYuPGJyPlxyXG4gICAgICogVGhlIG93bmVyIHBhcmFtZXRlciBhY2NlcHQgdGhlIGZvbGxvd2luZyB0eXBlczogMS4gVGhlIGFzc2V0IGl0c2VsZjsgMi4gVGhlIHJlc291cmNlIHVybDsgMy4gVGhlIGFzc2V0J3MgdXVpZC48YnI+XHJcbiAgICAgKiBUaGUgcmV0dXJuZWQgYXJyYXkgc3RvcmVzIHRoZSBkZXBlbmRlbmNpZXMgd2l0aCB0aGVpciB1dWlkcywgYWZ0ZXIgcmV0cmlldmUgZGVwZW5kZW5jaWVzLDxicj5cclxuICAgICAqIHlvdSBjYW4gcmVsZWFzZSB0aGVtLCBhY2Nlc3MgZGVwZW5kZW50IGFzc2V0cyBieSBwYXNzaW5nIHRoZSB1dWlkIHRvIFtbZ2V0UmVzXV0sIG9yIG90aGVyIHN0dWZmcyB5b3Ugd2FudC48YnI+XHJcbiAgICAgKiBGb3IgcmVsZWFzZSBhbGwgZGVwZW5kZW5jaWVzIG9mIGFuIGFzc2V0LCBwbGVhc2UgcmVmZXIgdG8gW1tyZWxlYXNlXV1cclxuICAgICAqIEhlcmUgaXMgc29tZSBleGFtcGxlczpcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5LiA5Liq5oyH5a6a6LWE5rqQ55qE5omA5pyJ5L6d6LWW6LWE5rqQ77yM5YyF5ZCr5a6D6Ieq6Lqr77yM5bm25L+d5a2Y5Zyo5pWw57uE5Lit6L+U5Zue44CCPGJyPlxyXG4gICAgICogb3duZXIg5Y+C5pWw5o6l5pS25Lul5LiL5Yeg56eN57G75Z6L77yaMS4g6LWE5rqQIGFzc2V0IOWvueixoe+8mzIuIOi1hOa6kOebruW9leS4i+eahCB1cmzvvJszLiDotYTmupDnmoQgdXVpZOOAgjxicj5cclxuICAgICAqIOi/lOWbnueahOaVsOe7hOWwhuS7heS/neWtmOS+nei1lui1hOa6kOeahCB1dWlk77yM6I635Y+W6L+Z5LqbIHV1aWQg5ZCO77yM5L2g5Y+v5Lul5LuOIGxvYWRlciDph4rmlL7ov5nkupvotYTmupDvvJvpgJrov4cgW1tnZXRSZXNdXSDojrflj5bmn5DkuKrotYTmupDmiJbogIXov5vooYzlhbbku5bkvaDpnIDopoHnmoTmk43kvZzjgII8YnI+XHJcbiAgICAgKiDmg7PopoHph4rmlL7kuIDkuKrotYTmupDlj4rlhbbkvp3otZbotYTmupDvvIzlj6/ku6Xlj4LogIMgW1tyZWxlYXNlXV3jgII8YnI+XHJcbiAgICAgKiDkuIvpnaLmmK/kuIDkupvnpLrkvovku6PnoIHvvJpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogaW1wb3J0IHsgbG9hZGVyLCBUZXh0dXJlMkQgfSBmcm9tICdjYyc7XHJcbiAgICAgKiAvLyBSZWxlYXNlIGFsbCBkZXBlbmRlbmNpZXMgb2YgYSBsb2FkZWQgcHJlZmFiXHJcbiAgICAgKiBsZXQgZGVwcyA9IGxvYWRlci5nZXREZXBlbmRzUmVjdXJzaXZlbHkocHJlZmFiKTtcclxuICAgICAqIGxvYWRlci5yZWxlYXNlKGRlcHMpO1xyXG4gICAgICogLy8gUmV0cmlldmUgYWxsIGRlcGVuZGVudCB0ZXh0dXJlc1xyXG4gICAgICogbGV0IGRlcHMgPSBsb2FkZXIuZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5KCdwcmVmYWJzL3NhbXBsZScpO1xyXG4gICAgICogbGV0IHRleHR1cmVzID0gW107XHJcbiAgICAgKiBmb3IgKGxldCBpID0gMDsgaSA8IGRlcHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAqICAgICBsZXQgaXRlbSA9IGxvYWRlci5nZXRSZXMoZGVwc1tpXSk7XHJcbiAgICAgKiAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBUZXh0dXJlMkQpIHtcclxuICAgICAqICAgICAgICAgdGV4dHVyZXMucHVzaChpdGVtKTtcclxuICAgICAqICAgICB9XHJcbiAgICAgKiB9XHJcbiAgICAgKiBgYGBcclxuICAgICAqIEBwYXJhbSBvd25lciAtIFRoZSBhc3NldCBpdHNlbGYgb3IgdGhlIGFzc2V0IHVybCBvciB0aGUgYXNzZXQgdXVpZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RGVwZW5kc1JlY3Vyc2l2ZWx5IChvd25lcjogQXNzZXR8UmF3QXNzZXR8c3RyaW5nKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgaWYgKG93bmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFJlZmVyZW5jZUtleShvd25lcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGFzc2V0cyA9IGdldERlcGVuZHNSZWN1cnNpdmVseShrZXkpO1xyXG4gICAgICAgICAgICBhc3NldHMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXNzZXRzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVsZWFzZSB0aGUgY29udGVudCBvZiBhbiBhc3NldCBvciBhbiBhcnJheSBvZiBhc3NldHMgYnkgdXVpZC48YnI+XHJcbiAgICAgKiBUaGlzIG1ldGhvZCB3aWxsIG5vdCBvbmx5IHJlbW92ZSB0aGUgY2FjaGUgb2YgdGhlIGFzc2V0IGluIGxvYWRlciwgYnV0IGFsc28gY2xlYW4gdXAgaXRzIGNvbnRlbnQuPGJyPlxyXG4gICAgICogRm9yIGV4YW1wbGUsIGlmIHlvdSByZWxlYXNlIGEgdGV4dHVyZSwgdGhlIHRleHR1cmUgYXNzZXQgYW5kIGl0cyBnbCB0ZXh0dXJlIGRhdGEgd2lsbCBiZSBmcmVlZCB1cC48YnI+XHJcbiAgICAgKiBJbiBjb21wbGV4ZSBwcm9qZWN0LCB5b3UgY2FuIHVzZSB0aGlzIGZ1bmN0aW9uIHdpdGggW1tnZXREZXBlbmRzUmVjdXJzaXZlbHldXSB0byBmcmVlIHVwIG1lbW9yeSBpbiBjcml0aWNhbCBjaXJjdW1zdGFuY2VzLjxicj5cclxuICAgICAqIE5vdGljZSwgdGhpcyBtZXRob2QgbWF5IGNhdXNlIHRoZSB0ZXh0dXJlIHRvIGJlIHVudXNhYmxlLCBpZiB0aGVyZSBhcmUgc3RpbGwgb3RoZXIgbm9kZXMgdXNlIHRoZSBzYW1lIHRleHR1cmUsIHRoZXkgbWF5IHR1cm4gdG8gYmxhY2sgYW5kIHJlcG9ydCBnbCBlcnJvcnMuPGJyPlxyXG4gICAgICogSWYgeW91IG9ubHkgd2FudCB0byByZW1vdmUgdGhlIGNhY2hlIG9mIGFuIGFzc2V0LCBwbGVhc2UgdXNlIFtbUGlwZWxpbmUucmVtb3ZlSXRlbV1dXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmAmui/hyBpZO+8iOmAmuW4uOaYr+i1hOa6kCB1cmzvvInmnaXph4rmlL7kuIDkuKrotYTmupDmiJbogIXkuIDkuKrotYTmupDmlbDnu4TjgII8YnI+XHJcbiAgICAgKiDov5nkuKrmlrnms5XkuI3ku4XkvJrku44gbG9hZGVyIOS4reWIoOmZpOi1hOa6kOeahOe8k+WtmOW8leeUqO+8jOi/mOS8mua4heeQhuWug+eahOi1hOa6kOWGheWuueOAgjxicj5cclxuICAgICAqIOavlOWmguivtO+8jOW9k+S9oOmHiuaUvuS4gOS4qiB0ZXh0dXJlIOi1hOa6kO+8jOi/meS4qiB0ZXh0dXJlIOWSjOWug+eahCBnbCDotLTlm77mlbDmja7pg73kvJrooqvph4rmlL7jgII8YnI+XHJcbiAgICAgKiDlnKjlpI3mnYLpobnnm67kuK3vvIzmiJHku6zlu7rorq7kvaDnu5PlkIggW1tnZXREZXBlbmRzUmVjdXJzaXZlbHldXSDmnaXkvb/nlKjvvIzkvr/kuo7lnKjorr7lpIflhoXlrZjlkYrmgKXnmoTmg4XlhrXkuIvmm7Tlv6vlnLDph4rmlL7kuI3lho3pnIDopoHnmoTotYTmupDnmoTlhoXlrZjjgII8YnI+XHJcbiAgICAgKiDms6jmhI/vvIzov5nkuKrlh73mlbDlj6/og73kvJrlr7zoh7TotYTmupDotLTlm77miJbotYTmupDmiYDkvp3otZbnmoTotLTlm77kuI3lj6/nlKjvvIzlpoLmnpzlnLrmma/kuK3lrZjlnKjoioLngrnku43nhLbkvp3otZblkIzmoLfnmoTotLTlm77vvIzlroPku6zlj6/og73kvJrlj5jpu5HlubbmiqUgR0wg6ZSZ6K+v44CCPGJyPlxyXG4gICAgICog5aaC5p6c5L2g5Y+q5oOz5Yig6Zmk5LiA5Liq6LWE5rqQ55qE57yT5a2Y5byV55So77yM6K+35L2/55SoIFtbUGlwZWxpbmUucmVtb3ZlSXRlbV1dXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAvLyBSZWxlYXNlIGEgdGV4dHVyZSB3aGljaCBpcyBubyBsb25nZXIgbmVlZFxyXG4gICAgICogbG9hZGVyLnJlbGVhc2UodGV4dHVyZSk7XHJcbiAgICAgKiAvLyBSZWxlYXNlIGFsbCBkZXBlbmRlbmNpZXMgb2YgYSBsb2FkZWQgcHJlZmFiXHJcbiAgICAgKiBsZXQgZGVwcyA9IGxvYWRlci5nZXREZXBlbmRzUmVjdXJzaXZlbHkoJ3ByZWZhYnMvc2FtcGxlJyk7XHJcbiAgICAgKiBsb2FkZXIucmVsZWFzZShkZXBzKTtcclxuICAgICAqIC8vIElmIHRoZXJlIGlzIG5vIGluc3RhbmNlIG9mIHRoaXMgcHJlZmFiIGluIHRoZSBzY2VuZSwgdGhlIHByZWZhYiBhbmQgaXRzIGRlcGVuZGVuY2llcyBsaWtlIHRleHR1cmVzLCBzcHJpdGUgZnJhbWVzLCBldGMsIHdpbGwgYmUgZnJlZWQgdXAuXHJcbiAgICAgKiAvLyBJZiB5b3UgaGF2ZSBzb21lIG90aGVyIG5vZGVzIHNoYXJlIGEgdGV4dHVyZSBpbiB0aGlzIHByZWZhYiwgeW91IGNhbiBza2lwIGl0IGluIHR3byB3YXlzOlxyXG4gICAgICogLy8gMS4gRm9yYmlkIGF1dG8gcmVsZWFzZSBhIHRleHR1cmUgYmVmb3JlIHJlbGVhc2VcclxuICAgICAqIGxvYWRlci5zZXRBdXRvUmVsZWFzZSh0ZXh0dXJlMmQsIGZhbHNlKTtcclxuICAgICAqIC8vIDIuIFJlbW92ZSBpdCBmcm9tIHRoZSBkZXBlbmRlbmNpZXMgYXJyYXlcclxuICAgICAqIGxldCBkZXBzID0gbG9hZGVyLmdldERlcGVuZHNSZWN1cnNpdmVseSgncHJlZmFicy9zYW1wbGUnKTtcclxuICAgICAqIGxldCBpbmRleCA9IGRlcHMuaW5kZXhPZih0ZXh0dXJlMmQuX3V1aWQpO1xyXG4gICAgICogaWYgKGluZGV4ICE9PSAtMSlcclxuICAgICAqICAgICBkZXBzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgKiBsb2FkZXIucmVsZWFzZShkZXBzKTtcclxuICAgICAqIGBgYFxyXG4gICAgICogQHBhcmFtIGFzc2V0IEFzc2V0IG9yIGFzc2V0cyB0byBiZSByZWxlYXNlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVsZWFzZSAoYXNzZXQ6IEFzc2V0fFJhd0Fzc2V0fHN0cmluZ3xBcnJheTxBc3NldHxSYXdBc3NldHxzdHJpbmc+KSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoYXNzZXQpKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXNzZXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGtleSA9IGFzc2V0W2ldO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYXNzZXQpIHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLl9nZXRSZWZlcmVuY2VLZXkoYXNzZXQpO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5nZXRJdGVtKGlkKTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQgPSB0aGlzLnJlbW92ZUl0ZW0oaWQpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXQgPSBpdGVtLmNvbnRlbnQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXNzZXQgaW5zdGFuY2VvZiBBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5hdGl2ZVVybCA9IGFzc2V0Lm5hdGl2ZVVybDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmF0aXZlVXJsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVsZWFzZShuYXRpdmVVcmwpOyAgLy8gdW5jYWNoZSBsb2FkaW5nIGl0ZW0gb2YgbmF0aXZlIGFzc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2V0LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChERUJVRyAmJiByZW1vdmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVsZWFzZWRBc3NldENoZWNrZXJfREVCVUcuc2V0UmVsZWFzZWQoaXRlbSwgaWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlbGVhc2UgdGhlIGFzc2V0IGJ5IGl0cyBvYmplY3QuIFJlZmVyIHRvIHt7cmVsZWFzZX19IGZvciBkZXRhaWxlZCBpbmZvcm1hdGlvbnMuXHJcbiAgICAgKiBAemgg6YCa6L+H6LWE5rqQ5a+56LGh6Ieq6Lqr5p2l6YeK5pS+6LWE5rqQ44CC6K+m57uG5L+h5oGv6K+35Y+C6ICDIHt7cmVsZWFzZX19XHJcbiAgICAgKiBAcGFyYW0gYXNzZXQgVGhlIGFzc2V0IHRvIGJlIHJlbGVhc2VkXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWxlYXNlQXNzZXQgKGFzc2V0OiBBc3NldCkge1xyXG4gICAgICAgIGNvbnN0IHV1aWQgPSBhc3NldC5fdXVpZDtcclxuICAgICAgICBpZiAodXVpZCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UodXVpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlbGVhc2UgdGhlIGFzc2V0IGxvYWRlZCBieSB7e2xvYWRSZXN9fS4gUmVmZXIgdG8ge3tyZWxlYXNlfX0gZm9yIGRldGFpbGVkIGluZm9ybWF0aW9ucy5cclxuICAgICAqIEB6aCDph4rmlL7pgJrov4cge3tsb2FkUmVzfX0g5Yqg6L2955qE6LWE5rqQ44CC6K+m57uG5L+h5oGv6K+35Y+C6ICDIHt7cmVsZWFzZX19XHJcbiAgICAgKiBAcGFyYW0gdXJsIFRoZSBhc3NldCB1cmwsIGl0IHNob3VsZCBiZSByZWxhdGVkIHBhdGggd2l0aG91dCBleHRlbnNpb24gdG8gdGhlIGByZXNvdXJjZXNgIGZvbGRlci5cclxuICAgICAqIEBwYXJhbSB0eXBlIElmIHR5cGUgaXMgcHJvdmlkZWQsIHRoZSBhc3NldCBmb3IgY29ycmVzcG9uZCB0eXBlIHdpbGwgYmUgcmV0dXJuZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbGVhc2VSZXMgKHVybDogc3RyaW5nLCB0eXBlPzogRnVuY3Rpb24sIG1vdW50Pykge1xyXG4gICAgICAgIGNvbnN0IHV1aWQgPSB0aGlzLl9nZXRSZXNVdWlkKHVybCwgdHlwZSwgbW91bnQsIHRydWUpO1xyXG4gICAgICAgIGlmICh1dWlkKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSh1dWlkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoNDkxNCwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVsZWFzZSB0aGUgYWxsIGFzc2V0cyBsb2FkZWQgYnkge3tsb2FkUmVzRGlyfX0uIFJlZmVyIHRvIHt7cmVsZWFzZX19IGZvciBkZXRhaWxlZCBpbmZvcm1hdGlvbnMuXHJcbiAgICAgKiBAemgg6YeK5pS+6YCa6L+HIHt7bG9hZFJlc0Rpcn19IOWKoOi9veeahOi1hOa6kOOAguivpue7huS/oeaBr+ivt+WPguiAgyB7e3JlbGVhc2V9fVxyXG4gICAgICogQHBhcmFtIHVybCBUaGUgdXJsIG9mIHRoZSBkaXJlY3RvcnkgdG8gcmVsZWFzZSwgaXQgc2hvdWxkIGJlIHJlbGF0ZWQgcGF0aCB0byB0aGUgYHJlc291cmNlc2AgZm9sZGVyLlxyXG4gICAgICogQHBhcmFtIHR5cGUgSWYgdHlwZSBpcyBwcm92aWRlZCwgdGhlIGFzc2V0IGZvciBjb3JyZXNwb25kIHR5cGUgd2lsbCBiZSByZXR1cm5lZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVsZWFzZVJlc0RpciAodXJsOiBzdHJpbmcsIHR5cGU/OiBGdW5jdGlvbiwgbW91bnQ/KSB7XHJcbiAgICAgICAgbW91bnQgPSBtb3VudCB8fCAnYXNzZXRzJztcclxuICAgICAgICBpZiAoIWFzc2V0VGFibGVzW21vdW50XSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgY29uc3QgdXVpZHMgPSBhc3NldFRhYmxlc1ttb3VudF0uZ2V0VXVpZEFycmF5KHVybCwgdHlwZSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1dWlkcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1dWlkID0gdXVpZHNbaV07XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSh1dWlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzb3VyY2UgYWxsIGFzc2V0cy4gUmVmZXIgdG8ge3tyZWxlYXNlfX0gZm9yIGRldGFpbGVkIGluZm9ybWF0aW9ucy5cclxuICAgICAqIEB6aCDph4rmlL7miYDmnInotYTmupDjgILor6bnu4bkv6Hmga/or7flj4LogIMge3tyZWxlYXNlfX1cclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbGVhc2VBbGwgKCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgaWQgaW4gdGhpcy5fY2FjaGUpIHtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKGlkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQVVUTyBSRUxFQVNFXHJcblxyXG4gICAgLy8gb3ZlcnJpZGVcclxuICAgIHB1YmxpYyByZW1vdmVJdGVtIChrZXkpIHtcclxuICAgICAgICBjb25zdCByZW1vdmVkID0gUGlwZWxpbmUucHJvdG90eXBlLnJlbW92ZUl0ZW0uY2FsbCh0aGlzLCBrZXkpO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdba2V5XTtcclxuICAgICAgICByZXR1cm4gcmVtb3ZlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgdG8gcmVsZWFzZSB0aGUgYXNzZXQgd2hlbiBsb2FkaW5nIGEgbmV3IHNjZW5lLjxicj5cclxuICAgICAqIEJ5IGRlZmF1bHQsIHdoZW4gbG9hZGluZyBhIG5ldyBzY2VuZSwgYWxsIGFzc2V0cyBpbiB0aGUgcHJldmlvdXMgc2NlbmUgd2lsbCBiZSByZWxlYXNlZCBvciBwcmVzZXJ2ZWQ8YnI+XHJcbiAgICAgKiBhY2NvcmRpbmcgdG8gd2hldGhlciB0aGUgcHJldmlvdXMgc2NlbmUgY2hlY2tlZCB0aGUgXCJBdXRvIFJlbGVhc2UgQXNzZXRzXCIgb3B0aW9uLjxicj5cclxuICAgICAqIE9uIHRoZSBvdGhlciBoYW5kLCBhc3NldHMgZHluYW1pY2FsbHkgbG9hZGVkIGJ5IHVzaW5nIGBsb2FkZXIubG9hZFJlc2Agb3IgYGxvYWRlci5sb2FkUmVzRGlyYDxicj5cclxuICAgICAqIHdpbGwgbm90IGJlIGFmZmVjdGVkIGJ5IHRoYXQgb3B0aW9uLCByZW1haW4gbm90IHJlbGVhc2VkIGJ5IGRlZmF1bHQuPGJyPlxyXG4gICAgICogVXNlIHRoaXMgQVBJIHRvIGNoYW5nZSB0aGUgZGVmYXVsdCBiZWhhdmlvciBvbiBhIHNpbmdsZSBhc3NldCwgdG8gZm9yY2UgcHJlc2VydmUgb3IgcmVsZWFzZSBzcGVjaWZpZWQgYXNzZXQgd2hlbiBzY2VuZSBzd2l0Y2hpbmcuPGJyPlxyXG4gICAgICogPGJyPlxyXG4gICAgICogU2VlOiB7e3NldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHl9fSwge3tpc0F1dG9SZWxlYXNlfX1cclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u5b2T5Zy65pmv5YiH5o2i5pe25piv5ZCm6Ieq5Yqo6YeK5pS+6LWE5rqQ44CCPGJyPlxyXG4gICAgICog6buY6K6k5oOF5Ya15LiL77yM5b2T5Yqg6L295paw5Zy65pmv5pe277yM5pen5Zy65pmv55qE6LWE5rqQ5qC55o2u5pen5Zy65pmv5piv5ZCm5Yu+6YCJ4oCcQXV0byBSZWxlYXNlIEFzc2V0c+KAne+8jOWwhuS8muiiq+mHiuaUvuaIluiAheS/neeVmeOAgjxicj5cclxuICAgICAqIOiAjOS9v+eUqCBgbG9hZGVyLmxvYWRSZXNgIOaIliBgbG9hZGVyLmxvYWRSZXNEaXJgIOWKqOaAgeWKoOi9veeahOi1hOa6kO+8jOWImeS4jeWPl+WcuuaZr+iuvue9rueahOW9seWTje+8jOm7mOiupOS4jeiHquWKqOmHiuaUvuOAgjxicj5cclxuICAgICAqIOS9v+eUqOi/meS4qiBBUEkg5Y+v5Lul5Zyo5Y2V5Liq6LWE5rqQ5LiK5pS55Y+Y6L+Z5Liq6buY6K6k6KGM5Li677yM5by65Yi25Zyo5YiH5o2i5Zy65pmv5pe25L+d55WZ5oiW6ICF6YeK5pS+5oyH5a6a6LWE5rqQ44CCPGJyPlxyXG4gICAgICogPGJyPlxyXG4gICAgICog5Y+C6ICD77yae3tzZXRBdXRvUmVsZWFzZVJlY3Vyc2l2ZWx5fX3vvIx7e2lzQXV0b1JlbGVhc2V9fVxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gYXV0byByZWxlYXNlIHRoZSB0ZXh0dXJlIGV2ZW50IGlmIFwiQXV0byBSZWxlYXNlIEFzc2V0c1wiIGRpc2FibGVkIGluIGN1cnJlbnQgc2NlbmVcclxuICAgICAqIGxvYWRlci5zZXRBdXRvUmVsZWFzZSh0ZXh0dXJlMmQsIHRydWUpO1xyXG4gICAgICogLy8gZG9uJ3QgcmVsZWFzZSB0aGUgdGV4dHVyZSBldmVuIGlmIFwiQXV0byBSZWxlYXNlIEFzc2V0c1wiIGVuYWJsZWQgaW4gY3VycmVudCBzY2VuZVxyXG4gICAgICogbG9hZGVyLnNldEF1dG9SZWxlYXNlKHRleHR1cmUyZCwgZmFsc2UpO1xyXG4gICAgICogLy8gZmlyc3QgcGFyYW1ldGVyIGNhbiBiZSB1cmxcclxuICAgICAqIGxvYWRlci5zZXRBdXRvUmVsZWFzZShhdWRpb1VybCwgZmFsc2UpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKiBAcGFyYW0gYXNzZXRPclVybE9yVXVpZCAtIFRoZSBhc3NldCBvciBpdHMgdXJsIG9yIGl0cyB1dWlkXHJcbiAgICAgKiBAcGFyYW0gYXV0b1JlbGVhc2UgLSBXaGV0aGVyIHRvIHJlbGVhc2UgYXV0b21hdGljYWxseSBkdXJpbmcgc2NlbmUgc3dpdGNoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRBdXRvUmVsZWFzZSAoYXNzZXRPclVybE9yVXVpZDogQXNzZXR8c3RyaW5nLCBhdXRvUmVsZWFzZTogQm9vbGVhbikge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldFJlZmVyZW5jZUtleShhc3NldE9yVXJsT3JVdWlkKTtcclxuICAgICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2F1dG9SZWxlYXNlU2V0dGluZ1trZXldID0gISFhdXRvUmVsZWFzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoREVWKSB7XHJcbiAgICAgICAgICAgIHdhcm5JRCg0OTAyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIHRvIHJlbGVhc2UgdGhlIGFzc2V0IGFuZCBpdHMgcmVmZXJlbmNlZCBvdGhlciBhc3NldHMgd2hlbiBsb2FkaW5nIGEgbmV3IHNjZW5lLjxicj5cclxuICAgICAqIEJ5IGRlZmF1bHQsIHdoZW4gbG9hZGluZyBhIG5ldyBzY2VuZSwgYWxsIGFzc2V0cyBpbiB0aGUgcHJldmlvdXMgc2NlbmUgd2lsbCBiZSByZWxlYXNlZCBvciBwcmVzZXJ2ZWQ8YnI+XHJcbiAgICAgKiBhY2NvcmRpbmcgdG8gd2hldGhlciB0aGUgcHJldmlvdXMgc2NlbmUgY2hlY2tlZCB0aGUgXCJBdXRvIFJlbGVhc2UgQXNzZXRzXCIgb3B0aW9uLjxicj5cclxuICAgICAqIE9uIHRoZSBvdGhlciBoYW5kLCBhc3NldHMgZHluYW1pY2FsbHkgbG9hZGVkIGJ5IHVzaW5nIGBsb2FkZXIubG9hZFJlc2Agb3IgYGxvYWRlci5sb2FkUmVzRGlyYDxicj5cclxuICAgICAqIHdpbGwgbm90IGJlIGFmZmVjdGVkIGJ5IHRoYXQgb3B0aW9uLCByZW1haW4gbm90IHJlbGVhc2VkIGJ5IGRlZmF1bHQuPGJyPlxyXG4gICAgICogVXNlIHRoaXMgQVBJIHRvIGNoYW5nZSB0aGUgZGVmYXVsdCBiZWhhdmlvciBvbiB0aGUgc3BlY2lmaWVkIGFzc2V0IGFuZCBpdHMgcmVjdXJzaXZlbHkgcmVmZXJlbmNlZCBhc3NldHMsIHRvIGZvcmNlIHByZXNlcnZlIG9yIHJlbGVhc2Ugc3BlY2lmaWVkIGFzc2V0IHdoZW4gc2NlbmUgc3dpdGNoaW5nLjxicj5cclxuICAgICAqIDxicj5cclxuICAgICAqIFNlZToge3tzZXRBdXRvUmVsZWFzZX19LCB7e2lzQXV0b1JlbGVhc2V9fVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7lvZPlnLrmma/liIfmjaLml7bmmK/lkKboh6rliqjph4rmlL7otYTmupDlj4rotYTmupDlvJXnlKjnmoTlhbblroPotYTmupDjgII8YnI+XHJcbiAgICAgKiDpu5jorqTmg4XlhrXkuIvvvIzlvZPliqDovb3mlrDlnLrmma/ml7bvvIzml6flnLrmma/nmoTotYTmupDmoLnmja7ml6flnLrmma/mmK/lkKbli77pgInigJxBdXRvIFJlbGVhc2UgQXNzZXRz4oCd77yM5bCG5Lya6KKr6YeK5pS+5oiW6ICF5L+d55WZ44CCPGJyPlxyXG4gICAgICog6ICM5L2/55SoIGBsb2FkZXIubG9hZFJlc2Ag5oiWIGBsb2FkZXIubG9hZFJlc0RpcmAg5Yqo5oCB5Yqg6L2955qE6LWE5rqQ77yM5YiZ5LiN5Y+X5Zy65pmv6K6+572u55qE5b2x5ZON77yM6buY6K6k5LiN6Ieq5Yqo6YeK5pS+44CCPGJyPlxyXG4gICAgICog5L2/55So6L+Z5LiqIEFQSSDlj6/ku6XlnKjmjIflrprotYTmupDlj4rotYTmupDpgJLlvZLlvJXnlKjliLDnmoTmiYDmnInotYTmupDkuIrmlLnlj5jov5nkuKrpu5jorqTooYzkuLrvvIzlvLrliLblnKjliIfmjaLlnLrmma/ml7bkv53nlZnmiJbogIXph4rmlL7mjIflrprotYTmupDjgII8YnI+XHJcbiAgICAgKiA8YnI+XHJcbiAgICAgKiDlj4LogIPvvJp7e3NldEF1dG9SZWxlYXNlfX3vvIx7e2lzQXV0b1JlbGVhc2V9fVxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gYXV0byByZWxlYXNlIHRoZSBTcHJpdGVGcmFtZSBhbmQgaXRzIFRleHR1cmUgZXZlbnQgaWYgXCJBdXRvIFJlbGVhc2UgQXNzZXRzXCIgZGlzYWJsZWQgaW4gY3VycmVudCBzY2VuZVxyXG4gICAgICogbG9hZGVyLnNldEF1dG9SZWxlYXNlUmVjdXJzaXZlbHkoc3ByaXRlRnJhbWUsIHRydWUpO1xyXG4gICAgICogLy8gZG9uJ3QgcmVsZWFzZSB0aGUgU3ByaXRlRnJhbWUgYW5kIGl0cyBUZXh0dXJlIGV2ZW4gaWYgXCJBdXRvIFJlbGVhc2UgQXNzZXRzXCIgZW5hYmxlZCBpbiBjdXJyZW50IHNjZW5lXHJcbiAgICAgKiBsb2FkZXIuc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseShzcHJpdGVGcmFtZSwgZmFsc2UpO1xyXG4gICAgICogLy8gZG9uJ3QgcmVsZWFzZSB0aGUgUHJlZmFiIGFuZCBhbGwgdGhlIHJlZmVyZW5jZWQgYXNzZXRzXHJcbiAgICAgKiBsb2FkZXIuc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseShwcmVmYWIsIGZhbHNlKTtcclxuICAgICAqIGBgYFxyXG4gICAgICogQHBhcmFtIGFzc2V0T3JVcmxPclV1aWQgLSBUaGUgYXNzZXQgb3IgaXRzIHVybCBvciBpdHMgdXVpZFxyXG4gICAgICogQHBhcmFtIGF1dG9SZWxlYXNlIC0gV2hldGhlciB0byByZWxlYXNlIGF1dG9tYXRpY2FsbHkgZHVyaW5nIHNjZW5lIHN3aXRjaFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseSAoYXNzZXRPclVybE9yVXVpZDogQXNzZXR8c3RyaW5nLCBhdXRvUmVsZWFzZTogQm9vbGVhbikge1xyXG4gICAgICAgIGF1dG9SZWxlYXNlID0gISFhdXRvUmVsZWFzZTtcclxuICAgICAgICBjb25zdCBrZXkgPSB0aGlzLl9nZXRSZWZlcmVuY2VLZXkoYXNzZXRPclVybE9yVXVpZCk7XHJcbiAgICAgICAgaWYgKGtleSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdba2V5XSA9IGF1dG9SZWxlYXNlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVwZW5kcyA9IGdldERlcGVuZHNSZWN1cnNpdmVseShrZXkpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlcGVuZHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlcGVuZCA9IGRlcGVuZHNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvUmVsZWFzZVNldHRpbmdbZGVwZW5kXSA9IGF1dG9SZWxlYXNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKERFVikge1xyXG4gICAgICAgICAgICB3YXJuSUQoNDkwMik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgd2hldGhlciB0aGUgYXNzZXQgaXMgY29uZmlndXJlZCBhcyBhdXRvIHJlbGVhc2VkLCBkZXNwaXRlIGhvdyBcIkF1dG8gUmVsZWFzZSBBc3NldHNcIiBwcm9wZXJ0eSBpcyBzZXQgb24gc2NlbmUgYXNzZXQuPGJyPlxyXG4gICAgICogPGJyPlxyXG4gICAgICogU2VlOiB7e3NldEF1dG9SZWxlYXNlfX0sIHt7c2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseX19XHJcbiAgICAgKiBAemgg6L+U5Zue5oyH5a6a55qE6LWE5rqQ5piv5ZCm5pyJ6KKr6K6+572u5Li66Ieq5Yqo6YeK5pS+77yM5LiN6K665Zy65pmv55qE4oCcQXV0byBSZWxlYXNlIEFzc2V0c+KAneWmguS9leiuvue9ruOAgjxicj5cclxuICAgICAqIDxicj5cclxuICAgICAqIOWPguiAg++8mnt7c2V0QXV0b1JlbGVhc2V9fe+8jHt7c2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseX19XHJcbiAgICAgKiBAcGFyYW0ge0Fzc2V0fHN0cmluZ30gYXNzZXRPclVybCAtIGFzc2V0IG9iamVjdCBvciB0aGUgcmF3IGFzc2V0J3MgdXJsXHJcbiAgICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzQXV0b1JlbGVhc2UgKGFzc2V0T3JVcmw6IEFzc2V0fHN0cmluZyk6IEJvb2xlYW57XHJcbiAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5fZ2V0UmVmZXJlbmNlS2V5KGFzc2V0T3JVcmwpO1xyXG4gICAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5fYXV0b1JlbGVhc2VTZXR0aW5nW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXRyaWV2ZSBhc3NldCdzIHV1aWRcclxuICAgICAqIEB6aCDojrflj5botYTmupDnmoQgdXVpZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX2dldFJlc1V1aWQgKHVybDogc3RyaW5nLCB0eXBlPzogRnVuY3Rpb24sIG1vdW50PywgcXVpZXQ/KSB7XHJcbiAgICAgICAgbW91bnQgPSBtb3VudCB8fCAnYXNzZXRzJztcclxuICAgICAgICBsZXQgdXVpZCA9ICcnO1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IEVkaXRvckV4dGVuZHMuQXNzZXQuZ2V0QXNzZXRJbmZvRnJvbVVybChgZGI6Ly8ke21vdW50fS9yZXNvdXJjZXMvJHt1cmx9YCk7XHJcbiAgICAgICAgICAgIHV1aWQgPSBpbmZvID8gaW5mby51dWlkIDogJyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBhc3NldFRhYmxlID0gYXNzZXRUYWJsZXNbbW91bnRdO1xyXG4gICAgICAgICAgICBpZiAodXJsICYmIGFzc2V0VGFibGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIElnbm9yZSBwYXJhbWV0ZXJcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdXJsLmluZGV4T2YoJz8nKTtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHV1aWQgPSBhc3NldFRhYmxlLmdldFV1aWQodXJsLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIGlmICghdXVpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGV4dG5hbWUgPSBwYXRoLmV4dG5hbWUodXJsKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXh0bmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHJpcCBleHRuYW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybCA9IHVybC5zbGljZSgwLCAtIGV4dG5hbWUubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXVpZCA9IGFzc2V0VGFibGUuZ2V0VXVpZCh1cmwsIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodXVpZCAmJiAhcXVpZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdhcm5JRCg0OTAxLCB1cmwsIGV4dG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdXVpZCAmJiB0eXBlKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0NoaWxkQ2xhc3NPZih0eXBlLCBTcHJpdGVGcmFtZSkgfHwgaXNDaGlsZENsYXNzT2YodHlwZSwgVGV4dHVyZTJEKSB8fCBpc0NoaWxkQ2xhc3NPZih0eXBlLCBUZXh0dXJlQ3ViZSkpIHtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCg0OTM0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdXVpZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBGaW5kIHRoZSBhc3NldCdzIHJlZmVyZW5jZSBpZCBpbiBsb2FkZXIsIGFzc2V0IGNvdWxkIGJlIGFzc2V0IG9iamVjdCwgYXNzZXQgdXVpZCBvciBhc3NldCB1cmxcclxuICAgICAqIEB6aCDlnKggbGFvZGVyIOS4reaJvuWIsOi1hOa6kOeahOW8leeUqCBpZCDvvIzlj4LmlbDlj6/ku6XmmK/otYTmupDlr7nosaHjgIHotYTmupDnmoQgdXVpZCDmiJbogIXmmK/otYTmupDnmoQgdXJsXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBfZ2V0UmVmZXJlbmNlS2V5IChhc3NldE9yVXJsT3JVdWlkKSB7XHJcbiAgICAgICAgbGV0IGtleTtcclxuICAgICAgICBpZiAodHlwZW9mIGFzc2V0T3JVcmxPclV1aWQgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgIGtleSA9IGFzc2V0T3JVcmxPclV1aWQuX3V1aWQgfHwgbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGFzc2V0T3JVcmxPclV1aWQgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIGtleSA9IHRoaXMuX2dldFJlc1V1aWQoYXNzZXRPclVybE9yVXVpZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHRydWUpIHx8IGFzc2V0T3JVcmxPclV1aWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICgha2V5KSB7XHJcbiAgICAgICAgICAgIHdhcm5JRCg0ODAwLCBhc3NldE9yVXJsT3JVdWlkKTtcclxuICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGVnYWN5Q0MuQXNzZXRMaWJyYXJ5Ll9nZXRBc3NldEluZm9JblJ1bnRpbWUoa2V5LCBfaW5mbyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW19pbmZvLnVybCFdID8gX2luZm8udXJsIDoga2V5O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE9wZXJhdGlvbiB3aGVuIGNvbXBsZXRlIHRoZSByZXF1ZXN0IHdpdGhvdXQgZm91bmQgYW55IGFzc2V0XHJcbiAgICBwcml2YXRlIF91cmxOb3RGb3VuZCAodXJsLCB0eXBlLCBjb21wbGV0ZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgY2FsbEluTmV4dFRpY2soKCkgPT4ge1xyXG4gICAgICAgICAgICB1cmwgPSBsZWdhY3lDQy51cmwubm9ybWFsaXplKHVybCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSBgJHt0eXBlID8gZ2V0Q2xhc3NOYW1lKHR5cGUpIDogJ0Fzc2V0J30gaW4gXCJyZXNvdXJjZXMvJHt1cmx9XCIgZG9lcyBub3QgZXhpc3QuYDtcclxuICAgICAgICAgICAgaWYgKGNvbXBsZXRlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobmV3IEVycm9yKGluZm8pLCBbXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9wYXJzZUxvYWRSZXNBcmdzICh0eXBlLCBvblByb2dyZXNzLCBvbkNvbXBsZXRlKSB7XHJcbiAgICAgICAgaWYgKG9uQ29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBjb25zdCBpc1ZhbGlkVHlwZSA9IGlzQ2hpbGRDbGFzc09mKHR5cGUsIGxlZ2FjeUNDLlJhd0Fzc2V0KTtcclxuICAgICAgICAgICAgaWYgKG9uUHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUgPSBvblByb2dyZXNzO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzVmFsaWRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb25Qcm9ncmVzcyA9IHRoaXMub25Qcm9ncmVzcyB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG9uUHJvZ3Jlc3MgPT09IHVuZGVmaW5lZCAmJiAhaXNWYWxpZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIG9uQ29tcGxldGUgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgb25Qcm9ncmVzcyA9IHRoaXMub25Qcm9ncmVzcyB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG9uUHJvZ3Jlc3MgIT09IHVuZGVmaW5lZCAmJiAhaXNWYWxpZFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIG9uUHJvZ3Jlc3MgPSB0eXBlO1xyXG4gICAgICAgICAgICAgICAgdHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgb25Qcm9ncmVzcyxcclxuICAgICAgICAgICAgb25Db21wbGV0ZSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExvYWQgYXNzZXRzIHdpdGggdXVpZHNcclxuICAgIHByaXZhdGUgX2xvYWRSZXNVdWlkcyAodXVpZHMsIHByb2dyZXNzQ2FsbGJhY2ssIGNvbXBsZXRlQ2FsbGJhY2ssIHVybHMgPykge1xyXG4gICAgICAgIGlmICh1dWlkcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBjb25zdCByZXMgPSB1dWlkcy5tYXAoKHV1aWQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3V1aWQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHV1aWQsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5sb2FkKHJlcywgcHJvZ3Jlc3NDYWxsYmFjaywgKGVycm9ycywgaXRlbXMpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wbGV0ZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNzZXRSZXM6IGFueSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybFJlczogYW55ID0gdXJscyAmJiBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB1dWlkID0gcmVzW2ldLnV1aWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gc2VsZi5fZ2V0UmVmZXJlbmNlS2V5KHV1aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpdGVtID0gaXRlbXMuZ2V0Q29udGVudChpZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaG91bGQgbm90IHJlbGVhc2UgdGhlc2UgYXNzZXRzLCBldmVuIGlmIHRoZXkgYXJlIHN0YXRpYyByZWZlcmVuY2VkIGluIHRoZSBzY2VuZS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0QXV0b1JlbGVhc2VSZWN1cnNpdmVseSh1dWlkLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhc3NldFJlcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVybFJlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybFJlcy5wdXNoKHVybHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2soZXJyb3JzLCBhc3NldFJlcywgdXJsUmVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2soZXJyb3JzLCBhc3NldFJlcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wbGV0ZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsSW5OZXh0VGljayggKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCwgW10sIFtdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbGJhY2sobnVsbCwgW10pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogU2luZ2xldG9uIG9iamVjdCBvZiBDQ0xvYWRlclxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IGxvYWRlciA9IGxlZ2FjeUNDLmxvYWRlciA9IG5ldyBDQ0xvYWRlcigpO1xyXG5cclxuaWYgKEVESVRPUikge1xyXG4gICAgbGVnYWN5Q0MubG9hZGVyLnJlZnJlc2hVcmwgPSBmdW5jdGlvbiAodXVpZCwgb2xkVXJsLCBuZXdVcmwpIHtcclxuICAgICAgICBsZXQgaXRlbSA9IHRoaXMuX2NhY2hlW3V1aWRdO1xyXG4gICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgIGl0ZW0udXJsID0gbmV3VXJsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXRlbSA9IHRoaXMuX2NhY2hlW29sZFVybF07XHJcbiAgICAgICAgaWYgKGl0ZW0pIHtcclxuICAgICAgICAgICAgaXRlbS5pZCA9IG5ld1VybDtcclxuICAgICAgICAgICAgaXRlbS51cmwgPSBuZXdVcmw7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlW25ld1VybF0gPSBpdGVtO1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fY2FjaGVbb2xkVXJsXTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcbiJdfQ==