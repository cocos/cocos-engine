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

/**
 * AssetTable is used to find asset's uuid by url
 * @class AssetTable
 * @constructor
 */
function AssetTable () {
    this._pathToUuid = {};
}

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
        path = cc.url.normalize(path);
        if ( !path ) {
            return '';
        }
        var uuid = this._pathToUuid[path];
        if (uuid) {
            return uuid;
        }
        else {
            return '';
        }
    },

    getUuidArray: function (path) {
        path = cc.url.normalize(path);
        if ( !path ) {
            return [];
        }
        var uuids = [];
        var p2u = this._pathToUuid;
        for (var p in p2u) {
            if (p.startsWith(path)) {
                uuids.push(p2u[p]);
            }
        }
        return uuids;
    },

    /**
     * Returns all asset paths in the table.
     * @method getAllPaths
     * @return {string[]}
     */
    getAllPaths: function () {
        return Object.keys(this._pathToUuid);
    },
    
    /**
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
