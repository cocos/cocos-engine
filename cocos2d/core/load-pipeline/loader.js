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

var JS = require('../platform/js');
var Pipeline = require('./pipeline');
var Texture2D = require('../textures/CCTexture2D');
var loadUuid = require('./uuid-loader');
var misc = require('../utils/misc');

function loadNothing (item, callback) {
    return null;
}

function loadJSON (item, callback) {
    if (typeof item.content !== 'string') {
        return new Error('JSON Loader: Input item doesn\'t contain string content');
    }

    try {
        var result = JSON.parse(item.content);
        return result;
    }
    catch (e) {
        return new Error('JSON Loader: Parse json [' + item.id + '] failed : ' + e);
    }
}

function loadImage (item, callback) {
    if (!(item.content instanceof Image)) {
        return new Error('Image Loader: Input item doesn\'t contain Image content');
    }
    var url = item.url;
    var tex = cc.textureCache.getTextureForKey(url) || new Texture2D();
    tex.url = url;
    tex.initWithElement(item.content);
    tex.handleLoadedTexture();
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        // Image element no longer needed
        misc.imagePool.put(item.content);
    }
    cc.textureCache.cacheImage(url, tex);
    return tex;
}

function loadPlist (item, callback) {
    if (typeof item.content !== 'string') {
        return new Error('Plist Loader: Input item doesn\'t contain string content');
    }
    var result = cc.plistParser.parse(item.content);
    if (result) {
        return result;
    }
    else {
        return new Error('Plist Loader: Parse [' + item.id + '] failed');
    }
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
    'image' : loadImage,

    'json' : loadJSON,
    'ExportJson' : loadJSON,

    'plist' : loadPlist,

    // we embed fnt data inside the asset json file
    // 'fnt' : loadFnt,

    'uuid' : loadUuid,
    'prefab' : loadUuid,
    'fire' : loadUuid,
    'scene' : loadUuid,

    'default' : loadNothing
};

var ID = 'Loader';

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
 * @class Pipeline.Loader
 */
/**
 * Constructor of Loader, you can pass custom supported types.
 *
 * @method constructor
 * @param {Object} extMap Custom supported types with corresponded handler
 * @example
 *var loader = new Loader({
 *    // This will match all url with `.scene` extension or all url with `scene` type
 *    'scene' : function (url, callback) {}
 *});
 */
var Loader = function (extMap) {
    this.id = ID;
    this.async = true;
    this.pipeline = null;

    this.extMap = JS.mixin(extMap, defaultMap);
};
Loader.ID = ID;

/**
 * Add custom supported types handler or modify existing type handler.
 * @method addHandlers
 * @param {Object} extMap Custom supported types with corresponded handler
 */
Loader.prototype.addHandlers = function (extMap) {
    this.extMap = JS.mixin(this.extMap, extMap);
};

Loader.prototype.handle = function (item, callback) {
    var loadFunc = this.extMap[item.type] || this.extMap['default'];
    return loadFunc.call(this, item, callback);
};

Pipeline.Loader = module.exports = Loader;
