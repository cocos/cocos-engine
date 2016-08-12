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

if (cc.sys) return;

/**
 * System variables
 * @class sys
 * @static
 */
cc.sys = {};
var sys = cc.sys;

/**
 * English language code
 * @property {String} LANGUAGE_ENGLISH
 * @readOnly
 */
sys.LANGUAGE_ENGLISH = "en";

/**
 * Chinese language code
 * @property {String} LANGUAGE_CHINESE
 * @readOnly
 */
sys.LANGUAGE_CHINESE = "zh";

/**
 * French language code
 * @property {String} LANGUAGE_FRENCH
 * @readOnly
 */
sys.LANGUAGE_FRENCH = "fr";

/**
 * Italian language code
 * @property {String} LANGUAGE_ITALIAN
 * @readOnly
 */
sys.LANGUAGE_ITALIAN = "it";

/**
 * German language code
 * @property {String} LANGUAGE_GERMAN
 * @readOnly
 */
sys.LANGUAGE_GERMAN = "de";

/**
 * Spanish language code
 * @property {String} LANGUAGE_SPANISH
 * @readOnly
 */
sys.LANGUAGE_SPANISH = "es";

/**
 * Spanish language code
 * @property {String} LANGUAGE_DUTCH
 * @readOnly
 */
sys.LANGUAGE_DUTCH = "du";

/**
 * Russian language code
 * @property {String} LANGUAGE_RUSSIAN
 * @readOnly
 */
sys.LANGUAGE_RUSSIAN = "ru";

/**
 * Korean language code
 * @property {String} LANGUAGE_KOREAN
 * @readOnly
 */
sys.LANGUAGE_KOREAN = "ko";

/**
 * Japanese language code
 * @property {String} LANGUAGE_JAPANESE
 * @readOnly
 */
sys.LANGUAGE_JAPANESE = "ja";

/**
 * Hungarian language code
 * @property {String} LANGUAGE_HUNGARIAN
 * @readonly
 */
sys.LANGUAGE_HUNGARIAN = "hu";

/**
 * Portuguese language code
 * @property {String} LANGUAGE_PORTUGUESE
 * @readOnly
 */
sys.LANGUAGE_PORTUGUESE = "pt";

/**
 * Arabic language code
 * @property {String} LANGUAGE_ARABIC
 * @readOnly
 */
sys.LANGUAGE_ARABIC = "ar";

/**
 * Norwegian language code
 * @property {String} LANGUAGE_NORWEGIAN
 * @readOnly
 */
sys.LANGUAGE_NORWEGIAN = "no";

/**
 * Polish language code
 * @property {String} LANGUAGE_POLISH
 * @readOnly
 */
sys.LANGUAGE_POLISH = "pl";

/**
 * Unknown language code
 * @property {String} LANGUAGE_UNKNOWN
 * @readOnly
 */
sys.LANGUAGE_UNKNOWN = "unknown";

/**
 * @property {String} OS_IOS
 * @readOnly
 */
sys.OS_IOS = "iOS";
/**
 * @property {String} OS_ANDROID
 * @readOnly
 */
sys.OS_ANDROID = "Android";
/**
 * @property {String} OS_WINDOWS
 * @readOnly
 */
sys.OS_WINDOWS = "Windows";
/**
 * @property {String} OS_MARMALADE
 * @readOnly
 */
sys.OS_MARMALADE = "Marmalade";
/**
 * @property {String} OS_LINUX
 * @readOnly
 */
sys.OS_LINUX = "Linux";
/**
 * @property {String} OS_BADA
 * @readOnly
 */
sys.OS_BADA = "Bada";
/**
 * @property {String} OS_BLACKBERRY
 * @readOnly
 */
sys.OS_BLACKBERRY = "Blackberry";
/**
 * @property {String} OS_OSX
 * @readOnly
 */
sys.OS_OSX = "OS X";
/**
 * @property {String} OS_WP8
 * @readOnly
 */
sys.OS_WP8 = "WP8";
/**
 * @property {String} OS_WINRT
 * @readOnly
 */
sys.OS_WINRT = "WINRT";
/**
 * @property {String} OS_UNKNOWN
 * @readOnly
 */
sys.OS_UNKNOWN = "Unknown";

/**
 * @property {Number} UNKNOWN
 * @readOnly
 * @default -1
 */
sys.UNKNOWN = -1;
/**
 * @property {Number} WIN32
 * @readOnly
 * @default 0
 */
sys.WIN32 = 0;
/**
 * @property {Number} LINUX
 * @readOnly
 * @default 1
 */
sys.LINUX = 1;
/**
 * @property {Number} MACOS
 * @readOnly
 * @default 2
 */
sys.MACOS = 2;
/**
 * @property {Number} ANDROID
 * @readOnly
 * @default 3
 */
sys.ANDROID = 3;
/**
 * @property {Number} IPHONE
 * @readOnly
 * @default 4
 */
sys.IPHONE = 4;
/**
 * @property {Number} IPAD
 * @readOnly
 * @default 5
 */
sys.IPAD = 5;
/**
 * @property {Number} BLACKBERRY
 * @readOnly
 * @default 6
 */
sys.BLACKBERRY = 6;
/**
 * @property {Number} NACL
 * @readOnly
 * @default 7
 */
sys.NACL = 7;
/**
 * @property {Number} EMSCRIPTEN
 * @readOnly
 * @default 8
 */
sys.EMSCRIPTEN = 8;
/**
 * @property {Number} TIZEN
 * @readOnly
 * @default 9
 */
sys.TIZEN = 9;
/**
 * @property {Number} WINRT
 * @readOnly
 * @default 10
 */
sys.WINRT = 10;
/**
 * @property {Number} WP8
 * @readOnly
 * @default 11
 */
sys.WP8 = 11;
/**
 * @property {Number} MOBILE_BROWSER
 * @readOnly
 * @default 100
 */
sys.MOBILE_BROWSER = 100;
/**
 * @property {Number} DESKTOP_BROWSER
 * @readOnly
 * @default 101
 */
sys.DESKTOP_BROWSER = 101;

/**
 * Indicates whether executes in editor's window process (Electron's renderer context)
 * @property {Number} EDITOR_PAGE
 * @readOnly
 * @default 102
 */
sys.EDITOR_PAGE = 102;
/**
 * Indicates whether executes in editor's main process (Electron's browser context)
 * @property {Number} EDITOR_CORE
 * @readOnly
 * @default 103
 */
sys.EDITOR_CORE = 103;
/**
 * BROWSER_TYPE_WECHAT
 * @property {String} BROWSER_TYPE_WECHAT
 * @readOnly
 * @default "wechat"
 */
sys.BROWSER_TYPE_WECHAT = "wechat";
/**
 *
 * @property {String} BROWSER_TYPE_ANDROID
 * @readOnly
 * @default "androidbrowser"
 */
sys.BROWSER_TYPE_ANDROID = "androidbrowser";
/**
 *
 * @property {String} BROWSER_TYPE_IE
 * @readOnly
 * @default "ie"
 */
sys.BROWSER_TYPE_IE = "ie";
/**
 *
 * @property {String} BROWSER_TYPE_QQ
 * @readOnly
 * @default "qqbrowser"
 */
sys.BROWSER_TYPE_QQ = "qqbrowser";
/**
 *
 * @property {String} BROWSER_TYPE_MOBILE_QQ
 * @readOnly
 * @default "mqqbrowser"
 */
sys.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
/**
 *
 * @property {String} BROWSER_TYPE_UC
 * @readOnly
 * @default "ucbrowser"
 */
sys.BROWSER_TYPE_UC = "ucbrowser";
/**
 *
 * @property {String} BROWSER_TYPE_360
 * @readOnly
 * @default "360browser"
 */
sys.BROWSER_TYPE_360 = "360browser";
/**
 *
 * @property {String} BROWSER_TYPE_BAIDU_APP
 * @readOnly
 * @default "baiduboxapp"
 */
sys.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
/**
 *
 * @property {String} BROWSER_TYPE_BAIDU
 * @readOnly
 * @default "baidubrowser"
 */
sys.BROWSER_TYPE_BAIDU = "baidubrowser";
/**
 *
 * @property {String} BROWSER_TYPE_MAXTHON
 * @readOnly
 * @default "maxthon"
 */
sys.BROWSER_TYPE_MAXTHON = "maxthon";
/**
 *
 * @property {String} BROWSER_TYPE_OPERA
 * @readOnly
 * @default "opera"
 */
sys.BROWSER_TYPE_OPERA = "opera";
/**
 *
 * @property {String} BROWSER_TYPE_OUPENG
 * @readOnly
 * @default "oupeng"
 */
sys.BROWSER_TYPE_OUPENG = "oupeng";
/**
 *
 * @property {String} BROWSER_TYPE_MIUI
 * @readOnly
 * @default "miuibrowser"
 */
sys.BROWSER_TYPE_MIUI = "miuibrowser";
/**
 *
 * @property {String} BROWSER_TYPE_FIREFOX
 * @readOnly
 * @default "firefox"
 */
sys.BROWSER_TYPE_FIREFOX = "firefox";
/**
 *
 * @property {String} BROWSER_TYPE_SAFARI
 * @readOnly
 * @default "safari"
 */
sys.BROWSER_TYPE_SAFARI = "safari";
/**
 *
 * @property {String} BROWSER_TYPE_CHROME
 * @readOnly
 * @default "chrome"
 */
sys.BROWSER_TYPE_CHROME = "chrome";
/**
 *
 * @property {String} BROWSER_TYPE_LIEBAO
 * @readOnly
 * @default "liebao"
 */
sys.BROWSER_TYPE_LIEBAO = "liebao";
/**
 *
 * @property {String} BROWSER_TYPE_QZONE
 * @readOnly
 * @default "qzone"
 */
sys.BROWSER_TYPE_QZONE = "qzone";
/**
 *
 * @property {String} BROWSER_TYPE_SOUGOU
 * @readOnly
 * @default "sogou"
 */
sys.BROWSER_TYPE_SOUGOU = "sogou";
/**
 *
 * @property {String} BROWSER_TYPE_UNKNOWN
 * @readOnly
 * @default "unknown"
 */
sys.BROWSER_TYPE_UNKNOWN = "unknown";

/**
 * Is native ? This is set to be true in jsb auto.
 * @property {Boolean} isNative
 */
sys.isNative = false;

/**
 * Is web browser ?
 * @property {Boolean} isBrowser
 */
sys.isBrowser = typeof window === 'object' && typeof document === 'object';

if (CC_EDITOR && Editor.isMainProcess) {
    sys.isMobile = false;
    sys.platform = sys.EDITOR_CORE;
    sys.language = sys.LANGUAGE_UNKNOWN;
    sys.os = ({
        darwin: sys.OS_OSX,
        win32: sys.OS_WINDOWS,
        linux: sys.OS_LINUX
    })[process.platform] || sys.OS_UNKNOWN;
    sys.browserType = null;
    sys.browserVersion = null;
    sys.windowPixelResolution = {
        width: 0,
        height: 0
    };
    sys.__audioSupport = {};
}
else {
    // browser or runtime
    var win = window, nav = win.navigator, doc = document, docEle = doc.documentElement;
    var ua = nav.userAgent.toLowerCase();

    if (CC_EDITOR) {
        sys.isMobile = false;
        sys.platform = sys.EDITOR_PAGE;
    }
    else {
        /**
         * Indicate whether system is mobile system
         * @property {Boolean} isMobile
         */
        sys.isMobile = /mobile|android|mqqbrowser|micromessenger|miuibrowser/.test(ua);

        /**
         * Indicate the running platform
         * @property {Number} platform
         */
        sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
    }

    var currLanguage = nav.language;
    currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
    currLanguage = currLanguage ? currLanguage.split("-")[0] : sys.LANGUAGE_ENGLISH;

    /**
     * Indicate the current language of the running system
     * @property {String} language
     */
    sys.language = currLanguage;

    // Get the os of system
    var isAndroid = false, iOS = false, osVersion = '', osMainVersion = 0;
    var uaResult = /android (\d+(?:\.\d+)+)/i.exec(ua) || /android (\d+(?:\.\d+)+)/i.exec(nav.platform);
    if (uaResult) {
        isAndroid = true;
        osVersion = uaResult[1] || '';
        osMainVersion = parseInt(osVersion) || 0;
    }
    uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);
    if (uaResult) {
        iOS = true;
        osVersion = uaResult[2] || '';
        osMainVersion = parseInt(osVersion) || 0;
    }

    var osName = sys.OS_UNKNOWN;
    if (nav.appVersion.indexOf("Win") !== -1) osName = sys.OS_WINDOWS;
    else if (iOS) osName = sys.OS_IOS;
    else if (nav.appVersion.indexOf("Mac") !== -1) osName = sys.OS_OSX;
    else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) osName = sys.OS_UNIX;
    else if (isAndroid) osName = sys.OS_ANDROID;
    else if (nav.appVersion.indexOf("Linux") !== -1) osName = sys.OS_LINUX;

    /**
     * Indicate the running os name
     * @property {String} os
     */
    sys.os = osName;
    /**
     * Indicate the running os version
     * @property {String} osVersion
     */
    sys.osVersion = osVersion;
    /**
     * Indicate the running os main version
     * @property {Number} osMainVersion
     */
    sys.osMainVersion = osMainVersion;

    /**
     * Indicate the running browser type
     * @property {String} browserType
     */
    sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
    /* Determine the browser type */
    (function(){
        var typeReg1 = /mqqbrowser|sogou|qzone|liebao|micromessenger|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i;
        var typeReg2 = /qqbrowser|chrome|safari|firefox|opr|oupeng|opera/i;
        var browserTypes = typeReg1.exec(ua);
        if(!browserTypes) browserTypes = typeReg2.exec(ua);
        var browserType = browserTypes ? browserTypes[0] : sys.BROWSER_TYPE_UNKNOWN;
        if (browserType === 'micromessenger')
            browserType = sys.BROWSER_TYPE_WECHAT;
        else if (browserType === "safari" && (ua.match(/android.*applewebkit/)))
            browserType = sys.BROWSER_TYPE_ANDROID;
        else if (browserType === "trident")
            browserType = sys.BROWSER_TYPE_IE;
        else if (browserType === "360 aphone")
            browserType = sys.BROWSER_TYPE_360;
        else if (browserType === "mxbrowser")
            browserType = sys.BROWSER_TYPE_MAXTHON;
        else if (browserType === "opr")
            browserType = sys.BROWSER_TYPE_OPERA;

        sys.browserType = browserType;
    })();

    /**
     * Indicate the running browser version
     * @property {Number} browserVersion
     */
    sys.browserVersion = "";
    /* Determine the browser version number */
    (function(){
        var versionReg1 = /(micromessenger|qq|mx|maxthon|baidu|sogou)(mobile)?(browser)?\/?([\d.]+)/i;
        var versionReg2 = /(msie |rv:|firefox|chrome|ucbrowser|oupeng|opera|opr|safari|miui)(mobile)?(browser)?\/?([\d.]+)/i;
        var tmp = ua.match(versionReg1);
        if(!tmp) tmp = ua.match(versionReg2);
        sys.browserVersion = tmp ? tmp[4] : "";
    })();

    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var ratio = window.devicePixelRatio || 1;

    /**
     * Indicate the real pixel resolution of the whole game window
     * @property {Number} windowPixelResolution
     */
    sys.windowPixelResolution = {
        width: ratio * w,
        height: ratio * h
    };

    sys._checkWebGLRenderMode = function () {
        if (cc._renderType !== cc.game.RENDER_TYPE_WEBGL)
            throw new Error("This feature supports WebGL render mode only.");
    };

    var _tmpCanvas1 = document.createElement("canvas"),
        _tmpCanvas2 = document.createElement("canvas");

    cc.create3DContext = function (canvas, opt_attribs) {
        var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
        var context = null;
        for (var ii = 0; ii < names.length; ++ii) {
            try {
                context = canvas.getContext(names[ii], opt_attribs);
            } catch (e) {
            }
            if (context) {
                break;
            }
        }
        return context;
    };

    //Whether or not the Canvas BlendModes are supported.
    sys._supportCanvasNewBlendModes = (function(){
        var data1, data2;
        var canvas = _tmpCanvas1;
        canvas.width = 1;
        canvas.height = 1;
        var context = canvas.getContext('2d');
        context.fillStyle = '#000';
        context.fillRect(0,0,1,1);
        context.globalCompositeOperation = 'multiply';

        var canvas2 = _tmpCanvas2;
        canvas2.width = 1;
        canvas2.height = 1;
        var context2 = canvas2.getContext('2d');
        context2.fillStyle = '#fff';
        context2.fillRect(0,0,1,1);
        context.drawImage(canvas2, 0, 0, 1, 1);

        data1 = context.getImageData(0,0,1,1).data[0];

        canvas = _tmpCanvas1;
        canvas.width = 1;
        canvas.height = 1;
        var context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0,0,1,1);
        context.globalCompositeOperation = 'destination-atop';

        canvas2 = _tmpCanvas2;
        canvas2.width = 1;
        canvas2.height = 1;
        var context2 = canvas2.getContext('2d');
        context2.fillStyle = '#000';
        context2.fillRect(0,0,1,1);
        context.drawImage(canvas2, 0, 0, 1, 1);

        data2 = context.getImageData(0,0,1,1).data[0];

        return (data1 === 0) && (data2 === 0);
    })();

    // Adjust mobile css settings
    if (cc.sys.isMobile) {
        var fontStyle = document.createElement("style");
        fontStyle.type = "text/css";
        document.body.appendChild(fontStyle);

        fontStyle.textContent = "body,canvas,div{ -moz-user-select: none;-webkit-user-select: none;-ms-user-select: none;-khtml-user-select: none;"
                                + "-webkit-tap-highlight-color:rgba(0,0,0,0);}";
    }

    /**
     * cc.sys.localStorage is a local storage component.
     * @property {Object} localStorage
     */
    try {
        var localStorage = sys.localStorage = win.localStorage;
        localStorage.setItem("storage", "");
        localStorage.removeItem("storage");
        localStorage = null;
    } catch (e) {
        var warn = function () {
            cc.warn("Warning: localStorage isn't enabled. Please confirm browser cookie or privacy option");
        };
        sys.localStorage = {
            getItem : warn,
            setItem : warn,
            removeItem : warn,
            clear : warn
        };
    }

    var _supportCanvas = !!_tmpCanvas1.getContext("2d");
    var _supportWebGL = false;
    if (win.WebGLRenderingContext) {
        var tmpCanvas = document.createElement("CANVAS");
        try{
            var context = cc.create3DContext(tmpCanvas, {'stencil': true});
            if(context) {
                _supportWebGL = true;
            }

            if (_supportWebGL && sys.os === sys.OS_ANDROID) {
                var browserVer = parseFloat(sys.browserVersion);
                switch (sys.browserType) {
                case sys.BROWSER_TYPE_MOBILE_QQ:
                case sys.BROWSER_TYPE_BAIDU:
                case sys.BROWSER_TYPE_BAIDU_APP:
                    // QQ & Baidu Brwoser 6.2+ (using blink kernel)
                    if (browserVer >= 6.2) {
                        _supportWebGL = true;
                    }
                    else {
                        _supportWebGL = false;
                    }
                    break;
                case sys.BROWSER_TYPE_ANDROID:
                    // Android 5+ default browser
                    if (sys.osMainVersion && sys.osMainVersion >= 5) {
                        _supportWebGL = true;
                    }
                    break;
                case sys.BROWSER_TYPE_CHROME:
                    // Chrome on android supports WebGL from v. 30
                    if(browserVer >= 30.0) {
                      _supportWebGL = true;
                    } else {
                      _supportWebGL = false;
                    }
                    break;
                case sys.BROWSER_TYPE_UNKNOWN:
                case sys.BROWSER_TYPE_360:
                case sys.BROWSER_TYPE_MIUI:
                case sys.BROWSER_TYPE_UC:
                    _supportWebGL = false;
                }
            }
        }
        catch (e) {}
        tmpCanvas = null;
    }

    /**
     * The capabilities of the current platform
     * @property {Object} capabilities
     */
    var capabilities = sys.capabilities = {
        "canvas": _supportCanvas,
        "opengl": _supportWebGL
    };
    if (docEle['ontouchstart'] !== undefined || doc['ontouchstart'] !== undefined || nav.msPointerEnabled)
        capabilities["touches"] = true;
    if (docEle['onmouseup'] !== undefined)
        capabilities["mouse"] = true;
    if (docEle['onkeyup'] !== undefined)
        capabilities["keyboard"] = true;
    if (win.DeviceMotionEvent || win.DeviceOrientationEvent)
        capabilities["accelerometer"] = true;

    var __audioSupport;

    /**
     * Audio support in the browser
     *
     * MULTI_CHANNEL        : Multiple audio while playing - If it doesn't, you can only play background music
     * WEB_AUDIO            : Support for WebAudio - Support W3C WebAudio standards, all of the audio can be played
     * AUTOPLAY             : Supports auto-play audio - if Don‘t support it, On a touch detecting background music canvas, and then replay
     * REPLAY_AFTER_TOUCH   : The first music will fail, must be replay after touchstart
     * USE_EMPTIED_EVENT    : Whether to use the emptied event to replace load callback
     * DELAY_CREATE_CTX     : delay created the context object - only webAudio
     * NEED_MANUAL_LOOP     : loop attribute failure, need to perform loop manually
     *
     * May be modifications for a few browser version
     */
    (function(){

        var DEBUG = false;

        var version = sys.browserVersion;

        // check if browser supports Web Audio
        // check Web Audio's context
        var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);

        __audioSupport = { ONLY_ONE: false, WEB_AUDIO: supportWebAudio, DELAY_CREATE_CTX: false };

        if (sys.os === sys.OS_IOS) {
            // IOS no event that used to parse completed callback
            // this time is not complete, can not play
            //
            __audioSupport.USE_LOADER_EVENT = 'loadedmetadata';
        }

        if (sys.browserType === sys.BROWSER_TYPE_FIREFOX) {
            __audioSupport.DELAY_CREATE_CTX = true;
            __audioSupport.USE_LOADER_EVENT = 'canplay';
        }

        if (sys.os === sys.OS_ANDROID) {
            if (sys.browserType === sys.BROWSER_TYPE_UC) {
                __audioSupport.ONE_SOURCE = true;
            }
        }

        if(DEBUG){
            setTimeout(function(){
                cc.log('browse type: ' + sys.browserType);
                cc.log('browse version: ' + version);
                cc.log('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
                cc.log('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
                cc.log('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
            }, 0);
        }
    })();

    try {
        if (__audioSupport.WEB_AUDIO) {
            __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
            if(__audioSupport.DELAY_CREATE_CTX) {
                setTimeout(function(){ __audioSupport.context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)(); }, 0);
            }
        }
    } catch(error) {
        __audioSupport.WEB_AUDIO = false;
        cc.log("browser don't support web audio");
    }

    var formatSupport = [];

    (function(){
        var audio = document.createElement('audio');
        if(audio.canPlayType) {
            var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
            if (ogg) formatSupport.push('.ogg');
            var mp3 = audio.canPlayType('audio/mpeg');
            if (mp3) formatSupport.push('.mp3');
            var wav = audio.canPlayType('audio/wav; codecs="1"');
            if (wav) formatSupport.push('.wav');
            var mp4 = audio.canPlayType('audio/mp4');
            if (mp4) formatSupport.push('.mp4');
            var m4a = audio.canPlayType('audio/x-m4a');
            if (m4a) formatSupport.push('.m4a');
        }
    })();
    __audioSupport.format = formatSupport;

    sys.__audioSupport = __audioSupport;
}

/**
 * Forces the garbage collection, only available in JSB
 * @method garbageCollect
 */
sys.garbageCollect = function () {
    // N/A in cocos2d-html5
};

/**
 * Dumps rooted objects, only available in JSB
 * @method dumpRoot
 */
sys.dumpRoot = function () {
    // N/A in cocos2d-html5
};

/**
 * Restart the JS VM, only available in JSB
 * @method restartVM
 */
sys.restartVM = function () {
    // N/A in cocos2d-html5
};

/**
 * Clean a script in the JS VM, only available in JSB
 * @method cleanScript
 * @param {String} jsfile
 */
sys.cleanScript = function (jsfile) {
    // N/A in cocos2d-html5
};

/**
 * Check whether an object is valid,
 * In web engine, it will return true if the object exist
 * In native engine, it will return true if the JS object and the correspond native object are both valid
 * @method isObjectValid
 * @param {Object} obj
 * @return {Boolean} Validity of the object
 */
sys.isObjectValid = function (obj) {
    if (obj) return true;
    else return false;
};

/**
 * Dump system informations
 * @method dump
 */
sys.dump = function () {
    var self = this;
    var str = "";
    str += "isMobile : " + self.isMobile + "\r\n";
    str += "language : " + self.language + "\r\n";
    str += "browserType : " + self.browserType + "\r\n";
    str += "browserVersion : " + self.browserVersion + "\r\n";
    str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
    str += "os : " + self.os + "\r\n";
    str += "osVersion : " + self.osVersion + "\r\n";
    str += "platform : " + self.platform + "\r\n";
    str += "Using " + (cc._renderType === cc.game.RENDER_TYPE_WEBGL ? "WEBGL" : "CANVAS") + " renderer." + "\r\n";
    cc.log(str);
};

/**
 * Open a url in browser
 * @method openURL
 * @param {String} url
 */
sys.openURL = function(url){
    window.open(url);
};

module.exports = sys;
