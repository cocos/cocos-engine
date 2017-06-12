/*
 * Copyright (c) 2015-2016 Chukong Technologies Inc.
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

//
// cocos2d boot
//

'use strict';

//+++++++++++++++++++++++++Engine initialization function begin+++++++++++++++++++++++++++

// Define singleton objects
cc.director = cc.Director.getInstance();
cc.director._actionManager = cc.director.getActionManager();
cc.director._scheduler = cc.director.getScheduler();
cc.winSize = cc.director.getWinSize();

cc.view = cc.director.getOpenGLView();
cc.view.getDevicePixelRatio = cc.view.getRetinaFactor;
cc.view.convertToLocationInView = function (tx, ty, relatedPos) {
    var _devicePixelRatio = cc.view.getDevicePixelRatio();
    return {x: _devicePixelRatio * (tx - relatedPos.left), y: _devicePixelRatio * (relatedPos.top + relatedPos.height - ty)};
};
cc.view.enableRetina = function(enabled) {};
cc.view.isRetinaEnabled = function() {
    var sys = cc.sys;
    return (sys.os === sys.OS_IOS || sys.os === sys.OS_OSX) ? true : false;
};
cc.view.adjustViewPort = function() {};
cc.view.resizeWithBrowserSize = function () {return;};
cc.view.setResizeCallback = function() {return;};
cc.view.enableAutoFullScreen = function () {return;};
cc.view.isAutoFullScreenEnabled = function() {return true;};
cc.view._setDesignResolutionSize = cc.view.setDesignResolutionSize;
cc.view.setDesignResolutionSize = function(width,height,resolutionPolicy){
    cc.view._setDesignResolutionSize(width,height,resolutionPolicy);
    cc.winSize = cc.director.getWinSize();
    cc.visibleRect.init();
};
cc.view.setRealPixelResolution = cc.view.setDesignResolutionSize;
cc.view.setResolutionPolicy = function(resolutionPolicy){
    var size = cc.view.getDesignResolutionSize();
    cc.view.setDesignResolutionSize(size.width,size.height,resolutionPolicy);
};

cc.view.getCanvasSize = cc.view.getFrameSize;
cc.view.getVisibleSizeInPixel = cc.view.getVisibleSize;
cc.view.getVisibleOriginInPixel = cc.view.getVisibleOrigin;
cc.view.setContentTranslateLeftTop = function(){return;};
cc.view.getContentTranslateLeftTop = function(){return null;};
cc.view.setFrameZoomFactor = function(){return;};
cc.view.setOrientation = function () {};
cc.view.setTargetDensityDPI = function() {};
cc.view.getTargetDensityDPI = function() {return cc.macro.DENSITYDPI_DEVICE;};

cc.eventManager = cc.director.getEventDispatcher();

cc.eventManager._resizeListener = cc.eventManager.addCustomListener('window-resize', function () {
    cc.winSize = cc.director.getWinSize();
    cc.visibleRect.init();
});

cc.configuration = cc.Configuration.getInstance();
cc.textureCache = cc.director.getTextureCache();
cc.shaderCache = cc.ShaderCache.getInstance();
cc.plistParser = cc.PlistParser.getInstance();

// File utils (Temporary, won't be accessible)
cc.fileUtils = cc.FileUtils.getInstance();
cc.fileUtils.setPopupNotify(false);

cc.screen = {
    init: function() {},
    fullScreen: function() {
        return true;
    },
    requestFullScreen: function(element, onFullScreenChange) {
        onFullScreenChange.call();
    },
    exitFullScreen: function() {
        return false;
    },
    autoFullScreen: function(element, onFullScreenChange) {
        onFullScreenChange.call();
    }
};

/**
 * @type {Object}
 * @name jsb.fileUtils
 * jsb.fileUtils is the native file utils singleton object,
 * please refer to Cocos2d-x API to know how to use it.
 * Only available in JSB
 */
jsb.fileUtils = cc.fileUtils;
delete cc.FileUtils;
delete cc.fileUtils;

/**
 * @type {Object}
 * @name jsb.reflection
 * jsb.reflection is a bridge to let you invoke Java static functions.
 * please refer to this document to know how to use it: http://www.cocos2d-x.org/docs/manual/framework/html5/v3/reflection/en
 * Only available on Android platform
 */
jsb.reflection = {
    callStaticMethod : function(){
        cc.log("not supported on current platform");
    }
};

//+++++++++++++++++++++++++Redefine JSB only APIs+++++++++++++++++++++++++++++


//+++++++++++++++++++++++++something about window events begin+++++++++++++++++++++++++++
cc.winEvents = {//TODO register hidden and show callback for window
    hiddens : [],
    shows : []
};
//+++++++++++++++++++++++++something about window events end+++++++++++++++++++++++++++++

//+++++++++++++++++++++++++something about sys begin+++++++++++++++++++++++++++++
var _initSys = function () {

    cc.sys = window.sys || {};
    var sys = cc.sys;

    /**
     * English language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_ENGLISH = "en";

    /**
     * Chinese language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_CHINESE = "zh";

    /**
     * French language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_FRENCH = "fr";

    /**
     * Italian language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_ITALIAN = "it";

    /**
     * German language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_GERMAN = "de";

    /**
     * Spanish language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_SPANISH = "es";

    /**
     * Netherlands language code
     * @type {string}
     */
    sys.LANGUAGE_DUTCH = "nl";
    /**
     * Dutch language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_DUTCH = "du";

    /**
     * Russian language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_RUSSIAN = "ru";

    /**
     * Korean language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_KOREAN = "ko";

    /**
     * Japanese language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_JAPANESE = "ja";

    /**
     * Hungarian language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_HUNGARIAN = "hu";

    /**
     * Portuguese language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_PORTUGUESE = "pt";

    /**
     * Arabic language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_ARABIC = "ar";

    /**
     * Norwegian language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_NORWEGIAN = "no";

    /**
     * Polish language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_POLISH = "pl";

    /**
     * Turkish language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_TURKISH = "tr";

    /**
     * Ukrainian language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_UKRAINIAN = "uk";

    /**
     * Romanian language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_ROMANIAN = "ro";

    /**
     * Bulgarian language code
     * @constant
     * @default
     * @type {Number}
     */
    sys.LANGUAGE_BULGARIAN = "bg";

    /**
     * Unknown language code
     * @memberof cc.sys
     * @name LANGUAGE_UNKNOWN
     * @constant
     * @type {Number}
     */
    sys.LANGUAGE_UNKNOWN = "unknown";

    /**
     * @memberof cc.sys
     * @name OS_IOS
     * @constant
     * @type {string}
     */
    sys.OS_IOS = "iOS";
    /**
     * @memberof cc.sys
     * @name OS_ANDROID
     * @constant
     * @type {string}
     */
    sys.OS_ANDROID = "Android";
    /**
     * @memberof cc.sys
     * @name OS_WINDOWS
     * @constant
     * @type {string}
     */
    sys.OS_WINDOWS = "Windows";
    /**
     * @memberof cc.sys
     * @name OS_MARMALADE
     * @constant
     * @type {string}
     */
    sys.OS_MARMALADE = "Marmalade";
    /**
     * @memberof cc.sys
     * @name OS_LINUX
     * @constant
     * @type {string}
     */
    sys.OS_LINUX = "Linux";
    /**
     * @memberof cc.sys
     * @name OS_BADA
     * @constant
     * @type {string}
     */
    sys.OS_BADA = "Bada";
    /**
     * @memberof cc.sys
     * @name OS_BLACKBERRY
     * @constant
     * @type {string}
     */
    sys.OS_BLACKBERRY = "Blackberry";
    /**
     * @memberof cc.sys
     * @name OS_OSX
     * @constant
     * @type {string}
     */
    sys.OS_OSX = "OS X";
    /**
     * @memberof cc.sys
     * @name OS_WP8
     * @constant
     * @type {string}
     */
    sys.OS_WP8 = "WP8";
    /**
     * @memberof cc.sys
     * @name OS_WINRT
     * @constant
     * @type {string}
     */
    sys.OS_WINRT = "WINRT";
    /**
     * @memberof cc.sys
     * @name OS_UNKNOWN
     * @constant
     * @type {string}
     */
    sys.OS_UNKNOWN = "Unknown";

    /**
     * @memberof cc.sys
     * @name UNKNOWN
     * @constant
     * @default
     * @type {Number}
     */
    sys.UNKNOWN = -1;
    /**
     * @memberof cc.sys
     * @name WIN32
     * @constant
     * @default
     * @type {Number}
     */
    sys.WIN32 = 0;
    /**
     * @memberof cc.sys
     * @name LINUX
     * @constant
     * @default
     * @type {Number}
     */
    sys.LINUX = 1;
    /**
     * @memberof cc.sys
     * @name MACOS
     * @constant
     * @default
     * @type {Number}
     */
    sys.MACOS = 2;
    /**
     * @memberof cc.sys
     * @name ANDROID
     * @constant
     * @default
     * @type {Number}
     */
    sys.ANDROID = 3;
    /**
     * @memberof cc.sys
     * @name IOS
     * @constant
     * @default
     * @type {Number}
     */
    sys.IPHONE = 4;
    /**
     * @memberof cc.sys
     * @name IOS
     * @constant
     * @default
     * @type {Number}
     */
    sys.IPAD = 5;
    /**
     * @memberof cc.sys
     * @name BLACKBERRY
     * @constant
     * @default
     * @type {Number}
     */
    sys.BLACKBERRY = 6;
    /**
     * @memberof cc.sys
     * @name NACL
     * @constant
     * @default
     * @type {Number}
     */
    sys.NACL = 7;
    /**
     * @memberof cc.sys
     * @name EMSCRIPTEN
     * @constant
     * @default
     * @type {Number}
     */
    sys.EMSCRIPTEN = 8;
    /**
     * @memberof cc.sys
     * @name TIZEN
     * @constant
     * @default
     * @type {Number}
     */
    sys.TIZEN = 9;
    /**
     * @memberof cc.sys
     * @name WINRT
     * @constant
     * @default
     * @type {Number}
     */
    sys.WINRT = 10;
    /**
     * @memberof cc.sys
     * @name WP8
     * @constant
     * @default
     * @type {Number}
     */
    sys.WP8 = 11;
    /**
     * @memberof cc.sys
     * @name MOBILE_BROWSER
     * @constant
     * @default
     * @type {Number}
     */
    sys.MOBILE_BROWSER = 100;
    /**
     * @memberof cc.sys
     * @name DESKTOP_BROWSER
     * @constant
     * @default
     * @type {Number}
     */
    sys.DESKTOP_BROWSER = 101;

    sys.BROWSER_TYPE_WECHAT = "wechat";
    sys.BROWSER_TYPE_ANDROID = "androidbrowser";
    sys.BROWSER_TYPE_IE = "ie";
    sys.BROWSER_TYPE_QQ = "qqbrowser";
    sys.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
    sys.BROWSER_TYPE_UC = "ucbrowser";
    sys.BROWSER_TYPE_360 = "360browser";
    sys.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
    sys.BROWSER_TYPE_BAIDU = "baidubrowser";
    sys.BROWSER_TYPE_MAXTHON = "maxthon";
    sys.BROWSER_TYPE_OPERA = "opera";
    sys.BROWSER_TYPE_OUPENG = "oupeng";
    sys.BROWSER_TYPE_MIUI = "miuibrowser";
    sys.BROWSER_TYPE_FIREFOX = "firefox";
    sys.BROWSER_TYPE_SAFARI = "safari";
    sys.BROWSER_TYPE_CHROME = "chrome";
    sys.BROWSER_TYPE_LIEBAO = "liebao";
    sys.BROWSER_TYPE_QZONE = "qzone";
    sys.BROWSER_TYPE_SOUGOU = "sogou";
    sys.BROWSER_TYPE_UNKNOWN = "unknown";

    /**
     * Is native ? This is set to be true in jsb auto.
     * @constant
     * @default
     * @type {Boolean}
     */
    sys.isNative = true;

    var platform = sys.platform = __getPlatform();

    /**
     * Indicate whether system is mobile system
     * @memberof cc.sys
     * @name isMobile
     * @type {Boolean}
     */
    sys.isMobile = (platform === sys.ANDROID || 
                    platform === sys.IPAD || 
                    platform === sys.IPHONE || 
                    platform === sys.WP8 || 
                    platform === sys.TIZEN ||
                    platform === sys.BLACKBERRY) ? true : false;
    
    sys._application = cc.Application.getInstance();

    /**
     * Indicate the current language of the running system
     * @memberof cc.sys
     * @name language
     * @type {String}
     */
    sys.language = (function(){
        var language = sys._application.getCurrentLanguage();
        switch(language){
            case 0: return sys.LANGUAGE_ENGLISH;
            case 1: return sys.LANGUAGE_CHINESE;
            case 2: return sys.LANGUAGE_FRENCH;
            case 3: return sys.LANGUAGE_ITALIAN;
            case 4: return sys.LANGUAGE_GERMAN;
            case 5: return sys.LANGUAGE_SPANISH;
            case 6: return sys.LANGUAGE_DUTCH;
            case 7: return sys.LANGUAGE_RUSSIAN;
            case 8: return sys.LANGUAGE_KOREAN;
            case 9: return sys.LANGUAGE_JAPANESE;
            case 10: return sys.LANGUAGE_HUNGARIAN;
            case 11: return sys.LANGUAGE_PORTUGUESE;
            case 12: return sys.LANGUAGE_ARABIC;
            case 13: return sys.LANGUAGE_NORWEGIAN;
            case 14: return sys.LANGUAGE_POLISH;
            case 15: return sys.LANGUAGE_TURKISH;
            case 16: return sys.LANGUAGE_UKRAINIAN;
            case 17: return sys.LANGUAGE_ROMANIAN;
            case 18: return sys.LANGUAGE_BULGARIAN;
            default: return sys.LANGUAGE_ENGLISH;
        }
    })();

    sys.os = __getOS();

    sys.browserType = null; //null in jsb

    sys.browserVersion = null; //null in jsb

    sys.windowPixelResolution = cc.view.getFrameSize();

    var capabilities = sys.capabilities = {
        "canvas": false,
        "opengl": true
    };
    if( sys.isMobile ) {
        capabilities["accelerometer"] = true;
        capabilities["touches"] = true;
        if (platform === sys.WINRT || platform === sys.WP8) {
            capabilities["keyboard"] = true;
        }
    } else {
        // desktop
        capabilities["keyboard"] = true;
        capabilities["mouse"] = true;
        // winrt can't suppot mouse in current version
        if (platform === sys.WINRT || platform === sys.WP8)
        {
            capabilities["touches"] = true;
            capabilities["mouse"] = false;
        }
    }

    /**
     * Forces the garbage collection, only available in JSB
     * @memberof cc.sys
     * @name garbageCollect
     * @function
     */
    sys.garbageCollect = function() {
        __jsc__.garbageCollect();
    };

    /**
     * Dumps rooted objects, only available in JSB
     * @memberof cc.sys
     * @name dumpRoot
     * @function
     */
    sys.dumpRoot = function() {
        __jsc__.dumpRoot();
    };

    /**
     * Restart the JS VM, only available in JSB
     * @memberof cc.sys
     * @name restartVM
     * @function
     */
    sys.restartVM = function() {
        __restartVM();
    };

    /**
     * Clean a script in the JS VM, only available in JSB
     * @memberof cc.sys
     * @name cleanScript
     * @param {String} jsfile
     * @function
     */
    sys.cleanScript = function(jsFile) {
        __cleanScript(jsFile);
    };

    /**
     * Check whether an object is valid,
     * In web engine, it will return true if the object exist
     * In native engine, it will return true if the JS object and the correspond native object are both valid
     * @memberof cc.sys
     * @name isObjectValid
     * @param {Object} obj
     * @return {boolean} Validity of the object
     * @function
     */
    sys.isObjectValid = function(obj) {
        return __isObjectValid(obj);
    };

    /**
     * Dump system informations
     * @memberof cc.sys
     * @name dump
     * @function
     */
    sys.dump = function () {
        var self = this;
        var str = "";
        str += "isMobile : " + self.isMobile + "\r\n";
        str += "language : " + self.language + "\r\n";
        str += "browserType : " + self.browserType + "\r\n";
        str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
        str += "os : " + self.os + "\r\n";
        str += "platform : " + self.platform + "\r\n";
        cc.log(str);
    };

    /**
     * Open a url in browser
     * @memberof cc.sys
     * @name openURL
     * @param {String} url
     */
    sys.openURL = function(url){
        sys._application.openURL(url);
    };

    sys.now = function () {
        return Date.now();
    };

    // JS to Native bridges
    if(window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID){
        jsb.reflection = new JavascriptJavaBridge();
        cc.sys.capabilities["keyboard"] = true;
    }
    else if(window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)){
        jsb.reflection = new JavaScriptObjCBridge();
    }
};
_initSys();

//+++++++++++++++++++++++++something about CCGame end+++++++++++++++++++++++++++++

// Original bind in Spidermonkey v33 will trigger object life cycle track issue in our memory model and cause crash
Function.prototype.bind = function (oThis, ...aArgs) {
    if (typeof this !== 'function') {
        // closest thing possible to the ECMAScript 5
        // internal IsCallable function
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var fToBind = this,
        fNOP = function () {},
        fBound = function (...args) {
            return fToBind.apply(this instanceof fNOP && oThis
                ? this
                : oThis,
                aArgs.concat(args));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
};

jsb.urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");

cc._engineLoaded = false;

(function (config) {
    require("script/jsb.js");
    cc._engineLoaded = true;
    console.log(cc.ENGINE_VERSION);
})();
