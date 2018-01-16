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

var Texture2D = require('../textures/CCTexture2D');
var JS = require('../platform/js');

function JsonUnpacker () {
    this.jsons = {};
}

/**
 * @param {String[]} indices
 * @param {Object[]} packedJson
 */
JsonUnpacker.prototype.load = function (indices, packedJson) {
    if (packedJson.length !== indices.length) {
        cc.errorID(4915);
    }
    for (var i = 0; i < indices.length; i++) {
        var key = indices[i];
        var json = packedJson[i];
        this.jsons[key] = json;
    }
};

JsonUnpacker.prototype.retrieve = function (key) {
    return this.jsons[key] || null;
};


function TextureUnpacker () {
    this.contents = {};
}
TextureUnpacker.ID = JS._getClassId(Texture2D);

/**
 * @param {String[]} indices
 * @param {Object[]} packedJson
 */
TextureUnpacker.prototype.load = function (indices, packedJson) {
    var datas = packedJson.data.split('|');
    if (datas.length !== indices.length) {
        cc.errorID(4915);
    }
    for (var i = 0; i < indices.length; i++) {
        this.contents[indices[i]] = datas[i];
    }
};

TextureUnpacker.prototype.retrieve = function (key) {
    var content = this.contents[key];
    if (content) {
        return {
            __type__: TextureUnpacker.ID,
            content: content
        };
    }
    else {
        return null;
    }
};

if (CC_TEST) {
    cc._Test.JsonUnpacker = JsonUnpacker;
    cc._Test.TextureUnpacker = TextureUnpacker;
}

module.exports = {
    JsonUnpacker,
    TextureUnpacker,
};
