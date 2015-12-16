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
    ParticleSystem: cc.ParticleSystem,
    Label: cc.Label,

};
