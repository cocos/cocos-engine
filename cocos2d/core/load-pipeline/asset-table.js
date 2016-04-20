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

var callInNextTick = require('./../platform/utils').callInNextTick;

function normalizePath (path) {
    if (path.charCodeAt(0) === 46 && path.charCodeAt(1) === 47) { 
        // strip './'
        path = path.slice(2);
    }
    else if (path.charCodeAt(0) === 47) {
        // strip '/'
        path = path.slice(1);
    }
    return path;
}

var GLOB = '**/*';

/*
 * !#en AssetTable is used to find asset's uuid by url.
 * !#zh AssetTable 用于查找资源的 uuid 和 url。
 * @class AssetTable
 * @constructor
 */
function AssetTable () {
    this._pathToUuid = {};
}
AssetTable._hasWildcard = function (path) {
    return path.endsWith(GLOB);
};
cc.js.mixin(AssetTable.prototype, {

    ///**
    // * Check if the table contains a specific object. <br/>
    // * <br/>
    // * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
    // *
    // * @method contains
    // * @param {string} path - (not support wildcard)
    // * @return {boolean}
    // */
    //contains: function (path) {
    //    return (path in this._pathToUuid);
    //},
    
    getUuid: function (path) {
        path = normalizePath(path);
        if ( !path ) {
            return '';
        }
        var uuid = this._pathToUuid[path];
        if (uuid) {
            return uuid;
        }
        else if (AssetTable._hasWildcard(path)) {
            var uuids = [];
            var pathNoWildcard = path.slice(0, - GLOB.length);
            for (var p in this._pathToUuid) {
                if (p.startsWith(pathNoWildcard)) {
                    var uuid = this._pathToUuid[p];
                    uuids.push(uuid);
                }
            }
            return uuids;
        }
        else {
            return '';
        }
    },

    /**
     * !#en Returns all asset paths in the table.
     * !#zh 返回表中的所有资源路径。
     * @method getAllPaths
     * @return {string[]}
     */
    getAllPaths: function () {
        return Object.keys(this._pathToUuid);
    },

    //_loadByWildcard: function (path, callback) {
    //    var results = [];
    //    var remain = 0;
    //    var aborted = false;
    //    function onLoad (err, asset) {
    //        if (aborted) {
    //            return;
    //        }
    //        if (asset) {
    //            results.push(asset);
    //            if (--remain <= 0) {
    //                callback(null, results);
    //            }
    //        }
    //        else {
    //            aborted = true;
    //            callback(err, results);
    //            callback = null;
    //        }
    //    }
    //    
    //    var pathNoWildcard = path.slice(0, - GLOB.length);
    //    for (var p in this._pathToUuid) {
    //        if (p.startsWith(pathNoWildcard)) {
    //            ++remain;
    //            var uuid = this._pathToUuid[p];
    //            cc.AssetLibrary.loadAsset(uuid, onLoad);
    //        }
    //    }
    //    return remain > 0;
    //},

    ///**
    // * Loads asset with path from the table asynchronously. <br/>
    // * <br/>
    // * wildcard: <br/>
    // * 如果路径以 &#42;&#42;&#47;&#42; 作为结尾，则该路径下的所有资源都会被加载，含子文件夹。
    // * 此时 callback 的第二参数将返回数组，如果文件夹下没有资源，数组长度将会是 0。如果加载出错，数组内的元素将不全。
    // * 
    // * Note: All asset paths in Creator use forward slashes, paths using backslashes will not work.
    // *
    // * @method load
    // * @param {string} path
    // * @param {function} [callback]
    // * @param {string} callback.param error - null or the error info
    // * @param {object} callback.param data - the loaded object or null
    // * @param {boolean} [quiet=false] - If true, the callback will not invoked even if asset is not found.
    // * @return {boolean} start loading
    // */
    //load: function (path, callback, quiet) {
    //    if ( !path ) {
    //        if ( !quiet ) {
    //            callInNextTick(callback, 'Argument must be non-nil', null);
    //        }
    //        return false;
    //    }
    //    path = normalizePath(path);
    //    var uuid = this._pathToUuid[path];
    //    if (uuid) {
    //        AssetLibrary.loadAsset(uuid, callback);
    //        return true;
    //    }
    //    else if (AssetTable._hasWildcard(path)) {
    //        var loading = this._loadByWildcard(path, callback);
    //        if ( !loading && !quiet ) {
    //            callInNextTick(callback, null, []);
    //        }
    //        return loading;
    //    }
    //    else if (! quiet) {
    //        callInNextTick(callback, 'Path not exists', null);
    //        return false;
    //    }
    //},
    
    /**
     * !#en TODO
     * !#zh 以路径为 key，uuid 为值添加到表中。
     * @method add
     * @param {string} path - the path to load, should NOT include filename extensions.
     * @param {string} uuid
     * @private
     */
    add: function (path, uuid) {
        //// remove extname
        //// (can not use path.slice because length of extname maybe 0)
        //path = path.substring(0, path - cc.path.extname(path).length);
        this._pathToUuid[path] = uuid;
    },
    _removeByPath: function (path) {
        delete this._pathToUuid[path];
    }
    //_removeByUuid: function (uuid) {
    //    for (var path in this._pathToUuid) {
    //        if (this._pathToUuid[path] === uuid) {
    //            delete this._pathToUuid[path];
    //            return;
    //        }
    //    }
    //}
});

module.exports = AssetTable;
