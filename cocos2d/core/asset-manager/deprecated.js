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
require('../CCDirector');
const utilities = require('./utilities');
const { getDepsRecursively } = require('./depend-util');
const finalizer = require('./finalizer');
const downloader = require('./downloader');


/**
 * `cc.loader` is deprecated now, please backup your project and upgrade to {{#crossLink "AssetManager"}}{{/crossLink}}
 * 
 * @class loader
 * @static
 * @deprecated `cc.loader` is deprecated now, please backup your project and upgrade to `cc.assetManager`
 */
var loader = {
    _onProgress: null,
    _autoReleaseSetting: Object.create(null),
    
    /**
     * @deprecated `cc.loader._cache` is deprecated now, please use `cc.assetManager.assets` instead
     */
    get _cache () {
        return cc.assetManager.assets._map;
    },

    /**
     * `cc.loader.load` is deprecated now, please use {{#crossLink "AssetManager/load:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.load` is deprecated now, please use `cc.assetManager.load` instead
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
                resources[i] = { url: item, isNative: true, isCrossOrigin: true };
            }
            else {
                if (item.type) {
                    item.ext = '.' + item.type;
                    delete item.type;
                }

                if (item.url) {
                    item.isNative = true; 
                    item.isCrossOrigin = true;
                }
            }
        }
        var imageFmt = ['.png', '.jpg', '.bmp', '.jpeg', '.gif', '.ico', '.tiff', '.webp', '.image', '.pvr', '.pkm'];
        var audioFmt = ['.mp3', '.ogg', '.wav', '.m4a'];
        var images = [];
        var audios = [];
        cc.assetManager.load(resources, null, (finish, total, item) => {
            if (item.content) {
                if (imageFmt.indexOf(item.ext) !== -1) { 
                    images.push(item.content);
                }
                else if (audioFmt.indexOf(item.ext) !== -1) {
                    audios.push(item.content);
                }
            }
            progressCallback && progressCallback(finish, total, item);
        }, (err, native) => {
            var out = null;
            if (!err) {
                native = Array.isArray(native) ? native : [native];
                for (var i = 0; i < native.length; i++) {
                    var item = native[i];
                    if (!(item instanceof cc.Asset)) {
                        var asset = item;
                        var url = resources[i].url;
                        if (images.indexOf(asset) !== -1) {
                            asset = new cc.Texture2D();
                            asset._setRawAsset(url, false);
                            asset._nativeAsset = item;
                            native[i] = asset;
                            asset._uuid = url;
                        }
                        else if (audios.indexOf(asset) !== -1) {
                            asset = new cc.AudioClip();
                            asset._setRawAsset(url, false);
                            asset._nativeAsset = item;
                            native[i] = asset;
                            asset._uuid = url;
                        }
                        cc.assetManager.assets.add(url, asset);
                    }
                }
                if (native.length > 1) {
                    var map = Object.create(null);
                    native.forEach(function (asset) {
                        map[asset._uuid] = asset;
                    });
                    out = { isCompleted: function () { return true }, _map: map};
                }
                out = native.length > 1 ? { isCompleted: function () { return true }, _map: native } : native[0];
            }
            completeCallback && completeCallback(err, out);
        });
    },

    /**
     * `cc.loader.getXMLHttpRequest` is deprecated now, please use `XMLHttpRequest` directly
     *
     * @method getXMLHttpRequest
     * @deprecated `cc.loader.getXMLHttpRequest` is deprecated now, please use `XMLHttpRequest` directly
     * @returns {XMLHttpRequest}
     */
    getXMLHttpRequest () {
        return new XMLHttpRequest();
    },

    /**
     * @deprecated `cc.loader.onProgress` is deprecated now, please transfer onProgress to API as a parameter
     */
    set onProgress (val) {
        this._onProgress = val;
    },

    get onProgress () {
        return this._onProgress;
    },

    _parseLoadResArgs: utilities.parseLoadResArgs,

    /**
     * `cc.loader.getItem` is deprecated now, please use `cc.assetManager._asset.get`  instead
     * 
     * @method getItem
     * @param {Object} id The id of the item
     * @return {Object}
     * @deprecated `cc.loader.getItem` is deprecated now, please use `cc.assetManager._asset.get`  instead
     */
    
    getItem (key) {
        return cc.assetManager.assets.has(key) ? { content: cc.assetManager.assets.get(key)} : null; 
    },

    /**
     * `cc.loader.loadRes` is deprecated now, please use {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}}  instead
     * 
     * @deprecated `cc.loader.loadRes` is deprecated now, please use `cc.assetManager.loadRes`  instead
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
        cc.assetManager.loadRes(url, type, onProgress, onComplete);
    },

    /**
     * `cc.loader.loadResArray` is deprecated now, please use {{#crossLink "AssetManager/loadRes:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.loadResArray` is deprecated now, please use `cc.assetManager.loadRes` instead
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
        cc.assetManager.loadRes(urls, type, onProgress, onComplete);
    },

    /**
     * `cc.loader.loadResDir` is deprecated now, please use {{#crossLink "AssetManager/loadResDir:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.loadResDir` is deprecated now, please use `cc.assetManager.loadResDir` instead
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
        cc.assetManager.loadResDir(url, type, onProgress, function (err, assets) {
            var urls = [];
            if (!err) {
                var infos = cc.assetManager.bundles.get(cc.AssetManager.BuiltinBundle.RESOURCES).config.getDirWithPath(url, type);
                urls = infos.map(function (info) {
                    return info.path;
                });
            }
            onComplete && onComplete(err, assets, urls);
        });
    },

    /**
     * `cc.loader.getRes` is deprecated now, please use {{#crossLink "AssetManager/getRes:method"}}{{/crossLink}} instead
     * 
     * @method getRes
     * @param {String} url
     * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
     * @returns {*}
     * @deprecated `cc.loader.getRes` is deprecated now, please use `cc.assetManager.getRes` instead
     */
    getRes (url, type) {
        return cc.assetManager.assets.has(url) ? cc.assetManager.assets.get(url) : cc.assetManager.getRes(url, type);
    },

    /**
     * @deprecated `cc.loader.getResCount` is deprecated now , please use `cc.assetManager.assets.count` instead
     */
    getResCount () {
        return cc.assetManager.assets.count;
    },

    /**
     * `cc.loader.getDependsRecursively` is deprecated now, please use use {{#crossLink "DependUtil/getDepsRecursively:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.getDependsRecursively` is deprecated now, please use use `cc.assetManager.dependUtil.getDepsRecursively` instead
     * @method getDependsRecursively
     * @param {Asset|String} owner - The owner asset or the resource url or the asset's uuid
     * @returns {Array}
     */
    getDependsRecursively (owner) {
        if (!owner) return [];
        return cc.assetManager.dependUtil.getDepsRecursively(typeof owner === 'string' ? owner : owner._uuid);
    },

    /**
     * `cc.loader.assetLoader` is not supported anymore, assetLoader and md5Pipe were merged into {{#crossLink "AssetManager/transformPipeline:property"}}{{/crossLink}}
     * 
     * @property assetLoader
     * @deprecated `cc.loader.assetLoader` is not supported anymore, assetLoader and md5Pipe were merged into `cc.assetManager.transformPipeline`
     * @type {Object}
     */
    get assetLoader () {
        cc.error('cc.loader.assetLoader is not supported anymore, assetLoader and md5Pipe were merged into cc.assetManager.transformPipeline');
    },

    /**
     * `cc.loader.md5Pipe` is deprecated now, assetLoader and md5Pipe were merged into {{#crossLink "AssetManager/transformPipeline:property"}}{{/crossLink}}
     * 
     * @property md5Pipe
     * @deprecated `cc.loader.md5Pipe` is deprecated now, assetLoader and md5Pipe were merged into `cc.assetManager.transformPipeline`
     * @type {Object}
     */
    get md5Pipe () {
        return {
            transformURL (url) {
                url = url.replace(/.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/, function (match, uuid) {
                    var bundle = cc.assetManager.bundles.find(function (bundle) {
                        return bundle.config.getAssetInfo(uuid);
                    });
                    let hashValue = '';
                    if (bundle) {
                        var info = bundle.config.getAssetInfo(uuid);
                        if (url.startsWith(bundle.config.base + bundle.config.nativeBase)) {
                            hashValue = info.nativeVer;
                        }
                        else {
                            hashValue = info.ver;
                        }
                    }
                    return hashValue ? match + '.' + hashValue : match;
                });
                return url
            }
        }
    },

    /**
     * `cc.loader.downloader` is deprecated now, please use {{#crossLink "AssetManager/downloader:property"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.downloader` is deprecated now, please use `cc.assetManager.downloader` instead
     * @property downloader
     * @type {Object}
     */
    get downloader () {
        return cc.assetManager.downloader;
    },

    /**
     * `cc.loader.loader` is deprecated now, please use {{#crossLink "AssetManager/parser:property"}}{{/crossLink}} instead
     * 
     * @property loader
     * @type {Object}
     * @deprecated `cc.loader.loader` is deprecated now, please use `cc.assetManager.parser` instead
     */
    get loader () {
        return cc.assetManager.parser;
    },

    /**
     * `cc.loader.addDownloadHandlers` is deprecated, please use `cc.assetManager.downloader.register` instead
     * 
     * @method addDownloadHandlers
     * @param {Object} extMap Custom supported types with corresponded handler
     * @deprecated `cc.loader.addDownloadHandlers` is deprecated, please use `cc.assetManager.downloader.register` instead
    */
    addDownloadHandlers (extMap) {
        var handler = Object.create(null);
        for (var type in extMap) {
            var func = extMap[type];
            handler['.' + type] = function (url, options, onComplete) {
                func({url}, onComplete);
            }
        }
        cc.assetManager.downloader.register(handler);
    },

    /**
     * `cc.loader.addLoadHandlers` is deprecated, please use `cc.assetManager.parser.register` instead
     * 
     * @method addLoadHandlers
     * @param {Object} extMap Custom supported types with corresponded handler
     * @deprecated `cc.loader.addLoadHandlers` is deprecated, please use `cc.assetManager.parser.register` instead
     */
    addLoadHandlers (extMap) {
        var handler = Object.create(null);
        for (var type in extMap) {
            var func = extMap[type];
            handler['.' + type] = function (file, options, onComplete) {
                func({content: file}, onComplete);
            }
        }
        cc.assetManager.parser.register(handler);
    },

    flowInDeps () {
        cc.error('cc.loader.flowInDeps is not supported anymore');
    },

    /**
     * `cc.loader.release` is deprecated now, please use {{#crossLink "AssetManager/release:method"}}{{/crossLink}} instead
     * 
     * @method release
     * @param {Asset|String|Array} asset
     * @deprecated `cc.loader.release` is deprecated now, please use `cc.assetManager.release` instead
     */
    release (asset) {
        if (Array.isArray(asset)) {
            for (let i = 0; i < asset.length; i++) {
                var key = asset[i];
                if (typeof key === 'string') key = cc.assetManager.assets.get(key);
                cc.assetManager.release(key, true);
            }
        }
        else if (asset) {
            if (typeof asset === 'string') asset = cc.assetManager.assets.get(asset);
            cc.assetManager.release(asset, true);
        }
    },

    /**
     * `cc.loader.releaseAsset` is deprecated now, please use {{#crossLink "AssetManager/release:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.releaseAsset` is deprecated now, please use `cc.assetManager.release` instead
     * @method releaseAsset
     * @param {Asset} asset
     */
    releaseAsset (asset) {
        cc.assetManager.release(asset, true);
    },

    /**
     * `cc.loader.releaseRes` is deprecated now, please use {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.releaseRes` is deprecated now, please use `cc.assetManager.releaseRes` instead
     * @method releaseRes
     * @param {String} url
     * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
     */
    releaseRes (url, type) {
        cc.assetManager.releaseRes(url, type, true);
    },

    /**
     * `cc.loader.releaseResDir` is not supported any more, please use {{#crossLink "AssetManager/releaseRes:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.releaseResDir` is not supported any more, please use `cc.assetManager.releaseRes` instead
     * @method releaseResDir
     */
    releaseResDir () {
        cc.error('cc.loader.releaseResDir is not supported any more, please use cc.assetManager.release instead');
    },

    /**
     * `cc.loader.releaseAll` is deprecated now, please use {{#crossLink "AssetManager/releaseAll:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.releaseAll` is deprecated now, please use `cc.assetManager.releaseAll` instead
     * @method releaseAll
     */
    releaseAll () {
        cc.assetManager.releaseAll(true);
        cc.assetManager.assets.clear();
    },

    /**
     * `cc.loader.removeItem` is deprecated now, please use `cc.assetManager.assets.remove` instead
     * 
     * @deprecated `cc.loader.removeItem` is deprecated now, please use `cc.assetManager.assets.remove` instead
     * @method removeItem
     * @param {Object} id The id of the item
     * @return {Boolean} succeed or not
     */
    removeItem (key) {
        cc.assetManager.assets.remove(key);
    },
    
    /**
     * `cc.loader.setAutoRelease` is deprecated now, if you want to lock some asset, please use {{#crossLink "Finalizer/lock:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.loader.setAutoRelease` is deprecated now, if you want to lock some asset, please use `cc.assetManager.finalizer.lock` instead
     * @method setAutoRelease
     * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
     * @param {Boolean} autoRelease - indicates whether should release automatically
     */
    setAutoRelease (asset, autoRelease) {
        if (typeof asset === 'object') asset = asset._uuid;
        this._autoReleaseSetting[asset] = !!autoRelease;
    },
    
    /**
     * `cc.loader.setAutoReleaseRecursively` is deprecated now, if you want to lock some asset, please use {{#crossLink "Finalizer/lock:method"}}{{/crossLink}} instead
     * 
     * @method setAutoReleaseRecursively
     * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
     * @param {Boolean} autoRelease - indicates whether should release automatically
     * @deprecated `cc.loader.setAutoReleaseRecursively` is deprecated now, if you want to lock some asset, please use `cc.assetManager.finalizer.lock` instead
     */
    setAutoReleaseRecursively (asset, autoRelease) {
        if (typeof asset === 'object') asset = asset._uuid;
        autoRelease = !!autoRelease;
        this._autoReleaseSetting[asset] = autoRelease;
        var depends = getDepsRecursively(asset);
        for (var i = 0; i < depends.length; i++) {
            var depend = depends[i];
            this._autoReleaseSetting[depend] = autoRelease;
        }
    },

    /**
     * `cc.loader.isAutoRelease` is deprecated now
     * 
     * @method isAutoRelease
     * @param {Asset|String} assetOrUrl - asset object or the raw asset's url
     * @returns {Boolean}
     * @deprecated `cc.loader.isAutoRelease` is deprecated now
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
 * `cc.loader.downloader.loadSubpackage` is deprecated now, please use {{#crossLink "AssetManager/loadBundle:method"}}{{/crossLink}} instead
 * 
 * @deprecated `cc.loader.downloader.loadSubpackage` is deprecated now, please use {{#crossLink "AssetManager/loadBundle:method"}}{{/crossLink}} instead
 * @method loadSubpackage
 * @param {String} name - Subpackage name
 * @param {Function} [completeCallback] -  Callback invoked when subpackage loaded
 * @param {Error} completeCallback.error - error information
 */
downloader.loadSubpackage = function (name, completeCallback) {
    cc.assetManager.loadBundle('assets/' + name, null, completeCallback);
};

/**
 * @deprecated `cc.AssetLibrary` is deprecated, please backup your project and upgrade to `cc.assetManager`
 */
var AssetLibrary = {

    /**
     * @deprecated `cc.AssetLibrary.init` is deprecated now, please use `cc.assetManager.init` instead
     */
    init (options) {
        options.importBase = options.libraryPath;
        options.nativeBase = CC_BUILD ? options.rawAssetsBase : options.libraryPath;
        cc.assetManager.init(options);
        if (options.rawAssets) {
            var resources = new cc.AssetManager.Bundle();
            resources.init({name: cc.AssetManager.BuiltinBundle.RESOURCES, importBase: options.importBase, nativeBase: options.nativeBase, paths: options.rawAssets.assets, uuids: Object.keys(options.rawAssets.assets)});
        }
    },

    /**
     * @deprecated `cc.AssetLibrary` is deprecated now, please use `cc.assetManager.load` instead
     */
    loadAsset (uuid, onComplete) {
        cc.assetManager.load(uuid, onComplete);
    },

    getLibUrlNoExt () {
        cc.error('cc.AssetLibrary.getLibUrlNoExt is not supported any more, if you want to transform url, please use cc.assetManager.helper.getUrlWithUuid instead');
    },

    queryAssetInfo () {
        cc.error('cc.AssetLibrary.queryAssetInfo is not supported any more, only available in the editor by using cc.assetManager.editorExtend.queryAssetInfo');
    }
};

/**
 * `cc.url` is deprecated now
 * 
 * @deprecated `cc.url` is deprecated now
 * @class url
 * @static
 */
cc.url = {
    /**
     * @deprecated `cc.url.normalize` is deprecated now, please use `cc.assetManager.utils.normalize` instead
     */
    normalize (url) {
        return cc.assetManager.utils.normalize(url);
    },

    /**
     * `cc.url.raw` is deprecated now, please use `cc.assetManager.loadRes` directly, or use `Asset.nativeUrl` instead.
     * 
     * @deprecated `cc.url.raw` is deprecated now, please use `cc.assetManager.loadRes` directly, or use `Asset.nativeUrl` instead.
     * @method raw
     * @param {String} url
     * @return {String}
     */
    raw (url) {
        if (url.startsWith('resources/')) {
            return cc.assetManager.transform({'path': cc.path.changeExtname(url.substr(10)), bundle: cc.AssetManager.BuiltinBundle.RESOURCES, isNative: true, ext: cc.path.extname(url)});
        }
        return '';
    }
};

Object.defineProperties(cc, {
    loader: {
        get () {
            return loader;
        }
    },

    AssetLibrary: {
        get () {
            return AssetLibrary;
        }
    },

    /**
     * `cc.LoadingItems` is not supported any more, please use {{#crossLink "Task"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.LoadingItems` is not supported any more, please use `cc.AssetManager.Task` instead
     * @class LoadingItems
     */
    LoadingItems: {
        get () {
            cc.error('cc.LoadingItems is not supported any more, please use cc.AssetManager.Task instead');
            return cc.AssetManager.Task;
        }
    },

    /**
     * @deprecated `cc.Pipeline` is not supported any more, please use `cc.AssetManager.Pipeline` instead
     */
    Pipeline: {
        get () {
            cc.error('cc.Pipeline is not supported any more, please use cc.AssetManager.Pipeline instead');
            return cc.AssetManager.Pipeline;
        }
    }
});

/**
 * @class Asset
 */
Object.defineProperties(cc.Asset.prototype, {

    /**
     * `cc.Asset.url` is deprecated now, please use {{#crossLink "Asset/nativeUrl:property"}}{{/crossLink}} instead
     * 
     * @property url
     * @type {String}
     * @deprecated `cc.Asset.url` is deprecated now, please use `cc.Asset.nativeUrl` instead
     */
    url: {
        get () {
            return this.nativeUrl;
        }
    } 
}); 

/**
 * @class macro
 * @static
 */
Object.defineProperties(cc.macro, {
    /**
     * `cc.macro.DOWNLOAD_MAX_CONCURRENT` is deprecated now, please use {{#crossLink "Downloader/limitations:property"}}{{/crossLink}} instead
     * 
     * @property DOWNLOAD_MAX_CONCURRENT
     * @type {Number}
     * @deprecated `cc.macro.DOWNLOAD_MAX_CONCURRENT` is deprecated now, please use `cc.assetManager.downloader.limitations` instead
     */
    DOWNLOAD_MAX_CONCURRENT: {
        get () {
            return cc.assetManager.downloader.limitations[cc.AssetManager.LoadStrategy.NORMAL].maxConcurrent;
        },

        set (val) {
            cc.assetManager.downloader.limitations[cc.AssetManager.LoadStrategy.NORMAL].maxConcurrent = val;
        }
    }
}); 

/**
 * @class Director
 */
Object.assign(cc.director, {
    /**
     * `cc.director.preloadScene` is deprecated now, please use {{#crossLink "AssetManager/preloadScene:method"}}{{/crossLink}} instead
     * 
     * @deprecated `cc.director.preloadScene` is deprecated now, please use `cc.assetManager.preloadScene` instead
     * @method preloadScene
     * @param {String} sceneName - The name of the scene to preload.
     * @param {Function} [onProgress] - callback, will be called when the load progression change.
     * @param {Number} onProgress.completedCount - The number of the items that are already completed
     * @param {Number} onProgress.totalCount - The total number of the items
     * @param {Object} onProgress.item - The latest item which flow out the pipeline
     * @param {Function} [onLoaded] - callback, will be called after scene loaded.
     * @param {Error} onLoaded.error - null or the error object.
     */
    preloadScene (sceneName, onProgress, onLoaded) {
        cc.assetManager.preloadScene(sceneName, null, onProgress, onLoaded);
    },

    /**
     * @deprecated `cc.director._getSceneUuid` is deprecated now, please use `config.getSceneInfo` instead
     */
    _getSceneUuid (sceneName) {
        cc.assetManager.bundles.get(cc.AssetManager.BuiltinBundle.MAIN).config.getSceneInfo(sceneName);
    }
}); 

Object.defineProperties(cc.game, {
    /**
     * @deprecated `cc.game._sceneInfos` is deprecated now, please use `config.scenes` instead
     */
    _sceneInfos: {
        get () {
            var scenes = [];
            cc.assetManager.bundles.get(cc.AssetManager.BuiltinBundle.MAIN).config.scenes.forEach(function (val) {
                scenes.push(val);
            });
            return scenes;
        }
    }
});

var original = utilities.parseParameters;
utilities.parseParameters = function () {
    var result = original.apply(this, arguments);
    result.onProgress = result.onProgress || loader._onProgress;
    return result;
};

var autoRelease = finalizer._autoRelease;
finalizer._autoRelease = function () {
    var result = autoRelease.apply(this, arguments);
    var releaseSettings = loader._autoReleaseSetting;
    var keys = Object.keys(releaseSettings);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (releaseSettings[key] === true) {
            var asset = cc.assetManager.assets.get(key);
            asset && finalizer.release(asset);
        }
    }
    return result;
};