/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 */

/**
 * @category loader
 */

import {safeMeasureText} from '../utils/text-utils';
import { legacyCC } from '../global-exports';

interface IFontLoadHandle {
    fontFamilyName;
    refWidth;
    callback;
    startTime;
}

let _canvasContext: CanvasRenderingContext2D|null = null;
// letter symbol number CJK
const _testString = "BES bswy:->@123\u4E01\u3041\u1101";

let _fontFaces = {};
let _intervalId = -1;
let _loadingFonts:Array<IFontLoadHandle> = [];
// 3 seconds timeout
let _timeout = 3000;

let useNativeCheck = (function () {
    let nativeCheck;
    return function () {
        if (!nativeCheck) {
            if (!!window.FontFace) {
                var match = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent);
                var safari10Match = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);
        
                if (match) {
                    nativeCheck = parseInt(match[1], 10) > 42;
                } 
                else if (safari10Match) {
                    nativeCheck = false;
                } 
                else {
                    nativeCheck = true;
                }
        
            } else {
                nativeCheck = false;
            }
        }
        return nativeCheck;
    }
})();

function nativeCheckFontLoaded (start, font, callback) {
    var loader = new Promise(function (resolve, reject) {
        var check = function () {
            var now = Date.now();

            if (now - start >= _timeout) {
                reject();
            } 
            else {
                // @ts-ignore
                document.fonts.load('40px ' + font).then(function (fonts) {
                    if (fonts.length >= 1) {
                        resolve();
                    } 
                    else {
                        setTimeout(check, 100);
                    }
                }, function () {
                    reject();
                });
            }
        };
        check();
    });
  
    let timeoutId;
    let timer = new Promise(function (resolve, reject) {
        timeoutId = setTimeout(reject, _timeout);
    });
  
    Promise.race([timer, loader]).then(function () {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        callback(null, font);
    }, function () {
        legacyCC.warnID(4933, font);
        callback(null, font);
    });
}

function _checkFontLoaded () {
    let allFontsLoaded = true;
    let now = Date.now();

    for (let i = _loadingFonts.length - 1; i >= 0; i--) {
        let fontLoadHandle = _loadingFonts[i];
        let fontFamily = fontLoadHandle.fontFamilyName;
        // load timeout
        if (now - fontLoadHandle.startTime > _timeout) {
            legacyCC.warnID(4933, fontFamily);
            fontLoadHandle.callback(null, fontFamily);
            _loadingFonts.splice(i, 1);
            continue;
        }

        let oldWidth = fontLoadHandle.refWidth;
        // @ts-ignore
        _canvasContext.font = '40px ' + fontFamily;
        // @ts-ignore
        let newWidth = safeMeasureText(_canvasContext, _testString);
        // loaded successfully
        if (oldWidth !== newWidth) {
            _loadingFonts.splice(i, 1);
            fontLoadHandle.callback(null, fontFamily);
        }
        else {
            allFontsLoaded = false;
        }
    }

    if (allFontsLoaded) {
        clearInterval(_intervalId);
        _intervalId = -1;
    }
}

export function loadFont (item, callback) {
    let url = item.url;
    let fontFamilyName = _getFontFamily(url);

    // Already loaded fonts
    if (_fontFaces[fontFamilyName]) {
        return fontFamilyName;
    }

    if (!_canvasContext) {
        let labelCanvas = document.createElement('canvas');
        labelCanvas.width = 100;
        labelCanvas.height = 100;
        _canvasContext = labelCanvas.getContext('2d');
    }

    // Default width reference to test whether new font is loaded correctly
    let fontDesc = '40px ' + fontFamilyName;
    // @ts-ignore
    _canvasContext.font = fontDesc;
    // @ts-ignore
    let refWidth = safeMeasureText(_canvasContext, _testString);

    // Setup font face style
    let fontStyle = document.createElement("style");
    fontStyle.type = "text/css";
    let fontStr = "";
    if (isNaN(fontFamilyName - 0))
        fontStr += "@font-face { font-family:" + fontFamilyName + "; src:";
    else
        fontStr += "@font-face { font-family:'" + fontFamilyName + "'; src:";
    fontStr += "url('" + url + "');";
    fontStyle.textContent = fontStr + "}";
    document.body.appendChild(fontStyle);

    // Preload font with div
    let preloadDiv = document.createElement("div");
    let divStyle = preloadDiv.style;
    divStyle.fontFamily = fontFamilyName;
    preloadDiv.innerHTML = ".";
    divStyle.position = "absolute";
    divStyle.left = "-100px";
    divStyle.top = "-100px";
    document.body.appendChild(preloadDiv);

    if (useNativeCheck()) {
        nativeCheckFontLoaded(Date.now(), fontFamilyName, callback);
    }
    else {
        // Save loading font
        let fontLoadHandle:IFontLoadHandle = {
            fontFamilyName,
            refWidth,
            callback,
            startTime: Date.now()
        }
        _loadingFonts.push(fontLoadHandle);
        if (_intervalId === -1) {
            _intervalId = setInterval(_checkFontLoaded, 100);
        }
    }
    _fontFaces[fontFamilyName] = fontStyle;
}

export function _getFontFamily (fontHandle) {
    let ttfIndex = fontHandle.lastIndexOf(".ttf");
    if (ttfIndex === -1) return fontHandle;

    let slashPos = fontHandle.lastIndexOf("/");
    let fontFamilyName;
    if (slashPos === -1) {
        fontFamilyName = fontHandle.substring(0, ttfIndex) + "_LABEL";
    } else {
        fontFamilyName = fontHandle.substring(slashPos + 1, ttfIndex) + "_LABEL";
    }
    if (fontFamilyName.indexOf(' ') !== -1) {
        fontFamilyName = '"' + fontFamilyName + '"';
    }
    return fontFamilyName;
}