/*
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
*/
/**
 * @hidden
 */

var decodeUuid = require('../core/utils/decode-uuid');
var Pipeline = require('./pipeline');

const ID = 'SubPackPipe';
const UuidRegex = /([^/\\]*)\.[^\.]*$/;

function getUuidFromURL(url) {
    var matches = url.match(UuidRegex);
    if (matches) {
        return matches[1];
    }
    return "";
}

var _uuidToSubPack = Object.create(null);

var SubPackPipe = function (subpackage) {
    this.id = ID;
    this.async = false;
    this.pipeline = null;
    for (var packName in subpackage) {
        var pack = subpackage[packName];
        pack.uuids && pack.uuids.forEach(function (val) {
            var uuid = decodeUuid(val);
            _uuidToSubPack[uuid] = pack.path;
        });
    }
};

SubPackPipe.ID = ID;

SubPackPipe.prototype.handle = function (item) {
    item.url = this.transformURL(item.url);
    return null;
};

SubPackPipe.prototype.transformURL = function (url) {
    var uuid = getUuidFromURL(url);
    if (uuid) {
        var subpackage = _uuidToSubPack[uuid];
        if (subpackage) {
            // only replace url of native assets
            return url.replace('res/raw-assets/', subpackage + 'raw-assets/');
        }
    }
    return url;
};

Pipeline.SubPackPipe = module.exports = SubPackPipe;
