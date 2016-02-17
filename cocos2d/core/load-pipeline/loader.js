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

function loadNothing (item, callback) {
    callback(null, null);
}

function loadJSON (item, callback) {
    if (typeof item.content !== 'string') {
        callback( new Error('JSON Loader: Input item doesn\'t contain string content') );
    }

    try {
        var result = JSON.parse(item.content);
        callback(null, result);
    }
    catch (e) {
        callback( new Error('JSON Loader: Parse json [' + item.src + '] failed : ' + e) );
    }
}

function loadImage (item, callback) {
    if (!(item.content instanceof Image)) {
        callback( new Error('Image Loader: Input item doesn\'t contain Image content') );
    }
    cc.textureCache.handleLoadedTexture(item.src);
    var texture = cc.textureCache.getTextureForKey(item.src);
    if (texture) {
        callback(null, texture);
    }
    else {
        callback( new Error('Image Loader: Create texture for [' + item.src + '] failed') );
    }
}

function loadPlist (item, callback) {
    if (typeof item.content !== 'string') {
        callback( new Error('Plist Loader: Input item doesn\'t contain string content') );
    }
    var result = cc.plistParser.parse(item.content);
    if (result) {
        callback(null, result);
    }
    else {
        callback( new Error('Plist Loader: Parse [' + item.src + '] failed') );
    }
}

function loadFont (item, callback) {
    callback(null, null);
}

var defaultMap = {
    // Images
    'png' : loadImage,
    'jpg' : loadImage,
    'bmp' : loadImage,
    'jpeg' : loadImage,
    'gif' : loadImage,
    'ico' : loadImage,
    'tiff' : loadImage,
    'webp' : loadImage,

    'json' : loadJSON,
    'ExportJson' : loadJSON,

    'plist' : loadPlist,

    'font' : loadFont,
    'eot' : loadFont,
    'ttf' : loadFont,
    'woff' : loadFont,
    'svg' : loadFont,
    'ttc' : loadFont,

    // "mp3",
    // "ogg",
    // "wav",
    // "mp4",
    // "m4a",

    'default' : loadNothing
};

/**
 * The loader pipe, it can load several types of files:
 * 1. Images
 * 2. JSON
 * 3. Plist
 * 4. Audio
 * 5. Font
 * 6. Cocos Creator scene
 * It will not interfere with items of unknown type.
 * You can pass custom supported types in the constructor.
 * @class Loader
 */
/**
 * Constructor of Loader, you can pass custom supported types.
 * @example
 *  var loader = new Loader({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 * 
 * @method Loader
 * @param {Object} extMap
 */
var Loader = function (extMap) {
    this.id = 'Loader';
    this.isAsync = true;
    this.pipeline = null;

    this.extMap = JS.addon(extMap, defaultMap);
};
JS.mixin(Loader.prototype, {
    handle: function (item, callback) {
        var loadFunc = this.extMap[item.type] || this.extMap['default'];
        loadFunc(item, function (err, result) {
            if (err) {
                callback && callback(err);
            }
            else {
                callback && callback(null, result);
            }
        });
    }
});

Pipeline.Loader = module.exports = Loader;