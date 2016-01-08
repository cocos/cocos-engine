var _noCacheRex = /\?/;
function urlAppendTimestamp (url) {
    if (cc.game.config['noCache'] && typeof url === 'string') {
        if(_noCacheRex.test(url))
            url += '&_t=' + (new Date() - 0);
        else
            url += '?_t=' + (new Date() - 0);
    }
    return url;
}

/**
 * Loader for resource loading process. It's a singleton object.
 * @class loader
 * @static
 */
cc.loader = cc.loader || (function () {
    var _jsCache = {}, //cache for js
        _register = {}, //register of loaders
        _langPathCache = {}, //cache for lang path
        _aliases = {}, //aliases for res url
        _urlRegExp = new RegExp(
            "^" +
                // protocol identifier
                "(?:(?:https?|ftp)://)" +
                // user:pass authentication
                "(?:\\S+(?::\\S*)?@)?" +
                "(?:" +
                    // IP address dotted notation octets
                    // excludes loopback network 0.0.0.0
                    // excludes reserved space >= 224.0.0.0
                    // excludes network & broacast addresses
                    // (first & last IP address of each class)
                    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
                    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
                    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
                "|" +
                    // host name
                    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                    // domain name
                    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                    // TLD identifier
                    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                "|" +
                    "(?:localhost)" +
                ")" +
                // port number
                "(?::\\d{2,5})?" +
                // resource path
                "(?:/\\S*)?" +
            "$", "i"
        );

    return /** @lends cc.loader# */{
        resPath: "",//root path of resource
        audioPath: "",//root path of audio
        cache: {},//cache for data loaded

        /**
         * Get XMLHttpRequest.
         * @returns {XMLHttpRequest}
         */
        getXMLHttpRequest: function () {
            return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
        },

        //@MODE_BEGIN DEV

        _getArgs4Js: function (args) {
            var a0 = args[0], a1 = args[1], a2 = args[2], results = ["", null, null];

            if (args.length === 1) {
                results[1] = a0 instanceof Array ? a0 : [a0];
            } else if (args.length === 2) {
                if (typeof a1 === "function") {
                    results[1] = a0 instanceof Array ? a0 : [a0];
                    results[2] = a1;
                } else {
                    results[0] = a0 || "";
                    results[1] = a1 instanceof Array ? a1 : [a1];
                }
            } else if (args.length === 3) {
                results[0] = a0 || "";
                results[1] = a1 instanceof Array ? a1 : [a1];
                results[2] = a2;
            } else throw new Error("arguments error to load js!");
            return results;
        },

        /**
         * Load js files.
         * If the third parameter doesn't exist, then the baseDir turns to be "".
         *
         * @method loadJs
         * @param {String} [baseDir] - The pre path for jsList or the list of js path.
         * @param {Array} jsList - List of js path.
         * @param {Function} [cb] - Callback function
         * @returns {*}
         */
        loadJs: function (baseDir, jsList, cb) {
            var self = this,
                args = self._getArgs4Js(arguments);

            var preDir = args[0], list = args[1], callback = args[2];
            if (navigator.userAgent.indexOf("Trident/5") > -1) {
                self._loadJs4Dependency(preDir, list, 0, callback);
            } else {
                cc.async.map(list, function (item, index, cb1) {
                    var jsPath = cc.path.join(preDir, item);
                    if (_jsCache[jsPath]) return cb1(null);
                    self._createScript(jsPath, false, cb1);
                }, callback);
            }
        },
        /**
         * Load js width loading image.
         *
         * @method loadJsWithImg
         * @param {String} [baseDir]
         * @param {Array} jsList
         * @param {Function} [cb]
         */
        loadJsWithImg: function (baseDir, jsList, cb) {
            var self = this, jsLoadingImg = self._loadJsImg(),
                args = self._getArgs4Js(arguments);
            this.loadJs(args[0], args[1], function (err) {
                if (err) throw new Error(err);
                jsLoadingImg.parentNode.removeChild(jsLoadingImg);//remove loading gif
                if (args[2]) args[2]();
            });
        },
        _createScript: function (jsPath, isAsync, cb) {
            var d = document, self = this, s = document.createElement('script');
            s.async = isAsync;
            _jsCache[jsPath] = true;
            s.src = urlAppendTimestamp(jsPath);
            s.addEventListener('load', function () {
                s.parentNode.removeChild(s);
                s.removeEventListener('load', arguments.callee, false);
                cb();
            }, false);
            s.addEventListener('error', function () {
                s.parentNode.removeChild(s);
                cb("Load " + jsPath + " failed!");
            }, false);
            d.body.appendChild(s);
        },
        _loadJs4Dependency: function (baseDir, jsList, index, cb) {
            if (index >= jsList.length) {
                if (cb) cb();
                return;
            }
            var self = this;
            self._createScript(cc.path.join(baseDir, jsList[index]), false, function (err) {
                if (err) return cb(err);
                self._loadJs4Dependency(baseDir, jsList, index + 1, cb);
            });
        },
        _loadJsImg: function () {
            var d = document, jsLoadingImg = d.getElementById("cocos2d_loadJsImg");
            if (!jsLoadingImg) {
                jsLoadingImg = document.createElement('img');

                if (cc._loadingImage)
                    jsLoadingImg.src = cc._loadingImage;

                var canvasNode = d.getElementById(cc.game.config["id"]);
                canvasNode.style.backgroundColor = "transparent";
                canvasNode.parentNode.appendChild(jsLoadingImg);

                var canvasStyle = getComputedStyle ? getComputedStyle(canvasNode) : canvasNode.currentStyle;
                if (!canvasStyle)
                    canvasStyle = {width: canvasNode.width, height: canvasNode.height};
                jsLoadingImg.style.left = canvasNode.offsetLeft + (parseFloat(canvasStyle.width) - jsLoadingImg.width) / 2 + "px";
                jsLoadingImg.style.top = canvasNode.offsetTop + (parseFloat(canvasStyle.height) - jsLoadingImg.height) / 2 + "px";
                jsLoadingImg.style.position = "absolute";
            }
            return jsLoadingImg;
        },
        //@MODE_END DEV

        /**
         * Load a single resource as txt.
         *
         * @method loadTxt
         * @param {String} url
         * @param {Function} [cb] - arguments are : err, txt
         */
        loadTxt: function (url, cb) {
            var xhr = this.getXMLHttpRequest(),
                errInfo = "load " + url + " failed!";

            url = urlAppendTimestamp(url);

            xhr.open("GET", url, true);
            if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                // IE-specific logic here
                xhr.setRequestHeader("Accept-Charset", "utf-8");
                xhr.onreadystatechange = function () {
                    if(xhr.readyState === 4)
                        (xhr.status === 200 || xhr.status === 0) ? cb(null, xhr.responseText) : cb({status:xhr.status, errorMessage:errInfo}, null);
                };
            } else {
                if (xhr.overrideMimeType) xhr.overrideMimeType("text\/plain; charset=utf-8");
                xhr.onload = function () {
                    if(xhr.readyState === 4) {
                        (xhr.status === 200 || xhr.status === 0) ? cb(null, xhr.responseText) : cb({status:xhr.status, errorMessage:errInfo}, null);
                    }
                };
                xhr.onerror = function(){
                    cb({status:xhr.status, errorMessage:errInfo}, null);
                };
            }
            xhr.send(null);
        },
        _loadTxtSync: function (url) {
            var xhr = this.getXMLHttpRequest();
            xhr.open("GET", url, false);
            if (/msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
                // IE-specific logic here
                xhr.setRequestHeader("Accept-Charset", "utf-8");
            } else {
                if (xhr.overrideMimeType) xhr.overrideMimeType("text\/plain; charset=utf-8");
            }
            xhr.send(null);
            if (!xhr.readyState === 4 || !(xhr.status === 200 || xhr.status === 0)) {
                return null;
            }
            return xhr.responseText;
        },

        loadCsb: function(url, cb){
            var xhr = new XMLHttpRequest(),
                errInfo = "load " + url + " failed!";

            url = urlAppendTimestamp(url);

            xhr.open("GET", url, true);
            xhr.responseType = "arraybuffer";

            xhr.onload = function () {
                var arrayBuffer = xhr.response; // Note: not oReq.responseText
                if (arrayBuffer) {
                    window.msg = arrayBuffer;
                }
                if(xhr.readyState === 4)
                    xhr.status === 200 ? cb(null, xhr.response) : cb({status:xhr.status, errorMessage:errInfo}, null);
            };
            xhr.onerror = function(){
                cb({status:xhr.status, errorMessage:errInfo}, null);
            };
            xhr.send(null);
        },

        /**
         * Load a single resource as json.
         *
         * @method loadJson
         * @param {String} url
         * @param {Function} [cb] - arguments are : err, json
         */
        loadJson: function (url, cb) {
            this.loadTxt(url, function (err, txt) {
                if (err) {
                    cb(err);
                }
                else {
                    try {
                        var result = JSON.parse(txt);
                    }
                    catch (e) {
                        throw new Error("parse json [" + url + "] failed : " + e);
                        return;
                    }
                    cb(null, result);
                }
            });
        },

        _checkIsImageURL: function (url) {
            var ext = /(\.png)|(\.jpg)|(\.bmp)|(\.jpeg)|(\.gif)/.exec(url);
            return (ext != null);
        },
        /**
         * Load a single image.
         *
         * @method loadImg
         * @param {String} url
         * @param {Object} [option]
         * @param {Function} callback
         * @returns {Image}
         */
        loadImg: function (url, option, callback) {
            var opt = {
                isCrossOrigin: true
            };
            if (callback !== undefined)
                opt.isCrossOrigin = option.isCrossOrigin === null ? opt.isCrossOrigin : option.isCrossOrigin;
            else if (option !== undefined)
                callback = option;

            url = urlAppendTimestamp(url);

            var img = this.getRes(url);
            if (!img) {
                img = new Image();
                if (opt.isCrossOrigin && location.origin !== "file://")
                    img.crossOrigin = "Anonymous";
                img.src = url;
            }

            if(img.complete) {
                callback && callback(null, img);
            } else {
                var loadCallback = function () {
                    img.removeEventListener('load', loadCallback, false);
                    img.removeEventListener('error', errorCallback, false);

                    if (callback)
                        callback(null, img);
                };

                var self = this;
                var errorCallback = function () {
                    img.removeEventListener('load', loadCallback, false);
                    img.removeEventListener('error', errorCallback, false);

                    if(img.crossOrigin && img.crossOrigin.toLowerCase() === "anonymous"){
                        opt.isCrossOrigin = false;
                        self.release(url);
                        cc.loader.loadImg(url, opt, callback);
                    }else{
                        typeof callback === "function" && callback("load image failed");
                    }
                };

                img.addEventListener("load", loadCallback);
                img.addEventListener("error", errorCallback);
            }
            return img;
        },

        /**
         * Iterator function to load res.
         *
         * @method _loadResIterator
         * @param {Object} item
         * @param {Number} index
         * @param {Function} [cb]
         * @returns {*}
         * @private
         */
        _loadResIterator: function (item, index, cb) {
            var self = this, url = null;
            var type = item.type;
            if (type) {
                type = "." + type.toLowerCase();
                url = item.src ? item.src : item.name + type;
            } else {
                url = item;
                type = cc.path.extname(url);
            }

            var obj = self.getRes(url);
            if (obj)
                return cb(null, obj);
            var loader = null;
            if (type) {
                loader = _register[type.toLowerCase()];
            }
            if (!loader) {
                cc.error("loader for [" + type + "] not exists!");
                return cb();
            }
            var realUrl = url;
            if (!_urlRegExp.test(url))
            {
                var basePath = loader.getBasePath ? loader.getBasePath() : self.resPath;
                realUrl = self.getUrl(basePath, url);
            }

            loader.load(realUrl, url, item, function (err, data) {
                if (err) {
                    cc.log(err);
                    self.cache[url] = null;
                    delete self.cache[url];
                    cb({status:520, errorMessage:err}, null);
                } else {
                    self.cache[url] = data;
                    cb(null, data);
                }
            });
        },

        /**
         * Get url with basePath.
         *
         * @method getUrl
         * @param {String} basePath
         * @param {String} [url]
         * @returns {*}
         */
        getUrl: function (basePath, url) {
            var self = this, path = cc.path;
            if (basePath !== undefined && url === undefined) {
                url = basePath;
                var type = path.extname(url);
                type = type ? type.toLowerCase() : "";
                var loader = _register[type];
                if (!loader)
                    basePath = self.resPath;
                else
                    basePath = loader.getBasePath ? loader.getBasePath() : self.resPath;
            }
            url = cc.path.join(basePath || "", url);
            if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
                if (_langPathCache[url])
                    return _langPathCache[url];
                var extname = path.extname(url) || "";
                url = _langPathCache[url] = url.substring(0, url.length - extname.length) + "_" + cc.sys.language + extname;
            }
            return url;
        },

        /**
         * Load resources then call the callback.
         *
         * @method load
         * @param {String} resources
         * @param {Function} [option] - callback or trigger
         * @param {Function|Object} [loadCallback]
         * @return {AsyncPool}
         */
        load: function(resources, option, loadCallback){
            'use strict';

            var self = this;
            var len = arguments.length;
            if(len === 0)
                throw new Error("arguments error!");

            if(len === 3){
                if(typeof option === "function"){
                    if(typeof loadCallback === "function")
                        option = {trigger : option, cb : loadCallback };
                    else
                        option = { cb : option, cbTarget : loadCallback};
                }
            }else if(len === 2){
                if(typeof option === "function")
                    option = {cb : option};
            }else if(len === 1){
                option = {};
            }

            if(!(resources instanceof Array))
                resources = [resources];
            var asyncPool = new cc.AsyncPool(
                resources, 0,
                function (value, index, AsyncPoolCallback, aPool) {
                    self._loadResIterator(value, index, function (err, res) {
                        if (option.trigger)
                            option.trigger.call(option.triggerTarget, res, aPool.size, aPool.finishedSize);   //call trigger
                        AsyncPoolCallback(err, res);
                    });
                },
                option.cb, option.cbTarget);
            asyncPool.flow();
            return asyncPool;
        },

        _handleAliases: function (fileNames, cb) {
            var self = this;
            var resList = [];
            for (var key in fileNames) {
                var value = fileNames[key];
                _aliases[key] = value;
                resList.push(value);
            }
            this.load(resList, cb);
        },

        /**
         * <p>
         *     Loads alias map from the contents of a filename.                                        <br/>
         *                                                                                                                 <br/>
         *     @note The plist file name should follow the format below:                                                   <br/>
         *     <?xml version="1.0" encoding="UTF-8"?>                                                                      <br/>
         *         <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">  <br/>
         *             <plist version="1.0">                                                                               <br/>
         *                 <dict>                                                                                          <br/>
         *                     <key>filenames</key>                                                                        <br/>
         *                     <dict>                                                                                      <br/>
         *                         <key>sounds/click.wav</key>                                                             <br/>
         *                         <string>sounds/click.caf</string>                                                       <br/>
         *                         <key>sounds/endgame.wav</key>                                                           <br/>
         *                         <string>sounds/endgame.caf</string>                                                     <br/>
         *                         <key>sounds/gem-0.wav</key>                                                             <br/>
         *                         <string>sounds/gem-0.caf</string>                                                       <br/>
         *                     </dict>                                                                                     <br/>
         *                     <key>metadata</key>                                                                         <br/>
         *                     <dict>                                                                                      <br/>
         *                         <key>version</key>                                                                      <br/>
         *                         <integer>1</integer>                                                                    <br/>
         *                     </dict>                                                                                     <br/>
         *                 </dict>                                                                                         <br/>
         *              </plist>                                                                                           <br/>
         * </p>
         *
         * @method loadAliases
         * @param {String} url - The plist file name.
         * @param {Function} [callback]
         */
        loadAliases: function (url, callback) {
            var self = this, dict = self.getRes(url);
            if (!dict) {
                self.load(url, function (err, results) {
                    self._handleAliases(results[0]["filenames"], callback);
                });
            } else
                self._handleAliases(dict["filenames"], callback);
        },

        /**
         * Register a resource loader into loader.
         *
         * @method register
         * @param {String} extNames
         * @param {Function} loader
         */
        register: function (extNames, loader) {
            if (!extNames || !loader) return;
            var self = this;
            if (typeof extNames === "string")
                return _register[extNames.trim().toLowerCase()] = loader;
            for (var i = 0, li = extNames.length; i < li; i++) {
                _register["." + extNames[i].trim().toLowerCase()] = loader;
            }
        },

        /**
         * Get resource data by url.
         *
         * @method getRes
         * @param url
         * @returns {*}
         */
        getRes: function (url) {
            return this.cache[url] || this.cache[_aliases[url]];
        },

        /**
         * Get aliase by url.
         *
         * @method getAliase
         * @param url
         * @returns {*}
         */
        getAliase: function (url) {
            return _aliases[url];
        },

        /**
         * Release the cache of resource by url.
         *
         * @method release
         * @param url
         */
        release: function (url) {
            var cache = this.cache;
            delete cache[url];
            delete cache[_aliases[url]];
            delete _aliases[url];
        },

        /**
         * Resource cache of all resources.
         *
         * @method releaseAll
         */
        releaseAll: function () {
            var locCache = this.cache;
            for (var key in locCache)
                delete locCache[key];
            for (var key in _aliases)
                delete _aliases[key];
        }
    };
})();