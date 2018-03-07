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

var pushToMap = require('../utils/misc').pushToMap;
var js = require('../platform/js');

function Entry (uuid, type) {
    this.uuid = uuid;
    this.type = type;
}

/*
 * !#en AssetTable is used to find asset's uuid by url.
 * !#zh AssetTable 用于查找资源的 uuid 和 url。
 * @class AssetTable
 *
 */

function AssetTable () {
    this._pathToUuid = js.createMap(true);
}

function isMatchByWord (path, test) {
    if (path.length > test.length) {
        var nextAscii = path.charCodeAt(test.length);
        return (nextAscii === 46 || nextAscii === 47); // '.' or '/'
    }
    return true;
}

var proto = AssetTable.prototype;

proto.getUuid = function (path, type) {
    path = cc.url.normalize(path);
    var item = this._pathToUuid[path];
    if (item) {
        if (Array.isArray(item)) {
            if (type) {
                for (var i = 0; i < item.length; i++) {
                    var entry = item[i];
                    if (cc.isChildClassOf(entry.type, type)) {
                        return entry.uuid;
                    }
                }
            }
            else {
                return item[0].uuid;
            }
        }
        else if (!type || cc.isChildClassOf(item.type, type)) {
            return item.uuid;
        }
    }
    return '';
};

proto.getUuidArray = function (path, type, out_urls) {
    path = cc.url.normalize(path);
    if (path[path.length - 1] === '/') {
        path = path.slice(0, -1);
    }
    var path2uuid = this._pathToUuid;
    var uuids = [];
    var isChildClassOf = cc.isChildClassOf;
    for (var p in path2uuid) {
        if ((p.startsWith(path) && isMatchByWord(p, path)) || !path) {
            var item = path2uuid[p];
            if (Array.isArray(item)) {
                for (var i = 0; i < item.length; i++) {
                    var entry = item[i];
                    if (!type || isChildClassOf(entry.type, type)) {
                        uuids.push(entry.uuid);
                        if (out_urls) {
                            out_urls.push(p);
                        }
                    }
                }
            }
            else {
                if (!type || isChildClassOf(item.type, type)) {
                    uuids.push(item.uuid);
                    if (out_urls) {
                        out_urls.push(p);
                    }
                }
            }
        }
    }
    return uuids;
};

// /**
//  * !#en Returns all asset paths in the table.
//  * !#zh 返回表中的所有资源路径。
//  * @method getAllPaths
//  * @return {string[]}
//  */
// proto.getAllPaths = function () {
//     return Object.keys(this._pathToUuid);
// };

/**
 * !#en TODO
 * !#zh 以路径为 key，uuid 为值添加到表中。
 * @method add
 * @param {String} path - the path to load, should NOT include filename extensions.
 * @param {String} uuid
 * @param {Function} type
 * @param {Boolean} isMainAsset
 * @private
 */
proto.add = function (path, uuid, type, isMainAsset) {
    // remove extname
    // (can not use path.slice because length of extname maybe 0)
    path = path.substring(0, path.length - cc.path.extname(path).length);
    var newEntry = new Entry(uuid, type);
    pushToMap(this._pathToUuid, path, newEntry, isMainAsset);
};

proto._getInfo_DEBUG = CC_DEBUG && function (uuid, out_info) {
    var path2uuid = this._pathToUuid;
    var paths = Object.keys(path2uuid);
    for (var p = 0; p < paths.length; ++p) {
        var path = paths[p];
        var item = path2uuid[path];
        if (Array.isArray(item)) {
            for (var i = 0; i < item.length; i++) {
                var entry = item[i];
                if (entry.uuid === uuid) {
                    out_info.path = path;
                    out_info.type = entry.type;
                    return true;
                }
            }
        }
        else if (item.uuid === uuid) {
            out_info.path = path;
            out_info.type = item.type;
            return true;
        }
    }
    return false;
};

proto.reset = function () {
    this._pathToUuid = js.createMap(true);
};


module.exports = AssetTable;
