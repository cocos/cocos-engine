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
 * @property LANGUAGE_ENGLISH
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_ENGLISH = "en";

/**
 * Chinese language code
 * @property LANGUAGE_CHINESE
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_CHINESE = "zh";

/**
 * French language code
 * @property LANGUAGE_FRENCH
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_FRENCH = "fr";

/**
 * Italian language code
 * @property LANGUAGE_ITALIAN
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_ITALIAN = "it";

/**
 * German language code
 * @property LANGUAGE_GERMAN
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_GERMAN = "de";

/**
 * Spanish language code
 * @property LANGUAGE_SPANISH
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_SPANISH = "es";

/**
 * Spanish language code
 * @property LANGUAGE_DUTCH
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_DUTCH = "du";

/**
 * Russian language code
 * @property LANGUAGE_RUSSIAN
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_RUSSIAN = "ru";

/**
 * Korean language code
 * @property LANGUAGE_KOREAN
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_KOREAN = "ko";

/**
 * Japanese language code
 * @property LANGUAGE_JAPANESE
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_JAPANESE = "ja";

/**
 * Hungarian language code
 * @property LANGUAGE_HUNGARIAN
 * @constant
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_HUNGARIAN = "hu";

/**
 * Portuguese language code
 * @property LANGUAGE_PORTUGUESE
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_PORTUGUESE = "pt";

/**
 * Arabic language code
 * @property LANGUAGE_ARABIC
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_ARABIC = "ar";

/**
 * Norwegian language code
 * @property LANGUAGE_NORWEGIAN
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_NORWEGIAN = "no";

/**
 * Polish language code
 * @property LANGUAGE_POLISH
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_POLISH = "pl";

/**
 * Unknown language code
 * @property LANGUAGE_UNKNOWN
 * @type {String}
 * @readOnly
 */
sys.LANGUAGE_UNKNOWN = "unkonwn";

/**
 * @property OS_IOS
 * @type {String}
 * @readOnly
 */
sys.OS_IOS = "iOS";
/**
 * @property OS_ANDROID
 * @type {String}
 * @readOnly
 */
sys.OS_ANDROID = "Android";
/**
 * @property OS_WINDOWS
 * @type {String}
 * @readOnly
 */
sys.OS_WINDOWS = "Windows";
/**
 * @property OS_MARMALADE
 * @type {String}
 * @readOnly
 */
sys.OS_MARMALADE = "Marmalade";
/**
 * @property OS_LINUX
 * @type {String}
 * @readOnly
 */
sys.OS_LINUX = "Linux";
/**
 * @property OS_BADA
 * @type {String}
 * @readOnly
 */
sys.OS_BADA = "Bada";
/**
 * @property OS_BLACKBERRY
 * @type {String}
 * @readOnly
 */
sys.OS_BLACKBERRY = "Blackberry";
/**
 * @property OS_OSX
 * @type {String}
 * @readOnly
 */
sys.OS_OSX = "OS X";
/**
 * @property OS_WP8
 * @type {String}
 * @readOnly
 */
sys.OS_WP8 = "WP8";
/**
 * @property OS_WINRT
 * @type {String}
 * @readOnly
 */
sys.OS_WINRT = "WINRT";
/**
 * @property OS_UNKNOWN
 * @type {String}
 * @readOnly
 */
sys.OS_UNKNOWN = "Unknown";

/**
 * @property UNKNOWN
 * @type {Number}
 * @readOnly
 * @default -1
 */
sys.UNKNOWN = -1;
/**
 * @property WIN32
 * @type {Number}
 * @readOnly
 * @default 0
 */
sys.WIN32 = 0;
/**
 * @property LINUX
 * @type {Number}
 * @readOnly
 * @default 1
 */
sys.LINUX = 1;
/**
 * @property MACOS
 * @type {Number}
 * @readOnly
 * @default 2
 */
sys.MACOS = 2;
/**
 * @property ANDROID
 * @type {Number}
 * @readOnly
 * @default 3
 */
sys.ANDROID = 3;
/**
 * @property IOS
 * @type {Number}
 * @readOnly
 * @default 4
 */
sys.IPHONE = 4;
/**
 * @property IPAD
 * @type {Number}
 * @readOnly
 * @default 5
 */
sys.IPAD = 5;
/**
 * @property BLACKBERRY
 * @type {Number}
 * @readOnly
 * @default 6
 */
sys.BLACKBERRY = 6;
/**
 * @property NACL
 * @type {Number}
 * @readOnly
 * @default 7
 */
sys.NACL = 7;
/**
 * @property EMSCRIPTEN
 * @type {Number}
 * @readOnly
 * @default 8
 */
sys.EMSCRIPTEN = 8;
/**
 * @property TIZEN
 * @type {Number}
 * @readOnly
 * @default 9
 */
sys.TIZEN = 9;
/**
 * @property WINRT
 * @type {Number}
 * @readOnly
 * @default 10
 */
sys.WINRT = 10;
/**
 * @property WP8
 * @type {Number}
 * @readOnly
 * @default 11
 */
sys.WP8 = 11;
/**
 * @property MOBILE_BROWSER
 * @type {Number}
 * @readOnly
 * @default 100
 */
sys.MOBILE_BROWSER = 100;
/**
 * @property DESKTOP_BROWSER
 * @type {Number}
 * @readOnly
 * @default 101
 */
sys.DESKTOP_BROWSER = 101;

/**
 * Indicates whether executes in editor's window process (Electron's renderer context)
 * @property EDITOR_PAGE
 * @type {Number}
 * @readOnly
 * @default 102
 */
sys.EDITOR_PAGE = 102;
/**
 * Indicates whether executes in editor's main process (Electron's browser context)
 * @property EDITOR_CORE
 * @type {Number}
 * @readOnly
 * @default 103
 */
sys.EDITOR_CORE = 103;

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
 * @property isNative
 * @type {Boolean}
 */
sys.isNative = false;

/**
 * Is web browser ?
 * @property isBrowser
 * @type {Boolean}
 */
sys.isBrowser = typeof window === 'object' && typeof document === 'object';

if (typeof Editor !== 'undefined' && Editor.isCoreLevel) {
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
}
else {
    // browser or runtime
    var win = window, nav = win.navigator, doc = document, docEle = doc.documentElement;
    var ua = nav.userAgent.toLowerCase();

    if (cc.isEditor) {
        sys.isMobile = false;
        sys.platform = sys.EDITOR_PAGE;
    }
    else {
        /**
         * Indicate whether system is mobile system
         * @property isMobile
         * @type {Boolean}
         */
        sys.isMobile = ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1;

        /**
         * Indicate the running platform
         * @property platform
         * @type {Number}
         */
        sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
    }

    var currLanguage = nav.language;
    currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
    currLanguage = currLanguage ? currLanguage.split("-")[0] : sys.LANGUAGE_ENGLISH;

    /**
     * Indicate the current language of the running system
     * @property language
     * @type {String}
     */
    sys.language = currLanguage;

    // Get the os of system
    var iOS = ( ua.match(/(iPad|iPhone|iPod)/i) ? true : false );
    var isAndroid = ua.match(/android/i) || nav.platform.match(/android/i) ? true : false;
    var osName = sys.OS_UNKNOWN;
    if (nav.appVersion.indexOf("Win") !== -1) osName = sys.OS_WINDOWS;
    else if (iOS) osName = sys.OS_IOS;
    else if (nav.appVersion.indexOf("Mac") !== -1) osName = sys.OS_OSX;
    else if (nav.appVersion.indexOf("X11") !== -1 && nav.appVersion.indexOf("Linux") === -1) osName = sys.OS_UNIX;
    else if (isAndroid) osName = sys.OS_ANDROID;
    else if (nav.appVersion.indexOf("Linux") !== -1) osName = sys.OS_LINUX;

    /**
     * Indicate the running os name
     * @property os
     * @type {String}
     */
    sys.os = osName;

    /**
     * Indicate the running browser type
     * @property browserType
     * @type {String}
     */
    sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
    /* Determine the browser type */
    (function(){
        var typeReg1 = /sogou|qzone|liebao|micromessenger|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|trident|miuibrowser/i;
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
     * @property browserVersion
     * @type {Number}
     */
    sys.browserVersion = "";
    /* Determine the browser version number */
    (function(){
        var versionReg1 = /(micromessenger|mx|maxthon|baidu|sogou)(mobile)?(browser)?\/?([\d.]+)/i;
        var versionReg2 = /(msie |rv:|firefox|chrome|ucbrowser|qq|oupeng|opera|opr|safari|miui)(mobile)?(browser)?\/?([\d.]+)/i;
        var tmp = ua.match(versionReg1);
        if(!tmp) tmp = ua.match(versionReg2);
        sys.browserVersion = tmp ? tmp[4] : "";
    })();

    var w = window.innerWidth || document.documentElement.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight;
    var ratio = window.devicePixelRatio || 1;

    /**
     * Indicate the real pixel resolution of the whole game window
     * @property windowPixelResolution
     * @type {Number}
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

        return context.getImageData(0,0,1,1).data[0] === 0;
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
     * @property localStorage
     * @type {Object}
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
    var tmpCanvas = document.createElement("CANVAS");
    if (win.WebGLRenderingContext) {
        try{
            var context = cc.create3DContext(tmpCanvas, {'stencil': true, 'preserveDrawingBuffer': true });
            if(context) {
                _supportWebGL = true;
            }
        }
        catch (e) {}
    }

    /**
     * The capabilities of the current platform
     * @property capabilities
     * @type {Object}
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

    delete _tmpCanvas1;
    delete _tmpCanvas2;
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
    str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
    str += "os : " + self.os + "\r\n";
    str += "platform : " + self.platform + "\r\n";
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