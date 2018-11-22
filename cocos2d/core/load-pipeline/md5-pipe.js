/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

var Pipeline = require('./pipeline');

const ID = 'MD5Pipe';
const ExtnameRegex = /(\.[^.\n\\/]*)$/;
const UuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;

function getUuidFromURL (url) {
    var matches = url.match(UuidRegex);
    if (matches) {
        return matches[1];
    }
    return "";
}

var MD5Pipe = function (md5AssetsMap, md5NativeAssetsMap, libraryBase) {
    this.id = ID;
    this.async = false;
    this.pipeline = null;
    this.md5AssetsMap = md5AssetsMap;
    this.md5NativeAssetsMap = md5NativeAssetsMap;
    this.libraryBase = libraryBase;
};
MD5Pipe.ID = ID;

MD5Pipe.prototype.handle = function(item) {
    let hashPatchInFolder = false;
    // HACK: explicitly use folder md5 for ttf files
    if (item.type === 'ttf') {
        hashPatchInFolder = true;
    }
    item.url = this.transformURL(item.url, hashPatchInFolder);
    return item;
};

MD5Pipe.prototype.transformURL = function (url, hashPatchInFolder) {
    var uuid = getUuidFromURL(url);
    if (uuid) {
        var isNativeAsset = !url.startsWith(this.libraryBase);
        var map = isNativeAsset ? this.md5NativeAssetsMap : this.md5AssetsMap;
        let hashValue = map[uuid];
        if (hashValue) {
            if (hashPatchInFolder) {
                var dirname = cc.path.dirname(url);
                var basename = cc.path.basename(url);
                url = `${dirname}.${hashValue}/${basename}`;
            } else {
                var matched = false;
                url = url.replace(ExtnameRegex, (function(match, p1) {
                    matched = true;
                    return "." + hashValue + p1;
                }));
                if (!matched) {
                    url = url + "." + hashValue;
                }
            }
        }
    }
    return url;
};


Pipeline.MD5Pipe = module.exports = MD5Pipe;
