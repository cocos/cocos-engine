/*
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

'use strict';

/**
 * @type {Object}
 * @name jsb.AssetsManager
 * jsb.AssetsManager is the native AssetsManager for your game resources or scripts.
 * please refer to this document to know how to use it: http://www.cocos2d-x.org/docs/manual/framework/html5/v3/assets-manager/en
 * Only available in JSB
 */
jsb.AssetsManager = cc.AssetsManager;
/**
 * @type {Object}
 * @name jsb.Manifest
 * please refer to this document to know how to use it: http://www.cocos2d-x.org/docs/manual/framework/html5/v3/assets-manager/en
 * Only available in JSB
 */
jsb.Manifest = cc.Manifest;
/**
 * @type {Object}
 * @name jsb.EventListenerAssetsManager
 * jsb.EventListenerAssetsManager is the native event listener for AssetsManager.
 * please refer to this document to know how to use it: http://www.cocos2d-x.org/docs/manual/framework/html5/v3/assets-manager/en
 * Only available in JSB
 */
jsb.EventListenerAssetsManager = cc.EventListenerAssetsManager;
/**
 * @type {Object}
 * @name jsb.EventAssetsManager
 * jsb.EventAssetsManager is the native event for AssetsManager.
 * please refer to this document to know how to use it: http://www.cocos2d-x.org/docs/manual/framework/html5/v3/assets-manager/en
 * Only available in JSB
 */
jsb.EventAssetsManager = cc.EventAssetsManager;

jsb.AssetsManager.State = {
    UNINITED : 0,
    UNCHECKED : 1,
    PREDOWNLOAD_VERSION : 2,
    DOWNLOADING_VERSION : 3,
    VERSION_LOADED : 4,
    PREDOWNLOAD_MANIFEST : 5,
    DOWNLOADING_MANIFEST : 6,
    MANIFEST_LOADED : 7,
    NEED_UPDATE : 8,
    READY_TO_UPDATE : 9,
    UPDATING : 10,
    UNZIPPING : 11,
    UP_TO_DATE : 12,
    FAIL_TO_UPDATE : 13
}

jsb.EventListenerAssetsManager.prototype._ctor = function(assetsManager, callback) {
    callback !== undefined && this.init(assetsManager, callback);
};

jsb.Manifest.DownloadState = {
    UNSTARTED: 0,
    DOWNLOADING: 1,
    SUCCESSED: 2,
    UNMARKED: 3
};

jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST = 0;
jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST = 1;
jsb.EventAssetsManager.ERROR_PARSE_MANIFEST = 2;
jsb.EventAssetsManager.NEW_VERSION_FOUND = 3;
jsb.EventAssetsManager.ALREADY_UP_TO_DATE = 4;
jsb.EventAssetsManager.UPDATE_PROGRESSION = 5;
jsb.EventAssetsManager.ASSET_UPDATED = 6;
jsb.EventAssetsManager.ERROR_UPDATING = 7;
jsb.EventAssetsManager.UPDATE_FINISHED = 8;
jsb.EventAssetsManager.UPDATE_FAILED = 9;
jsb.EventAssetsManager.ERROR_DECOMPRESS = 10;

/**
 * @constant
 * @type Number
 */
cc.KEYBOARD_RETURNTYPE_DEFAULT = 0;

/**
 * @constant
 * @type Number
 */
cc.KEYBOARD_RETURNTYPE_DONE = 1;

/**
 * @constant
 * @type Number
 */
cc.KEYBOARD_RETURNTYPE_SEND = 2;

/**
 * @constant
 * @type Number
 */
cc.KEYBOARD_RETURNTYPE_SEARCH = 3;

/**
 * @constant
 * @type Number
 */
cc.KEYBOARD_RETURNTYPE_GO = 4;

/**
 * The EditBox::InputMode defines the type of text that the user is allowed * to enter.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_MODE_ANY = 0;

/**
 * The user is allowed to enter an e-mail address.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_MODE_EMAILADDR = 1;

/**
 * The user is allowed to enter an integer value.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_MODE_NUMERIC = 2;

/**
 * The user is allowed to enter a phone number.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_MODE_PHONENUMBER = 3;

/**
 * The user is allowed to enter a URL.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_MODE_URL = 4;

/**
 * The user is allowed to enter a real number value.
 * This extends kEditBoxInputModeNumeric by allowing a decimal point.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_MODE_DECIMAL = 5;

/**
 * The user is allowed to enter any text, except for line breaks.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_MODE_SINGLELINE = 6;

/**
 * Indicates that the text entered is confidential data that should be
 * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_FLAG_PASSWORD = 0;

/**
 * Indicates that the text entered is sensitive data that the
 * implementation must never store into a dictionary or table for use
 * in predictive, auto-completing, or other accelerated input schemes.
 * A credit card number is an example of sensitive data.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_FLAG_SENSITIVE = 1;

/**
 * This flag is a hint to the implementation that during text editing,
 * the initial letter of each word should be capitalized.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_WORD = 2;

/**
 * This flag is a hint to the implementation that during text editing,
 * the initial letter of each sentence should be capitalized.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_SENTENCE = 3;

/**
 * Capitalize all characters automatically.
 * @constant
 * @type Number
 */
cc.EDITBOX_INPUT_FLAG_INITIAL_CAPS_ALL_CHARACTERS = 4;

