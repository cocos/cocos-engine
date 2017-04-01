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

'use strict';

//FIXME: should delete this line after implementing the VideoPlayer on Mac and Windows
if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
    cc.VideoPlayer = {};
}

//FIXME: should delete this line after implementing the VideoPlayer on Mac and Windows
if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
    cc.WebView = {};
}

cc.VideoPlayer.EventType = {
    PLAYING: 0,
    PAUSED: 1,
    STOPPED: 2,
    COMPLETED: 3,
    META_LOADED: 4,
    CLICKED: 5,
    READY_TO_PLAY: 6
};

cc.WebView.EventType = {
    LOADING: 0,
    LOADED: 1,
    ERROR: 2,
    JS_EVALUATED: 3
};

cc.EditBox.InputMode = cc.Enum({

    ANY: 0,

    /**
     * The user is allowed to enter an e-mail address.
     */
    EMAIL_ADDR: 1,

    /**
     * The user is allowed to enter an integer value.
     */
    NUMERIC: 2,

    /**
     * The user is allowed to enter a phone number.
     */
    PHONE_NUMBER: 3,

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
    SINGLE_LINE: 6
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
    INITIAL_CAPS_ALL_CHARACTERS: 4,

    /**
     * Don't do anything with the input text.
     */
    DEFAULT: 5
});

/**
 * Enum for keyboard return types
 * @readonly
 * @enum {number}
 */
cc.EditBox.KeyboardReturnType = cc.Enum({
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
