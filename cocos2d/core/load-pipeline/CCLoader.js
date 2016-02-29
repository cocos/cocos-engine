/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

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

var downloader = new Downloader();
var loader = new Loader();

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
     *  cc.loader.load('a.png', function (err, tex) {
     *      cc.log('Result should be a texture: ' + (tex instanceof cc.Texture2D));
     *  });
     *
     *  
     *  cc.loader.load(['a.png', 'b.json'], function (errors, results) {
     *      if (errors) {
     *          for (var i = 0; i < errors.length; i++) {
     *              cc.log('Error url [' + errors[i] + ']: ' + results.getError(errors[i]));
     *          }
     *      }
     *      var aTex = results.getContent('a.png');
     *      var bJsonObj = results.getContent('b.json');
     *  });
     *
     * @method load
     * @param {String|Array} resources - Url list in an array
     * @param {[Function]} progressCallback - Callback invoked when progression change
     * @param {Function} completeCallback - Callback invoked when all resources loaded
     */
    load: function(resources, progressCallback, completeCallback) {
        if (completeCallback === undefined) {
            completeCallback = progressCallback;
            progressCallback = null;
        }

        var singleRes = false;
        if (!(resources instanceof Array)) {
            resources = resources ? [resources] : [];
            singleRes = true;
        }
        // Return directly if no resources
        if (resources.length === 0) {
            completeCallback && completeCallback.call(this, null, this._items);
        }

        // Resolve callback
        var error = null;
        var checker = {};
        var totalCount = 0;
        var completedCount = 0;
        var self = this;

        function loadedCheck (item) {
            checker[item.src] = item;
            if (item.error) {
                error = error || [];
                error.push(item.src);
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
        }

        // Add loaded listeners
        for (var i = 0; i < resources.length; ++i) {
            var url = resources[i].src || resources[i];
            if (typeof url !== 'string')
                continue;
            var item = this._items.map[url];
            if ( !item || (item && !item.complete) ) {
                this._items.add(url, loadedCheck);
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
            if (singleRes) {
                var src = resources[0].src || resources[0];
                var result = this._items.map[src];
                completeCallback.call(this, result.error, result.content);
            }
            else {
                completeCallback.call(this, null, this._items);
            }
        }
        else {
            this.flowIn(resources);
        }
    },

    /**
     * Get resource data by url.
     *
     * @method getRes
     * @param {String} url
     * @returns {*}
     */
    getRes: function (url) {
        var item = this._items.map[url];
        if (item && item.complete) {
            return item.content;
        }
        else {
            return null;
        }
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
     * Resource cache of all resources.
     *
     * @method releaseAll
     */
    releaseAll: function () {
        this.clear();
    }
});

module.exports = cc.loader;