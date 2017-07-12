/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var JS = require('../platform/js');
var Pipeline = require('./pipeline');
var LoadingItems = require('./loading-items');
var AssetLoader = require('./asset-loader');
var Downloader = require('./downloader');
var Loader = require('./loader');
var AssetTable = require('./asset-table');
var callInNextTick = require('../platform/utils').callInNextTick;
var AutoReleaseUtils = require('./auto-release-utils');

var resources = new AssetTable();

function getXMLHttpRequest () {
    return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject('MSXML2.XMLHTTP');
}

var _info = {url: null, raw: false};

// Convert a resources by finding its real url with uuid, otherwise we will use the uuid or raw url as its url
// So we gurantee there will be url in result
function getResWithUrl (res) {
    var id, result, isUuid;
    if (typeof res === 'object') {
        result = res;
        if (res.url) {
            return result;
        }
        else {
            id = res.uuid;
        }
    }
    else {
        result = {};
        id = res;
    }
    isUuid = result.type ? result.type === 'uuid' : cc.AssetLibrary._getAssetUrl(id);
    cc.AssetLibrary._getAssetInfoInRuntime(id, _info);
    result.url = !isUuid ? id : _info.url;
    if (_info.url && result.type === 'uuid' && _info.raw) {
        result.type = null;
        result.isRawAsset = true;
    }
    else if (!isUuid) {
        result.isRawAsset = true;
    }
    return result;
}

var _sharedResources = [];
var _sharedList = [];

/**
 * Loader for resource loading process. It's a singleton object.
 * @class loader
 * @extends Pipeline
 * @static
 */
function CCLoader () {
    var assetLoader = new AssetLoader();
    var downloader = new Downloader();
    var loader = new Loader();

    Pipeline.call(this, [
        assetLoader,
        downloader,
        loader
    ]);

    /**
     * The asset loader in cc.loader's pipeline, it's by default the first pipe.
     * It's used to identify an asset's type, and determine how to download it.
     * @property assetLoader
     * @type {Object}
     */
    this.assetLoader = assetLoader;

    /**
     * The downloader in cc.loader's pipeline, it's by default the second pipe.
     * It's used to download files with several handlers: pure text, image, script, audio, font, uuid.
     * You can add your own download function with addDownloadHandlers
     * @property downloader
     * @type {Object}
     */
    this.downloader = downloader;

    /**
     * The downloader in cc.loader's pipeline, it's by default the third pipe.
     * It's used to parse downloaded content with several handlers: JSON, image, plist, fnt, uuid.
     * You can add your own download function with addLoadHandlers
     * @property loader
     * @type {Object}
     */
    this.loader = loader;

    this.onProgress = null;

    // assets to release automatically
    this._autoReleaseSetting = {};
}
JS.extend(CCLoader, Pipeline);
var proto = CCLoader.prototype;

/**
 * Get XMLHttpRequest.
 * @returns {XMLHttpRequest}
 */
proto.getXMLHttpRequest = getXMLHttpRequest;

/**
 * Add custom supported types handler or modify existing type handler for download process.
 * @example
 *  cc.loader.addDownloadHandlers({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 * @method addDownloadHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */
proto.addDownloadHandlers = function (extMap) {
    this.downloader.addHandlers(extMap);
};

/**
 * Add custom supported types handler or modify existing type handler for load process.
 * @example
 *  cc.loader.addLoadHandlers({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 * @method addLoadHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */
proto.addLoadHandlers = function (extMap) {
    this.loader.addHandlers(extMap);
};

/**
 * Load resources with a progression callback and a complete callback.
 * The progression callback is the same as Pipeline's {{#crossLink "LoadingItems/onProgress:method"}}onProgress{{/crossLink}}
 * The complete callback is almost the same as Pipeline's {{#crossLink "LoadingItems/onComplete:method"}}onComplete{{/crossLink}}
 * The only difference is when user pass a single url as resources, the complete callback will set its result directly as the second parameter.
 *
 * @example
 * cc.loader.load('a.png', function (err, tex) {
 *     cc.log('Result should be a texture: ' + (tex instanceof cc.Texture2D));
 * });
 *
 * cc.loader.load('http://example.com/a.png', function (err, tex) {
 *     cc.log('Should load a texture from external url: ' + (tex instanceof cc.Texture2D));
 * });
 *
 * cc.loader.load({url: 'http://example.com/getImageREST?file=a.png', type: 'png'}, function (err, tex) {
 *     cc.log('Should load a texture from RESTful API by specify the type: ' + (tex instanceof cc.Texture2D));
 * });
 *
 * cc.loader.load(['a.png', 'b.json'], function (errors, results) {
 *     if (errors) {
 *         for (var i = 0; i < errors.length; i++) {
 *             cc.log('Error url [' + errors[i] + ']: ' + results.getError(errors[i]));
 *         }
 *     }
 *     var aTex = results.getContent('a.png');
 *     var bJsonObj = results.getContent('b.json');
 * });
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
proto.load = function(resources, progressCallback, completeCallback) {
    if (completeCallback === undefined) {
        completeCallback = progressCallback;
        progressCallback = this.onProgress || null;
    }

    var self = this;
    var singleRes = false;
    if (!(resources instanceof Array)) {
        singleRes = true;
        resources = resources ? [resources] : [];
    }

    _sharedResources.length = 0;
    for (var i = 0; i < resources.length; ++i) {
        var resource = resources[i];
        // Backward compatibility
        if (resource && resource.id) {
            cc.warnID(4920, resource.id);
            if (!resource.uuid && !resource.url) {
                resource.url = resource.id;
            }
        }
        var res = getResWithUrl(resource);
        if (!res.url && !res.uuid)
            continue;
        var item = this.getItem(res.url);
        _sharedResources.push(item || res);
    }

    var queue = LoadingItems.create(this, progressCallback, function (errors, items) {
        callInNextTick(function () {
            if (!completeCallback)
                return;

            if (singleRes) {
                var id = res.url;
                completeCallback.call(self, items.getError(id), items.getContent(id));
            }
            else {
                completeCallback.call(self, errors, items);
            }
            completeCallback = null;

            if (CC_EDITOR) {
                for (var id in self._cache) {
                    if (self._cache[id].complete) {
                        self.removeItem(id);
                    }
                }
            }
            items.destroy();
        });
    });
    LoadingItems.initQueueDeps(queue);
    queue.append(_sharedResources);
    _sharedResources.length = 0;
};

proto.flowInDeps = function (owner, urlList, callback) {
    _sharedList.length = 0;
    for (var i = 0; i < urlList.length; ++i) {
        var res = getResWithUrl(urlList[i]);
        if (!res.url && ! res.uuid)
            continue;
        var item = this.getItem(res.url);
        if (item) {
            _sharedList.push(item);
        }
        else {
            _sharedList.push(res);
        }
    }

    var queue = LoadingItems.create(this, owner ? function (completedCount, totalCount, item) {
        if (this._ownerQueue && this._ownerQueue.onProgress) {
            this._ownerQueue._childOnProgress(item);
        }
    } : null, function (errors, items) {
        callback(errors, items);
        // Clear deps because it's already done
        // Each item will only flowInDeps once, so it's still safe here
        owner && owner.deps && (owner.deps.length = 0);
        items.destroy();
    });
    if (owner) {
        var ownerQueue = LoadingItems.getQueue(owner);
        // Set the root ownerQueue, if no ownerQueue defined in ownerQueue, it's the root
        queue._ownerQueue = ownerQueue._ownerQueue || ownerQueue;
    }
    var accepted = queue.append(_sharedList, owner);
    _sharedList.length = 0;
    return accepted;
};

proto._resources = resources;
proto._getResUuid = function (url, type, quiet) {
    if (!url) {
        return null;
    }
    // Ignore parameter
    var index = url.indexOf('?');
    if (index !== -1)
        url = url.substr(0, index);
    var uuid = resources.getUuid(url, type);
    if ( !uuid ) {
        var extname = cc.path.extname(url);
        if (extname) {
            // strip extname
            url = url.slice(0, - extname.length);
            uuid = resources.getUuid(url, type);
            if (uuid && !quiet) {
                cc.warnID(4901, url, extname);
            }
        }
    }
    return uuid;
};
// Find the asset's reference id in loader, asset could be asset object, asset uuid or asset url
proto._getReferenceKey = function (assetOrUrlOrUuid) {
    var key;
    if (typeof assetOrUrlOrUuid === 'object') {
        key = assetOrUrlOrUuid._uuid || null;
    }
    else if (typeof assetOrUrlOrUuid === 'string') {
        key = this._getResUuid(assetOrUrlOrUuid, null, true) || assetOrUrlOrUuid;
    }
    if (!key) {
        cc.warnID(4800, assetOrUrlOrUuid);
        return key;
    }
    cc.AssetLibrary._getAssetInfoInRuntime(key, _info);
    return this._cache[_info.url] ? _info.url : key;
};

proto._urlNotFound = function (url, type, completeCallback) {
    callInNextTick(function () {
        url = cc.url.normalize(url);
        var info = `${type ? JS.getClassName(type) : 'Asset'} in "resources/${url}" does not exist.`;
        if (completeCallback) {
            completeCallback(new Error(info), []);
        }
    });
};

/**
 * @param {Function} [type]
 * @param {Function} [onProgress]
 * @param {Function} onComplete
 * @returns {Object} arguments
 * @returns {Function} arguments.type
 * @returns {Function} arguments.onProgress
 * @returns {Function} arguments.onComplete
 */
proto._parseLoadResArgs = function (type, onProgress, onComplete) {
    if (onComplete === undefined) {
        var isValidType = cc.isChildClassOf(type, cc.RawAsset);
        if (onProgress) {
            onComplete = onProgress;
            if (isValidType) {
                onProgress = this.onProgress || null;
            }
        }
        else if (onProgress === undefined && !isValidType) {
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
        onComplete: onComplete,
    };
};

/**
 * Load resources from the "resources" folder inside the "assets" folder of your project.<br>
 * <br>
 * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
 *
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
 * @example
 *
 * // load the prefab (project/assets/resources/misc/character/cocos) from resources folder
 * cc.loader.loadRes('misc/character/cocos', function (err, prefab) {
 *     if (err) {
 *         cc.error(err.message || err);
 *         return;
 *     }
 *     cc.log('Result should be a prefab: ' + (prefab instanceof cc.Prefab));
 * });
 *
 * // load the sprite frame of (project/assets/resources/imgs/cocos.png) from resources folder
 * cc.loader.loadRes('imgs/cocos', cc.SpriteFrame, function (err, spriteFrame) {
 *     if (err) {
 *         cc.error(err.message || err);
 *         return;
 *     }
 *     cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
 * });
 * @typescript
 * loadRes(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
 * loadRes(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void): void
 * loadRes(url: string, type: typeof cc.Asset): void
 * loadRes(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any) => void)|null): void
 * loadRes(url: string, completeCallback: (error: Error, resource: any) => void): void
 * loadRes(url: string): void
 */
proto.loadRes = function (url, type, progressCallback, completeCallback) {
    var args = this._parseLoadResArgs(type, progressCallback, completeCallback);
    type = args.type;
    progressCallback = args.onProgress;
    completeCallback = args.onComplete;
    var self = this;
    var uuid = self._getResUuid(url, type);
    if (uuid) {
        this.load(
            {
                type: 'uuid',
                uuid: uuid
            },
            progressCallback,
            function (err, asset) {
                if (asset) {
                    // should not release these assets, even if they are static referenced in the scene.
                    self.setAutoReleaseRecursively(uuid, false);
                }
                if (completeCallback) {
                    completeCallback(err, asset);
                }
            }
        );
    }
    else {
        self._urlNotFound(url, type, completeCallback);
    }
};

proto._loadResUuids = function (uuids, progressCallback, completeCallback, urls) {
    if (uuids.length > 0) {
        var self = this;
        var res = uuids.map(function (uuid) {
            return {
                type: 'uuid',
                uuid: uuid
            }
        });
        this.load(res, progressCallback, function (errors, items) {
            if (completeCallback) {
                var assetRes = [];
                var urlRes = urls && [];
                for (var i = 0; i < res.length; ++i) {
                    var uuid = res[i].uuid;
                    var id = this._getReferenceKey(uuid);
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
                }
                else {
                    completeCallback(errors, assetRes);
                }
            }
        });
    }
    else {
        if (completeCallback) {
            callInNextTick(function () {
                if (urls) {
                    completeCallback(null, [], []);
                }
                else {
                    completeCallback(null, []);
                }
            });
        }
    }
};

/**
 * This method is like {{#crossLink "loader/loadRes:method"}}{{/crossLink}} except that it accepts array of url.
 *
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
 * @example
 *
 * // load the SpriteFrames from resources folder
 * var spriteFrames;
 * var urls = ['misc/characters/character_01', 'misc/weapons/weapons_01'];
 * cc.loader.loadResArray(urls, cc.SpriteFrame, function (err, assets) {
 *     if (err) {
 *         cc.error(err);
 *         return;
 *     }
 *     spriteFrames = assets;
 *     // ...
 * });
 * @typescript
 * loadResArray(url: string[], type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
 * loadResArray(url: string[], type: typeof cc.Asset, completeCallback: (error: Error, resource: any[]) => void): void
 * loadResArray(url: string[], type: typeof cc.Asset): void
 * loadResArray(url: string[], progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[]) => void)|null): void
 * loadResArray(url: string[], completeCallback: (error: Error, resource: any[]) => void): void
 * loadResArray(url: string[]): void
 */
proto.loadResArray = function (urls, type, progressCallback, completeCallback) {
    var args = this._parseLoadResArgs(type, progressCallback, completeCallback);
    type = args.type;
    progressCallback = args.onProgress;
    completeCallback = args.onComplete;

    var uuids = [];
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        var uuid = this._getResUuid(url, type);
        if (uuid) {
            uuids.push(uuid);
        }
        else {
            this._urlNotFound(url, type, completeCallback);
            return;
        }
    }
    this._loadResUuids(uuids, progressCallback, completeCallback);
};

/**
 * Load all assets in a folder inside the "assets/resources" folder of your project.<br>
 * <br>
 * Note: All asset URLs in Creator use forward slashes, URLs using backslashes will not work.
 *
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
 * @example
 *
 * // load the texture (resources/imgs/cocos.png) and the corresponding sprite frame
 * cc.loader.loadResDir('imgs/cocos', function (err, assets) {
 *     if (err) {
 *         cc.error(err);
 *         return;
 *     }
 *     var texture = assets[0];
 *     var spriteFrame = assets[1];
 * });
 *
 * // load all textures in "resources/imgs/"
 * cc.loader.loadResDir('imgs', cc.Texture2D, function (err, textures) {
 *     var texture1 = textures[0];
 *     var texture2 = textures[1];
 * });
 *
 * // load all JSONs in "resources/data/"
 * cc.loader.loadResDir('data', function (err, objects, urls) {
 *     var data = objects[0];
 *     var url = urls[0];
 * });
 * @typescript
 * loadResDir(url: string, type: typeof cc.Asset, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
 * loadResDir(url: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
 * loadResDir(url: string, type: typeof cc.Asset): void
 * loadResDir(url: string, progressCallback: (completedCount: number, totalCount: number, item: any) => void, completeCallback: ((error: Error, resource: any[], urls: string[]) => void)|null): void
 * loadResDir(url: string, completeCallback: (error: Error, resource: any[], urls: string[]) => void): void
 * loadResDir(url: string): void
 */
proto.loadResDir = function (url, type, progressCallback, completeCallback) {
    var args = this._parseLoadResArgs(type, progressCallback, completeCallback);
    type = args.type;
    progressCallback = args.onProgress;
    completeCallback = args.onComplete;

    var urls = [];
    var uuids = resources.getUuidArray(url, type, urls);
    this._loadResUuids(uuids, progressCallback, completeCallback, urls);
};

/**
 * Get resource data by id. <br>
 * When you load resources with {{#crossLink "loader/load:method"}}{{/crossLink}} or {{#crossLink "loader/loadRes:method"}}{{/crossLink}},
 * the url will be the unique identity of the resource.
 * After loaded, you can acquire them by passing the url to this API.
 *
 * @method getRes
 * @param {String} url
 * @param {Function} [type] - Only asset of type will be returned if this argument is supplied.
 * @returns {*}
 */
proto.getRes = function (url, type) {
    var item = this._cache[url];
    if (!item) {
        var uuid = this._getResUuid(url, type, true);
        if (uuid) {
            var ref = this._getReferenceKey(uuid);
            item = this._cache[ref];
        }
        else {
            return null;
        }
    }
    if (item && item.alias) {
        item = this._cache[item.alias];
    }
    return (item && item.complete) ? item.content : null;
};

/**
 * Get total resources count in loader.
 * @returns {Number}
 */
proto.getResCount = function () {
    return Object.keys(this._cache).length;
};

/**
 * !#en Get all resource dependencies of the requested asset in an array, including itself.
 * The owner parameter accept the following types: 1. The asset itself; 2. The resource url; 3. The asset's uuid.<br>
 * The returned array stores the dependencies with their uuids, after retrieve dependencies,
 * you can release them, access dependent assets by passing the uuid to {{#crossLink "loader/getRes:method"}}{{/crossLink}}, or other stuffs you want.<br>
 * For release all dependencies of an asset, please refer to {{#crossLink "loader/release:method"}}{{/crossLink}}
 * Here is some examples:
 * !#zh 获取一个指定资源的所有依赖资源，包含它自身，并保存在数组中返回。owner 参数接收以下几种类型：1. 资源 asset 对象；2. 资源目录下的 url；3. 资源的 uuid。<br>
 * 返回的数组将仅保存依赖资源的 uuid，获取这些 uuid 后，你可以从 loader 释放这些资源；通过 {{#crossLink "loader/getRes:method"}}{{/crossLink}} 获取某个资源或者进行其他你需要的操作。<br>
 * 想要释放一个资源及其依赖资源，可以参考 {{#crossLink "loader/release:method"}}{{/crossLink}}。下面是一些示例代码：
 *
 * @example
 * // Release all dependencies of a loaded prefab
 * var deps = cc.loader.getDependsRecursively(prefab);
 * cc.loader.release(deps);
 * // Retrieve all dependent textures
 * var deps = cc.loader.getDependsRecursively('prefabs/sample');
 * var textures = [];
 * for (var i = 0; i < deps.length; ++i) {
 *     var item = cc.loader.getRes(deps[i]);
 *     if (item instanceof cc.Texture2D) {
 *         textures.push(item);
 *     }
 * }
 *
 * @method getDependsRecursively
 * @param {Asset|RawAsset|String} owner - The owner asset or the resource url or the asset's uuid
 * @returns {Array}
 */
proto.getDependsRecursively = function (owner) {
    if (owner) {
        var key = this._getReferenceKey(owner);
        var assets = AutoReleaseUtils.getDependsRecursively(key);
        assets.push(key);
        return assets;
    }
    else {
        return [];
    }
};

/**
 * !#en
 * Release the content of an asset or an array of assets by uuid.
 * Start from v1.3, this method will not only remove the cache of the asset in loader, but also clean up its content.
 * For example, if you release a texture, the texture asset and its gl texture data will be freed up.
 * In complexe project, you can use this function with {{#crossLink "loader/getDependsRecursively:method"}}{{/crossLink}} to free up memory in critical circumstances.
 * Notice, this method may cause the texture to be unusable, if there are still other nodes use the same texture, they may turn to black and report gl errors.
 * If you only want to remove the cache of an asset, please use {{#crossLink "pipeline/removeItem:method"}}{{/crossLink}}
 * !#zh
 * 通过 id（通常是资源 url）来释放一个资源或者一个资源数组。
 * 从 v1.3 开始，这个方法不仅会从 loader 中删除资源的缓存引用，还会清理它的资源内容。
 * 比如说，当你释放一个 texture 资源，这个 texture 和它的 gl 贴图数据都会被释放。
 * 在复杂项目中，我们建议你结合 {{#crossLink "loader/getDependsRecursively:method"}}{{/crossLink}} 来使用，便于在设备内存告急的情况下更快地释放不再需要的资源的内存。
 * 注意，这个函数可能会导致资源贴图或资源所依赖的贴图不可用，如果场景中存在节点仍然依赖同样的贴图，它们可能会变黑并报 GL 错误。
 * 如果你只想删除一个资源的缓存引用，请使用 {{#crossLink "pipeline/removeItem:method"}}{{/crossLink}}
 *
 * @example
 * // Release a texture which is no longer need
 * cc.loader.release(texture);
 * // Release all dependencies of a loaded prefab
 * var deps = cc.loader.getDependsRecursively('prefabs/sample');
 * cc.loader.release(deps);
 * // If there is no instance of this prefab in the scene, the prefab and its dependencies like textures, sprite frames, etc, will be freed up.
 * // If you have some other nodes share a texture in this prefab, you can skip it in two ways:
 * // 1. Forbid auto release a texture before release
 * cc.loader.setAutoRelease(texture2d, false);
 * // 2. Remove it from the dependencies array
 * var deps = cc.loader.getDependsRecursively('prefabs/sample');
 * var index = deps.indexOf(texture2d._uuid);
 * if (index !== -1)
 *     deps.splice(index, 1);
 * cc.loader.release(deps);
 *
 * @method release
 * @param {Asset|RawAsset|String|Array} asset
 */
proto.release = function (asset) {
    if (Array.isArray(asset)) {
        for (let i = 0; i < asset.length; i++) {
            var key = asset[i];
            this.release(key);
        }
    }
    else if (asset) {
        var id = this._getReferenceKey(asset);
        var item = this.getItem(id);
        if (item) {
            var removed = this.removeItem(id);
            asset = item.content;
            // TODO: AUDIO
            if (asset instanceof cc.Asset) {
                if (CC_JSB && asset instanceof cc.SpriteFrame && removed) {
                    // for the "Temporary solution" in deserialize.js
                    asset.release();
                }
                var urls = asset.rawUrls;
                for (let i = 0; i < urls.length; i++) {
                    this.release(urls[i]);
                }
            }
            else if (asset instanceof cc.Texture2D) {
                cc.textureCache.removeTextureForKey(item.url);
            }
        }
    }
};

/**
 * !#en Release the asset by its object. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 通过资源对象自身来释放资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseAsset
 * @param {Asset} asset
 */
proto.releaseAsset = function (asset) {
    var uuid = asset._uuid;
    if (uuid) {
        this.release(uuid);
    }
};

/**
 * !#en Release the asset loaded by {{#crossLink "loader/loadRes:method"}}{{/crossLink}}. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 释放通过 {{#crossLink "loader/loadRes:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseRes
 * @param {String} url
 * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
 */
proto.releaseRes = function (url, type) {
    var uuid = this._getResUuid(url, type);
    if (uuid) {
        this.release(uuid);
    }
    else {
        cc.errorID(4914, url);
    }
};

/**
 * !#en Release the all assets loaded by {{#crossLink "loader/loadResDir:method"}}{{/crossLink}}. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 释放通过 {{#crossLink "loader/loadResDir:method"}}{{/crossLink}} 加载的资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseResDir
 * @param {String} url
 * @param {Function} [type] - Only asset of type will be released if this argument is supplied.
 */
proto.releaseResDir = function (url, type) {
    var uuids = resources.getUuidArray(url, type);
    for (var i = 0; i < uuids.length; i++) {
        var uuid = uuids[i];
        this.release(uuid);
    }
};

/**
 * !#en Resource all assets. Refer to {{#crossLink "loader/release:method"}}{{/crossLink}} for detailed informations.
 * !#zh 释放所有资源。详细信息请参考 {{#crossLink "loader/release:method"}}{{/crossLink}}
 *
 * @method releaseAll
 */
proto.releaseAll = function () {
    for (var id in this._cache) {
        this.release(id);
    }
};

// AUTO RELEASE

// override
proto.removeItem = function (key) {
    var removed = Pipeline.prototype.removeItem.call(this, key);
    delete this._autoReleaseSetting[key];
    return removed;
};

/**
 * !#en
 * Indicates whether to release the asset when loading a new scene.<br>
 * By default, when loading a new scene, all assets in the previous scene will be released or preserved
 * according to whether the previous scene checked the "Auto Release Assets" option.
 * On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`
 * will not be affected by that option, remain not released by default.<br>
 * Use this API to change the default behavior on a single asset, to force preserve or release specified asset when scene switching.<br>
 * <br>
 * See: {{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}, {{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 * !#zh
 * 设置当场景切换时是否自动释放资源。<br>
 * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。
 * 而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
 * 使用这个 API 可以在单个资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
 * <br>
 * 参考：{{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}，{{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 *
 * @example
 * // auto release the texture event if "Auto Release Assets" disabled in current scene
 * cc.loader.setAutoRelease(texture2d, true);
 * // don't release the texture even if "Auto Release Assets" enabled in current scene
 * cc.loader.setAutoRelease(texture2d, false);
 * // first parameter can be url
 * cc.loader.setAutoRelease(audioUrl, false);
 *
 * @method setAutoRelease
 * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
 * @param {Boolean} autoRelease - indicates whether should release automatically
 */
proto.setAutoRelease = function (assetOrUrlOrUuid, autoRelease) {
    var key = this._getReferenceKey(assetOrUrlOrUuid);
    if (key) {
        this._autoReleaseSetting[key] = !!autoRelease;
    }
    else if (CC_DEV) {
        cc.warnID(4902);
    }
};

/**
 * !#en
 * Indicates whether to release the asset and its referenced other assets when loading a new scene.<br>
 * By default, when loading a new scene, all assets in the previous scene will be released or preserved
 * according to whether the previous scene checked the "Auto Release Assets" option.
 * On the other hand, assets dynamically loaded by using `cc.loader.loadRes` or `cc.loader.loadResDir`
 * will not be affected by that option, remain not released by default.<br>
 * Use this API to change the default behavior on the specified asset and its recursively referenced assets, to force preserve or release specified asset when scene switching.<br>
 * <br>
 * See: {{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}, {{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 * !#zh
 * 设置当场景切换时是否自动释放资源及资源引用的其它资源。<br>
 * 默认情况下，当加载新场景时，旧场景的资源根据旧场景是否勾选“Auto Release Assets”，将会被释放或者保留。
 * 而使用 `cc.loader.loadRes` 或 `cc.loader.loadResDir` 动态加载的资源，则不受场景设置的影响，默认不自动释放。<br>
 * 使用这个 API 可以在指定资源及资源递归引用到的所有资源上改变这个默认行为，强制在切换场景时保留或者释放指定资源。<br>
 * <br>
 * 参考：{{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}，{{#crossLink "loader/isAutoRelease:method"}}cc.loader.isAutoRelease{{/crossLink}}
 *
 * @example
 * // auto release the SpriteFrame and its Texture event if "Auto Release Assets" disabled in current scene
 * cc.loader.setAutoReleaseRecursively(spriteFrame, true);
 * // don't release the SpriteFrame and its Texture even if "Auto Release Assets" enabled in current scene
 * cc.loader.setAutoReleaseRecursively(spriteFrame, false);
 * // don't release the Prefab and all the referenced assets
 * cc.loader.setAutoReleaseRecursively(prefab, false);
 *
 * @method setAutoReleaseRecursively
 * @param {Asset|String} assetOrUrlOrUuid - asset object or the raw asset's url or uuid
 * @param {Boolean} autoRelease - indicates whether should release automatically
 */
proto.setAutoReleaseRecursively = function (assetOrUrlOrUuid, autoRelease) {
    autoRelease = !!autoRelease;
    var key = this._getReferenceKey(assetOrUrlOrUuid);
    if (key) {
        this._autoReleaseSetting[key] = autoRelease;

        var depends = AutoReleaseUtils.getDependsRecursively(key);
        for (var i = 0; i < depends.length; i++) {
            var depend = depends[i];
            this._autoReleaseSetting[depend] = autoRelease;
        }
    }
    else if (CC_DEV) {
        cc.warnID(4902);
    }
};


/**
 * !#en
 * Returns whether the asset is configured as auto released, despite how "Auto Release Assets" property is set on scene asset.<br>
 * <br>
 * See: {{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}, {{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}
 *
 * !#zh
 * 返回指定的资源是否有被设置为自动释放，不论场景的“Auto Release Assets”如何设置。<br>
 * <br>
 * 参考：{{#crossLink "loader/setAutoRelease:method"}}cc.loader.setAutoRelease{{/crossLink}}，{{#crossLink "loader/setAutoReleaseRecursively:method"}}cc.loader.setAutoReleaseRecursively{{/crossLink}}
 * @method isAutoRelease
 * @param {Asset|String} assetOrUrl - asset object or the raw asset's url
 * @returns {Boolean}
 */
proto.isAutoRelease = function (assetOrUrl) {
    var key = this._getReferenceKey(assetOrUrl);
    if (key) {
        return !!this._autoReleaseSetting[key];
    }
    return false;
};

cc.loader = new CCLoader();

if (CC_EDITOR) {
    cc.loader.refreshUrl = function (uuid, oldUrl, newUrl) {
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

module.exports = cc.loader;
