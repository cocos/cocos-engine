/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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

const js = require('../platform/js');
require('../CCDirector');
const utilities = require('./utilities');
const dependUtil = require('./depend-util');
const releaseManager = require('./releaseManager');
const downloader = require('./downloader');
const factory = require('./factory');
const helper = require('./helper');

const ImageFmts = ['.png', '.jpg', '.bmp', '.jpeg', '.gif', '.ico', '.tiff', '.webp', '.image', '.pvr', '.pkm'];
const AudioFmts = ['.mp3', '.ogg', '.wav', '.m4a'];

function GetTrue () { return true; }

const md5Pipe = {
    transformURL (url) {
        let uuid = helper.getUuidFromURL(url);
        if (!uuid) { return url; }
        let bundle = cc.assetManager.bundles.find((b) => {
            return !!b.getAssetInfo(uuid);
        });
        if (!bundle) { return url; }
        let hashValue = '';
        let info = bundle.getAssetInfo(uuid);
        if (url.startsWith(bundle.base + bundle._config.nativeBase)) {
            hashValue = info.nativeVer || '';
        }
        else {
            hashValue = info.ver || '';
        }
        if (!hashValue || url.indexOf(hashValue) !== -1) { return url; }
        let hashPatchInFolder = false;
        if (cc.path.extname(url) === '.ttf') {
            hashPatchInFolder = true;
        }
        if (hashPatchInFolder) {
            let dirname = cc.path.dirname(url);
            let basename = cc.path.basename(url);
            url = `${dirname}.${hashValue}/${basename}`;
        } else {
            url = url.replace(/.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/, (match, uuid) => {
                return match + '.' + hashValue;
            });
        }
        
        return url;
    },
};

/**
 * `cc.loader` is deprecated, please backup your project and upgrade to {{#crossLink "AssetManager"}}{{/crossLink}}
 *
 * @class loader
 * @static
 * @deprecated cc.loader is deprecated, please backup your project and upgrade to cc.assetManager
 */
const loader = {
    /**
     * `cc.loader.onProgress` is deprecated, please transfer onProgress to API as a parameter
     * @property onProgress
     * @deprecated cc.loader.onProgress is deprecated, please transfer onProgress to API as a parameter
     */
    onProgress: null,
    _autoReleaseSetting: Object.create(null),

    get _cache () {
        return cc.assetManager.assets._map;
    },

    /**
     * `cc.loader.load` is deprecated, please use {{#crossLink "AssetManager/loadAny:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.load is deprecated, please use cc.assetManager.loadAny instead
     *
     * @method load
     * @param {String|String[]|Object} resources - Url list in an array
     * @param {Function} [progressCallback] - Callback invoked when progression change
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed
     * @param {Number} progressCallback.totalCount - The total number of the items
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline
     * @param {Function} [completeCallback] - Callback invoked when all resources loaded
     * @typescript
     * load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, completeCallback?: Function): void
     * load(resources: string|string[]|{uuid?: string, url?: string, type?: string}, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: Function|null): void
     */
    load (resources, progressCallback, completeCallback) {
        if (completeCallback === undefined) {
            if (progressCallback !== undefined) {
                completeCallback = progressCallback;
                progressCallback = null;
            }
        }
        resources = Array.isArray(resources) ? resources : [resources];
        for (var i = 0; i < resources.length; i++) {
            var item = resources[i];
            if (typeof item === 'string') {
                resources[i] = { url: item, __isNative__: true};
            }
            else {
                if (item.type) {
                    item.ext = '.' + item.type;
                    item.type = undefined;
                }

                if (item.url) {
                    item.__isNative__ = true;
                }
            }
        }
        var images = [];
        var audios = [];
        cc.assetManager.loadAny(resources, null, (finish, total, item) => {
            if (item.content) {
                if (ImageFmts.includes(item.ext)) {
                    images.push(item.content);
                }
                else if (AudioFmts.includes(item.ext)) {
                    audios.push(item.content);
                }
            }
            progressCallback && progressCallback(finish, total, item);
        }, (err, native) => {
            var res = null;
            if (!err) {
                native = Array.isArray(native) ? native : [native];
                for (var i = 0; i < native.length; i++) {
                    var item = native[i];
                    if (!(item instanceof cc.Asset)) {
                        var asset = item;
                        var url = resources[i].url;
                        if (images.includes(asset)) {
                            factory.create(url, item, '.png', null, (err, image) => {
                                asset = native[i] = image;
                            });
                        }
                        else if (audios.includes(asset)) {
                            factory.create(url, item, '.mp3', null, (err, audio) => {
                                asset = native[i] = audio;
                            });
                        }
                        cc.assetManager.assets.add(url, asset);
                    }
                }
                if (native.length > 1) {
                    var map = Object.create(null);
                    native.forEach(function (asset) {
                        map[asset._uuid] = asset;
                    });
                    res = { isCompleted: GetTrue, _map: map };
                }
                else {
                    res = native[0];
                }
            }
            completeCallback && completeCallback(err, res);
        });
    },

    /**
     * `cc.loader.getXMLHttpRequest` is deprecated, please use `XMLHttpRequest` directly
     *
     * @method getXMLHttpRequest
     * @deprecated cc.loader.getXMLHttpRequest is deprecated, please use XMLHttpRequest directly
     * @returns {XMLHttpRequest}
     */
    getXMLHttpRequest () {
        return new XMLHttpRequest();
    },

    _parseLoadResArgs: utilities.parseLoadResArgs,

    /**
     * `cc.loader.getItem` is deprecated, please use `cc.assetManager.asset.get` instead
     *
     * @method getItem
     * @param {Object} id The id of the item
     * @return {Object}
     * @deprecated cc.loader.getItem is deprecated, please use cc.assetManager.assets.get instead
     */
    getItem (key) {
        return cc.assetManager.assets.has(key) ? { content: cc.assetManager.assets.get(key) } : null;
    },

    /**
     * `cc.loader.loadRes` is deprecated, please use {{#crossLink "Bundle/load:method"}}{{/crossLink}}  instead
     *
     * @deprecated cc.loader.loadRes is deprecated, please use cc.resources.load  instead
     * @method loadRes
     * @param {String} url - Url of the target resource.
     *                       The url is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [progressCallback] - Callback invoked when progression change.
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
     * @param {Number} progressCallback.totalCount - The total number of the items.
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
     * @param {Function} [completeCallback] - Callback invoked when the resource loaded.
     * @param {Error} completeCallback.error - The error info or null if loaded successfully.
     * @param {Object} completeCallback.resource - The loaded resource if it can be found otherwise returns null.
     *
     * @typescript
     * loadRes(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
     * loadRes(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void): void
     * loadRes(url: string, type: typeof cc.Asset): void
     * loadRes(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
     * loadRes(url: string, completeCallback: (error: Error, resource: any) => void): void
     * loadRes(url: string): void
     */
    loadRes (url, type, progressCallback, completeCallback) {
        var { type, onProgress, onComplete } = this._parseLoadResArgs(type, progressCallback, completeCallback);
        var extname = cc.path.extname(url);
        if (extname) {
            // strip extname
            url = url.slice(0, - extname.length);
        }
        cc.resources.load(url, type, onProgress, onComplete);
    },

    /**
     * `cc.loader.loadResArray` is deprecated, please use {{#crossLink "Bundle/load:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.loadResArray is deprecated, please use cc.resources.load instead
     * @method loadResArray
     * @param {String[]} urls - Array of URLs of the target resource.
     *                          The url is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [progressCallback] - Callback invoked when progression change.
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
     * @param {Number} progressCallback.totalCount - The total number of the items.
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
     * @param {Function} [completeCallback] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are loaded successfully, error will be null.
     * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
     *                                                     If nothing to load, assets will be an empty array.
     * @typescript
     * loadResArray(url: string[], type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
     * loadResArray(url: string[], type: typeof cc.Asset, completeCallback: (error: Error, resource: any[]) => void): void
     * loadResArray(url: string[], type: typeof cc.Asset): void
     * loadResArray(url: string[], progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
     * loadResArray(url: string[], completeCallback: (error: Error, resource: any[]) => void): void
     * loadResArray(url: string[]): void
     * loadResArray(url: string[], type: typeof cc.Asset[]): void
     */
    loadResArray (urls, type, progressCallback, completeCallback) {
        var { type, onProgress, onComplete } = this._parseLoadResArgs(type, progressCallback, completeCallback);
        urls.forEach((url, i) => {
            var extname = cc.path.extname(url);
            if (extname) {
                // strip extname
                urls[i] = url.slice(0, - extname.length);
            }
        })
        cc.resources.load(urls, type, onProgress, onComplete);
    },

    /**
     * `cc.loader.loadResDir` is deprecated, please use {{#crossLink "Bundle/loadDir:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.loadResDir is deprecated, please use cc.resources.loadDir instead
     * @method loadResDir
     * @param {String} url - Url of the target folder.
     *                       The url is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} [progressCallback] - Callback invoked when progression change.
     * @param {Number} progressCallback.completedCount - The number of the items that are already completed.
     * @param {Number} progressCallback.totalCount - The total number of the items.
     * @param {Object} progressCallback.item - The latest item which flow out the pipeline.
     * @param {Function} [completeCallback] - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called
     *                                         with the error. If all assets are loaded successfully, error will be null.
     * @param {Asset[]|Array} completeCallback.assets - An array of all loaded assets.
     *                                             If nothing to load, assets will be an empty array.
     * @param {String[]} completeCallback.urls - An array that lists all the URLs of loaded assets.
     *
     * @typescript
     * loadResDir(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
     * loadResDir(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
     * loadResDir(url: string, type: typeof cc.Asset): void
     * loadResDir(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
     * loadResDir(url: string, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
     * loadResDir(url: string): void
     */
    loadResDir (url, type, progressCallback, completeCallback) {
        var { type, onProgress, onComplete } = this._parseLoadResArgs(type, progressCallback, completeCallback);
        cc.resources.loadDir(url, type, onProgress, function (err, assets) {
            var urls = [];
            if (!err) {
                var infos = cc.resources.getDirWithPath(url, type);
                urls = infos.map(function (info) {
                    return info.path;
                });
            }
            onComplete && onComplete(err, assets, urls);
        });
    },

    /**
     * `cc.loader.getRes` is deprecated, please use {{#crossLink "Bundle/get:method"}}{{/crossLink}} instead
     *
     * @method getRes
     * @param {String} url
     * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
     * @returns {*}
     * @deprecated cc.loader.getRes is deprecated, please use cc.resources.get instead
     */
    getRes (url, type) {
        return cc.assetManager.assets.has(url) ? cc.assetManager.assets.get(url) : cc.resources.get(url, type);
    },

    getResCount () {
        return cc.assetManager.assets.count;
    },

    /**
     * `cc.loader.getDependsRecursively` is deprecated, please use use {{#crossLink "DependUtil/getDepsRecursively:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.getDependsRecursively is deprecated, please use use cc.assetManager.dependUtil.getDepsRecursively instead
     * @method getDependsRecursively
     * @param {Asset|String} owner - The owner asset or the resource url or the asset's uuid
     * @returns {Array}
     */
    getDependsRecursively (owner) {
        if (!owner) return [];
        return dependUtil.getDepsRecursively(typeof owner === 'string' ? owner : owner._uuid).concat([ owner._uuid ]);
    },

    /**
     * `cc.loader.assetLoader` was removed, assetLoader and md5Pipe were merged into {{#crossLink "AssetManager/transformPipeline:property"}}{{/crossLink}}
     *
     * @property assetLoader
     * @deprecated cc.loader.assetLoader was removed, assetLoader and md5Pipe were merged into cc.assetManager.transformPipeline
     * @type {Object}
     */
    get assetLoader () {
        if (CC_DEBUG) {
            cc.error('cc.loader.assetLoader was removed, assetLoader and md5Pipe were merged into cc.assetManager.transformPipeline');
        }
    },

    /**
     * `cc.loader.md5Pipe` is deprecated, assetLoader and md5Pipe were merged into {{#crossLink "AssetManager/transformPipeline:property"}}{{/crossLink}}
     *
     * @property md5Pipe
     * @deprecated cc.loader.md5Pipe is deprecated, assetLoader and md5Pipe were merged into cc.assetManager.transformPipeline
     * @type {Object}
     */
    get md5Pipe () {
        return md5Pipe;
    },

    /**
     * `cc.loader.downloader` is deprecated, please use {{#crossLink "AssetManager/downloader:property"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.downloader is deprecated, please use cc.assetManager.downloader instead
     * @property downloader
     * @type {Object}
     */
    get downloader () {
        return cc.assetManager.downloader;
    },

    /**
     * `cc.loader.loader` is deprecated, please use {{#crossLink "AssetManager/parser:property"}}{{/crossLink}} instead
     *
     * @property loader
     * @type {Object}
     * @deprecated cc.loader.loader is deprecated, please use cc.assetManager.parser instead
     */
    get loader () {
        return cc.assetManager.parser;
    },

    /**
     * `cc.loader.addDownloadHandlers` is deprecated, please use `cc.assetManager.downloader.register` instead
     *
     * @method addDownloadHandlers
     * @param {Object} extMap Custom supported types with corresponded handler
     * @deprecated cc.loader.addDownloadHandlers is deprecated, please use cc.assetManager.downloader.register instead
    */
    addDownloadHandlers (extMap) {
        if (CC_DEBUG) {
            cc.warn('`cc.loader.addDownloadHandlers` is deprecated, please use `cc.assetManager.downloader.register` instead');
        }
        var handler = Object.create(null);
        for (var type in extMap) {
            var func = extMap[type];
            handler['.' + type] = function (url, options, onComplete) {
                func({url}, onComplete);
            };
        }
        cc.assetManager.downloader.register(handler);
    },

    /**
     * `cc.loader.addLoadHandlers` is deprecated, please use `cc.assetManager.parser.register` instead
     *
     * @method addLoadHandlers
     * @param {Object} extMap Custom supported types with corresponded handler
     * @deprecated cc.loader.addLoadHandlers is deprecated, please use cc.assetManager.parser.register instead
     */
    addLoadHandlers (extMap) {
        if (CC_DEBUG) {
            cc.warn('`cc.loader.addLoadHandlers` is deprecated, please use `cc.assetManager.parser.register` instead');
        }
        var handler = Object.create(null);
        for (var type in extMap) {
            var func = extMap[type];
            handler['.' + type] = function (file, options, onComplete) {
                func({content: file}, onComplete);
            };
        }
        cc.assetManager.parser.register(handler);
    },

    flowInDeps () {
        if (CC_DEBUG) {
            cc.error('cc.loader.flowInDeps was removed');
        }
    },

    /**
     * `cc.loader.release` is deprecated, please use {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} instead
     *
     * @method release
     * @param {Asset|String|Array} asset
     * @deprecated cc.loader.release is deprecated, please use cc.assetManager.releaseAsset instead
     */
    release (asset) {
        if (Array.isArray(asset)) {
            for (let i = 0; i < asset.length; i++) {
                var key = asset[i];
                if (typeof key === 'string') key = cc.assetManager.assets.get(key);
                let isBuiltin = cc.assetManager.builtins._assets.find(function (assets) {
                    return assets.find(builtinAsset => builtinAsset === key);
                });
                if (isBuiltin) continue;
                cc.assetManager.releaseAsset(key);
            }
        }
        else if (asset) {
            if (typeof asset === 'string') asset = cc.assetManager.assets.get(asset);
            let isBuiltin = cc.assetManager.builtins._assets.find(function (assets) {
                return assets.find(builtinAsset => builtinAsset === asset);
            });
            if (isBuiltin) return;
            cc.assetManager.releaseAsset(asset);
        }
    },

    /**
     * `cc.loader.releaseAsset` is deprecated, please use {{#crossLink "AssetManager/releaseAsset:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.releaseAsset is deprecated, please use cc.assetManager.releaseAsset instead
     * @method releaseAsset
     * @param {Asset} asset
     */
    releaseAsset (asset) {
        cc.assetManager.releaseAsset(asset);
    },

    /**
     * `cc.loader.releaseRes` is deprecated, please use {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.releaseRes is deprecated, please use cc.assetManager.releaseRes instead
     * @method releaseRes
     * @param {String} url
     * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
     */
    releaseRes (url, type) {
        cc.resources.release(url, type);
    },

    /**
     * `cc.loader.releaseResDir` was removed, please use {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.releaseResDir was removed, please use cc.assetManager.releaseRes instead
     * @method releaseResDir
     */
    releaseResDir () {
        if (CC_DEBUG) {
            cc.error('cc.loader.releaseResDir was removed, please use cc.assetManager.releaseAsset instead');
        }
    },

    /**
     * `cc.loader.releaseAll` is deprecated, please use {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.releaseAll is deprecated, please use cc.assetManager.releaseAll instead
     * @method releaseAll
     */
    releaseAll () {
        cc.assetManager.releaseAll();
        cc.assetManager.assets.clear();
    },

    /**
     * `cc.loader.removeItem` is deprecated, please use `cc.assetManager.assets.remove` instead
     *
     * @deprecated cc.loader.removeItem is deprecated, please use cc.assetManager.assets.remove instead
     * @method removeItem
     * @param {Object} id The id of the item
     * @return {Boolean} succeed or not
     */
    removeItem (key) {
        cc.assetManager.assets.remove(key);
    },

    /**
     * `cc.loader.setAutoRelease` is deprecated, if you want to prevent some asset from auto releasing, please use {{#crossLink "Asset/addRef:method"}}{{/crossLink}} instead
     *
     * @deprecated cc.loader.setAutoRelease is deprecated, if you want to prevent some asset from auto releasing, please use cc.Asset.addRef instead
     * @method setAutoRelease
     * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
     * @param {Boolean} autoRelease - indicates whether should release automatically
     */
    setAutoRelease (asset, autoRelease) {
        if (typeof asset === 'object') asset = asset._uuid;
        this._autoReleaseSetting[asset] = !!autoRelease;
    },

    /**
     * `cc.loader.setAutoReleaseRecursively` is deprecated, if you want to prevent some asset from auto releasing, please use {{#crossLink "Asset/addRef:method"}}{{/crossLink}} instead
     *
     * @method setAutoReleaseRecursively
     * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
     * @param {Boolean} autoRelease - indicates whether should release automatically
     * @deprecated cc.loader.setAutoReleaseRecursively is deprecated, if you want to prevent some asset from auto releasing, please use cc.Asset.addRef instead
     */
    setAutoReleaseRecursively (asset, autoRelease) {
        if (typeof asset === 'object') asset = asset._uuid;
        autoRelease = !!autoRelease;
        this._autoReleaseSetting[asset] = autoRelease;
        var depends = dependUtil.getDepsRecursively(asset);
        for (var i = 0; i < depends.length; i++) {
            var depend = depends[i];
            this._autoReleaseSetting[depend] = autoRelease;
        }
    },

    /**
     * `cc.loader.isAutoRelease` is deprecated
     *
     * @method isAutoRelease
     * @param {Asset|String} assetOrUrl - asset object or the raw asset's url
     * @returns {Boolean}
     * @deprecated cc.loader.isAutoRelease is deprecated
     */
    isAutoRelease (asset) {
        if (typeof asset === 'object') asset = asset._uuid;
        return !!this._autoReleaseSetting[asset];
    }
};

/**
 * @class Downloader
 */
/**
 * `cc.loader.downloader.loadSubpackage` is deprecated, please use {{#crossLink "AssetManager/loadBundle:method"}}{{/crossLink}} instead
 *
 * @deprecated cc.loader.downloader.loadSubpackage is deprecated, please use AssetManager.loadBundle instead
 * @method loadSubpackage
 * @param {String} name - Subpackage name
 * @param {Function} [completeCallback] -  Callback invoked when subpackage loaded
 * @param {Error} completeCallback.error - error information
 */
downloader.loadSubpackage = function (name, completeCallback) {
    cc.assetManager.loadBundle(name, null, completeCallback);
};

/**
 * @deprecated cc.AssetLibrary is deprecated, please backup your project and upgrade to cc.assetManager
 */
var AssetLibrary = {

    /**
     * @deprecated cc.AssetLibrary.init is deprecated, please use cc.assetManager.init instead
     */
    init (options) {
        options.importBase = options.libraryPath;
        options.nativeBase = CC_BUILD ? options.rawAssetsBase : options.libraryPath;
        cc.assetManager.init(options);
        if (options.rawAssets) {
            var resources = new cc.AssetManager.Bundle();
            resources.init({
                name: cc.AssetManager.BuiltinBundleName.RESOURCES,
                importBase: options.importBase,
                nativeBase: options.nativeBase,
                paths: options.rawAssets.assets,
                uuids: Object.keys(options.rawAssets.assets),
            });
        }
    },

    /**
     * @deprecated cc.AssetLibrary is deprecated, please use cc.assetManager.loadAny instead
     */
    loadAsset (uuid, onComplete) {
        cc.assetManager.loadAny(uuid, onComplete);
    },

    getLibUrlNoExt () {
        if (CC_DEBUG) {
            cc.error('cc.AssetLibrary.getLibUrlNoExt was removed, if you want to transform url, please use cc.assetManager.utils.getUrlWithUuid instead');
        }
    },

    queryAssetInfo () {
        if (CC_DEBUG) {
            cc.error('cc.AssetLibrary.queryAssetInfo was removed, only available in the editor by using cc.assetManager.editorExtend.queryAssetInfo');
        }
    }
};

/**
 * `cc.url` is deprecated
 *
 * @deprecated cc.url is deprecated
 * @class url
 * @static
 */
cc.url = {
    normalize (url) {
        cc.warnID(1400, 'cc.url.normalize', 'cc.assetManager.utils.normalize');
        return cc.assetManager.utils.normalize(url);
    },

    /**
     * `cc.url.raw` is deprecated, please use `cc.resources.load` directly, or use `Asset.nativeUrl` instead.
     *
     * @deprecated cc.url.raw is deprecated, please use cc.resources.load directly, or use Asset.nativeUrl instead.
     * @method raw
     * @param {String} url
     * @return {String}
     */
    raw (url) {
        cc.warnID(1400, 'cc.url.raw', 'cc.resources.load');
        if (url.startsWith('resources/')) {
            return cc.assetManager._transform({'path': cc.path.changeExtname(url.substr(10)), bundle: cc.AssetManager.BuiltinBundleName.RESOURCES, __isNative__: true, ext: cc.path.extname(url)});
        }
        return '';
    }
};

let onceWarns = {
    loader: true,
    assetLibrary: true,
};

Object.defineProperties(cc, {
    loader: {
        get () {
            if (CC_DEBUG) {
                if (onceWarns.loader) {
                    onceWarns.loader = false;
                    cc.log('cc.loader is deprecated, use cc.assetManager instead please. See https://docs.cocos.com/creator/2.4/manual/zh/release-notes/asset-manager-upgrade-guide.html');
                }
            }
            return loader;
        }
    },

    AssetLibrary: {
        get () {
            if (CC_DEBUG) {
                if (onceWarns.assetLibrary) {
                    onceWarns.assetLibrary = false;
                    cc.log('cc.AssetLibrary is deprecated, use cc.assetManager instead please. See https://docs.cocos.com/creator/manual/zh/release-notes/asset-manager-upgrade-guide.html');
                }
            }
            return AssetLibrary;
        }
    },

    /**
     * `cc.LoadingItems` was removed, please use {{#crossLink "Task"}}{{/crossLink}} instead
     *
     * @deprecated cc.LoadingItems was removed, please use cc.AssetManager.Task instead
     * @class LoadingItems
     */
    LoadingItems: {
        get () {
            cc.warnID(1400, 'cc.LoadingItems', 'cc.AssetManager.Task');
            return cc.AssetManager.Task;
        }
    },

    Pipeline: {
        get () {
            cc.warnID(1400, 'cc.Pipeline', 'cc.AssetManager.Pipeline');
            return cc.AssetManager.Pipeline;
        }
    }
});

js.obsolete(cc, 'cc.RawAsset', 'cc.Asset');

/**
 * @class Asset
 */
/**
 * `cc.Asset.url` is deprecated, please use {{#crossLink "Asset/nativeUrl:property"}}{{/crossLink}} instead
 * @property url
 * @type {String}
 * @deprecated cc.Asset.url is deprecated, please use cc.Asset.nativeUrl instead
 */
js.obsolete(cc.Asset.prototype, 'cc.Asset.url', 'nativeUrl');

/**
 * @class macro
 * @static
 */
Object.defineProperties(cc.macro, {
    /**
     * `cc.macro.DOWNLOAD_MAX_CONCURRENT` is deprecated now, please use {{#crossLink "Downloader/maxConcurrency:property"}}{{/crossLink}} instead
     * 
     * @property DOWNLOAD_MAX_CONCURRENT
     * @type {Number}
     * @deprecated cc.macro.DOWNLOAD_MAX_CONCURRENT is deprecated now, please use cc.assetManager.downloader.maxConcurrency instead
     */
    DOWNLOAD_MAX_CONCURRENT: {
        get () {
            return cc.assetManager.downloader.maxConcurrency;
        },

        set (val) {
            cc.assetManager.downloader.maxConcurrency = val;
        }
    }
});

Object.assign(cc.director, {
    _getSceneUuid (sceneName) {
        cc.assetManager.main.getSceneInfo(sceneName);
    }
});

Object.defineProperties(cc.game, {
    _sceneInfos: {
        get () {
            var scenes = [];
            cc.assetManager.main._config.scenes.forEach(function (val) {
                scenes.push(val);
            });
            return scenes;
        }
    }
});

var parseParameters = utilities.parseParameters;
utilities.parseParameters = function (options, onProgress, onComplete) {
    var result = parseParameters(options, onProgress, onComplete);
    result.onProgress = result.onProgress || loader.onProgress;
    return result;
};

var autoRelease = releaseManager._autoRelease;
releaseManager._autoRelease = function () {
    autoRelease.apply(this, arguments);
    var releaseSettings = loader._autoReleaseSetting;
    var keys = Object.keys(releaseSettings);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (releaseSettings[key] === true) {
            var asset = cc.assetManager.assets.get(key);
            asset && releaseManager.tryRelease(asset);
        }
    }
};