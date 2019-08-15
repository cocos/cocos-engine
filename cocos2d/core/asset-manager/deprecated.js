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

var loader = {
    _onProgress: null,
    _autoReleaseSetting: Object.create(null),
    /**
     * @deprecated `cc.loader._cache` is deprecated now, please use `cc.assetManager._assets` instead
     */
    get _cache () {
        return cc.assetManager._assets._map;
    },

    /**
     * @deprecated `cc.loader.load` is deprecated now, please use `cc.assetManager.load` instead
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
                        cc.assetManager._assets.add(url, asset);
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
     * @deprecated cc.loader.getXMLHttpRequest is deprecated now, please use `XMLHttpRequest` directly
     */
    getXMLHttpRequest () {
        return new XMLHttpRequest();
    },

    /**
     * @deprecated cc.loader.onProgress is deprecated now, please transfer onProgress to API as a parameter
     */
    set onProgress (val) {
        this._onProgress = val;
    },

    get onProgress () {
        return this._onProgress;
    },

    _parseLoadResArgs: utilities.parseLoadResArgs,

    /**
     * @deprecated `cc.loader.getItem` is deprecated now, please use `cc.assetManager._assets` instead
     */
    getItem (key) {
        return cc.assetManager._assets.has(key) ? { content: cc.assetManager._assets.get(key)} : null; 
    },

    /**
     * @deprecated `cc.loader.loadRes` is deprecated now, please use `cc.assetManager.loadRes` instead
     */
    loadRes (url, type, progressCallback, completeCallback) {
        var { type, onProgress, onComplete } = this._parseLoadResArgs(type, progressCallback, completeCallback);
        cc.assetManager.loadRes(url, type, onProgress, onComplete);
    },

    /**
     * @deprecated `cc.loader.loadResArray` is deprecated now, please use `cc.assetManager.loadRes` instead
     */
    loadResArray (urls, type, progressCallback, completeCallback) {
        var { type, onProgress, onComplete } = this._parseLoadResArgs(type, progressCallback, completeCallback);
        cc.assetManager.loadRes(urls, type, onProgress, onComplete);
    },

    /**
     * @deprecated `cc.loader.loadResDir` is deprecated now, please use `cc.assetManager.loadResDir` instead
     */
    loadResDir (url, type, progressCallback, completeCallback) {
        var { type, onProgress, onComplete } = this._parseLoadResArgs(type, progressCallback, completeCallback);
        cc.assetManager.loadResDir(url, type, onProgress, function (err, assets) {
            var urls = [];
            if (!err) {
                var infos = cc.assetManager._bundles.get('resources')._config.getDirWithPath(url, type);
                urls = infos.map(function (info) {
                    return info.path;
                });
            }
            onComplete && onComplete(err, assets, urls);
        });
    },

    /**
     * @deprecated `cc.loader.getRes` is deprecated now, please use `cc.assetManager.getRes` instead
     */
    getRes (url, type) {
        return cc.assetManager._assets.has(url) ? cc.assetManager._assets.get(url) : cc.assetManager.getRes(url, type);
    },

    /**
     * @deprecated `cc.loader.getResCount` is deprecated now , please use `cc.assetManager._assets.count` instead
     */
    getResCount () {
        return cc.assetManager._assets.count;
    },

    /**
     * @deprecated `cc.loader.getDependsRecursively` is deprecated now, please use use `cc.assetManager.dependUtil.getDepsRecursively` instead
     */
    getDependsRecursively (owner) {
        if (!owner) return [];
        return cc.assetManager.dependUtil.getDepsRecursively(typeof owner === 'string' ? owner : owner._uuid);
    },

    get assetLoader () {
        cc.error('cc.loader.assetLoader is not supported anymore, assetLoader and md5Pipe were merged into cc.assetManager._transformPipeline');
    },

    /**
     * @deprecated `cc.loader.md5Pipe` is deprecated now, assetLoader and md5Pipe were merged into `cc.assetManager._transformPipeline`
     */
    get md5Pipe () {
        return {
            transformURL (url) {
                url = url.replace(/.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/, function (match, uuid) {
                    var bundle = cc.assetManager._bundles.find(function (bundle) {
                        return bundle._config.getAssetInfo(uuid);
                    });
                    let hashValue = '';
                    if (bundle) {
                        var info = bundle._config.getAssetInfo(uuid);
                        if (url.startsWith(bundle._config.base + bundle._config.nativeBase)) {
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
     * @deprecated `cc.loader.downloader` is deprecated now, please use `cc.assetManager.downloader` instead
     */
    get downloader () {
        return cc.assetManager.downloader;
    },

    /**
     * @deprecated `cc.loader.loader` is deprecated now, please use `cc.assetManager.parser` instead
     */
    get loader () {
        return cc.assetManager.parser;
    },

    /**
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
     * @deprecated `cc.loader.release` is deprecated now, please use `cc.assetManager.release` instead
     */
    release (asset) {
        if (Array.isArray(asset)) {
            for (let i = 0; i < asset.length; i++) {
                var key = asset[i];
                if (typeof key === 'string') key = cc.assetManager._assets.get(key);
                cc.assetManager.release(key, true);
            }
        }
        else if (asset) {
            if (typeof asset === 'string') asset = cc.assetManager._assets.get(asset);
            cc.assetManager.release(asset, true);
        }
    },

    /**
     * @deprecated `cc.loader.releaseAsset` is deprecated now, please use `cc.assetManager.release` instead
     */
    releaseAsset (asset) {
        cc.assetManager.release(asset, true);
    },

    /**
     * @deprecated `cc.loader.releaseRes` is deprecated now, please use `cc.assetManager.releaseRes` instead
     */
    releaseRes (url, type) {
        cc.assetManager.releaseRes(url, type, true);
    },

    releaseResDir () {
        cc.error('cc.loader.releaseResDir is not supported any more, please use cc.assetManager.release instead');
    },

    /**
     * @deprecated `cc.loader.releaseAll` is deprecated now, please use `cc.assetManager.releaseAll` instead
     */
    releaseAll () {
        cc.assetManager.releaseAll(true);
        cc.assetManager._assets.clear();
    },

    /**
     * @deprecated `cc.loader.removeItem` is deprecated now, please use `cc.assetManager._assets.remove` instead
     */
    removeItem (key) {
        cc.assetManager._assets.remove(key);
    },
    
    /**
     * @deprecated `cc.loader.setAutoRelease` is deprecated now, if you want to lock some asset, please use `cc.assetManager.finalizer.lock` instead
     */
    setAutoRelease (asset, autoRelease) {
        if (typeof asset === 'object') asset = asset._uuid;
        this._autoReleaseSetting[asset] = !!autoRelease;
    },
    
    /**
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
     * @deprecated `cc.loader.isAutoRelease` is deprecated now
     */
    isAutoRelease (asset) {
        if (typeof asset === 'object') asset = asset._uuid;
        return !!this._autoReleaseSetting[asset];
    }
};

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
            resources.init({name:'resources', importBase: options.importBase, nativeBase: options.nativeBase, paths: options.rawAssets.assets, uuids: Object.keys(options.rawAssets.assets)});
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
        cc.error('cc.AssetLibrary.queryAssetInfo is not supported any more, only valid in editor as cc.assetManager.editorExtend.queryAssetInfo');
    }
};

cc.url = {
    /**
     * @deprecated `cc.url.normalize` is deprecated now, please use `cc.assetManager.utils.normalize` instead
     */
    normalize (url) {
        return cc.assetManager.utils.normalize(url);
    },

    /**
     * @deprecated `cc.url.raw` is deprecated now, please use `cc.assetManager.loadRes` directly, or use `Asset.nativeUrl` instead.
     */
    raw (url) {
        if (url.startsWith('resources/')) {
            return cc.assetManager.transform({'path': cc.path.changeExtname(url.substr(10)), bundle: 'resources', isNative: true, ext: cc.path.extname(url)});
        }
        return '';
    }
};

Object.defineProperties(cc, {
    /**
     * @deprecated `cc.loader` is deprecated now, please backup your project and upgrade to `cc.assetManager`
     */
    loader: {
        get () {
            return loader;
        }
    },

    /**
     * @deprecated `cc.AssetLibrary` is deprecated, please backup your project and upgrade to `cc.assetManager`
     */
    AssetLibrary: {
        get () {
            return AssetLibrary;
        }
    },

    LoadingItems: {
        get () {
            cc.error('cc.LoadingItems is not supported any more, please backup your project and upgrade to cc.assetManager');
            return function () {};
        }
    }
});

Object.defineProperties(cc.Asset.prototype, {
    /**
     * @deprecated `cc.Asset.url` is deprecated now, please use `cc.Asset.nativeUrl` instead
     */
    url: {
        get () {
            return this.nativeUrl;
        }
    } 
}); 

Object.defineProperties(cc.macro, {
    /**
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

Object.assign(cc.director, {
    /**
     * @deprecated `cc.director.preloadScene` is deprecated now, please use `cc.assetManager.preloadScene` instead
     */
    preloadScene (sceneName, onProgress, onLoaded) {
        cc.assetManager.preloadScene(sceneName, null, onProgress, onLoaded);
    },

    /**
     * @deprecated `cc.director._getSceneUuid` is deprecated now, please use `config.getSceneInfo` instead
     */
    _getSceneUuid (sceneName) {
        cc.assetManager._bundles.get('scenes')._config.getSceneInfo(sceneName);
    }
}); 

Object.defineProperties(cc.game, {
    /**
     * @deprecated `cc.game._sceneInfos` is deprecated now, please use `config.scenes` instead
     */
    _sceneInfos: {
        get () {
            var scenes = [];
            cc.assetManager._bundles.get('scenes')._config.scenes.forEach(function (val) {
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
finalizer._autoRelease = function (oldScene) {
    var result = autoRelease.apply(this, arguments);
    if (CC_TEST || (oldScene && oldScene.autoReleaseAssets)) {
        var releaseSettings = loader._autoReleaseSetting;
        var keys = Object.keys(releaseSettings);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (releaseSettings[key] === true) {
                var asset = cc.assetManager._assets.get(key);
                asset && finalizer.release(asset);
            }
        }
    }
    return result;
};