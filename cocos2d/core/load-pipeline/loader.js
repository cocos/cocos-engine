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
        callback( new Error('JSON Loader: Parse json [' + item.id + '] failed : ' + e) );
    }
}

function loadImage (item, callback) {
    if (!(item.content instanceof Image)) {
        callback( new Error('Image Loader: Input item doesn\'t contain Image content') );
    }
    var url = item.url;
    var tex = cc.textureCache.getTextureForKey(url) || new Texture2D();
    tex.url = url;
    tex.initWithElement(item.content);
    tex.handleLoadedTexture();
    cc.textureCache.cacheImage(url, tex);
    callback(null, tex);
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
        callback( new Error('Plist Loader: Parse [' + item.id + '] failed') );
    }
}

var fntRE = {
    INFO_EXP: /info [^\n]*(\n|$)/gi,
    COMMON_EXP: /common [^\n]*(\n|$)/gi,
    PAGE_EXP: /page [^\n]*(\n|$)/gi,
    CHAR_EXP: /char [^\n]*(\n|$)/gi,
    KERNING_EXP: /kerning [^\n]*(\n|$)/gi,
    ITEM_EXP: /\w+=[^ \r\n]+/gi,
    INT_EXP: /^[\-]?\d+$/,
};
function _parseFntStrToObj (str) {
    var arr = str.match(fntRE.ITEM_EXP);
    var obj = {};
    if (arr) {
        for (var i = 0, li = arr.length; i < li; i++) {
            var tempStr = arr[i];
            var index = tempStr.indexOf('=');
            var key = tempStr.substring(0, index);
            var value = tempStr.substring(index + 1);
            if (value.match(fntRE.INT_EXP)) value = parseInt(value);
            else if (value[0] === '"') value = value.substring(1, value.length - 1);
            obj[key] = value;
        }
    }
    return obj;
}
function loadFnt (item, callback) {
    var fntStr = item.content;
    var url = item.url;

    var fnt = {}, i, li;
    //padding
    var infoObj = _parseFntStrToObj(fntStr.match(fntRE.INFO_EXP)[0]);
    var paddingArr = infoObj['padding'].split(',');
    var padding = {
        left: parseInt(paddingArr[0]),
        top: parseInt(paddingArr[1]),
        right: parseInt(paddingArr[2]),
        bottom: parseInt(paddingArr[3])
    };

    //common
    var commonObj = _parseFntStrToObj(fntStr.match(fntRE.COMMON_EXP)[0]);
    fnt.commonHeight = commonObj['lineHeight'];
    //font size
    fnt.fontSize = infoObj['size'];
    if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
        var texSize = cc.configuration.getMaxTextureSize();
        if (commonObj['scaleW'] > texSize.width || commonObj['scaleH'] > texSize.height) {
            cc.log('cc.LabelBMFont._parseCommonArguments(): page can\'t be larger than supported');
        }
    }
    if (commonObj['pages'] !== 1) {
        cc.log('cc.LabelBMFont._parseCommonArguments(): only supports 1 page');
    }

    //page
    var pageObj = _parseFntStrToObj(fntStr.match(fntRE.PAGE_EXP)[0]);
    if (pageObj['id'] !== 0) {
        cc.log('cc.LabelBMFont._parseImageFileName() : file could not be found');
    }
    fnt.atlasName = cc.path.changeBasename(url, pageObj['file']);

    //char
    var charLines = fntStr.match(fntRE.CHAR_EXP);
    var fontDefDictionary = fnt.fontDefDictionary = {};
    for (i = 0, li = charLines.length; i < li; i++) {
        var charObj = _parseFntStrToObj(charLines[i]);
        var charId = charObj['id'];
        fontDefDictionary[charId] = {
            rect: {x: charObj['x'], y: charObj['y'], width: charObj['width'], height: charObj['height']},
            xOffset: charObj['xoffset'],
            yOffset: charObj['yoffset'],
            xAdvance: charObj['xadvance']
        };
    }

    //kerning
    var kerningDict = fnt.kerningDict = {};
    var kerningLines = fntStr.match(fntRE.KERNING_EXP);
    if (kerningLines) {
        for (i = 0, li = kerningLines.length; i < li; i++) {
            var kerningObj = _parseFntStrToObj(kerningLines[i]);
            kerningDict[(kerningObj['first'] << 16) | (kerningObj['second'] & 0xffff)] = kerningObj['amount'];
        }
    }
    callback(null, fnt);
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

    'fnt' : loadFnt,

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
 * @example
 *  var loader = new Loader({
 *      // This will match all url with `.scene` extension or all url with `scene` type
 *      'scene' : function (url, callback) {}
 *  });
 * 
 * @method Loader
 * @param {Object} extMap Custom supported types with corresponded handler
 */
var Loader = function (extMap) {
    this.id = ID;
    this.async = true;
    this.pipeline = null;

    this.extMap = JS.mixin(extMap, defaultMap);
};
Loader.ID = ID;
JS.mixin(Loader.prototype, {
    /**
     * Add custom supported types handler or modify existing type handler.
     * @method addHandlers
     * @param {Object} extMap Custom supported types with corresponded handler
     */
    addHandlers: function (extMap) {
        this.extMap = JS.mixin(this.extMap, extMap);
    },

    handle: function (item, callback) {
        var loadFunc = this.extMap[item.type] || this.extMap['default'];
        loadFunc.call(this, item, function (err, result) {
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