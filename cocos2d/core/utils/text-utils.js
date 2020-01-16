/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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

import js from '../platform/js'

// Draw text the textBaseline ratio (Can adjust the appropriate baseline ratio based on the platform)
let _BASELINE_RATIO = 0.26;
if (CC_RUNTIME) {
    _BASELINE_RATIO = -0.05;
}

const MAX_CACHE_SIZE = 100;

let pool = new js.Pool(2);
pool.get = function () {
    var node = this._get() || {
        key: null,
        value: null,
        prev: null,
        next: null
    };

    return node;
};

function LRUCache(size) {
    this.count = 0;
    this.limit = size;
    this.datas = {};
    this.head = null;
    this.tail = null;
}

LRUCache.prototype.moveToHead = function (node) {
    node.next = this.head;
    node.prev = null;
    if (this.head !== null) 
        this.head.prev = node;
    this.head = node;
    if (this.tail === null) 
        this.tail = node;
    this.count++;
    this.datas[node.key] = node;
}

LRUCache.prototype.put = function (key, value) {
    const node = pool.get();
    node.key = key;
    node.value = value;
    
    if (this.count >= this.limit) {
        let discard = this.tail;
        delete this.datas[discard.key];
        this.count--;
        this.tail = discard.prev;
        this.tail.next = null;
        discard.prev = null;
        discard.next = null;
        pool.put(discard);
    }
    this.moveToHead(node);
}

LRUCache.prototype.remove = function (node) {
    if (node.prev !== null) {
        node.prev.next = node.next;
    } else {
        this.head = node.next;
    }
    if (node.next !== null) {
        node.next.prev = node.prev;
    } else {
        this.tail = node.prev;
    }
    delete this.datas[node.key];
    this.count--;
}

LRUCache.prototype.get = function (key) {
    const node = this.datas[key];
    if (node) {
        this.remove(node);
        this.moveToHead(node);
        return node.value;
    }
    return null;
}

LRUCache.prototype.clear = function () {
    this.count = 0;
    this.datas = {};
    this.head = null;
    this.tail = null;
}

LRUCache.prototype.has = function (key) {
    return !!this.datas[key];
}

LRUCache.prototype.delete = function (key) {
    const node = this.datas[key];
    this.remove(node);
}

let measureCache = new LRUCache(MAX_CACHE_SIZE);

var textUtils = {

    BASELINE_RATIO: _BASELINE_RATIO,
    MIDDLE_RATIO: (_BASELINE_RATIO + 1) / 2 - _BASELINE_RATIO,

    label_wordRex : /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/,
    label_symbolRex : /^[!,.:;'}\]%\?>、‘“》？。，！]/,
    label_lastWordRex : /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]+|\S)$/,
    label_lastEnglish : /[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]+$/,
    label_firstEnglish : /^[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]/,
    label_firstEmoji : /^[\uD83C\uDF00-\uDFFF\uDC00-\uDE4F]/,
    label_lastEmoji : /([\uDF00-\uDFFF\uDC00-\uDE4F]+|\S)$/,
    label_wrapinspection : true,

    __CHINESE_REG: /^[\u4E00-\u9FFF\u3400-\u4DFF]+$/,
    __JAPANESE_REG: /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g,
    __KOREAN_REG: /^[\u1100-\u11FF]|[\u3130-\u318F]|[\uA960-\uA97F]|[\uAC00-\uD7AF]|[\uD7B0-\uD7FF]+$/,

    isUnicodeCJK: function(ch) {
        return this.__CHINESE_REG.test(ch) || this.__JAPANESE_REG.test(ch) || this.__KOREAN_REG.test(ch);
    },

    //Checking whether the character is a whitespace
    isUnicodeSpace: function(ch) {
        ch = ch.charCodeAt(0);
        return ((ch >= 9 && ch <= 13) || ch === 32 || ch === 133 || ch === 160 || ch === 5760 || (ch >= 8192 && ch <= 8202) || ch === 8232 || ch === 8233 || ch === 8239 || ch === 8287 || ch === 12288);
    },

    safeMeasureText: function (ctx, string, desc) {
        let font = desc || ctx.font;
        let key = font + "\uD83C\uDFAE" + string;
        let cache = measureCache.get(key);
        if (cache !== null) {
            return cache;
        }

        let metric = ctx.measureText(string);
        let width = metric && metric.width || 0;
        measureCache.put(key, width);

        return width;
    },

    fragmentText: function (stringToken, allWidth, maxWidth, measureText) {
        //check the first character
        var wrappedWords = [];
        //fast return if strArr is empty
        if(stringToken.length === 0 || maxWidth < 0) {
            wrappedWords.push('');
            return wrappedWords;
        }

        var text = stringToken;
        while (allWidth > maxWidth && text.length > 1) {

            var fuzzyLen = text.length * ( maxWidth / allWidth ) | 0;
            var tmpText = text.substring(fuzzyLen);
            var width = allWidth - measureText(tmpText);
            var sLine = tmpText;
            var pushNum = 0;

            var checkWhile = 0;
            var checkCount = 10;

            //Exceeded the size
            while (width > maxWidth && checkWhile++ < checkCount) {
                fuzzyLen *= maxWidth / width;
                fuzzyLen = fuzzyLen | 0;
                tmpText = text.substring(fuzzyLen);
                width = allWidth - measureText(tmpText);
            }

            checkWhile = 0;

            //Find the truncation point
            while (width <= maxWidth && checkWhile++ < checkCount) {
                if (tmpText) {
                    var exec = this.label_wordRex.exec(tmpText);
                    pushNum = exec ? exec[0].length : 1;
                    sLine = tmpText;
                }

                fuzzyLen = fuzzyLen + pushNum;
                tmpText = text.substring(fuzzyLen);
                width = allWidth - measureText(tmpText);
            }

            fuzzyLen -= pushNum;
            if (fuzzyLen === 0) {
                fuzzyLen = 1;
                sLine = sLine.substring(1);
            }

            var sText = text.substring(0, 0 + fuzzyLen), result;

            //symbol in the first
            if (this.label_wrapinspection) {
                if (this.label_symbolRex.test(sLine || tmpText)) {
                    result = this.label_lastWordRex.exec(sText);
                    fuzzyLen -= result ? result[0].length : 0;
                    if (fuzzyLen === 0) fuzzyLen = 1;

                    sLine = text.substring(fuzzyLen);
                    sText = text.substring(0, 0 + fuzzyLen);
                }
            }

            // To judge whether a Emoji words are truncated
            // todo Some Emoji are not well adapted, such as 🚗 and 🇨🇳
            if (this.label_firstEmoji.test(sLine)) {
                result = this.label_lastEmoji.exec(sText);
                if (result && sText !== result[0]) {
                    fuzzyLen -= result[0].length;
                    sLine = text.substring(fuzzyLen);
                    sText = text.substring(0, 0 + fuzzyLen);
                }
            }

            //To judge whether a English words are truncated
            if (this.label_firstEnglish.test(sLine)) {
                result = this.label_lastEnglish.exec(sText);
                if (result && sText !== result[0]) {
                    fuzzyLen -= result[0].length;
                    sLine = text.substring(fuzzyLen);
                    sText = text.substring(0, 0 + fuzzyLen);
                }
            }

            // The first line And do not wrap should not remove the space
            if (wrappedWords.length === 0) {
                wrappedWords.push(sText);
            }
            else {
                sText = sText.trimLeft();
                if (sText.length > 0) {
                    wrappedWords.push(sText);
                }
            }
            text = sLine || tmpText;
            allWidth = measureText(text);
        }

        if (wrappedWords.length === 0) {
            wrappedWords.push(text);
        }
        else {
            text = text.trimLeft();
            if (text.length > 0) {
                wrappedWords.push(text);
            }
        }
        return wrappedWords;
    },
};

cc.textUtils = module.exports = textUtils;
