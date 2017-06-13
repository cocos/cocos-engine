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

var CustomFontDescriptor = function() {
    this._status =  'unloaded';
    //when font is loaded, it will notify each observer in the observers array
    this._observers = [];
    this._isLoadWithCSS = false;
};

CustomFontDescriptor.prototype.onLoaded = function () {
    this._status = 'loaded';
    this._observers.forEach(function(item) {
        item();
    });
};

CustomFontDescriptor.prototype.isLoaded = function () {
    return this._status === 'loaded';
};

CustomFontDescriptor.prototype.addHandler = function (callback) {
    if(this._observers.indexOf(callback) === -1) {
        this._observers.push(callback);
    }
};

var CustomFontLoader = {
    _fontCache: {},
    _fontWidthCache: {},
    _canvasContext: null,
    _testString: "BESbswy",
    _allFontsLoaded: false,
    _intervalId: 0,
    loadTTF: function (url, callback) {
        //these platforms support window.FontFace, but it sucks sometimes.
        var useFontFace = (cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU
                           && cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU_APP
                           && cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ);

        if (window.FontFace && useFontFace) {
            this._loadWithFontFace(url, callback);
        } else {
            this._loadWithCSS(url, callback);
        }

        if (this._intervalId === 0) {
            this._intervalId = setInterval(this._checkFontLoaded.bind(this), 100);
        }
    },

    _checkFontLoaded: function () {
        this._allFontsLoaded = true;

        for(var k in this._fontCache) {
            var fontDescriptor = this._fontCache[k];
            if(fontDescriptor.isLoaded() || !fontDescriptor._isLoadWithCSS) {
                continue;
            }
            var oldWidth = this._fontWidthCache[k];
            this._canvasContext.font = '40px ' + k;
            var newWidth = this._canvasContext.measureText(this._testString).width;
            if(oldWidth !== newWidth) {
                fontDescriptor.onLoaded();
            } else {
                this._allFontsLoaded = false;
            }
        }

        if(this._allFontsLoaded) {
            clearInterval(this._intervalId);
            this._intervalId = 0;
        }
    },

    _loadWithFontFace: function(url, callback) {
        var fontFamilyName = this._getFontFamily(url);

        var fontDescriptor = this._fontCache[fontFamilyName];
        if(!fontDescriptor) {
            var fontFace = new FontFace(fontFamilyName, "url('" + url + "')");
            document.fonts.add(fontFace);

            fontDescriptor = new CustomFontDescriptor();
            fontDescriptor.addHandler(callback);
            this._fontCache[fontFamilyName] = fontDescriptor;

            fontFace.loaded.then(function() {
                fontDescriptor.onLoaded();
            });
        } else {
            if(!fontDescriptor.isLoaded()) {
                fontDescriptor.addHandler(callback);
            }
        }
    },

    _loadWithCSS: function(url, callback) {
        var fontFamilyName = this._getFontFamily(url);

        var fontDescriptor = this._fontCache[fontFamilyName];
        if(!fontDescriptor) {
            //fall back implementations
            var doc = document;
            var fontStyle = document.createElement("style");
            fontStyle.type = "text/css";
            doc.body.appendChild(fontStyle);

            var fontStr = "";
            if (isNaN(fontFamilyName - 0))
                fontStr += "@font-face { font-family:" + fontFamilyName + "; src:";
            else
                fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";

            fontStr += "url('" + url + "');";

            fontStyle.textContent = fontStr + "}";

            var preloadDiv = document.createElement("div");
            var _divStyle = preloadDiv.style;
            _divStyle.fontFamily = fontFamilyName;
            preloadDiv.innerHTML = ".";
            _divStyle.position = "absolute";
            _divStyle.left = "-100px";
            _divStyle.top = "-100px";
            doc.body.appendChild(preloadDiv);

            fontDescriptor = new CustomFontDescriptor();
            fontDescriptor.addHandler(callback);
            this._fontCache[fontFamilyName] = fontDescriptor;
            fontDescriptor._isLoadWithCSS = true;

            if(!this._canvasContext) {
                var labelCanvas = document.createElement('canvas');
                labelCanvas.width = 100;
                labelCanvas.height = 100;
                this._canvasContext = labelCanvas.getContext('2d');
            }

            var fontDesc = '40px ' + fontFamilyName;
            this._canvasContext.font = fontDesc;

            var width = this._canvasContext.measureText(this._testString).width;
            this._fontWidthCache[fontFamilyName] = width;

            var self = this;
            fontStyle.onload = function() {
                setTimeout(function () {
                    //in case some font won't cause the width as to system font.
                    if(!self._allFontsLoaded) {
                        cc.logID(4004);
                        fontDescriptor.onLoaded();
                        cc.director.getScheduler().unschedule(this._checkFontLoaded, this);
                    }
                }, 20000);
            };

        } else {
            if(!fontDescriptor.isLoaded()) {
                fontDescriptor.addHandler(callback);
            }
        }
    },

    _getFontFamily: function (fontHandle) {
        var ttfIndex = fontHandle.lastIndexOf(".ttf");
        if (ttfIndex === -1) return fontHandle;

        var slashPos = fontHandle.lastIndexOf("/");
        var fontFamilyName;
        if (slashPos === -1) {
            fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
        } else {
            fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
        }
        return fontFamilyName;
    }
};

var TextUtils = {
    label_wordRex : /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/,
    label_symbolRex : /^[!,.:;}\]%\?>、‘“》？。，！]/,
    label_lastWordRex : /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]+|\S)$/,
    label_lastEnglish : /[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]+$/,
    label_firsrEnglish : /^[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]/,
    label_wrapinspection : true,

    isUnicodeCJK: function(ch) {
        var __CHINESE_REG = /^[\u4E00-\u9FFF\u3400-\u4DFF]+$/;
        var __JAPANESE_REG = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
        var __KOREAN_REG = /^[\u1100-\u11FF]|[\u3130-\u318F]|[\uA960-\uA97F]|[\uAC00-\uD7AF]|[\uD7B0-\uD7FF]+$/;
        return __CHINESE_REG.test(ch) || __JAPANESE_REG.test(ch) || __KOREAN_REG.test(ch);
    },

    //Checking whether the character is a whitespace
    isUnicodeSpace: function(ch) {
        ch = ch.charCodeAt(0);
        return ((ch >= 9 && ch <= 13) || ch === 32 || ch === 133 || ch === 160 || ch === 5760 || (ch >= 8192 && ch <= 8202) || ch === 8232 || ch === 8233 || ch === 8239 || ch === 8287 || ch === 12288);
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
            var tmpText = text.substr(fuzzyLen);
            var width = allWidth - measureText(tmpText);
            var sLine = tmpText;
            var pushNum = 0;

            var checkWhile = 0;
            var checkCount = 10;

            //Exceeded the size
            while (width > maxWidth && checkWhile++ < checkCount) {
                fuzzyLen *= maxWidth / width;
                fuzzyLen = fuzzyLen | 0;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - measureText(tmpText);
            }

            checkWhile = 0;

            //Find the truncation point
            while (width < maxWidth && checkWhile++ < checkCount) {
                if (tmpText) {
                    var exec = this.label_wordRex.exec(tmpText);
                    pushNum = exec ? exec[0].length : 1;
                    sLine = tmpText;
                }

                fuzzyLen = fuzzyLen + pushNum;
                tmpText = text.substr(fuzzyLen);
                width = allWidth - measureText(tmpText);
            }

            fuzzyLen -= pushNum;
            if (fuzzyLen === 0) {
                fuzzyLen = 1;
                sLine = sLine.substr(1);
            }

            var sText = text.substr(0, fuzzyLen), result;

            //symbol in the first
            if (this.label_wrapinspection) {
                if (this.label_symbolRex.test(sLine || tmpText)) {
                    result = this.label_lastWordRex.exec(sText);
                    fuzzyLen -= result ? result[0].length : 0;
                    if (fuzzyLen === 0) fuzzyLen = 1;

                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }

            //To judge whether a English words are truncated
            if (this.label_firsrEnglish.test(sLine)) {
                result = this.label_lastEnglish.exec(sText);
                if (result && sText !== result[0]) {
                    fuzzyLen -= result[0].length;
                    sLine = text.substr(fuzzyLen);
                    sText = text.substr(0, fuzzyLen);
                }
            }
            if (sText.trim().length > 0) {
                wrappedWords.push(sText);
            }
            text = sLine || tmpText;
            allWidth = measureText(text);
        }
        if (text.length > 0) {
            wrappedWords.push(text);
        }

        return wrappedWords;
    },

};

cc.TextUtils = module.exports = TextUtils;
cc.CustomFontLoader = module.exports = CustomFontLoader;
