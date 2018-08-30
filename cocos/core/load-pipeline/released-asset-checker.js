/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

if (CC_DEBUG) {

var js = require('../platform/js');

// checks if asset was releasable

function ReleasedAssetChecker () {
    // { dependKey: true }
    this._releasedKeys = js.createMap(true);
    this._dirty = false;
}

// mark as released for further checking dependencies
ReleasedAssetChecker.prototype.setReleased = function (item, releasedKey) {
    this._releasedKeys[releasedKey] = true;
    this._dirty = true;
};

var tmpInfo = null;
function getItemDesc (item) {
    if (item.uuid) {
        if (!tmpInfo) {
            tmpInfo = { path: "", type: null };
        }
        if (cc.loader._resources._getInfo_DEBUG(item.uuid, tmpInfo)) {
            tmpInfo.path = 'resources/' + tmpInfo.path;
            return `"${tmpInfo.path}" (type: ${js.getClassName(tmpInfo.type)}, uuid: ${item.uuid})`;
        }
        else {
            return `"${item.rawUrl}" (${item.uuid})`;
        }
    }
    else {
        return `"${item.rawUrl}"`;
    }
}

function doCheckCouldRelease (releasedKey, refOwnerItem, caches) {
    var loadedAgain = caches[releasedKey];
    if (!loadedAgain) {
        cc.log(`"${releasedKey}" was released but maybe still referenced by ${getItemDesc(refOwnerItem)}`);
    }
}

// check dependencies
ReleasedAssetChecker.prototype.checkCouldRelease = function (caches) {
    if (!this._dirty) {
        return;
    }
    this._dirty = false;

    var released = this._releasedKeys;

    // check loader cache
    for (let id in caches) {
        var item = caches[id];
        if (item.alias) {
            item = item.alias;
        }
        let depends = item.dependKeys;
        if (depends) {
            for (let i = 0; i < depends.length; ++i) {
                let depend = depends[i];
                if (released[depend]) {
                    doCheckCouldRelease(depend, item, caches);
                    delete released[depend];
                }
            }
        }
    }

    // // check current scene
    // let depends = cc.director.getScene().dependAssets;
    // for (let i = 0; i < depends.length; ++i) {
    //     let depend = depends[i];
    //     if (released[depend]) {
    //         doCheckCouldRelease(depend, item, caches);
    //         delete released[depend];
    //     }
    // }

    // clear released
    js.clear(released);
};

module.exports = ReleasedAssetChecker;

}
