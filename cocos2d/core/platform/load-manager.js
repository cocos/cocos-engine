var CallbacksInvoker = require('./callbacks-invoker');

function getBuiltinRawTypes () {
    return {
        image: {
            loader: cc.loader.loadImg.bind(cc.loader),
            defaultExtname: '.host'
        },
        json: {
            loader: cc.loader.loadJson.bind(cc.loader),
            defaultExtname: '.json'
        },
        text: {
            loader: cc.loader.loadTxt.bind(cc.loader),
            defaultExtname: '.txt'
        }
    };
}

var urlToCallbacks = new CallbacksInvoker();


 // list of elements to load, the element type is {
 //     url: url,
 //     loader: loader,
 //     callback: callback,
 // }
var loadQueue = [];

var loadNext = function () {
    if (LoadManager._curConcurrent >= LoadManager.maxConcurrent) {
        cc.error('too many concurrent requests');
        return;
    }
    var nextOne = loadQueue.pop();
    if (nextOne) {
        doLoad(nextOne.loader, nextOne.url, nextOne.callback);
    }
};

function doLoad (loader, url, callback) {
    LoadManager._curConcurrent += 1;
    loader(url, function doLoadCB (error, asset) {
        callback(error, asset);
        LoadManager._curConcurrent = Math.max(0, LoadManager._curConcurrent - 1);
        loadNext();
    });
}

/**
* The manager scheduling resources loading
* - It will:
*   - select registered loader
*   - merge same url request
*   - limit the max concurrent request
* - It will NOT:
*   - cache what has being loaded
*   - load depends of resource
* @class LoadManager
* @static
*/
var LoadManager = {

    /**
     * Max allowed concurrent request count
     * @property maxConcurrent
     * @type {Number}
     * @default 2
     */
    maxConcurrent: 2,

    /**
     * Current concurrent request count
     * @property _curConcurrent
     * @type {Number}
     * @readOnly
     */
    _curConcurrent: 0,

    /**
     * NOTE: Request the same url with different loader is disallowed
     * @method loadByLoader
     * @param {Function} loader
     * @param {String} url
     * @param {Function} callback
     * @param {String} callback.param error - null or the error info
     * @param {any} callback.param data - the loaded data
     * @private
     */
    loadByLoader: function (loader, url, callback) {
        if (urlToCallbacks.add(url, callback)) {
            var callbackBundle = urlToCallbacks.bindKey(url, true);
            if (this._curConcurrent < this.maxConcurrent) {
                doLoad(loader, url, callbackBundle);
            }
            else {
                loadQueue.push({
                    url: url,
                    loader: loader,
                    callback: callbackBundle
                });
            }
        }
    },

    /**
     * @method load
     * @param {String} url
     * @param {String} rawType
     * @param {String} [rawExtname]
     * @param {Function} callback
     * @param {String} callback.param error - null or the error info
     * @param {any} callback.param data - the loaded data
     * @private
     */
    load: function (url, rawType, rawExtname, callback) {
        if (typeof rawExtname === 'function') {
            callback = rawExtname;
        }
        var typeInfo = this._rawTypes[rawType];
        if (typeInfo) {
            var extname = rawExtname ? ('.' + rawExtname) : typeInfo.defaultExtname;
            if (extname) {
                var rawUrl = url + extname;
                this.loadByLoader(typeInfo.loader, rawUrl, callback);
            }
            else {
                callback(new Error('Undefined extname for the raw ' + rawType + ' file of ' + url), null);
            }
        }
        else {
            callback(new Error('Unknown raw type "' + rawType + '" of ' + url), null);
        }
    },

    _rawTypes: getBuiltinRawTypes(),

    /**
     * @method registerRawTypes
     * @param {String} rawType
     * @param {Function} loader
     * @param {String} defaultExtname
     */
    registerRawTypes: function (rawType, loader, defaultExtname) {
        if (CC_DEV) {
            if (!rawType) {
                cc.error('[AssetLibrary.registerRawTypes] rawType must be non-nil');
                return;
            }
            if (typeof rawType !== 'string') {
                cc.error('[AssetLibrary.registerRawTypes] rawType must be string');
                return;
            }
            if (!loader) {
                cc.error('[AssetLibrary.registerRawTypes] loader must be non-nil');
                return;
            }
            if (typeof loader !== 'function') {
                cc.error('[AssetLibrary.registerRawTypes] loader must be function');
                return;
            }
        }
        if (this._rawTypes[rawType]) {
            cc.error('rawType "%s" has already defined', rawType);
            return;
        }
        if (defaultExtname && defaultExtname[0] !== '.') {
            defaultExtname = '.' + defaultExtname;
        }
        this._rawTypes[rawType] = {
            loader: loader,
            defaultExtname: defaultExtname
        };
    },

    reset: function () {
        if (CC_EDITOR) {
            var audio = this._rawTypes.audio;
            this._rawTypes = getBuiltinRawTypes();
            this._rawTypes.audio = audio;
        }
    },

    isLoading: function (url, alsoCheckRaw) {
        if (CC_EDITOR) {
            if (this._curConcurrent === 0) {
                return false;
            }
            if (urlToCallbacks.has(url)) {
                return true;
            }
            if (alsoCheckRaw) {
                for (var u in urlToCallbacks._callbackTable) {
                    if (u.indexOf(url) === 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
};

// TODO - merge with cc.loader
cc._LoadManager = LoadManager;
module.exports = LoadManager;
