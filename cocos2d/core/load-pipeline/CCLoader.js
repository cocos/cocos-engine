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
var Downloader = require('./downloader');
var Loader = require('./loader');
var AssetTable = require('./asset-table');
var callInNextTick = require('../platform/utils').callInNextTick;

var downloader = new Downloader();
var loader = new Loader();
var resources = new AssetTable();

/**
 * Loader for resource loading process. It's a singleton object.
 * @class loader
 * @extends Pipeline
 * @static
 */
cc.loader = new Pipeline([
    downloader,
    loader
]);


JS.mixin(cc.loader, {
    /**
     * The downloader in cc.loader's pipeline, it's by default the first pipe.
     * It's used to download files with several handlers: pure text, image, script, audio, font, uuid.
     * You can add your own download function with addDownloadHandlers
     * @property downloader
     * @type {Object}
     */
    downloader: downloader,

    /**
     * The downloader in cc.loader's pipeline, it's by default the second pipe.
     * It's used to parse downloaded content with several handlers: JSON, image, plist, fnt, uuid.
     * You can add your own download function with addLoadHandlers
     * @property loader
     * @type {Object}
     */
    loader: loader,

    /**
     * Get XMLHttpRequest.
     * @returns {XMLHttpRequest}
     */
    getXMLHttpRequest: Pipeline.getXMLHttpRequest,

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
    addDownloadHandlers: function (extMap) {
        downloader.addHandlers(extMap);
    },

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
    addLoadHandlers: function (extMap) {
        loader.addHandlers(extMap);
    },

    /**
     * Load resources with a progression callback and a complete callback.
     * The progression callback is the same as Pipeline's {{#crossLink "Pipeline/onProgress:method"}}onProgress{{/crossLink}}
     * The complete callback is almost the same as Pipeline's {{#crossLink "Pipeline/onComplete:method"}}onComplete{{/crossLink}}
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
     * cc.loader.load({id: 'http://example.com/getImageREST?file=a.png', type: 'png'}, function (err, tex) {
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
     * @param {String|Array} resources - Url list in an array 
     * @param {Function} [progressCallback] - Callback invoked when progression change
     * @param {Function} completeCallback - Callback invoked when all resources loaded
     */
    load: function(resources, progressCallback, completeCallback) {
        
        // COMPATIBLE WITH 0.X
        if (CC_DEV && typeof resources === 'string' && resources.startsWith('resources://')) {
            cc.warn('Sorry, the "resources://" protocol is obsoleted, use cc.loader.loadRes instead please.');
            this.loadRes(resources.slice('resources://'.length), progressCallback, completeCallback);
            return;
        }
        
        if (completeCallback === undefined) {
            completeCallback = progressCallback;
            progressCallback = null;
        }

        var self = this;
        var singleRes = false;
        if (!(resources instanceof Array)) {
            resources = resources ? [resources] : [];
            singleRes = true;
        }
        // Return directly if no resources
        if (resources.length === 0) {
            if (completeCallback) {
                callInNextTick(function () {
                    completeCallback.call(self, null, self._items);
                    completeCallback = null;
                });
            }
            return;
        }

        // Resolve callback
        var error = null;
        var checker = {};
        var totalCount = 0;
        var completedCount = 0;

        function loadedCheck (item) {
            checker[item.id] = item;
            if (item.error) {
                error = error || [];
                error.push(item.id);
            }
            completedCount++;

            progressCallback && progressCallback.call(self, completedCount, totalCount, item);

            for (var url in checker) {
                // Not done yet
                if (!checker[url]) {
                    return;
                }
            }
            // All url completed
            if (completeCallback) {
                if (singleRes) {
                    completeCallback.call(self, item.error, item.content);
                }
                else {
                    completeCallback.call(self, error, self._items);
                }
            }
            completeCallback = null;
        }

        // Add loaded listeners
        for (var i = 0; i < resources.length; ++i) {
            var url = resources[i].id || resources[i];
            if (typeof url !== 'string')
                continue;
            var item = this.getItem(url);
            if ( !item || (item && !item.complete) ) {
                this._items.addListener(url, loadedCheck);
                checker[url] = null;
                totalCount++;
            }
            else if (item && item.complete) {
                checker[url] = item;
                totalCount++;
                completedCount++;
            }
        }

        // No new resources, complete directly
        if (totalCount === completedCount) {
            var id = resources[0].id || resources[0];
            var content = this._items.getContent(id);
            var error = this._items.getError(id);
            if (completeCallback) {
                callInNextTick(function () {
                    if (singleRes) {
                        completeCallback.call(self, error, content);
                    }
                    else {
                        completeCallback.call(self, null, self._items);
                    }
                    completeCallback = null;
                });
            }
        }
        else {
            this.flowIn(resources);
        }
    },

    _resources: resources,
    _getResUuid: function (url, type) {
        var uuid = resources.getUuid(url, type);
        if ( !uuid ) {
            var extname = cc.path.extname(url);
            if (extname) {
                // strip extname
                url = url.slice(0, - extname.length);
                uuid = resources.getUuid(url, type);
                if (uuid) {
                    cc.warn('loadRes: should not specify the extname in ' + url + extname);
                }
            }
        }
        return uuid;
    },

    /**
     * Load resources from the "resources" folder inside the "assets" folder of your project.<br>
     * <br>
     * Note: All asset urls in Creator use forward slashes, urls using backslashes will not work.
     * 
     * @method loadRes
     * @param {String} url - Url of the target resource.
     *                       The url is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} completeCallback - Callback invoked when the resource loaded.
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
     * // load the sprite frame (project/assets/resources/imgs/cocos.png/cocos) from resources folder
     * cc.loader.loadRes('imgs/cocos', cc.SpriteFrame, function (err, spriteFrame) {
     *     if (err) {
     *         cc.error(err.message || err);
     *         return;
     *     }
     *     cc.log('Result should be a sprite frame: ' + (spriteFrame instanceof cc.SpriteFrame));
     * });
     */
    loadRes: function (url, type, completeCallback) {
        if (!completeCallback && type && !cc.isChildClassOf(type, cc.RawAsset)) {
            completeCallback = type;
            type = null;
        }
        var uuid = this._getResUuid(url, type);
        if (uuid) {
            this.load(
                {
                    id: uuid,
                    type: 'uuid',
                    uuid: uuid
                },
                completeCallback
            );
        }
        else {
            callInNextTick(function () {
                var info;
                if (type) {
                    info = cc.js.getClassName(type) + ' in "' + url + '" does not exist.';
                }
                else {
                    info = 'Resources url "' + url + '" does not exist.';
                }
                completeCallback(new Error(info), null);
            });
        }
    },

    /**
     * Load all assets in a folder inside the "assets/resources" folder of your project.<br>
     * <br>
     * Note: All asset urls in Creator use forward slashes, urls using backslashes will not work.
     *
     * @method loadResAll
     * @param {String} url - Url of the target folder.
     *                       The url is relative to the "resources" folder, extensions must be omitted.
     * @param {Function} [type] - Only asset of type will be loaded if this argument is supplied.
     * @param {Function} completeCallback - A callback which is called when all assets have been loaded, or an error occurs.
     * @param {Error} completeCallback.error - If one of the asset failed, the complete callback is immediately called with the error. If all assets are loaded successfully, error will be null.
     * @param {Object[]} completeCallback.assets - An array of all loaded assets. If nothing to load, assets will be an empty array. If error occurs, assets will be null.
     *
     * @example
     *
     * // load the texture (resources/imgs/cocos.png) and sprite frame (resources/imgs/cocos.png/cocos)
     * cc.loader.loadResAll('imgs/cocos', function (err, assets) {
     *     if (err) {
     *         cc.error(err);
     *         return;
     *     }
     *     var texture = assets[0];
     *     var spriteFrame = assets[1];
     * });
     *
     * // load all textures in "resources/imgs/"
     * cc.loader.loadResAll('imgs', cc.Texture2D, function (err, textures) {
     *     if (err) {
     *         cc.error(err);
     *         return;
     *     }
     *     var texture1 = textures[0];
     *     var texture2 = textures[1];
     * });
     */
    loadResAll: function (url, type, completeCallback) {
        if (!completeCallback && type && !cc.isChildClassOf(type, cc.RawAsset)) {
            completeCallback = type;
            type = null;
        }
        var uuids = resources.getUuidArray(url, type);
        var remain = uuids.length;
        if (remain > 0) {
            var results = [];
            var aborted = false;
            function loaded (err, res) {
                if (aborted) {
                    return;
                }
                if (err) {
                    aborted = true;
                    completeCallback(err, null);
                    return;
                }
                results.push(res);
                --remain;
                if (remain === 0) {
                    completeCallback(null, results);
                }
            }
            for (var i = 0, len = remain; i < len; ++i) {
                var uuid = uuids[i];
                this.load(
                    {
                        id: uuid,
                        type: 'uuid',
                        uuid: uuid
                    },
                    loaded
                );
            }
        }
        else {
            callInNextTick(function () {
                completeCallback(null, []);
            });
        }
    },

    /**
     * Get resource data by id. <br>
     * When you load resources with {{#crossLink "loader/load:method"}}{{/crossLink}} or {{#crossLink "loader/loadRes:method"}}{{/crossLink}},
     * the url will be the unique identity of the resource.
     * After loaded, you can acquire them by passing the url to this API.
     *
     * @method getRes
     * @param {String} url
     * @returns {*}
     */
    getRes: function (url) {
        var item = this._items.getContent(url);
        if (!item) {
            var uuid = this._getResUuid(url);
            item = this._items.getContent(uuid);
        }
        return item;
    },

    /**
     * Get total resources count in loader.
     * @returns {Number}
     */
    getResCount: function () {
        return this._items.totalCount;
    },

    /**
     * Returns an item in pipeline.
     * @method getItem
     * @return {LoadingItem}
     */
    getItem: function (url) {
        var item = this._items.map[url];

        if (!item)
            return item;

        if (item.alias)
            item = this._items.map[item.alias];

        return item;
    },

    /**
     * Release the cache of resource by url.
     *
     * @method release
     * @param {String} url
     */
    release: function (url) {
        this.removeItem(url);
    },

    /**
     * Release the loaded cache of asset.
     *
     * @method releaseAsset
     * @param {Asset} asset
     */
    releaseAsset: function (asset) {
        var uuid = asset._uuid;
        if (uuid) {
            this.removeItem(uuid);
        }
    },

    /**
     * Release the cache of resource which loaded by {{#crossLink "loader/loadRes:method"}}{{/crossLink}}.
     *
     * @method releaseRes
     * @param {String} url
     */
    releaseRes: function (url) {
        var uuid = this._getResUuid(url);
        if (uuid) {
            this.removeItem(uuid);
        }
        else {
            cc.error('Resources url "%s" does not exist.', url);
        }
    },

    /**
     * Resource cache of all resources.
     *
     * @method releaseAll
     */
    releaseAll: function () {
        this.clear();
    }
});

module.exports = cc.loader;
