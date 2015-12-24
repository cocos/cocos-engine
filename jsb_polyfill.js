'use strict';

cc.ParticleSystem.Mode = cc.Enum({
    /** The gravity mode (A mode) */
    GRAVITY: 0,
    /** The radius mode (B mode) */
    RADIUS: 1
});

cc.ParticleSystem.Type = cc.Enum({
    /**
     * Living particles are attached to the world and are unaffected by emitter repositioning.
     */
    FREE: 0,

    /**
     * Living particles are attached to the world but will follow the emitter repositioning.<br/>
     * Use case: Attach an emitter to an sprite, and you want that the emitter follows the sprite.
     */
    RELATIVE: 1,

    /**
     * Living particles are attached to the emitter and are translated along with it.
     */
    GROUPED: 2
});

cc.ProgressTimer.Type = cc.Enum({
    /**
     * Radial Counter-Clockwise
     */
    RADIAL: 0,
    BAR: 1
});


cc.EditBox.InputMode = cc.Enum({

    ANY: 0,

    /**
     * The user is allowed to enter an e-mail address.
     */
    EMAILADDR: 1,

    /**
     * The user is allowed to enter an integer value.
     */
    NUMERIC: 2,

    /**
     * The user is allowed to enter a phone number.
     */
    PHONENUMBER: 3,

    /**
     * The user is allowed to enter a URL.
     */
    URL: 4,

    /**
     * The user is allowed to enter a real number value.
     * This extends kEditBoxInputModeNumeric by allowing a decimal point.
     */
    DECIMAL: 5,

    /**
     * The user is allowed to enter any text, except for line breaks.
     */
    SINGLELINE: 6
});

/**
 * Enum for the EditBox's input flags
 * @readonly
 * @enum {number}
 * @memberof cc.EditBox
 */
cc.EditBox.InputFlag = cc.Enum({
    /**
     * Indicates that the text entered is confidential data that should be
     * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
     */
    PASSWORD: 0,

    /**
     * Indicates that the text entered is sensitive data that the
     * implementation must never store into a dictionary or table for use
     * in predictive, auto-completing, or other accelerated input schemes.
     * A credit card number is an example of sensitive data.
     */
    SENSITIVE: 1,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each word should be capitalized.
     */
    INITIAL_CAPS_WORD: 2,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each sentence should be capitalized.
     */
    INITIAL_CAPS_SENTENCE: 3,

    /**
     * Capitalize all characters automatically.
     */
    INITIAL_CAPS_ALL_CHARACTERS: 4
});

/**
 * Enum for keyboard return types
 * @readonly
 * @enum {number}
 */
cc.KeyboardReturnType = cc.Enum({
    DEFAULT: 0,
    DONE: 1,
    SEND: 2,
    SEARCH: 3,
    GO: 4
});

/**
 * Enum for text alignment
 * @readonly
 * @enum {number}
 */
cc.TextAlignment = cc.Enum({
    LEFT: 0,
    CENTER: 1,
    RIGHT: 2
});

/**
 * Enum for vertical text alignment
 * @readonly
 * @enum {number}
 */
cc.VerticalTextAlignment = cc.Enum({
    TOP: 0,
    CENTER: 1,
    BOTTOM: 2
});

/**
 * Enum for Relative layout parameter RelativeAlign
 * @readonly
 * @enum {number}
 */
ccui.RelativeLayoutParameter.Type = cc.Enum({
    /**
     * The none of ccui.RelativeLayoutParameter's relative align.
     */
    NONE: 0,
    /**
     * The parent's top left of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_TOP_LEFT: 1,
    /**
     * The parent's top center horizontal of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_TOP_CENTER_HORIZONTAL: 2,
    /**
     * The parent's top right of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_TOP_RIGHT: 3,
    /**
     * The parent's left center vertical of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_LEFT_CENTER_VERTICAL: 4,

    /**
     * The center in parent of ccui.RelativeLayoutParameter's relative align.
     */
    CENTER_IN_PARENT: 5,

    /**
     * The parent's right center vertical of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_RIGHT_CENTER_VERTICAL: 6,
    /**
     * The parent's left bottom of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_LEFT_BOTTOM: 7,
    /**
     * The parent's bottom center horizontal of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_BOTTOM_CENTER_HORIZONTAL: 8,
    /**
     * The parent's right bottom of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_RIGHT_BOTTOM: 9,

    /**
     * The location above left align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_ABOVE_LEFTALIGN: 10,
    /**
     * The location above center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_ABOVE_CENTER: 11,
    /**
     * The location above right align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_ABOVE_RIGHTALIGN: 12,
    /**
     * The location left of top align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_LEFT_OF_TOPALIGN: 13,
    /**
     * The location left of center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_LEFT_OF_CENTER: 14,
    /**
     * The location left of bottom align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_LEFT_OF_BOTTOMALIGN: 15,
    /**
     * The location right of top align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_RIGHT_OF_TOPALIGN: 16,
    /**
     * The location right of center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_RIGHT_OF_CENTER: 17,
    /**
     * The location right of bottom align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_RIGHT_OF_BOTTOMALIGN: 18,
    /**
     * The location below left align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_BELOW_LEFTALIGN: 19,
    /**
     * The location below center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_BELOW_CENTER: 20,
    /**
     * The location below right align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_BELOW_RIGHTALIGN: 21
});


/**
 * Enum for layout type
 * @readonly
 * @enum {number}
 */
ccui.Layout.Type = cc.Enum({
    /**
     * The absolute of ccui.Layout's layout type.
     */
    ABSOLUTE: 0,
    /**
     * The vertical of ccui.Layout's layout type.
     */
    LINEAR_VERTICAL: 1,
    /**
     * The horizontal of ccui.Layout's layout type.
     */
    LINEAR_HORIZONTAL: 2,
    /**
     * The relative of ccui.Layout's layout type.
     */
    RELATIVE: 3
});

/**
 * Enum for loadingBar Type
 * @readonly
 * @enum {number}
 */
ccui.LoadingBar.Type = cc.Enum({
    /**
     * The left direction of ccui.LoadingBar.
     */
    LEFT: 0,
    /**
     * The right direction of ccui.LoadingBar.
     */
    RIGHT: 1
});

/**
 * Enum for ScrollView direction
 * @readonly
 * @enum {number}
 */
ccui.ScrollView.Dir = cc.Enum({
    /**
     * The none flag of ccui.ScrollView's direction.
     */
    NONE: 0,
    /**
     * The vertical flag of ccui.ScrollView's direction.
     */
    VERTICAL: 1,
    /**
     * The horizontal flag of ccui.ScrollView's direction.
     */
    HORIZONTAL: 2,
    /**
     * The both flag of ccui.ScrollView's direction.
     */
    BOTH: 3
});

require("CCDebugger");

cc.js.mixin(cc.path, {
    //todo make public after verification
    _normalize: function(url){
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(this.normalizeRE, '');
        } while(oldUrl.length !== url.length);
        return url;
    },

    // The platform-specific file separator. '\\' or '/'.
    sep: (cc.sys.os === cc.sys.OS_WINDOWS ? '\\' : '/'),

    // @param {string} path
    // @param {boolean|string} [endsWithSep = true]
    // @returns {string}
    _setEndWithSep: function (path, endsWithSep) {
        var sep = cc.path.sep;
        if (typeof endsWithSep === 'undefined') {
            endsWithSep = true;
        }
        else if (typeof endsWithSep === 'string') {
            sep = endsWithSep;
            endsWithSep = !!endsWithSep;
        }

        var endChar = path[path.length - 1];
        var oldEndWithSep = (endChar === '\\' || endChar === '/');
        if (!oldEndWithSep && endsWithSep) {
            path += sep;
        }
        else if (oldEndWithSep && !endsWithSep) {
            path = path.slice(0, -1);
        }
        return path;
    }
});

cc.EventTarget.call(cc.game);
cc.js.addon(cc.game, cc.EventTarget.prototype);
cc.EventTarget.call(cc.director);
cc.js.addon(cc.director, cc.EventTarget.prototype);

// cc.Label
cc._Label = cc.Label;
cc.Label = function (string, fontHandle, type) {
    var label;
    if (type === cc.Label.Type.TTF) {
        label = cc._Label.createWithSystemFont(string, fontHandle, 40);
    }
    else if (type === cc.Label.Type.BMFont) {
        label = cc._Label.createWithBMFont(fontHandle, string);
    }
    return label;
};
cc.Label.Type = cc.Enum({
    TTF: 0,
    BMFont: 1
});
cc.Label.Overflow = cc.Enum({
    CLAMP: 0,
    SHRINK: 1,
    RESIZE: 2
});

cc.spriteFrameAnimationCache = cc.animationCache;
cc.SpriteFrameAnimation = cc.Animation;

// Assets
cc.js.setClassName('cc.SpriteFrame', cc.SpriteFrame);

// ccsg
window._ccsg = {
    Node: cc.Node,
    Scene: cc.Scene,
    Sprite: cc.Sprite,
    ParticleSystem: cc.ParticleSystem,
    Label: cc.Label,

};

// rename cc.Class to cc._Class
cc._Class = cc.Class;

// cc.textureCache.cacheImage
cc.textureCache._textures = {};
cc.textureCache.cacheImage = function (key, texture) {
    if (texture instanceof cc.Texture2D) {
        this._textures[key] = texture;
    }
};
cc.textureCache._getTextureForKey = cc.textureCache.getTextureForKey;
cc.textureCache.getTextureForKey = function (key) {
    var tex = this._getTextureForKey(key);
    if (!tex)
        tex = this._textures[key];
    return tex || null;
};

// cc.Texture2D
cc.Texture2D.prototype.isLoaded = function () {
    return true;
};
cc.Texture2D.prototype.getPixelWidth = cc.Texture2D.prototype.getPixelsWide;
cc.Texture2D.prototype.getPixelHeight = cc.Texture2D.prototype.getPixelsHigh;

// cc.SpriteFrame
cc.SpriteFrame.prototype.textureLoaded = function () {
    return this.getTexture() !== null;
};
cc.SpriteFrame.prototype._deserialize = function (data, handle) {
    var rect = data.rect;
    rect = new cc.Rect(rect[0], rect[1], rect[2], rect[3]);
    var rectInP = cc.rectPointsToPixels(rect);
    var offset = new cc.Vec2(data.offset[0], data.offset[1]);
    var offsetInP = cc.pointPointsToPixels(offset);
    var size = new cc.Size(data.originalSize[0], data.originalSize[1]);
    var sizeInP = cc.sizePointsToPixels(size);
    var rotated = data.rotated === 1;
    // init properties not included in this._initWithTexture()
    this._name = data.name;
    var capInsets = data.capInsets;
    if (capInsets) {
        this.insetLeft = capInsets[0];
        this.insetTop = capInsets[1];
        this.insetRight = capInsets[2];
        this.insetBottom = capInsets[3];
    }

    // load texture via _textureFilenameSetter
    var textureUuid = data.texture;
    if (textureUuid) {
        handle.result.push(this, '_textureFilenameSetter', textureUuid);
    }

    this.initWithTexture(null, rectInP, rotated, offsetInP, sizeInP);
};
cc.SpriteFrame.prototype._checkRect = function (texture) {
    var rect = this._rectInPixels;
    var maxX = rect.x, maxY = rect.y;
    if (this._rotated) {
        maxX += rect.height;
        maxY += rect.width;
    }
    else {
        maxX += rect.width;
        maxY += rect.height;
    }
    if (maxX > texture.getPixelWidth()) {
        cc.error(cc._LogInfos.RectWidth, texture.url);
    }
    if (maxY > texture.getPixelHeight()) {
        cc.error(cc._LogInfos.RectHeight, texture.url);
    }
};
var getTextureJSB = cc.SpriteFrame.prototype.getTexture;
cc.SpriteFrame.prototype.getTexture = function () {
    var tex = getTextureJSB.call(this);
    this._texture = tex;
    return tex;
};
cc.js.set(cc.SpriteFrame.prototype, '_textureFilenameSetter', function (url) {
    this._textureFilename = url;
    if (url) {
        // texture will be init in getTexture()
        var texture = this.getTexture();
        if (this.textureLoaded()) {
            this._checkRect(texture);
            this.emit('load');
        }
        else {
            // register event in setTexture()
            this._texture = null;
            this.setTexture(texture);
        }
    }
});

// cc.Label
cc.Label.prototype.setHorizontalAlign = cc.Label.prototype.setHorizontalAlignment;
cc.Label.prototype.setVerticalAlign = cc.Label.prototype.setVerticalAlignment;
cc.Label.prototype.setFontSize = cc.Label.prototype.setSystemFontSize;
cc.Label.prototype.setOverflow = function () {};
cc.Label.prototype.enableWrapText = function () {};
cc.Label.prototype.setLineHeight = function () {};

// cc.Event#getCurrentTarget
cc.Event.prototype._getCurrentTarget = cc.Event.prototype.getCurrentTarget;
cc.Event.prototype.getCurrentTarget = function () {
    return this._currentTarget || this._getCurrentTarget();
};

// cc.eventManager.addListener
cc.eventManager.addListener = function(listener, nodeOrPriority) {
    if(!(listener instanceof cc.EventListener)) {
        listener = cc.EventListener.create(listener);
    }

    if (typeof nodeOrPriority == "number") {
        if (nodeOrPriority == 0) {
            cc.log("0 priority is forbidden for fixed priority since it's used for scene graph based priority.");
            return;
        }

        cc.eventManager.addEventListenerWithFixedPriority(listener, nodeOrPriority);
    } else {
        var node = nodeOrPriority;
        if (nodeOrPriority instanceof cc.Component) {
            node = nodeOrPriority.node._sgNode;
        }
        if (nodeOrPriority instanceof cc.Node) {
            node = nodeOrPriority._sgNode;
        }
        // rebind target
        if (node !== nodeOrPriority) {
            var keys = Object.keys(listener);
            // Overwrite all functions
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                var value = listener[key];
                if (typeof value === 'function') {
                    // var _value = value;
                    listener[key] = function (event1, event2) {
                        // event must be the last argument, and arguments count could be 1 or 2 
                        var event = event2 || event1;
                        // Replace event's _currentTarget
                        if (event) {
                            event._currentTarget = nodeOrPriority;
                        }
                        value.call(this, event1, event2);
                    };
                }
            }
        }
        cc.eventManager.addEventListenerWithSceneGraphPriority(listener, node);
    }

    return listener;
};

// cc.Scheduler
cc.Scheduler.prototype.scheduleUpdate = cc.Scheduler.prototype.scheduleUpdateForTarget;

// cc.Scale9Sprite
cc.Scale9Sprite.prototype._setBlendFunc = cc.Scale9Sprite.prototype.setBlendFunc;
cc.Scale9Sprite.prototype.setBlendFunc = function(blendFunc, dst) {
    if (dst !== undefined) {
        blendFunc = {
            src : blendFunc,
            dst : dst
        };
    }
    this._setBlendFunc(blendFunc);
};
cc.Scale9Sprite.prototype._setContentSize = cc.Scale9Sprite.prototype.setContentSize;
cc.Scale9Sprite.prototype.setContentSize = function(size, height){
    if (height !== undefined) {
        size = new cc.Size(size, height);
    }
    this._setContentSize(size);
};
cc.Scale9Sprite.prototype._setAnchorPoint = cc.Scale9Sprite.prototype.setAnchorPoint;
cc.Scale9Sprite.prototype.setAnchorPoint = function(anchorPoint, y){
    if (y !== undefined) {
        anchorPoint = new cc.Vec2(anchorPoint, y);
    }
    this._setAnchorPoint(anchorPoint);
};
