(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../default-constants.js", "../global-exports.js", "./debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../default-constants.js"), require("../global-exports.js"), require("./debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.globalExports, global.debug);
    global.sys = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.sys = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  // tslint:disable
  // @ts-ignore
  var _global = typeof window === 'undefined' ? global : window;

  var NetworkType;

  (function (NetworkType) {
    NetworkType[NetworkType["NONE"] = 0] = "NONE";
    NetworkType[NetworkType["LAN"] = 1] = "LAN";
    NetworkType[NetworkType["WWAN"] = 2] = "WWAN";
  })(NetworkType || (NetworkType = {}));

  ;
  /**
   * @en A set of system related variables
   * @zh 一系列系统相关环境变量
   * @main
   */

  var sys = {
    /**
     * @en
     * Network type enumeration
     * @zh
     * 网络类型枚举
     */
    NetworkType: NetworkType,

    /**
     * @en English language code
     * @zh 语言代码 - 英语
     */
    LANGUAGE_ENGLISH: 'en',

    /**
     * @en Chinese language code
     * @zh 语言代码 - 中文
     */
    LANGUAGE_CHINESE: 'zh',

    /**
     * @en French language code
     * @zh 语言代码 - 法语
     */
    LANGUAGE_FRENCH: 'fr',

    /**
     * @en Italian language code
     * @zh 语言代码 - 意大利语
     */
    LANGUAGE_ITALIAN: 'it',

    /**
     * @en German language code
     * @zh 语言代码 - 德语
     */
    LANGUAGE_GERMAN: 'de',

    /**
     * @en Spanish language code
     * @zh 语言代码 - 西班牙语
     */
    LANGUAGE_SPANISH: 'es',

    /**
     * @en Spanish language code
     * @zh 语言代码 - 荷兰语
     */
    LANGUAGE_DUTCH: 'du',

    /**
     * @en Russian language code
     * @zh 语言代码 - 俄罗斯语
     */
    LANGUAGE_RUSSIAN: 'ru',

    /**
     * @en Korean language code
     * @zh 语言代码 - 韩语
     */
    LANGUAGE_KOREAN: 'ko',

    /**
     * @en Japanese language code
     * @zh 语言代码 - 日语
     */
    LANGUAGE_JAPANESE: 'ja',

    /**
     * @en Hungarian language code
     * @zh 语言代码 - 匈牙利语
     */
    LANGUAGE_HUNGARIAN: 'hu',

    /**
     * @en Portuguese language code
     * @zh 语言代码 - 葡萄牙语
     */
    LANGUAGE_PORTUGUESE: 'pt',

    /**
     * @en Arabic language code
     * @zh 语言代码 - 阿拉伯语
     */
    LANGUAGE_ARABIC: 'ar',

    /**
     * @en Norwegian language code
     * @zh 语言代码 - 挪威语
     */
    LANGUAGE_NORWEGIAN: 'no',

    /**
     * @en Polish language code
     * @zh 语言代码 - 波兰语
     */
    LANGUAGE_POLISH: 'pl',

    /**
     * @en Turkish language code
     * @zh 语言代码 - 土耳其语
     */
    LANGUAGE_TURKISH: 'tr',

    /**
     * @en Ukrainian language code
     * @zh 语言代码 - 乌克兰语
     */
    LANGUAGE_UKRAINIAN: 'uk',

    /**
     * @en Romanian language code
     * @zh 语言代码 - 罗马尼亚语
     */
    LANGUAGE_ROMANIAN: 'ro',

    /**
     * @en Bulgarian language code
     * @zh 语言代码 - 保加利亚语
     */
    LANGUAGE_BULGARIAN: 'bg',

    /**
     * @en Unknown language code
     * @zh 语言代码 - 未知
     */
    LANGUAGE_UNKNOWN: 'unknown',

    /**
     * @en Operating System - iOS
     * @zh 操作系统 - iOS
     */
    OS_IOS: 'iOS',

    /**
     * @en Operating System - Android
     * @zh 操作系统 - 安卓
     */
    OS_ANDROID: 'Android',

    /**
     * @en Operating System - Windows
     * @zh 操作系统 - Windows
     */
    OS_WINDOWS: 'Windows',

    /**
     * @en Operating System - Linux
     * @zh 操作系统 - Linux
     */
    OS_LINUX: 'Linux',

    /**
     * @en Operating System - Mac OS X
     * @zh 操作系统 - Mac OS X
     */
    OS_OSX: 'OS X',

    /**
     * @en Operating System - Unknown
     * @zh 操作系统 - 未知
     */
    OS_UNKNOWN: 'Unknown',

    /**
     * @en Platform - Unknown
     * @zh 平台 - 未知
     * @default -1
     */
    UNKNOWN: -1,

    /**
     * @en Platform - 32 bit Windows application
     * @zh 平台 - 32位 Windows 可执行程序
     * @default 0
     */
    WIN32: 0,

    /**
     * @en Platform - Linux
     * @zh 平台 - Linux
     * @default 1
     */
    LINUX: 1,

    /**
     * @en Platform - Mac OS X app
     * @zh 平台 - Mac OS X 原生平台
     * @default 2
     */
    MACOS: 2,

    /**
     * @en Platform - Android native app
     * @zh 平台 - 安卓原生平台
     * @default 3
     */
    ANDROID: 3,

    /**
     * @en Platform - iPhone native app
     * @zh 平台 - iPhone 原生平台
     * @default 4
     */
    IPHONE: 4,

    /**
     * @en Platform - iPad native app
     * @zh 平台 - iPad 原生平台
     * @default 5
     */
    IPAD: 5,

    /**
     * @en Platform - Blackberry devices
     * @zh 平台 - 黑莓设备
     * @default 6
     */
    BLACKBERRY: 6,

    /**
     * @en Platform - NACL
     * @zh 平台 - NACL
     * @default 7
     */
    NACL: 7,

    /**
     * @en Platform - Emscripten compiled runtime
     * @zh 平台 - 编译为 Emscripten 的运行时环境
     * @default 8
     */
    EMSCRIPTEN: 8,

    /**
     * @en Platform - Tizen
     * @zh 平台 - Tizen
     * @default 9
     */
    TIZEN: 9,

    /**
     * @en Platform - Windows RT
     * @zh 平台 - Windows RT
     * @default 10
     */
    WINRT: 10,

    /**
     * @en Platform - Windows Phone 8 app
     * @zh 平台 - Windows Phone 8 原生应用
     * @default 11
     */
    WP8: 11,

    /**
     * @en Platform - Mobile browsers
     * @zh 平台 - 移动浏览器
     * @default 100
     */
    MOBILE_BROWSER: 100,

    /**
     * @en Platform - Desktop browsers
     * @zh 平台 - 桌面端浏览器
     * @default 101
     */
    DESKTOP_BROWSER: 101,

    /**
     * @en Platform - Editor's window process
     * @zh 平台 - 编辑器窗口进程
     * @default 102
     */
    EDITOR_PAGE: 102,

    /**
     * @en Platform - Editor's main process
     * @zh 平台 - 编辑器主进程
     * @default 103
     */
    EDITOR_CORE: 103,

    /**
     * @en Platform - WeChat Mini Game
     * @zh 平台 - 微信小游戏
     * @default 104
     */
    WECHAT_GAME: 104,

    /**
     * @en Platform - QQ Play Game
     * @zh 平台 - QQ Play
     * @default 105
     */
    QQ_PLAY: 105,

    /**
     * @en Browser Type - WeChat inner browser
     * @zh 浏览器类型 - 微信内置浏览器
     * @default "wechat"
     */
    BROWSER_TYPE_WECHAT: 'wechat',

    /**
     * @en Browser Type - Cocos Play Game
     * @zh 浏览器类型 - Cocos Play 游戏
     * @default "cocosplay"
     */
    BROWSER_TYPE_COCOSPLAY: 'cocosplay',

    /**
     * @en Browser Type - huawei quick Game
     * @zh 浏览器类型 - 华为快游戏
     * @default "huaweiquickgame"
     */
    BROWSER_TYPE_HUAWEI_GAME: 'huaweiquickgame',

    /**
    * @en Browser Type - OPPO mini Game
    * @zh 浏览器类型 - OPPO小游戏
    * @default "oppogame"
    */
    BROWSER_TYPE_OPPO_GAME: 'oppogame',

    /**
    * @en Browser Type - vivo mini Game
    * @zh 浏览器类型 - vivo小游戏
    * @default "vivogame"
    */
    BROWSER_TYPE_VIVO_GAME: 'vivogame',

    /**
     * @en Browser Type - Android Browser
     * @zh 浏览器类型 - 安卓浏览器
     * @default "androidbrowser"
     */
    BROWSER_TYPE_ANDROID: 'androidbrowser',

    /**
     * @en Browser Type - Internet Explorer
     * @zh 浏览器类型 - 微软 IE
     * @default "ie"
     */
    BROWSER_TYPE_IE: 'ie',

    /**
     * @en Browser Type - Microsoft Edge
     * @zh 浏览器类型 - 微软 Edge
     * @default "edge"
     */
    BROWSER_TYPE_EDGE: "edge",

    /**
     * @en Browser Type - QQ Browser
     * @zh 浏览器类型 - QQ 浏览器
     * @default "qqbrowser"
     */
    BROWSER_TYPE_QQ: 'qqbrowser',

    /**
     * @en Browser Type - Mobile QQ Browser
     * @zh 浏览器类型 - 手机 QQ 浏览器
     * @default "mqqbrowser"
     */
    BROWSER_TYPE_MOBILE_QQ: 'mqqbrowser',

    /**
     * @en Browser Type - UC Browser
     * @zh 浏览器类型 - UC 浏览器
     * @default "ucbrowser"
     */
    BROWSER_TYPE_UC: 'ucbrowser',

    /**
     * @en Browser Type - Third party integrated UC browser
     * @zh 浏览器类型 - 第三方应用中集成的 UC 浏览器
     * @default "ucbs"
     */
    BROWSER_TYPE_UCBS: 'ucbs',

    /**
     * @en Browser Type - 360 Browser
     * @zh 浏览器类型 - 360 浏览器
     * @default "360browser"
     */
    BROWSER_TYPE_360: '360browser',

    /**
     * @en Browser Type - Baidu Box App
     * @zh 浏览器类型 - Baidu Box App
     * @default "baiduboxapp"
     */
    BROWSER_TYPE_BAIDU_APP: 'baiduboxapp',

    /**
     * @en Browser Type - Baidu Browser
     * @zh 浏览器类型 - 百度浏览器
     * @default "baidubrowser"
     */
    BROWSER_TYPE_BAIDU: 'baidubrowser',

    /**
     * @en Browser Type - Maxthon Browser
     * @zh 浏览器类型 - 傲游浏览器
     * @default "maxthon"
     */
    BROWSER_TYPE_MAXTHON: 'maxthon',

    /**
     * @en Browser Type - Opera Browser
     * @zh 浏览器类型 - Opera 浏览器
     * @default "opera"
     */
    BROWSER_TYPE_OPERA: 'opera',

    /**
     * @en Browser Type - Oupeng Browser
     * @zh 浏览器类型 - 欧朋浏览器
     * @default "oupeng"
     */
    BROWSER_TYPE_OUPENG: 'oupeng',

    /**
     * @en Browser Type - MI UI Browser
     * @zh 浏览器类型 - MIUI 内置浏览器
     * @default "miuibrowser"
     */
    BROWSER_TYPE_MIUI: 'miuibrowser',

    /**
     * @en Browser Type - Firefox Browser
     * @zh 浏览器类型 - Firefox 浏览器
     * @default "firefox"
     */
    BROWSER_TYPE_FIREFOX: 'firefox',

    /**
     * @en Browser Type - Safari Browser
     * @zh 浏览器类型 - Safari 浏览器
     * @default "safari"
     */
    BROWSER_TYPE_SAFARI: 'safari',

    /**
     * @en Browser Type - Chrome Browser
     * @zh 浏览器类型 - Chrome 浏览器
     * @default "chrome"
     */
    BROWSER_TYPE_CHROME: 'chrome',

    /**
     * @en Browser Type - Cheetah Browser
     * @zh 浏览器类型 - 猎豹浏览器
     * @default "liebao"
     */
    BROWSER_TYPE_LIEBAO: 'liebao',

    /**
     * @en Browser Type - QZone Inner Browser
     * @zh 浏览器类型 - QZone 内置浏览器
     * @default "qzone"
     */
    BROWSER_TYPE_QZONE: 'qzone',

    /**
     * @en Browser Type - Sogou Browser
     * @zh 浏览器类型 - 搜狗浏览器
     * @default "sogou"
     */
    BROWSER_TYPE_SOUGOU: 'sogou',

    /**
     * @en Browser Type - Unknown
     * @zh 浏览器类型 - 未知
     * @default "unknown"
     */
    BROWSER_TYPE_UNKNOWN: 'unknown',

    /**
     * @en Whether the running platform is native app
     * @zh 指示运行平台是否是原生平台
     */
    isNative: _defaultConstants.JSB,

    /**
     * @en Whether the running platform is browser
     * @zh 指示运行平台是否是浏览器
     */
    isBrowser: (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && (typeof document === "undefined" ? "undefined" : _typeof(document)) === 'object' && !_defaultConstants.MINIGAME && !_defaultConstants.JSB && !_defaultConstants.RUNTIME_BASED,

    /**
     * @en Indicate whether the current running context is a mobile system
     * @zh 指示当前运行平台是否是移动端平台
     * @default false
     */
    isMobile: false,

    /**
     * @en Whether the endianness of current platform is little endian
     * @zh 当前平台字节顺序是否是小端序
     */
    isLittleEndian: function () {
      var buffer = new ArrayBuffer(2);
      new DataView(buffer).setInt16(0, 256, true); // Int16Array uses the platform's endianness.

      return new Int16Array(buffer)[0] === 256;
    }(),

    /**
     * @en The running platform
     * @zh 当前运行平台或环境
     * @default {{sys.UNKNOWN}}
     */
    platform: -1,

    /**
     * @en Indicate the current language of the running system
     * @zh 指示当前运行环境的语言
     * @default {{sys.LANGUAGE_UNKNOWN}}
     */
    language: 'unknown',

    /**
     * @en Indicate the running os name
     * @zh 指示当前运行系统
     */
    os: 'Unknown',

    /**
     * @en Indicate the running os version string
     * @zh 指示当前运行系统版本字符串
     */
    osVersion: '',

    /**
     * @en Indicate the running os main version
     * @zh 指示当前系统主版本
     */
    osMainVersion: 0,

    /**
     * @en Indicate the running browser type
     * @zh 指示当前运行的浏览器类型
     */
    browserType: 'unknown',

    /**
     * @en Indicate the running browser version
     * @zh 指示当前运行的浏览器版本
     */
    browserVersion: '',

    /**
     * @en Indicate the real pixel resolution of the whole game window
     * @zh 指示游戏窗口的像素分辨率
     */
    windowPixelResolution: null,

    /**
     * @en The capabilities of the current platform
     * @zh 当前平台的功能可用性
     */
    capabilities: null,

    /**
     * @en It is a local storage component based on HTML5 localStorage API, on web platform, it's equal to window.localStorage
     * @zh HTML5 标准中的 localStorage 的本地存储功能，在 Web 端等价于 window.localStorage
     */
    localStorage: null,

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
     * @private
     */
    __audioSupport: null,

    /**
     * Video support in the browser
     * @private
     */
    __videoSupport: null,

    /**
     * @en Get the network type of current device, return `sys.NetworkType.LAN` if failure.
     * @zh 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`
     */
    getNetworkType: function getNetworkType() {
      // TODO: need to implement this for mobile phones.
      return NetworkType.LAN;
    },

    /**
     * @en Get the battery level of current device, return 1.0 if failure.
     * @zh 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
     * @return - 0.0 ~ 1.0
     */
    getBatteryLevel: function getBatteryLevel() {
      // TODO: need to implement this for mobile phones.
      return 1.0;
    },

    /**
     * @en Forces the garbage collection, only available in native platforms
     * @zh 强制进行 JS 内存垃圾回收，尽在原生平台有效
     */
    garbageCollect: function garbageCollect() {// N/A in web
    },

    /**
     * @en Check whether an object is valid,
     * In web engine, it will return true if the object exist
     * In native engine, it will return true if the JS object and the correspond native object are both valid
     * @zh 检查一个对象是否非空或在原生平台有效，
     * 在 Web 平台，只要对象非空或非 Undefined 就会返回 true，在原生平台，我们会检查当前 JS 对象和其绑定的原生对象是否都有效
     * @param obj The object to be checked
     */
    isObjectValid: function isObjectValid(obj) {
      if (obj === null || obj === undefined) {
        return false;
      } else {
        return true;
      }
    },

    /**
     * @en Dump system informations
     * @zh 在控制台打印当前的主要系统信息
     */
    dump: function dump() {
      var str = '';
      str += 'isMobile : ' + this.isMobile + '\r\n';
      str += 'language : ' + this.language + '\r\n';
      str += 'browserType : ' + this.browserType + '\r\n';
      str += 'browserVersion : ' + this.browserVersion + '\r\n';
      str += 'capabilities : ' + JSON.stringify(this.capabilities) + '\r\n';
      str += 'os : ' + this.os + '\r\n';
      str += 'osVersion : ' + this.osVersion + '\r\n';
      str += 'platform : ' + this.platform + '\r\n';
      str += 'Using ' + (_globalExports.legacyCC.game.renderType === _globalExports.legacyCC.game.RENDER_TYPE_WEBGL ? 'WEBGL' : 'CANVAS') + ' renderer.' + '\r\n';
      (0, _debug.log)(str);
    },

    /**
     * @en Try to open a url in browser, may not work in some platforms
     * @zh 尝试打开一个 web 页面，并非在所有平台都有效
     */
    openURL: function openURL(url) {
      if (_defaultConstants.JSB || _defaultConstants.RUNTIME_BASED) {
        // @ts-ignore
        jsb.openURL(url);
      } else {
        window.open(url);
      }
    },

    /**
     * @en Get the current time in milliseconds
     * @zh 获取当前时间（毫秒为单位）
     */
    now: function now() {
      if (Date.now) {
        return Date.now();
      } else {
        return +new Date();
      }
    },

    /**
     * Dumps rooted objects, only available in native platforms
     * @private
     */
    dumpRoot: function dumpRoot() {// N/A in web
    },

    /**
     * Restart the JS VM, only available in native platforms
     * @private
     */
    restartVM: function restartVM() {// N/A in web
    },

    /**
     * Clean a script in the JS VM, only available in native platforms
     * @private
     */
    cleanScript: function cleanScript(jsfile) {// N/A in web
    },

    /**
     * @en
     * Returns the safe area of the screen. If the screen is not notched, the design resolution will be returned by default.
     * Only supported on Android, iOS and WeChat Mini Game platform.
     * @zh
     * 返回手机屏幕安全区域，如果不是异形屏将默认返回设计分辨率尺寸。目前只支持安卓、iOS 原生平台和微信小游戏平台。
     * @method getSafeAreaRect
     * @return {Rect}
     */
    getSafeAreaRect: function getSafeAreaRect() {
      var visibleSize = _globalExports.legacyCC.view.getVisibleSize();

      return _globalExports.legacyCC.rect(0, 0, visibleSize.width, visibleSize.height);
    }
  }; // ============= Platform Adaptation ==============

  _exports.sys = sys;

  if (_global.__globalAdapter && _global.__globalAdapter.adaptSys) {
    // init sys info in adapter
    _global.__globalAdapter.adaptSys(sys);
  } // TODO: main process flag
  // else if (EDITOR) {
  //     sys.isMobile = false;
  //     sys.platform = sys.EDITOR_CORE;
  //     sys.language = sys.LANGUAGE_UNKNOWN;
  //     sys.os = ({
  //         darwin: sys.OS_OSX,
  //         win32: sys.OS_WINDOWS,
  //         linux: sys.OS_LINUX,
  //     // @ts-ignore
  //     })[process.platform] || sys.OS_UNKNOWN;
  //     sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
  //     sys.browserVersion = '';
  //     sys.windowPixelResolution = {
  //         width: 0,
  //         height: 0,
  //     };
  //     sys.__audioSupport = {};
  // }
  else if (_defaultConstants.JSB || _defaultConstants.RUNTIME_BASED) {
      // @ts-ignore
      var platform = sys.platform = __getPlatform();

      sys.isMobile = platform === sys.ANDROID || platform === sys.IPAD || platform === sys.IPHONE || platform === sys.WP8 || platform === sys.TIZEN || platform === sys.BLACKBERRY; // @ts-ignore

      sys.os = __getOS(); // @ts-ignore

      sys.language = __getCurrentLanguage(); // @ts-ignore

      sys.osVersion = __getOSVersion();
      sys.osMainVersion = parseInt(sys.osVersion);
      sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
      sys.browserVersion = '';
      var w = window.innerWidth;
      var h = window.innerHeight;
      var ratio = window.devicePixelRatio || 1;
      sys.windowPixelResolution = {
        width: ratio * w,
        height: ratio * h
      };
      sys.localStorage = window.localStorage;
      var capabilities;
      capabilities = sys.capabilities = {
        canvas: false,
        opengl: true,
        webp: true
      };

      if (sys.isMobile) {
        capabilities.accelerometer = true;
        capabilities.touches = true;
      } else {
        // desktop
        capabilities.keyboard = true;
        capabilities.mouse = true;
        capabilities.touches = false;
      }

      sys.__audioSupport = {
        ONLY_ONE: false,
        WEB_AUDIO: false,
        DELAY_CREATE_CTX: false,
        format: ['.mp3']
      };
      sys.__videoSupport = {
        format: ['.mp4']
      };
    } else {
      // browser or runtime
      var win = window,
          nav = win.navigator,
          doc = document,
          docEle = doc.documentElement;
      var ua = nav.userAgent.toLowerCase();

      if (_defaultConstants.EDITOR) {
        sys.isMobile = false;
        sys.platform = sys.EDITOR_PAGE;
      } else {
        sys.isMobile = /mobile|android|iphone|ipad/.test(ua);
        sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
      }

      var currLanguage = nav.language; // @ts-ignore

      currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
      currLanguage = currLanguage ? currLanguage.split('-')[0] : sys.LANGUAGE_ENGLISH;
      sys.language = currLanguage; // Get the os of system

      var isAndroid = false,
          iOS = false,
          osVersion = '',
          osMajorVersion = 0;
      var uaResult = /android\s*(\d+(?:\.\d+)*)/i.exec(ua) || /android\s*(\d+(?:\.\d+)*)/i.exec(nav.platform);

      if (uaResult) {
        isAndroid = true;
        osVersion = uaResult[1] || '';
        osMajorVersion = parseInt(osVersion) || 0;
      }

      uaResult = /(iPad|iPhone|iPod).*OS ((\d+_?){2,3})/i.exec(ua);

      if (uaResult) {
        iOS = true;
        osVersion = uaResult[2] || '';
        osMajorVersion = parseInt(osVersion) || 0;
      } // refer to https://github.com/cocos-creator/engine/pull/5542 , thanks for contribition from @krapnikkk
      // ipad OS 13 safari identifies itself as "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)"
      // so use maxTouchPoints to check whether it's desktop safari or not.
      // reference: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
      // FIXME: should remove it when touch-enabled mac are available
      // TODO: due to compatibility issues, it is still determined to be ios, and a new operating system type ipados may be added later？
      else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || nav.platform === 'MacIntel' && nav.maxTouchPoints && nav.maxTouchPoints > 1) {
          iOS = true;
          osVersion = '';
          osMajorVersion = 0;
        }

      var osName = sys.OS_UNKNOWN;

      if (nav.appVersion.indexOf('Win') !== -1) {
        osName = sys.OS_WINDOWS;
      } else if (iOS) {
        osName = sys.OS_IOS;
      } else if (nav.appVersion.indexOf('Mac') !== -1) {
        osName = sys.OS_OSX;
      } else if (nav.appVersion.indexOf('X11') !== -1 && nav.appVersion.indexOf('Linux') === -1) {
        osName = sys.OS_UNIX;
      } else if (isAndroid) {
        osName = sys.OS_ANDROID;
      } else if (nav.appVersion.indexOf('Linux') !== -1 || ua.indexOf('ubuntu') !== -1) {
        osName = sys.OS_LINUX;
      }

      sys.os = osName;
      sys.osVersion = osVersion;
      sys.osMainVersion = osMajorVersion;
      sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
      /* Determine the browser type */

      (function () {
        var typeReg1 = /mqqbrowser|micromessenger|qq|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
        var typeReg2 = /qqbrowser|ucbrowser|edge/i;
        var typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
        var browserTypes = typeReg1.exec(ua);

        if (!browserTypes) {
          browserTypes = typeReg2.exec(ua);
        }

        if (!browserTypes) {
          browserTypes = typeReg3.exec(ua);
        }

        var browserType = browserTypes ? browserTypes[0].toLowerCase() : sys.BROWSER_TYPE_UNKNOWN;

        if (_defaultConstants.COCOSPLAY) {
          browserType = sys.BROWSER_TYPE_COCOSPLAY;
        } else if (_defaultConstants.HUAWEI) {
          browserType = sys.BROWSER_TYPE_HUAWEI_GAME;
        } else if (_defaultConstants.OPPO) {
          browserType = sys.BROWSER_TYPE_OPPO_GAME;
        } else if (_defaultConstants.VIVO) {
          browserType = sys.BROWSER_TYPE_VIVO_GAME;
        } else if (browserType === 'micromessenger') {
          browserType = sys.BROWSER_TYPE_WECHAT;
        } else if (browserType === 'safari' && isAndroid) {
          browserType = sys.BROWSER_TYPE_ANDROID;
        } else if (browserType === 'qq' && ua.match(/android.*applewebkit/i)) {
          browserType = sys.BROWSER_TYPE_ANDROID;
        } else if (browserType === 'trident') {
          browserType = sys.BROWSER_TYPE_IE;
        } else if (browserType === 'edge') {
          browserType === sys.BROWSER_TYPE_EDGE;
        } else if (browserType === '360 aphone') {
          browserType = sys.BROWSER_TYPE_360;
        } else if (browserType === 'mxbrowser') {
          browserType = sys.BROWSER_TYPE_MAXTHON;
        } else if (browserType === 'opr/') {
          browserType = sys.BROWSER_TYPE_OPERA;
        }

        sys.browserType = browserType;
      })();

      sys.browserVersion = '';
      /* Determine the browser version number */

      (function () {
        var versionReg1 = /(mqqbrowser|micromessenger|qq|sogou|qzone|liebao|maxthon|uc|ucbs|360 aphone|360|baiduboxapp|baidu|maxthon|mxbrowser|miui)(mobile)?(browser)?\/?([\d.]+)/i;
        var versionReg2 = /(qqbrowser|chrome|safari|firefox|trident|opera|opr\/|oupeng)(mobile)?(browser)?\/?([\d.]+)/i;
        var tmp = ua.match(versionReg1);

        if (!tmp) {
          tmp = ua.match(versionReg2);
        }

        sys.browserVersion = tmp ? tmp[4] : '';
      })();

      var _w = window.innerWidth || document.documentElement.clientWidth;

      var _h = window.innerHeight || document.documentElement.clientHeight;

      var _ratio = window.devicePixelRatio || 1;

      sys.windowPixelResolution = {
        width: _ratio * _w,
        height: _ratio * _h
      };

      var _tmpCanvas1 = document.createElement('canvas');

      var create3DContext = function create3DContext(canvas, opt_attribs, opt_contextType) {
        if (opt_contextType) {
          try {
            return canvas.getContext(opt_contextType, opt_attribs);
          } catch (e) {
            return null;
          }
        } else {
          return create3DContext(canvas, opt_attribs, 'webgl') || create3DContext(canvas, opt_attribs, 'experimental-webgl') || create3DContext(canvas, opt_attribs, 'webkit-3d') || create3DContext(canvas, opt_attribs, 'moz-webgl') || null;
        }
      };

      try {
        var localStorage = sys.localStorage = win.localStorage;
        localStorage.setItem('storage', '');
        localStorage.removeItem('storage');
        localStorage = null;
      } catch (e) {
        var warn = function warn() {
          (0, _debug.warnID)(5200);
        };

        sys.localStorage = {
          getItem: warn,
          setItem: warn,
          removeItem: warn,
          clear: warn
        };
      }

      var _supportWebp = _defaultConstants.TEST ? false : _tmpCanvas1.toDataURL('image/webp').startsWith('data:image/webp');

      var _supportCanvas = _defaultConstants.TEST ? false : !!_tmpCanvas1.getContext('2d');

      var _supportWebGL = false;

      if (_defaultConstants.TEST) {
        _supportWebGL = false;
      } else if (win.WebGLRenderingContext) {
        // @ts-ignore
        if (create3DContext(document.createElement('CANVAS'))) {
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
              } else {
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
              if (browserVer >= 30.0) {
                _supportWebGL = true;
              } else {
                _supportWebGL = false;
              }

              break;

            case sys.BROWSER_TYPE_UC:
              if (browserVer > 11.0) {
                _supportWebGL = true;
              } else {
                _supportWebGL = false;
              }

              break;

            case sys.BROWSER_TYPE_360:
              _supportWebGL = false;
              break;
          }
        }
      }

      var _capabilities = sys.capabilities = {
        canvas: _supportCanvas,
        opengl: _supportWebGL,
        webp: _supportWebp
      };

      if (docEle.ontouchstart !== undefined || doc.ontouchstart !== undefined || nav.msPointerEnabled) {
        _capabilities.touches = true;
      }

      if (docEle.onmouseup !== undefined) {
        _capabilities.mouse = true;
      }

      if (docEle.onkeyup !== undefined) {
        _capabilities.keyboard = true;
      } // @ts-ignore


      if (win.DeviceMotionEvent || win.DeviceOrientationEvent) {
        _capabilities.accelerometer = true;
      }

      var __audioSupport;

      (function () {
        var DEBUG = false;
        var version = sys.browserVersion; // check if browser supports Web Audio
        // check Web Audio's context

        var supportWebAudio = !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);
        __audioSupport = {
          ONLY_ONE: false,
          WEB_AUDIO: supportWebAudio,
          DELAY_CREATE_CTX: false
        };

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

        if (DEBUG) {
          setTimeout(function () {
            (0, _debug.log)('browse type: ' + sys.browserType);
            (0, _debug.log)('browse version: ' + version);
            (0, _debug.log)('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
            (0, _debug.log)('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
            (0, _debug.log)('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
          }, 0);
        }
      })();

      try {
        if (__audioSupport.WEB_AUDIO) {
          __audioSupport._context = null;
          Object.defineProperty(__audioSupport, 'context', {
            get: function get() {
              if (this._context) {
                return this._context;
              } // @ts-ignore


              return this._context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
            }
          });
        }
      } catch (error) {
        __audioSupport.WEB_AUDIO = false;
        (0, _debug.logID)(5201);
      }

      var formatSupport = [];

      (function () {
        var audio = document.createElement('audio');

        if (audio.canPlayType) {
          var ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');

          if (ogg) {
            formatSupport.push('.ogg');
          }

          var mp3 = audio.canPlayType('audio/mpeg');

          if (mp3) {
            formatSupport.push('.mp3');
          }

          var wav = audio.canPlayType('audio/wav; codecs="1"');

          if (wav) {
            formatSupport.push('.wav');
          }

          var mp4 = audio.canPlayType('audio/mp4');

          if (mp4) {
            formatSupport.push('.mp4');
          }

          var m4a = audio.canPlayType('audio/x-m4a');

          if (m4a) {
            formatSupport.push('.m4a');
          }
        }
      })();

      __audioSupport.format = formatSupport;
      sys.__audioSupport = __audioSupport;
      sys.__videoSupport = {
        format: []
      };

      (function () {
        var video = document.createElement('video');

        if (video.canPlayType) {
          var canPlayTypes = ['mp4', 'webm'];
          var format = sys.__videoSupport.format;
          canPlayTypes.forEach(function (type) {
            if (video.canPlayType("video/".concat(type))) {
              format.push(".".concat(type));
            }
          });
          sys.__videoSupport.format = format;
        }
      })();
    }

  _globalExports.legacyCC.sys = sys;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vc3lzLnRzIl0sIm5hbWVzIjpbIl9nbG9iYWwiLCJ3aW5kb3ciLCJnbG9iYWwiLCJOZXR3b3JrVHlwZSIsInN5cyIsIkxBTkdVQUdFX0VOR0xJU0giLCJMQU5HVUFHRV9DSElORVNFIiwiTEFOR1VBR0VfRlJFTkNIIiwiTEFOR1VBR0VfSVRBTElBTiIsIkxBTkdVQUdFX0dFUk1BTiIsIkxBTkdVQUdFX1NQQU5JU0giLCJMQU5HVUFHRV9EVVRDSCIsIkxBTkdVQUdFX1JVU1NJQU4iLCJMQU5HVUFHRV9LT1JFQU4iLCJMQU5HVUFHRV9KQVBBTkVTRSIsIkxBTkdVQUdFX0hVTkdBUklBTiIsIkxBTkdVQUdFX1BPUlRVR1VFU0UiLCJMQU5HVUFHRV9BUkFCSUMiLCJMQU5HVUFHRV9OT1JXRUdJQU4iLCJMQU5HVUFHRV9QT0xJU0giLCJMQU5HVUFHRV9UVVJLSVNIIiwiTEFOR1VBR0VfVUtSQUlOSUFOIiwiTEFOR1VBR0VfUk9NQU5JQU4iLCJMQU5HVUFHRV9CVUxHQVJJQU4iLCJMQU5HVUFHRV9VTktOT1dOIiwiT1NfSU9TIiwiT1NfQU5EUk9JRCIsIk9TX1dJTkRPV1MiLCJPU19MSU5VWCIsIk9TX09TWCIsIk9TX1VOS05PV04iLCJVTktOT1dOIiwiV0lOMzIiLCJMSU5VWCIsIk1BQ09TIiwiQU5EUk9JRCIsIklQSE9ORSIsIklQQUQiLCJCTEFDS0JFUlJZIiwiTkFDTCIsIkVNU0NSSVBURU4iLCJUSVpFTiIsIldJTlJUIiwiV1A4IiwiTU9CSUxFX0JST1dTRVIiLCJERVNLVE9QX0JST1dTRVIiLCJFRElUT1JfUEFHRSIsIkVESVRPUl9DT1JFIiwiV0VDSEFUX0dBTUUiLCJRUV9QTEFZIiwiQlJPV1NFUl9UWVBFX1dFQ0hBVCIsIkJST1dTRVJfVFlQRV9DT0NPU1BMQVkiLCJCUk9XU0VSX1RZUEVfSFVBV0VJX0dBTUUiLCJCUk9XU0VSX1RZUEVfT1BQT19HQU1FIiwiQlJPV1NFUl9UWVBFX1ZJVk9fR0FNRSIsIkJST1dTRVJfVFlQRV9BTkRST0lEIiwiQlJPV1NFUl9UWVBFX0lFIiwiQlJPV1NFUl9UWVBFX0VER0UiLCJCUk9XU0VSX1RZUEVfUVEiLCJCUk9XU0VSX1RZUEVfTU9CSUxFX1FRIiwiQlJPV1NFUl9UWVBFX1VDIiwiQlJPV1NFUl9UWVBFX1VDQlMiLCJCUk9XU0VSX1RZUEVfMzYwIiwiQlJPV1NFUl9UWVBFX0JBSURVX0FQUCIsIkJST1dTRVJfVFlQRV9CQUlEVSIsIkJST1dTRVJfVFlQRV9NQVhUSE9OIiwiQlJPV1NFUl9UWVBFX09QRVJBIiwiQlJPV1NFUl9UWVBFX09VUEVORyIsIkJST1dTRVJfVFlQRV9NSVVJIiwiQlJPV1NFUl9UWVBFX0ZJUkVGT1giLCJCUk9XU0VSX1RZUEVfU0FGQVJJIiwiQlJPV1NFUl9UWVBFX0NIUk9NRSIsIkJST1dTRVJfVFlQRV9MSUVCQU8iLCJCUk9XU0VSX1RZUEVfUVpPTkUiLCJCUk9XU0VSX1RZUEVfU09VR09VIiwiQlJPV1NFUl9UWVBFX1VOS05PV04iLCJpc05hdGl2ZSIsIkpTQiIsImlzQnJvd3NlciIsImRvY3VtZW50IiwiTUlOSUdBTUUiLCJSVU5USU1FX0JBU0VEIiwiaXNNb2JpbGUiLCJpc0xpdHRsZUVuZGlhbiIsImJ1ZmZlciIsIkFycmF5QnVmZmVyIiwiRGF0YVZpZXciLCJzZXRJbnQxNiIsIkludDE2QXJyYXkiLCJwbGF0Zm9ybSIsImxhbmd1YWdlIiwib3MiLCJvc1ZlcnNpb24iLCJvc01haW5WZXJzaW9uIiwiYnJvd3NlclR5cGUiLCJicm93c2VyVmVyc2lvbiIsIndpbmRvd1BpeGVsUmVzb2x1dGlvbiIsImNhcGFiaWxpdGllcyIsImxvY2FsU3RvcmFnZSIsIl9fYXVkaW9TdXBwb3J0IiwiX192aWRlb1N1cHBvcnQiLCJnZXROZXR3b3JrVHlwZSIsIkxBTiIsImdldEJhdHRlcnlMZXZlbCIsImdhcmJhZ2VDb2xsZWN0IiwiaXNPYmplY3RWYWxpZCIsIm9iaiIsInVuZGVmaW5lZCIsImR1bXAiLCJzdHIiLCJKU09OIiwic3RyaW5naWZ5IiwibGVnYWN5Q0MiLCJnYW1lIiwicmVuZGVyVHlwZSIsIlJFTkRFUl9UWVBFX1dFQkdMIiwib3BlblVSTCIsInVybCIsImpzYiIsIm9wZW4iLCJub3ciLCJEYXRlIiwiZHVtcFJvb3QiLCJyZXN0YXJ0Vk0iLCJjbGVhblNjcmlwdCIsImpzZmlsZSIsImdldFNhZmVBcmVhUmVjdCIsInZpc2libGVTaXplIiwidmlldyIsImdldFZpc2libGVTaXplIiwicmVjdCIsIndpZHRoIiwiaGVpZ2h0IiwiX19nbG9iYWxBZGFwdGVyIiwiYWRhcHRTeXMiLCJfX2dldFBsYXRmb3JtIiwiX19nZXRPUyIsIl9fZ2V0Q3VycmVudExhbmd1YWdlIiwiX19nZXRPU1ZlcnNpb24iLCJwYXJzZUludCIsInciLCJpbm5lcldpZHRoIiwiaCIsImlubmVySGVpZ2h0IiwicmF0aW8iLCJkZXZpY2VQaXhlbFJhdGlvIiwiY2FudmFzIiwib3BlbmdsIiwid2VicCIsImFjY2VsZXJvbWV0ZXIiLCJ0b3VjaGVzIiwia2V5Ym9hcmQiLCJtb3VzZSIsIk9OTFlfT05FIiwiV0VCX0FVRElPIiwiREVMQVlfQ1JFQVRFX0NUWCIsImZvcm1hdCIsIndpbiIsIm5hdiIsIm5hdmlnYXRvciIsImRvYyIsImRvY0VsZSIsImRvY3VtZW50RWxlbWVudCIsInVhIiwidXNlckFnZW50IiwidG9Mb3dlckNhc2UiLCJFRElUT1IiLCJ0ZXN0IiwiY3Vyckxhbmd1YWdlIiwiYnJvd3Nlckxhbmd1YWdlIiwic3BsaXQiLCJpc0FuZHJvaWQiLCJpT1MiLCJvc01ham9yVmVyc2lvbiIsInVhUmVzdWx0IiwiZXhlYyIsIm1heFRvdWNoUG9pbnRzIiwib3NOYW1lIiwiYXBwVmVyc2lvbiIsImluZGV4T2YiLCJPU19VTklYIiwidHlwZVJlZzEiLCJ0eXBlUmVnMiIsInR5cGVSZWczIiwiYnJvd3NlclR5cGVzIiwiQ09DT1NQTEFZIiwiSFVBV0VJIiwiT1BQTyIsIlZJVk8iLCJtYXRjaCIsInZlcnNpb25SZWcxIiwidmVyc2lvblJlZzIiLCJ0bXAiLCJjbGllbnRXaWR0aCIsImNsaWVudEhlaWdodCIsIl90bXBDYW52YXMxIiwiY3JlYXRlRWxlbWVudCIsImNyZWF0ZTNEQ29udGV4dCIsIm9wdF9hdHRyaWJzIiwib3B0X2NvbnRleHRUeXBlIiwiZ2V0Q29udGV4dCIsImUiLCJzZXRJdGVtIiwicmVtb3ZlSXRlbSIsIndhcm4iLCJnZXRJdGVtIiwiY2xlYXIiLCJfc3VwcG9ydFdlYnAiLCJURVNUIiwidG9EYXRhVVJMIiwic3RhcnRzV2l0aCIsIl9zdXBwb3J0Q2FudmFzIiwiX3N1cHBvcnRXZWJHTCIsIldlYkdMUmVuZGVyaW5nQ29udGV4dCIsImJyb3dzZXJWZXIiLCJwYXJzZUZsb2F0Iiwib250b3VjaHN0YXJ0IiwibXNQb2ludGVyRW5hYmxlZCIsIm9ubW91c2V1cCIsIm9ua2V5dXAiLCJEZXZpY2VNb3Rpb25FdmVudCIsIkRldmljZU9yaWVudGF0aW9uRXZlbnQiLCJERUJVRyIsInZlcnNpb24iLCJzdXBwb3J0V2ViQXVkaW8iLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJtb3pBdWRpb0NvbnRleHQiLCJVU0VfTE9BREVSX0VWRU5UIiwiT05FX1NPVVJDRSIsInNldFRpbWVvdXQiLCJNVUxUSV9DSEFOTkVMIiwiQVVUT1BMQVkiLCJfY29udGV4dCIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwiZXJyb3IiLCJmb3JtYXRTdXBwb3J0IiwiYXVkaW8iLCJjYW5QbGF5VHlwZSIsIm9nZyIsInB1c2giLCJtcDMiLCJ3YXYiLCJtcDQiLCJtNGEiLCJ2aWRlbyIsImNhblBsYXlUeXBlcyIsImZvckVhY2giLCJ0eXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBa0NBO0FBRUE7QUFDQSxNQUFNQSxPQUFPLEdBQUcsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQXpEOztNQUVLRSxXOzthQUFBQSxXO0FBQUFBLElBQUFBLFcsQ0FBQUEsVztBQUFB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Q2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBFRElUT1IsIFRFU1QsIENPQ09TUExBWSwgSlNCLCBNSU5JR0FNRSwgSFVBV0VJLCBPUFBPLCBWSVZPLCBSVU5USU1FX0JBU0VEIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IHdhcm5JRCwgbG9nLCBsb2dJRCB9IGZyb20gJy4vZGVidWcnO1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGVcclxuXHJcbi8vIEB0cy1pZ25vcmVcclxuY29uc3QgX2dsb2JhbCA9IHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93O1xyXG5cclxuZW51bSBOZXR3b3JrVHlwZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBOZXR3b3JrIGlzIHVucmVhY2hhYmxlLlxyXG4gICAgICogQHpoIOe9kee7nOS4jemAmlxyXG4gICAgICovXHJcbiAgICBOT05FLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTmV0d29yayBpcyByZWFjaGFibGUgdmlhIFdpRmkgb3IgY2FibGUuXHJcbiAgICAgKiBAemgg6YCa6L+H5peg57q/5oiW6ICF5pyJ57q/5pys5Zyw572R57uc6L+e5o6l5Zug54m5572RXHJcbiAgICAgKi9cclxuICAgIExBTixcclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5ldHdvcmsgaXMgcmVhY2hhYmxlIHZpYSBXaXJlbGVzcyBXaWRlIEFyZWEgTmV0d29ya1xyXG4gICAgICogQHpoIOmAmui/h+icgueqneenu+WKqOe9kee7nOi/nuaOpeWboOeJuee9kVxyXG4gICAgICovXHJcbiAgICBXV0FOXHJcbn07XHJcblxyXG4vKipcclxuICogQGVuIEEgc2V0IG9mIHN5c3RlbSByZWxhdGVkIHZhcmlhYmxlc1xyXG4gKiBAemgg5LiA57O75YiX57O757uf55u45YWz546v5aKD5Y+Y6YePXHJcbiAqIEBtYWluXHJcbiAqL1xyXG5leHBvcnQgY29uc3Qgc3lzOiB7IFt4OiBzdHJpbmddOiBhbnk7IH0gPSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTmV0d29yayB0eXBlIGVudW1lcmF0aW9uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOe9kee7nOexu+Wei+aemuS4vlxyXG4gICAgICovXHJcbiAgICBOZXR3b3JrVHlwZSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFbmdsaXNoIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDoi7Hor61cclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfRU5HTElTSDogJ2VuJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDaGluZXNlIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDkuK3mlodcclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfQ0hJTkVTRTogJ3poJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBGcmVuY2ggbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOazleivrVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9GUkVOQ0g6ICdmcicsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSXRhbGlhbiBsYW5ndWFnZSBjb2RlXHJcbiAgICAgKiBAemgg6K+t6KiA5Luj56CBIC0g5oSP5aSn5Yip6K+tXHJcbiAgICAgKi9cclxuICAgIExBTkdVQUdFX0lUQUxJQU46ICdpdCcsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2VybWFuIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDlvrfor61cclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfR0VSTUFOOiAnZGUnLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNwYW5pc2ggbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOilv+ePreeJmeivrVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9TUEFOSVNIOiAnZXMnLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNwYW5pc2ggbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOiNt+WFsOivrVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9EVVRDSDogJ2R1JyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSdXNzaWFuIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDkv4TnvZfmlq/or61cclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfUlVTU0lBTjogJ3J1JyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBLb3JlYW4gbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOmfqeivrVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9LT1JFQU46ICdrbycsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSmFwYW5lc2UgbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOaXpeivrVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9KQVBBTkVTRTogJ2phJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBIdW5nYXJpYW4gbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOWMiOeJmeWIqeivrVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9IVU5HQVJJQU46ICdodScsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUG9ydHVndWVzZSBsYW5ndWFnZSBjb2RlXHJcbiAgICAgKiBAemgg6K+t6KiA5Luj56CBIC0g6JGh6JCE54mZ6K+tXHJcbiAgICAgKi9cclxuICAgIExBTkdVQUdFX1BPUlRVR1VFU0U6ICdwdCcsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQXJhYmljIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDpmL/mi4nkvK/or61cclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfQVJBQklDOiAnYXInLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5vcndlZ2lhbiBsYW5ndWFnZSBjb2RlXHJcbiAgICAgKiBAemgg6K+t6KiA5Luj56CBIC0g5oyq5aiB6K+tXHJcbiAgICAgKi9cclxuICAgIExBTkdVQUdFX05PUldFR0lBTjogJ25vJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQb2xpc2ggbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOazouWFsOivrVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9QT0xJU0g6ICdwbCcsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVHVya2lzaCBsYW5ndWFnZSBjb2RlXHJcbiAgICAgKiBAemgg6K+t6KiA5Luj56CBIC0g5Zyf6ICz5YW26K+tXHJcbiAgICAgKi9cclxuICAgIExBTkdVQUdFX1RVUktJU0g6ICd0cicsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVWtyYWluaWFuIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDkuYzlhYvlhbDor61cclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfVUtSQUlOSUFOOiAndWsnLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJvbWFuaWFuIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDnvZfpqazlsLzkupror61cclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfUk9NQU5JQU46ICdybycsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQnVsZ2FyaWFuIGxhbmd1YWdlIGNvZGVcclxuICAgICAqIEB6aCDor63oqIDku6PnoIEgLSDkv53liqDliKnkupror61cclxuICAgICAqL1xyXG4gICAgTEFOR1VBR0VfQlVMR0FSSUFOOiAnYmcnLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFVua25vd24gbGFuZ3VhZ2UgY29kZVxyXG4gICAgICogQHpoIOivreiogOS7o+eggSAtIOacquefpVxyXG4gICAgICovXHJcbiAgICBMQU5HVUFHRV9VTktOT1dOOiAndW5rbm93bicsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3BlcmF0aW5nIFN5c3RlbSAtIGlPU1xyXG4gICAgICogQHpoIOaTjeS9nOezu+e7nyAtIGlPU1xyXG4gICAgICovXHJcbiAgICBPU19JT1M6ICdpT1MnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3BlcmF0aW5nIFN5c3RlbSAtIEFuZHJvaWRcclxuICAgICAqIEB6aCDmk43kvZzns7vnu58gLSDlronljZNcclxuICAgICAqL1xyXG4gICAgT1NfQU5EUk9JRDogJ0FuZHJvaWQnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3BlcmF0aW5nIFN5c3RlbSAtIFdpbmRvd3NcclxuICAgICAqIEB6aCDmk43kvZzns7vnu58gLSBXaW5kb3dzXHJcbiAgICAgKi9cclxuICAgIE9TX1dJTkRPV1M6ICdXaW5kb3dzJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIE9wZXJhdGluZyBTeXN0ZW0gLSBMaW51eFxyXG4gICAgICogQHpoIOaTjeS9nOezu+e7nyAtIExpbnV4XHJcbiAgICAgKi9cclxuICAgIE9TX0xJTlVYOiAnTGludXgnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3BlcmF0aW5nIFN5c3RlbSAtIE1hYyBPUyBYXHJcbiAgICAgKiBAemgg5pON5L2c57O757ufIC0gTWFjIE9TIFhcclxuICAgICAqL1xyXG4gICAgT1NfT1NYOiAnT1MgWCcsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPcGVyYXRpbmcgU3lzdGVtIC0gVW5rbm93blxyXG4gICAgICogQHpoIOaTjeS9nOezu+e7nyAtIOacquefpVxyXG4gICAgICovXHJcbiAgICBPU19VTktOT1dOOiAnVW5rbm93bicsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxhdGZvcm0gLSBVbmtub3duXHJcbiAgICAgKiBAemgg5bmz5Y+wIC0g5pyq55+lXHJcbiAgICAgKiBAZGVmYXVsdCAtMVxyXG4gICAgICovXHJcbiAgICBVTktOT1dOOiAtMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gMzIgYml0IFdpbmRvd3MgYXBwbGljYXRpb25cclxuICAgICAqIEB6aCDlubPlj7AgLSAzMuS9jSBXaW5kb3dzIOWPr+aJp+ihjOeoi+W6j1xyXG4gICAgICogQGRlZmF1bHQgMFxyXG4gICAgICovXHJcbiAgICBXSU4zMjogMCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gTGludXhcclxuICAgICAqIEB6aCDlubPlj7AgLSBMaW51eFxyXG4gICAgICogQGRlZmF1bHQgMVxyXG4gICAgICovXHJcbiAgICBMSU5VWDogMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gTWFjIE9TIFggYXBwXHJcbiAgICAgKiBAemgg5bmz5Y+wIC0gTWFjIE9TIFgg5Y6f55Sf5bmz5Y+wXHJcbiAgICAgKiBAZGVmYXVsdCAyXHJcbiAgICAgKi9cclxuICAgIE1BQ09TOiAyLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxhdGZvcm0gLSBBbmRyb2lkIG5hdGl2ZSBhcHBcclxuICAgICAqIEB6aCDlubPlj7AgLSDlronljZPljp/nlJ/lubPlj7BcclxuICAgICAqIEBkZWZhdWx0IDNcclxuICAgICAqL1xyXG4gICAgQU5EUk9JRDogMyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gaVBob25lIG5hdGl2ZSBhcHBcclxuICAgICAqIEB6aCDlubPlj7AgLSBpUGhvbmUg5Y6f55Sf5bmz5Y+wXHJcbiAgICAgKiBAZGVmYXVsdCA0XHJcbiAgICAgKi9cclxuICAgIElQSE9ORTogNCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gaVBhZCBuYXRpdmUgYXBwXHJcbiAgICAgKiBAemgg5bmz5Y+wIC0gaVBhZCDljp/nlJ/lubPlj7BcclxuICAgICAqIEBkZWZhdWx0IDVcclxuICAgICAqL1xyXG4gICAgSVBBRDogNSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gQmxhY2tiZXJyeSBkZXZpY2VzXHJcbiAgICAgKiBAemgg5bmz5Y+wIC0g6buR6I6T6K6+5aSHXHJcbiAgICAgKiBAZGVmYXVsdCA2XHJcbiAgICAgKi9cclxuICAgIEJMQUNLQkVSUlk6IDYsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQbGF0Zm9ybSAtIE5BQ0xcclxuICAgICAqIEB6aCDlubPlj7AgLSBOQUNMXHJcbiAgICAgKiBAZGVmYXVsdCA3XHJcbiAgICAgKi9cclxuICAgIE5BQ0w6IDcsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQbGF0Zm9ybSAtIEVtc2NyaXB0ZW4gY29tcGlsZWQgcnVudGltZVxyXG4gICAgICogQHpoIOW5s+WPsCAtIOe8luivkeS4uiBFbXNjcmlwdGVuIOeahOi/kOihjOaXtueOr+Wig1xyXG4gICAgICogQGRlZmF1bHQgOFxyXG4gICAgICovXHJcbiAgICBFTVNDUklQVEVOOiA4LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxhdGZvcm0gLSBUaXplblxyXG4gICAgICogQHpoIOW5s+WPsCAtIFRpemVuXHJcbiAgICAgKiBAZGVmYXVsdCA5XHJcbiAgICAgKi9cclxuICAgIFRJWkVOOiA5LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxhdGZvcm0gLSBXaW5kb3dzIFJUXHJcbiAgICAgKiBAemgg5bmz5Y+wIC0gV2luZG93cyBSVFxyXG4gICAgICogQGRlZmF1bHQgMTBcclxuICAgICAqL1xyXG4gICAgV0lOUlQ6IDEwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxhdGZvcm0gLSBXaW5kb3dzIFBob25lIDggYXBwXHJcbiAgICAgKiBAemgg5bmz5Y+wIC0gV2luZG93cyBQaG9uZSA4IOWOn+eUn+W6lOeUqFxyXG4gICAgICogQGRlZmF1bHQgMTFcclxuICAgICAqL1xyXG4gICAgV1A4OiAxMSxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gTW9iaWxlIGJyb3dzZXJzXHJcbiAgICAgKiBAemgg5bmz5Y+wIC0g56e75Yqo5rWP6KeI5ZmoXHJcbiAgICAgKiBAZGVmYXVsdCAxMDBcclxuICAgICAqL1xyXG4gICAgTU9CSUxFX0JST1dTRVI6IDEwMCxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBsYXRmb3JtIC0gRGVza3RvcCBicm93c2Vyc1xyXG4gICAgICogQHpoIOW5s+WPsCAtIOahjOmdouerr+a1j+iniOWZqFxyXG4gICAgICogQGRlZmF1bHQgMTAxXHJcbiAgICAgKi9cclxuICAgIERFU0tUT1BfQlJPV1NFUjogMTAxLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxhdGZvcm0gLSBFZGl0b3IncyB3aW5kb3cgcHJvY2Vzc1xyXG4gICAgICogQHpoIOW5s+WPsCAtIOe8lui+keWZqOeql+WPo+i/m+eoi1xyXG4gICAgICogQGRlZmF1bHQgMTAyXHJcbiAgICAgKi9cclxuICAgIEVESVRPUl9QQUdFOiAxMDIsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQbGF0Zm9ybSAtIEVkaXRvcidzIG1haW4gcHJvY2Vzc1xyXG4gICAgICogQHpoIOW5s+WPsCAtIOe8lui+keWZqOS4u+i/m+eoi1xyXG4gICAgICogQGRlZmF1bHQgMTAzXHJcbiAgICAgKi9cclxuICAgIEVESVRPUl9DT1JFOiAxMDMsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQbGF0Zm9ybSAtIFdlQ2hhdCBNaW5pIEdhbWVcclxuICAgICAqIEB6aCDlubPlj7AgLSDlvq7kv6HlsI/muLjmiI9cclxuICAgICAqIEBkZWZhdWx0IDEwNFxyXG4gICAgICovXHJcbiAgICBXRUNIQVRfR0FNRTogMTA0LFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGxhdGZvcm0gLSBRUSBQbGF5IEdhbWVcclxuICAgICAqIEB6aCDlubPlj7AgLSBRUSBQbGF5XHJcbiAgICAgKiBAZGVmYXVsdCAxMDVcclxuICAgICAqL1xyXG4gICAgUVFfUExBWTogMTA1LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIFdlQ2hhdCBpbm5lciBicm93c2VyXHJcbiAgICAgKiBAemgg5rWP6KeI5Zmo57G75Z6LIC0g5b6u5L+h5YaF572u5rWP6KeI5ZmoXHJcbiAgICAgKiBAZGVmYXVsdCBcIndlY2hhdFwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9XRUNIQVQ6ICd3ZWNoYXQnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQnJvd3NlciBUeXBlIC0gQ29jb3MgUGxheSBHYW1lXHJcbiAgICAgKiBAemgg5rWP6KeI5Zmo57G75Z6LIC0gQ29jb3MgUGxheSDmuLjmiI9cclxuICAgICAqIEBkZWZhdWx0IFwiY29jb3NwbGF5XCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX0NPQ09TUExBWTogJ2NvY29zcGxheScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBodWF3ZWkgcXVpY2sgR2FtZVxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOWNjuS4uuW/q+a4uOaIj1xyXG4gICAgICogQGRlZmF1bHQgXCJodWF3ZWlxdWlja2dhbWVcIlxyXG4gICAgICovXHJcbiAgICBCUk9XU0VSX1RZUEVfSFVBV0VJX0dBTUU6ICdodWF3ZWlxdWlja2dhbWUnLFxyXG4gICAgICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIE9QUE8gbWluaSBHYW1lXHJcbiAgICAgKiBAemgg5rWP6KeI5Zmo57G75Z6LIC0gT1BQT+Wwj+a4uOaIj1xyXG4gICAgICogQGRlZmF1bHQgXCJvcHBvZ2FtZVwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9PUFBPX0dBTUU6ICdvcHBvZ2FtZScsXHJcbiAgICAvKipcclxuICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIHZpdm8gbWluaSBHYW1lXHJcbiAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSB2aXZv5bCP5ri45oiPXHJcbiAgICAqIEBkZWZhdWx0IFwidml2b2dhbWVcIlxyXG4gICAgKi9cclxuICAgQlJPV1NFUl9UWVBFX1ZJVk9fR0FNRTogJ3Zpdm9nYW1lJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIEFuZHJvaWQgQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOWuieWNk+a1j+iniOWZqFxyXG4gICAgICogQGRlZmF1bHQgXCJhbmRyb2lkYnJvd3NlclwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9BTkRST0lEOiAnYW5kcm9pZGJyb3dzZXInLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQnJvd3NlciBUeXBlIC0gSW50ZXJuZXQgRXhwbG9yZXJcclxuICAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSDlvq7ova8gSUVcclxuICAgICAqIEBkZWZhdWx0IFwiaWVcIlxyXG4gICAgICovXHJcbiAgICBCUk9XU0VSX1RZUEVfSUU6ICdpZScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBNaWNyb3NvZnQgRWRnZVxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOW+rui9ryBFZGdlXHJcbiAgICAgKiBAZGVmYXVsdCBcImVkZ2VcIlxyXG4gICAgICovXHJcbiAgICBCUk9XU0VSX1RZUEVfRURHRTogXCJlZGdlXCIsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBRUSBCcm93c2VyXHJcbiAgICAgKiBAemgg5rWP6KeI5Zmo57G75Z6LIC0gUVEg5rWP6KeI5ZmoXHJcbiAgICAgKiBAZGVmYXVsdCBcInFxYnJvd3NlclwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9RUTogJ3FxYnJvd3NlcicsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBNb2JpbGUgUVEgQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOaJi+acuiBRUSDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwibXFxYnJvd3NlclwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9NT0JJTEVfUVE6ICdtcXFicm93c2VyJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIFVDIEJyb3dzZXJcclxuICAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSBVQyDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwidWNicm93c2VyXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX1VDOiAndWNicm93c2VyJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIFRoaXJkIHBhcnR5IGludGVncmF0ZWQgVUMgYnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOesrOS4ieaWueW6lOeUqOS4rembhuaIkOeahCBVQyDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwidWNic1wiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9VQ0JTOiAndWNicycsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSAzNjAgQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIDM2MCDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwiMzYwYnJvd3NlclwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV8zNjA6ICczNjBicm93c2VyJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIEJhaWR1IEJveCBBcHBcclxuICAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSBCYWlkdSBCb3ggQXBwXHJcbiAgICAgKiBAZGVmYXVsdCBcImJhaWR1Ym94YXBwXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX0JBSURVX0FQUDogJ2JhaWR1Ym94YXBwJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIEJhaWR1IEJyb3dzZXJcclxuICAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSDnmb7luqbmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwiYmFpZHVicm93c2VyXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX0JBSURVOiAnYmFpZHVicm93c2VyJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIE1heHRob24gQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOWCsua4uOa1j+iniOWZqFxyXG4gICAgICogQGRlZmF1bHQgXCJtYXh0aG9uXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX01BWFRIT046ICdtYXh0aG9uJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIE9wZXJhIEJyb3dzZXJcclxuICAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSBPcGVyYSDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwib3BlcmFcIlxyXG4gICAgICovXHJcbiAgICBCUk9XU0VSX1RZUEVfT1BFUkE6ICdvcGVyYScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBPdXBlbmcgQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOasp+aci+a1j+iniOWZqFxyXG4gICAgICogQGRlZmF1bHQgXCJvdXBlbmdcIlxyXG4gICAgICovXHJcbiAgICBCUk9XU0VSX1RZUEVfT1VQRU5HOiAnb3VwZW5nJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuIEJyb3dzZXIgVHlwZSAtIE1JIFVJIEJyb3dzZXJcclxuICAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSBNSVVJIOWGhee9rua1j+iniOWZqFxyXG4gICAgICogQGRlZmF1bHQgXCJtaXVpYnJvd3NlclwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9NSVVJOiAnbWl1aWJyb3dzZXInLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQnJvd3NlciBUeXBlIC0gRmlyZWZveCBCcm93c2VyXHJcbiAgICAgKiBAemgg5rWP6KeI5Zmo57G75Z6LIC0gRmlyZWZveCDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwiZmlyZWZveFwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9GSVJFRk9YOiAnZmlyZWZveCcsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBTYWZhcmkgQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIFNhZmFyaSDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwic2FmYXJpXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX1NBRkFSSTogJ3NhZmFyaScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBDaHJvbWUgQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIENocm9tZSDmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwiY2hyb21lXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX0NIUk9NRTogJ2Nocm9tZScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBDaGVldGFoIEJyb3dzZXJcclxuICAgICAqIEB6aCDmtY/op4jlmajnsbvlnosgLSDnjI7osbnmtY/op4jlmahcclxuICAgICAqIEBkZWZhdWx0IFwibGllYmFvXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX0xJRUJBTzogJ2xpZWJhbycsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBRWm9uZSBJbm5lciBCcm93c2VyXHJcbiAgICAgKiBAemgg5rWP6KeI5Zmo57G75Z6LIC0gUVpvbmUg5YaF572u5rWP6KeI5ZmoXHJcbiAgICAgKiBAZGVmYXVsdCBcInF6b25lXCJcclxuICAgICAqL1xyXG4gICAgQlJPV1NFUl9UWVBFX1FaT05FOiAncXpvbmUnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQnJvd3NlciBUeXBlIC0gU29nb3UgQnJvd3NlclxyXG4gICAgICogQHpoIOa1j+iniOWZqOexu+WeiyAtIOaQnOeLl+a1j+iniOWZqFxyXG4gICAgICogQGRlZmF1bHQgXCJzb2dvdVwiXHJcbiAgICAgKi9cclxuICAgIEJST1dTRVJfVFlQRV9TT1VHT1U6ICdzb2dvdScsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBCcm93c2VyIFR5cGUgLSBVbmtub3duXHJcbiAgICAgKiBAemgg5rWP6KeI5Zmo57G75Z6LIC0g5pyq55+lXHJcbiAgICAgKiBAZGVmYXVsdCBcInVua25vd25cIlxyXG4gICAgICovXHJcbiAgICBCUk9XU0VSX1RZUEVfVU5LTk9XTjogJ3Vua25vd24nLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgdGhlIHJ1bm5pbmcgcGxhdGZvcm0gaXMgbmF0aXZlIGFwcFxyXG4gICAgICogQHpoIOaMh+ekuui/kOihjOW5s+WPsOaYr+WQpuaYr+WOn+eUn+W5s+WPsFxyXG4gICAgICovXHJcbiAgICBpc05hdGl2ZTogSlNCLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgdGhlIHJ1bm5pbmcgcGxhdGZvcm0gaXMgYnJvd3NlclxyXG4gICAgICogQHpoIOaMh+ekuui/kOihjOW5s+WPsOaYr+WQpuaYr+a1j+iniOWZqFxyXG4gICAgICovXHJcbiAgICBpc0Jyb3dzZXI6IHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHR5cGVvZiBkb2N1bWVudCA9PT0gJ29iamVjdCcgJiYgIU1JTklHQU1FICYmICFKU0IgJiYgIVJVTlRJTUVfQkFTRUQsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5kaWNhdGUgd2hldGhlciB0aGUgY3VycmVudCBydW5uaW5nIGNvbnRleHQgaXMgYSBtb2JpbGUgc3lzdGVtXHJcbiAgICAgKiBAemgg5oyH56S65b2T5YmN6L+Q6KGM5bmz5Y+w5piv5ZCm5piv56e75Yqo56uv5bmz5Y+wXHJcbiAgICAgKiBAZGVmYXVsdCBmYWxzZVxyXG4gICAgICovXHJcbiAgICBpc01vYmlsZTogZmFsc2UsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2hldGhlciB0aGUgZW5kaWFubmVzcyBvZiBjdXJyZW50IHBsYXRmb3JtIGlzIGxpdHRsZSBlbmRpYW5cclxuICAgICAqIEB6aCDlvZPliY3lubPlj7DlrZfoioLpobrluo/mmK/lkKbmmK/lsI/nq6/luo9cclxuICAgICAqL1xyXG4gICAgaXNMaXR0bGVFbmRpYW46ICgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xyXG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEludDE2KDAsIDI1NiwgdHJ1ZSk7XHJcbiAgICAgICAgLy8gSW50MTZBcnJheSB1c2VzIHRoZSBwbGF0Zm9ybSdzIGVuZGlhbm5lc3MuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnQxNkFycmF5KGJ1ZmZlcilbMF0gPT09IDI1NjtcclxuICAgIH0pKCksXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHJ1bm5pbmcgcGxhdGZvcm1cclxuICAgICAqIEB6aCDlvZPliY3ov5DooYzlubPlj7DmiJbnjq/looNcclxuICAgICAqIEBkZWZhdWx0IHt7c3lzLlVOS05PV059fVxyXG4gICAgICovXHJcbiAgICBwbGF0Zm9ybTogLTEsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5kaWNhdGUgdGhlIGN1cnJlbnQgbGFuZ3VhZ2Ugb2YgdGhlIHJ1bm5pbmcgc3lzdGVtXHJcbiAgICAgKiBAemgg5oyH56S65b2T5YmN6L+Q6KGM546v5aKD55qE6K+t6KiAXHJcbiAgICAgKiBAZGVmYXVsdCB7e3N5cy5MQU5HVUFHRV9VTktOT1dOfX1cclxuICAgICAqL1xyXG4gICAgbGFuZ3VhZ2U6ICd1bmtub3duJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbmRpY2F0ZSB0aGUgcnVubmluZyBvcyBuYW1lXHJcbiAgICAgKiBAemgg5oyH56S65b2T5YmN6L+Q6KGM57O757ufXHJcbiAgICAgKi9cclxuICAgIG9zOiAnVW5rbm93bicsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5kaWNhdGUgdGhlIHJ1bm5pbmcgb3MgdmVyc2lvbiBzdHJpbmdcclxuICAgICAqIEB6aCDmjIfnpLrlvZPliY3ov5DooYzns7vnu5/niYjmnKzlrZfnrKbkuLJcclxuICAgICAqL1xyXG4gICAgb3NWZXJzaW9uOiAnJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbmRpY2F0ZSB0aGUgcnVubmluZyBvcyBtYWluIHZlcnNpb25cclxuICAgICAqIEB6aCDmjIfnpLrlvZPliY3ns7vnu5/kuLvniYjmnKxcclxuICAgICAqL1xyXG4gICAgb3NNYWluVmVyc2lvbjogMCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbmRpY2F0ZSB0aGUgcnVubmluZyBicm93c2VyIHR5cGVcclxuICAgICAqIEB6aCDmjIfnpLrlvZPliY3ov5DooYznmoTmtY/op4jlmajnsbvlnotcclxuICAgICAqL1xyXG4gICAgYnJvd3NlclR5cGU6ICd1bmtub3duJyxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbmRpY2F0ZSB0aGUgcnVubmluZyBicm93c2VyIHZlcnNpb25cclxuICAgICAqIEB6aCDmjIfnpLrlvZPliY3ov5DooYznmoTmtY/op4jlmajniYjmnKxcclxuICAgICAqL1xyXG4gICAgYnJvd3NlclZlcnNpb246ICcnLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEluZGljYXRlIHRoZSByZWFsIHBpeGVsIHJlc29sdXRpb24gb2YgdGhlIHdob2xlIGdhbWUgd2luZG93XHJcbiAgICAgKiBAemgg5oyH56S65ri45oiP56qX5Y+j55qE5YOP57Sg5YiG6L6o546HXHJcbiAgICAgKi9cclxuICAgIHdpbmRvd1BpeGVsUmVzb2x1dGlvbjogbnVsbCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgY2FwYWJpbGl0aWVzIG9mIHRoZSBjdXJyZW50IHBsYXRmb3JtXHJcbiAgICAgKiBAemgg5b2T5YmN5bmz5Y+w55qE5Yqf6IO95Y+v55So5oCnXHJcbiAgICAgKi9cclxuICAgIGNhcGFiaWxpdGllczogbnVsbCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJdCBpcyBhIGxvY2FsIHN0b3JhZ2UgY29tcG9uZW50IGJhc2VkIG9uIEhUTUw1IGxvY2FsU3RvcmFnZSBBUEksIG9uIHdlYiBwbGF0Zm9ybSwgaXQncyBlcXVhbCB0byB3aW5kb3cubG9jYWxTdG9yYWdlXHJcbiAgICAgKiBAemggSFRNTDUg5qCH5YeG5Lit55qEIGxvY2FsU3RvcmFnZSDnmoTmnKzlnLDlrZjlgqjlip/og73vvIzlnKggV2ViIOerr+etieS7t+S6jiB3aW5kb3cubG9jYWxTdG9yYWdlXHJcbiAgICAgKi9cclxuICAgIGxvY2FsU3RvcmFnZTogbnVsbCxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEF1ZGlvIHN1cHBvcnQgaW4gdGhlIGJyb3dzZXJcclxuICAgICAqXHJcbiAgICAgKiBNVUxUSV9DSEFOTkVMICAgICAgICA6IE11bHRpcGxlIGF1ZGlvIHdoaWxlIHBsYXlpbmcgLSBJZiBpdCBkb2Vzbid0LCB5b3UgY2FuIG9ubHkgcGxheSBiYWNrZ3JvdW5kIG11c2ljXHJcbiAgICAgKiBXRUJfQVVESU8gICAgICAgICAgICA6IFN1cHBvcnQgZm9yIFdlYkF1ZGlvIC0gU3VwcG9ydCBXM0MgV2ViQXVkaW8gc3RhbmRhcmRzLCBhbGwgb2YgdGhlIGF1ZGlvIGNhbiBiZSBwbGF5ZWRcclxuICAgICAqIEFVVE9QTEFZICAgICAgICAgICAgIDogU3VwcG9ydHMgYXV0by1wbGF5IGF1ZGlvIC0gaWYgRG9u4oCYdCBzdXBwb3J0IGl0LCBPbiBhIHRvdWNoIGRldGVjdGluZyBiYWNrZ3JvdW5kIG11c2ljIGNhbnZhcywgYW5kIHRoZW4gcmVwbGF5XHJcbiAgICAgKiBSRVBMQVlfQUZURVJfVE9VQ0ggICA6IFRoZSBmaXJzdCBtdXNpYyB3aWxsIGZhaWwsIG11c3QgYmUgcmVwbGF5IGFmdGVyIHRvdWNoc3RhcnRcclxuICAgICAqIFVTRV9FTVBUSUVEX0VWRU5UICAgIDogV2hldGhlciB0byB1c2UgdGhlIGVtcHRpZWQgZXZlbnQgdG8gcmVwbGFjZSBsb2FkIGNhbGxiYWNrXHJcbiAgICAgKiBERUxBWV9DUkVBVEVfQ1RYICAgICA6IGRlbGF5IGNyZWF0ZWQgdGhlIGNvbnRleHQgb2JqZWN0IC0gb25seSB3ZWJBdWRpb1xyXG4gICAgICogTkVFRF9NQU5VQUxfTE9PUCAgICAgOiBsb29wIGF0dHJpYnV0ZSBmYWlsdXJlLCBuZWVkIHRvIHBlcmZvcm0gbG9vcCBtYW51YWxseVxyXG4gICAgICpcclxuICAgICAqIE1heSBiZSBtb2RpZmljYXRpb25zIGZvciBhIGZldyBicm93c2VyIHZlcnNpb25cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9fYXVkaW9TdXBwb3J0OiBudWxsLFxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZpZGVvIHN1cHBvcnQgaW4gdGhlIGJyb3dzZXJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIF9fdmlkZW9TdXBwb3J0OiBudWxsLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCB0aGUgbmV0d29yayB0eXBlIG9mIGN1cnJlbnQgZGV2aWNlLCByZXR1cm4gYHN5cy5OZXR3b3JrVHlwZS5MQU5gIGlmIGZhaWx1cmUuXHJcbiAgICAgKiBAemgg6I635Y+W5b2T5YmN6K6+5aSH55qE572R57uc57G75Z6LLCDlpoLmnpznvZHnu5znsbvlnovml6Dms5Xojrflj5bvvIzpu5jorqTlsIbov5Tlm54gYHN5cy5OZXR3b3JrVHlwZS5MQU5gXHJcbiAgICAgKi9cclxuICAgIGdldE5ldHdvcmtUeXBlICgpOiBOZXR3b3JrVHlwZSB7XHJcbiAgICAgICAgLy8gVE9ETzogbmVlZCB0byBpbXBsZW1lbnQgdGhpcyBmb3IgbW9iaWxlIHBob25lcy5cclxuICAgICAgICByZXR1cm4gTmV0d29ya1R5cGUuTEFOO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgdGhlIGJhdHRlcnkgbGV2ZWwgb2YgY3VycmVudCBkZXZpY2UsIHJldHVybiAxLjAgaWYgZmFpbHVyZS5cclxuICAgICAqIEB6aCDojrflj5blvZPliY3orr7lpIfnmoTnlLXmsaDnlLXph4/vvIzlpoLmnpznlLXph4/ml6Dms5Xojrflj5bvvIzpu5jorqTlsIbov5Tlm54gMVxyXG4gICAgICogQHJldHVybiAtIDAuMCB+IDEuMFxyXG4gICAgICovXHJcbiAgICBnZXRCYXR0ZXJ5TGV2ZWwgKCk6IG51bWJlciB7XHJcbiAgICAgICAgLy8gVE9ETzogbmVlZCB0byBpbXBsZW1lbnQgdGhpcyBmb3IgbW9iaWxlIHBob25lcy5cclxuICAgICAgICByZXR1cm4gMS4wO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBGb3JjZXMgdGhlIGdhcmJhZ2UgY29sbGVjdGlvbiwgb25seSBhdmFpbGFibGUgaW4gbmF0aXZlIHBsYXRmb3Jtc1xyXG4gICAgICogQHpoIOW8uuWItui/m+ihjCBKUyDlhoXlrZjlnoPlnL7lm57mlLbvvIzlsL3lnKjljp/nlJ/lubPlj7DmnInmlYhcclxuICAgICAqL1xyXG4gICAgZ2FyYmFnZUNvbGxlY3QgKCkge1xyXG4gICAgICAgIC8vIE4vQSBpbiB3ZWJcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaXMgdmFsaWQsXHJcbiAgICAgKiBJbiB3ZWIgZW5naW5lLCBpdCB3aWxsIHJldHVybiB0cnVlIGlmIHRoZSBvYmplY3QgZXhpc3RcclxuICAgICAqIEluIG5hdGl2ZSBlbmdpbmUsIGl0IHdpbGwgcmV0dXJuIHRydWUgaWYgdGhlIEpTIG9iamVjdCBhbmQgdGhlIGNvcnJlc3BvbmQgbmF0aXZlIG9iamVjdCBhcmUgYm90aCB2YWxpZFxyXG4gICAgICogQHpoIOajgOafpeS4gOS4quWvueixoeaYr+WQpumdnuepuuaIluWcqOWOn+eUn+W5s+WPsOacieaViO+8jFxyXG4gICAgICog5ZyoIFdlYiDlubPlj7DvvIzlj6ropoHlr7nosaHpnZ7nqbrmiJbpnZ4gVW5kZWZpbmVkIOWwseS8mui/lOWbniB0cnVl77yM5Zyo5Y6f55Sf5bmz5Y+w77yM5oiR5Lus5Lya5qOA5p+l5b2T5YmNIEpTIOWvueixoeWSjOWFtue7keWumueahOWOn+eUn+WvueixoeaYr+WQpumDveacieaViFxyXG4gICAgICogQHBhcmFtIG9iaiBUaGUgb2JqZWN0IHRvIGJlIGNoZWNrZWRcclxuICAgICAqL1xyXG4gICAgaXNPYmplY3RWYWxpZCAob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAob2JqID09PSBudWxsIHx8IG9iaiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRHVtcCBzeXN0ZW0gaW5mb3JtYXRpb25zXHJcbiAgICAgKiBAemgg5Zyo5o6n5Yi25Y+w5omT5Y2w5b2T5YmN55qE5Li76KaB57O757uf5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIGR1bXAgKCkge1xyXG4gICAgICAgIGxldCBzdHIgPSAnJztcclxuICAgICAgICBzdHIgKz0gJ2lzTW9iaWxlIDogJyArIHRoaXMuaXNNb2JpbGUgKyAnXFxyXFxuJztcclxuICAgICAgICBzdHIgKz0gJ2xhbmd1YWdlIDogJyArIHRoaXMubGFuZ3VhZ2UgKyAnXFxyXFxuJztcclxuICAgICAgICBzdHIgKz0gJ2Jyb3dzZXJUeXBlIDogJyArIHRoaXMuYnJvd3NlclR5cGUgKyAnXFxyXFxuJztcclxuICAgICAgICBzdHIgKz0gJ2Jyb3dzZXJWZXJzaW9uIDogJyArIHRoaXMuYnJvd3NlclZlcnNpb24gKyAnXFxyXFxuJztcclxuICAgICAgICBzdHIgKz0gJ2NhcGFiaWxpdGllcyA6ICcgKyBKU09OLnN0cmluZ2lmeSh0aGlzLmNhcGFiaWxpdGllcykgKyAnXFxyXFxuJztcclxuICAgICAgICBzdHIgKz0gJ29zIDogJyArIHRoaXMub3MgKyAnXFxyXFxuJztcclxuICAgICAgICBzdHIgKz0gJ29zVmVyc2lvbiA6ICcgKyB0aGlzLm9zVmVyc2lvbiArICdcXHJcXG4nO1xyXG4gICAgICAgIHN0ciArPSAncGxhdGZvcm0gOiAnICsgdGhpcy5wbGF0Zm9ybSArICdcXHJcXG4nO1xyXG4gICAgICAgIHN0ciArPSAnVXNpbmcgJyArIChsZWdhY3lDQy5nYW1lLnJlbmRlclR5cGUgPT09IGxlZ2FjeUNDLmdhbWUuUkVOREVSX1RZUEVfV0VCR0wgPyAnV0VCR0wnIDogJ0NBTlZBUycpICsgJyByZW5kZXJlci4nICsgJ1xcclxcbic7XHJcbiAgICAgICAgbG9nKHN0cik7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRyeSB0byBvcGVuIGEgdXJsIGluIGJyb3dzZXIsIG1heSBub3Qgd29yayBpbiBzb21lIHBsYXRmb3Jtc1xyXG4gICAgICogQHpoIOWwneivleaJk+W8gOS4gOS4qiB3ZWIg6aG16Z2i77yM5bm26Z2e5Zyo5omA5pyJ5bmz5Y+w6YO95pyJ5pWIXHJcbiAgICAgKi9cclxuICAgIG9wZW5VUkwgKHVybCkge1xyXG4gICAgICAgIGlmIChKU0IgfHwgUlVOVElNRV9CQVNFRCkge1xyXG4gICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgIGpzYi5vcGVuVVJMKHVybCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB3aW5kb3cub3Blbih1cmwpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IHRoZSBjdXJyZW50IHRpbWUgaW4gbWlsbGlzZWNvbmRzXHJcbiAgICAgKiBAemgg6I635Y+W5b2T5YmN5pe26Ze077yI5q+r56eS5Li65Y2V5L2N77yJXHJcbiAgICAgKi9cclxuICAgIG5vdyAoKSB7XHJcbiAgICAgICAgaWYgKERhdGUubm93KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBEYXRlLm5vdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICsobmV3IERhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEdW1wcyByb290ZWQgb2JqZWN0cywgb25seSBhdmFpbGFibGUgaW4gbmF0aXZlIHBsYXRmb3Jtc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgZHVtcFJvb3QgKCkge1xyXG4gICAgICAgIC8vIE4vQSBpbiB3ZWJcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXN0YXJ0IHRoZSBKUyBWTSwgb25seSBhdmFpbGFibGUgaW4gbmF0aXZlIHBsYXRmb3Jtc1xyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcmVzdGFydFZNICgpIHtcclxuICAgICAgICAvLyBOL0EgaW4gd2ViXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xlYW4gYSBzY3JpcHQgaW4gdGhlIEpTIFZNLCBvbmx5IGF2YWlsYWJsZSBpbiBuYXRpdmUgcGxhdGZvcm1zXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjbGVhblNjcmlwdCAoanNmaWxlKSB7XHJcbiAgICAgICAgLy8gTi9BIGluIHdlYlxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmV0dXJucyB0aGUgc2FmZSBhcmVhIG9mIHRoZSBzY3JlZW4uIElmIHRoZSBzY3JlZW4gaXMgbm90IG5vdGNoZWQsIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiB3aWxsIGJlIHJldHVybmVkIGJ5IGRlZmF1bHQuXHJcbiAgICAgKiBPbmx5IHN1cHBvcnRlZCBvbiBBbmRyb2lkLCBpT1MgYW5kIFdlQ2hhdCBNaW5pIEdhbWUgcGxhdGZvcm0uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi/lOWbnuaJi+acuuWxj+W5leWuieWFqOWMuuWfn++8jOWmguaenOS4jeaYr+W8guW9ouWxj+Wwhum7mOiupOi/lOWbnuiuvuiuoeWIhui+qOeOh+WwuuWvuOOAguebruWJjeWPquaUr+aMgeWuieWNk+OAgWlPUyDljp/nlJ/lubPlj7Dlkozlvq7kv6HlsI/muLjmiI/lubPlj7DjgIJcclxuICAgICAqIEBtZXRob2QgZ2V0U2FmZUFyZWFSZWN0XHJcbiAgICAgKiBAcmV0dXJuIHtSZWN0fVxyXG4gICAgICovXHJcbiAgICBnZXRTYWZlQXJlYVJlY3QgKCkge1xyXG4gICAgICAgIGxldCB2aXNpYmxlU2l6ZSA9IGxlZ2FjeUNDLnZpZXcuZ2V0VmlzaWJsZVNpemUoKTtcclxuICAgICAgICByZXR1cm4gbGVnYWN5Q0MucmVjdCgwLCAwLCB2aXNpYmxlU2l6ZS53aWR0aCwgdmlzaWJsZVNpemUuaGVpZ2h0KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vID09PT09PT09PT09PT0gUGxhdGZvcm0gQWRhcHRhdGlvbiA9PT09PT09PT09PT09PVxyXG5cclxuaWYgKF9nbG9iYWwuX19nbG9iYWxBZGFwdGVyICYmIF9nbG9iYWwuX19nbG9iYWxBZGFwdGVyLmFkYXB0U3lzKSB7XHJcbiAgICAvLyBpbml0IHN5cyBpbmZvIGluIGFkYXB0ZXJcclxuICAgIF9nbG9iYWwuX19nbG9iYWxBZGFwdGVyLmFkYXB0U3lzKHN5cyk7XHJcbn1cclxuLy8gVE9ETzogbWFpbiBwcm9jZXNzIGZsYWdcclxuLy8gZWxzZSBpZiAoRURJVE9SKSB7XHJcbi8vICAgICBzeXMuaXNNb2JpbGUgPSBmYWxzZTtcclxuLy8gICAgIHN5cy5wbGF0Zm9ybSA9IHN5cy5FRElUT1JfQ09SRTtcclxuLy8gICAgIHN5cy5sYW5ndWFnZSA9IHN5cy5MQU5HVUFHRV9VTktOT1dOO1xyXG4vLyAgICAgc3lzLm9zID0gKHtcclxuLy8gICAgICAgICBkYXJ3aW46IHN5cy5PU19PU1gsXHJcbi8vICAgICAgICAgd2luMzI6IHN5cy5PU19XSU5ET1dTLFxyXG4vLyAgICAgICAgIGxpbnV4OiBzeXMuT1NfTElOVVgsXHJcbi8vICAgICAvLyBAdHMtaWdub3JlXHJcbi8vICAgICB9KVtwcm9jZXNzLnBsYXRmb3JtXSB8fCBzeXMuT1NfVU5LTk9XTjtcclxuLy8gICAgIHN5cy5icm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfVU5LTk9XTjtcclxuLy8gICAgIHN5cy5icm93c2VyVmVyc2lvbiA9ICcnO1xyXG4vLyAgICAgc3lzLndpbmRvd1BpeGVsUmVzb2x1dGlvbiA9IHtcclxuLy8gICAgICAgICB3aWR0aDogMCxcclxuLy8gICAgICAgICBoZWlnaHQ6IDAsXHJcbi8vICAgICB9O1xyXG4vLyAgICAgc3lzLl9fYXVkaW9TdXBwb3J0ID0ge307XHJcbi8vIH1cclxuZWxzZSBpZiAoSlNCIHx8IFJVTlRJTUVfQkFTRUQpIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGNvbnN0IHBsYXRmb3JtID0gc3lzLnBsYXRmb3JtID0gX19nZXRQbGF0Zm9ybSgpO1xyXG4gICAgc3lzLmlzTW9iaWxlID0gKHBsYXRmb3JtID09PSBzeXMuQU5EUk9JRCB8fFxyXG4gICAgICAgIHBsYXRmb3JtID09PSBzeXMuSVBBRCB8fFxyXG4gICAgICAgIHBsYXRmb3JtID09PSBzeXMuSVBIT05FIHx8XHJcbiAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5XUDggfHxcclxuICAgICAgICBwbGF0Zm9ybSA9PT0gc3lzLlRJWkVOIHx8XHJcbiAgICAgICAgcGxhdGZvcm0gPT09IHN5cy5CTEFDS0JFUlJZKTtcclxuXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBzeXMub3MgPSBfX2dldE9TKCk7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBzeXMubGFuZ3VhZ2UgPSBfX2dldEN1cnJlbnRMYW5ndWFnZSgpO1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgc3lzLm9zVmVyc2lvbiA9IF9fZ2V0T1NWZXJzaW9uKCk7XHJcbiAgICBzeXMub3NNYWluVmVyc2lvbiA9IHBhcnNlSW50KHN5cy5vc1ZlcnNpb24pO1xyXG4gICAgc3lzLmJyb3dzZXJUeXBlID0gc3lzLkJST1dTRVJfVFlQRV9VTktOT1dOO1xyXG4gICAgc3lzLmJyb3dzZXJWZXJzaW9uID0gJyc7XHJcblxyXG4gICAgY29uc3QgdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xyXG4gICAgY29uc3QgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgIGNvbnN0IHJhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcclxuICAgIHN5cy53aW5kb3dQaXhlbFJlc29sdXRpb24gPSB7XHJcbiAgICAgICAgd2lkdGg6IHJhdGlvICogdyxcclxuICAgICAgICBoZWlnaHQ6IHJhdGlvICogaCxcclxuICAgIH07XHJcblxyXG4gICAgc3lzLmxvY2FsU3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2U7XHJcblxyXG4gICAgbGV0IGNhcGFiaWxpdGllcztcclxuICAgIGNhcGFiaWxpdGllcyA9IHN5cy5jYXBhYmlsaXRpZXMgPSB7XHJcbiAgICAgICAgY2FudmFzOiBmYWxzZSxcclxuICAgICAgICBvcGVuZ2w6IHRydWUsXHJcbiAgICAgICAgd2VicDogdHJ1ZSxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKHN5cy5pc01vYmlsZSkge1xyXG4gICAgICAgIGNhcGFiaWxpdGllcy5hY2NlbGVyb21ldGVyID0gdHJ1ZTtcclxuICAgICAgICBjYXBhYmlsaXRpZXMudG91Y2hlcyA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIGRlc2t0b3BcclxuICAgICAgICBjYXBhYmlsaXRpZXMua2V5Ym9hcmQgPSB0cnVlO1xyXG4gICAgICAgIGNhcGFiaWxpdGllcy5tb3VzZSA9IHRydWU7XHJcbiAgICAgICAgY2FwYWJpbGl0aWVzLnRvdWNoZXMgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzeXMuX19hdWRpb1N1cHBvcnQgPSB7XHJcbiAgICAgICAgT05MWV9PTkU6IGZhbHNlLFxyXG4gICAgICAgIFdFQl9BVURJTzogZmFsc2UsXHJcbiAgICAgICAgREVMQVlfQ1JFQVRFX0NUWDogZmFsc2UsXHJcbiAgICAgICAgZm9ybWF0OiBbJy5tcDMnXSxcclxuICAgIH07XHJcblxyXG4gICAgc3lzLl9fdmlkZW9TdXBwb3J0ID0ge1xyXG4gICAgICAgIGZvcm1hdDogWycubXA0J11cclxuICAgIH1cclxuXHJcbn1cclxuZWxzZSB7XHJcbiAgICAvLyBicm93c2VyIG9yIHJ1bnRpbWVcclxuICAgIGNvbnN0IHdpbiA9IHdpbmRvdywgbmF2ID0gd2luLm5hdmlnYXRvciwgZG9jID0gZG9jdW1lbnQsIGRvY0VsZSA9IGRvYy5kb2N1bWVudEVsZW1lbnQ7XHJcbiAgICBjb25zdCB1YSA9IG5hdi51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgc3lzLmlzTW9iaWxlID0gZmFsc2U7XHJcbiAgICAgICAgc3lzLnBsYXRmb3JtID0gc3lzLkVESVRPUl9QQUdFO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgc3lzLmlzTW9iaWxlID0gL21vYmlsZXxhbmRyb2lkfGlwaG9uZXxpcGFkLy50ZXN0KHVhKTtcclxuICAgICAgICBzeXMucGxhdGZvcm0gPSBzeXMuaXNNb2JpbGUgPyBzeXMuTU9CSUxFX0JST1dTRVIgOiBzeXMuREVTS1RPUF9CUk9XU0VSO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjdXJyTGFuZ3VhZ2UgPSBuYXYubGFuZ3VhZ2U7XHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBjdXJyTGFuZ3VhZ2UgPSBjdXJyTGFuZ3VhZ2UgPyBjdXJyTGFuZ3VhZ2UgOiBuYXYuYnJvd3Nlckxhbmd1YWdlO1xyXG4gICAgY3Vyckxhbmd1YWdlID0gY3Vyckxhbmd1YWdlID8gY3Vyckxhbmd1YWdlLnNwbGl0KCctJylbMF0gOiBzeXMuTEFOR1VBR0VfRU5HTElTSDtcclxuICAgIHN5cy5sYW5ndWFnZSA9IGN1cnJMYW5ndWFnZTtcclxuXHJcbiAgICAvLyBHZXQgdGhlIG9zIG9mIHN5c3RlbVxyXG4gICAgbGV0IGlzQW5kcm9pZCA9IGZhbHNlLCBpT1MgPSBmYWxzZSwgb3NWZXJzaW9uID0gJycsIG9zTWFqb3JWZXJzaW9uID0gMDtcclxuICAgIGxldCB1YVJlc3VsdCA9IC9hbmRyb2lkXFxzKihcXGQrKD86XFwuXFxkKykqKS9pLmV4ZWModWEpIHx8IC9hbmRyb2lkXFxzKihcXGQrKD86XFwuXFxkKykqKS9pLmV4ZWMobmF2LnBsYXRmb3JtKTtcclxuICAgIGlmICh1YVJlc3VsdCkge1xyXG4gICAgICAgIGlzQW5kcm9pZCA9IHRydWU7XHJcbiAgICAgICAgb3NWZXJzaW9uID0gdWFSZXN1bHRbMV0gfHwgJyc7XHJcbiAgICAgICAgb3NNYWpvclZlcnNpb24gPSBwYXJzZUludChvc1ZlcnNpb24pIHx8IDA7XHJcbiAgICB9XHJcbiAgICB1YVJlc3VsdCA9IC8oaVBhZHxpUGhvbmV8aVBvZCkuKk9TICgoXFxkK18/KXsyLDN9KS9pLmV4ZWModWEpO1xyXG4gICAgaWYgKHVhUmVzdWx0KSB7XHJcbiAgICAgICAgaU9TID0gdHJ1ZTtcclxuICAgICAgICBvc1ZlcnNpb24gPSB1YVJlc3VsdFsyXSB8fCAnJztcclxuICAgICAgICBvc01ham9yVmVyc2lvbiA9IHBhcnNlSW50KG9zVmVyc2lvbikgfHwgMDtcclxuICAgIH1cclxuICAgIC8vIHJlZmVyIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2Nvcy1jcmVhdG9yL2VuZ2luZS9wdWxsLzU1NDIgLCB0aGFua3MgZm9yIGNvbnRyaWJpdGlvbiBmcm9tIEBrcmFwbmlra2tcclxuICAgIC8vIGlwYWQgT1MgMTMgc2FmYXJpIGlkZW50aWZpZXMgaXRzZWxmIGFzIFwiTW96aWxsYS81LjAgKE1hY2ludG9zaDsgSW50ZWwgTWFjIE9TIFggMTBfMTUpIEFwcGxlV2ViS2l0LzYwNS4xLjE1IChLSFRNTCwgbGlrZSBHZWNrbylcIlxyXG4gICAgLy8gc28gdXNlIG1heFRvdWNoUG9pbnRzIHRvIGNoZWNrIHdoZXRoZXIgaXQncyBkZXNrdG9wIHNhZmFyaSBvciBub3QuXHJcbiAgICAvLyByZWZlcmVuY2U6IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzU4MDE5NDYzL2hvdy10by1kZXRlY3QtZGV2aWNlLW5hbWUtaW4tc2FmYXJpLW9uLWlvcy0xMy13aGlsZS1pdC1kb2VzbnQtc2hvdy10aGUtY29ycmVjdFxyXG4gICAgLy8gRklYTUU6IHNob3VsZCByZW1vdmUgaXQgd2hlbiB0b3VjaC1lbmFibGVkIG1hYyBhcmUgYXZhaWxhYmxlXHJcbiAgICAvLyBUT0RPOiBkdWUgdG8gY29tcGF0aWJpbGl0eSBpc3N1ZXMsIGl0IGlzIHN0aWxsIGRldGVybWluZWQgdG8gYmUgaW9zLCBhbmQgYSBuZXcgb3BlcmF0aW5nIHN5c3RlbSB0eXBlIGlwYWRvcyBtYXkgYmUgYWRkZWQgbGF0ZXLvvJ9cclxuICAgIGVsc2UgaWYgKC8oaVBob25lfGlQYWR8aVBvZCkvLmV4ZWMobmF2LnBsYXRmb3JtKSB8fCAobmF2LnBsYXRmb3JtID09PSAnTWFjSW50ZWwnICYmIG5hdi5tYXhUb3VjaFBvaW50cyAmJiBuYXYubWF4VG91Y2hQb2ludHMgPiAxKSkge1xyXG4gICAgICAgIGlPUyA9IHRydWU7XHJcbiAgICAgICAgb3NWZXJzaW9uID0gJyc7XHJcbiAgICAgICAgb3NNYWpvclZlcnNpb24gPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBvc05hbWUgPSBzeXMuT1NfVU5LTk9XTjtcclxuICAgIGlmIChuYXYuYXBwVmVyc2lvbi5pbmRleE9mKCdXaW4nKSAhPT0gLTEpIHsgb3NOYW1lID0gc3lzLk9TX1dJTkRPV1M7IH1cclxuICAgIGVsc2UgaWYgKGlPUykgeyBvc05hbWUgPSBzeXMuT1NfSU9TOyB9XHJcbiAgICBlbHNlIGlmIChuYXYuYXBwVmVyc2lvbi5pbmRleE9mKCdNYWMnKSAhPT0gLTEpIHsgb3NOYW1lID0gc3lzLk9TX09TWDsgfVxyXG4gICAgZWxzZSBpZiAobmF2LmFwcFZlcnNpb24uaW5kZXhPZignWDExJykgIT09IC0xICYmIG5hdi5hcHBWZXJzaW9uLmluZGV4T2YoJ0xpbnV4JykgPT09IC0xKSB7IG9zTmFtZSA9IHN5cy5PU19VTklYOyB9XHJcbiAgICBlbHNlIGlmIChpc0FuZHJvaWQpIHsgb3NOYW1lID0gc3lzLk9TX0FORFJPSUQ7IH1cclxuICAgIGVsc2UgaWYgKG5hdi5hcHBWZXJzaW9uLmluZGV4T2YoJ0xpbnV4JykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ3VidW50dScpICE9PSAtMSkgeyBvc05hbWUgPSBzeXMuT1NfTElOVVg7IH1cclxuXHJcbiAgICBzeXMub3MgPSBvc05hbWU7XHJcbiAgICBzeXMub3NWZXJzaW9uID0gb3NWZXJzaW9uO1xyXG4gICAgc3lzLm9zTWFpblZlcnNpb24gPSBvc01ham9yVmVyc2lvbjtcclxuXHJcbiAgICBzeXMuYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX1VOS05PV047XHJcbiAgICAvKiBEZXRlcm1pbmUgdGhlIGJyb3dzZXIgdHlwZSAqL1xyXG4gICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCB0eXBlUmVnMSA9IC9tcXFicm93c2VyfG1pY3JvbWVzc2VuZ2VyfHFxfHNvZ291fHF6b25lfGxpZWJhb3xtYXh0aG9ufHVjYnN8MzYwIGFwaG9uZXwzNjBicm93c2VyfGJhaWR1Ym94YXBwfGJhaWR1YnJvd3NlcnxtYXh0aG9ufG14YnJvd3NlcnxtaXVpYnJvd3Nlci9pO1xyXG4gICAgICAgIGNvbnN0IHR5cGVSZWcyID0gL3FxYnJvd3Nlcnx1Y2Jyb3dzZXJ8ZWRnZS9pO1xyXG4gICAgICAgIGNvbnN0IHR5cGVSZWczID0gL2Nocm9tZXxzYWZhcml8ZmlyZWZveHx0cmlkZW50fG9wZXJhfG9wclxcL3xvdXBlbmcvaTtcclxuICAgICAgICBsZXQgYnJvd3NlclR5cGVzID0gdHlwZVJlZzEuZXhlYyh1YSk7XHJcbiAgICAgICAgaWYgKCFicm93c2VyVHlwZXMpIHsgYnJvd3NlclR5cGVzID0gdHlwZVJlZzIuZXhlYyh1YSk7IH1cclxuICAgICAgICBpZiAoIWJyb3dzZXJUeXBlcykgeyBicm93c2VyVHlwZXMgPSB0eXBlUmVnMy5leGVjKHVhKTsgfVxyXG5cclxuICAgICAgICBsZXQgYnJvd3NlclR5cGUgPSBicm93c2VyVHlwZXMgPyBicm93c2VyVHlwZXNbMF0udG9Mb3dlckNhc2UoKSA6IHN5cy5CUk9XU0VSX1RZUEVfVU5LTk9XTjtcclxuICAgICAgICBpZihDT0NPU1BMQVkpIHtcclxuICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX0NPQ09TUExBWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihIVUFXRUkpIHtcclxuICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX0hVQVdFSV9HQU1FO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmKE9QUE8pIHtcclxuICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX09QUE9fR0FNRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZihWSVZPKSB7XHJcbiAgICAgICAgICAgIGJyb3dzZXJUeXBlID0gc3lzLkJST1dTRVJfVFlQRV9WSVZPX0dBTUU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGJyb3dzZXJUeXBlID09PSAnbWljcm9tZXNzZW5nZXInKSB7XHJcbiAgICAgICAgICAgIGJyb3dzZXJUeXBlID0gc3lzLkJST1dTRVJfVFlQRV9XRUNIQVQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGJyb3dzZXJUeXBlID09PSAnc2FmYXJpJyAmJiBpc0FuZHJvaWQpIHtcclxuICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX0FORFJPSUQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGJyb3dzZXJUeXBlID09PSAncXEnICYmIHVhLm1hdGNoKC9hbmRyb2lkLiphcHBsZXdlYmtpdC9pKSkge1xyXG4gICAgICAgICAgICBicm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfQU5EUk9JRDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYnJvd3NlclR5cGUgPT09ICd0cmlkZW50Jykge1xyXG4gICAgICAgICAgICBicm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfSUU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGJyb3dzZXJUeXBlID09PSAnZWRnZScpIHtcclxuICAgICAgICAgICAgYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfRURHRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYnJvd3NlclR5cGUgPT09ICczNjAgYXBob25lJykge1xyXG4gICAgICAgICAgICBicm93c2VyVHlwZSA9IHN5cy5CUk9XU0VSX1RZUEVfMzYwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChicm93c2VyVHlwZSA9PT0gJ214YnJvd3NlcicpIHtcclxuICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX01BWFRIT047XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGJyb3dzZXJUeXBlID09PSAnb3ByLycpIHtcclxuICAgICAgICAgICAgYnJvd3NlclR5cGUgPSBzeXMuQlJPV1NFUl9UWVBFX09QRVJBO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3lzLmJyb3dzZXJUeXBlID0gYnJvd3NlclR5cGU7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIHN5cy5icm93c2VyVmVyc2lvbiA9ICcnO1xyXG4gICAgLyogRGV0ZXJtaW5lIHRoZSBicm93c2VyIHZlcnNpb24gbnVtYmVyICovXHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHZlcnNpb25SZWcxID0gLyhtcXFicm93c2VyfG1pY3JvbWVzc2VuZ2VyfHFxfHNvZ291fHF6b25lfGxpZWJhb3xtYXh0aG9ufHVjfHVjYnN8MzYwIGFwaG9uZXwzNjB8YmFpZHVib3hhcHB8YmFpZHV8bWF4dGhvbnxteGJyb3dzZXJ8bWl1aSkobW9iaWxlKT8oYnJvd3Nlcik/XFwvPyhbXFxkLl0rKS9pO1xyXG4gICAgICAgIGNvbnN0IHZlcnNpb25SZWcyID0gLyhxcWJyb3dzZXJ8Y2hyb21lfHNhZmFyaXxmaXJlZm94fHRyaWRlbnR8b3BlcmF8b3ByXFwvfG91cGVuZykobW9iaWxlKT8oYnJvd3Nlcik/XFwvPyhbXFxkLl0rKS9pO1xyXG4gICAgICAgIGxldCB0bXAgPSB1YS5tYXRjaCh2ZXJzaW9uUmVnMSk7XHJcbiAgICAgICAgaWYgKCF0bXApIHsgdG1wID0gdWEubWF0Y2godmVyc2lvblJlZzIpOyB9XHJcbiAgICAgICAgc3lzLmJyb3dzZXJWZXJzaW9uID0gdG1wID8gdG1wWzRdIDogJyc7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIGNvbnN0IHcgPSB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XHJcbiAgICBjb25zdCBoID0gd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XHJcbiAgICBjb25zdCByYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIHx8IDE7XHJcblxyXG4gICAgc3lzLndpbmRvd1BpeGVsUmVzb2x1dGlvbiA9IHtcclxuICAgICAgICB3aWR0aDogcmF0aW8gKiB3LFxyXG4gICAgICAgIGhlaWdodDogcmF0aW8gKiBoLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfdG1wQ2FudmFzMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cclxuICAgIGNvbnN0IGNyZWF0ZTNEQ29udGV4dCA9IGZ1bmN0aW9uIChjYW52YXMsIG9wdF9hdHRyaWJzLCBvcHRfY29udGV4dFR5cGUpIHtcclxuICAgICAgICBpZiAob3B0X2NvbnRleHRUeXBlKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FudmFzLmdldENvbnRleHQob3B0X2NvbnRleHRUeXBlLCBvcHRfYXR0cmlicyk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlM0RDb250ZXh0KGNhbnZhcywgb3B0X2F0dHJpYnMsICd3ZWJnbCcpIHx8XHJcbiAgICAgICAgICAgICAgICBjcmVhdGUzRENvbnRleHQoY2FudmFzLCBvcHRfYXR0cmlicywgJ2V4cGVyaW1lbnRhbC13ZWJnbCcpIHx8XHJcbiAgICAgICAgICAgICAgICBjcmVhdGUzRENvbnRleHQoY2FudmFzLCBvcHRfYXR0cmlicywgJ3dlYmtpdC0zZCcpIHx8XHJcbiAgICAgICAgICAgICAgICBjcmVhdGUzRENvbnRleHQoY2FudmFzLCBvcHRfYXR0cmlicywgJ21vei13ZWJnbCcpIHx8XHJcbiAgICAgICAgICAgICAgICBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgbG9jYWxTdG9yYWdlOiBTdG9yYWdlIHwgbnVsbCA9IHN5cy5sb2NhbFN0b3JhZ2UgPSB3aW4ubG9jYWxTdG9yYWdlO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzdG9yYWdlJywgJycpO1xyXG4gICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdzdG9yYWdlJyk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlID0gbnVsbDtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zdCB3YXJuID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTIwMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzeXMubG9jYWxTdG9yYWdlID0ge1xyXG4gICAgICAgICAgICBnZXRJdGVtOiB3YXJuLFxyXG4gICAgICAgICAgICBzZXRJdGVtOiB3YXJuLFxyXG4gICAgICAgICAgICByZW1vdmVJdGVtOiB3YXJuLFxyXG4gICAgICAgICAgICBjbGVhcjogd2FybixcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IF9zdXBwb3J0V2VicCA9IFRFU1QgPyBmYWxzZSA6IF90bXBDYW52YXMxLnRvRGF0YVVSTCgnaW1hZ2Uvd2VicCcpLnN0YXJ0c1dpdGgoJ2RhdGE6aW1hZ2Uvd2VicCcpO1xyXG4gICAgY29uc3QgX3N1cHBvcnRDYW52YXMgPSBURVNUID8gZmFsc2UgOiAhIV90bXBDYW52YXMxLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICBsZXQgX3N1cHBvcnRXZWJHTCA9IGZhbHNlO1xyXG4gICAgaWYgKFRFU1QpIHtcclxuICAgICAgICBfc3VwcG9ydFdlYkdMID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh3aW4uV2ViR0xSZW5kZXJpbmdDb250ZXh0KSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmIChjcmVhdGUzRENvbnRleHQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnQ0FOVkFTJykpKSB7XHJcbiAgICAgICAgICAgIF9zdXBwb3J0V2ViR0wgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoX3N1cHBvcnRXZWJHTCAmJiBzeXMub3MgPT09IHN5cy5PU19BTkRST0lEKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJWZXIgPSBwYXJzZUZsb2F0KHN5cy5icm93c2VyVmVyc2lvbik7XHJcbiAgICAgICAgICAgIHN3aXRjaCAoc3lzLmJyb3dzZXJUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIHN5cy5CUk9XU0VSX1RZUEVfTU9CSUxFX1FROlxyXG4gICAgICAgICAgICAgICAgY2FzZSBzeXMuQlJPV1NFUl9UWVBFX0JBSURVOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBzeXMuQlJPV1NFUl9UWVBFX0JBSURVX0FQUDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBRUSAmIEJhaWR1IEJyd29zZXIgNi4yKyAodXNpbmcgYmxpbmsga2VybmVsKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChicm93c2VyVmVyID49IDYuMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfc3VwcG9ydFdlYkdMID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zdXBwb3J0V2ViR0wgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIHN5cy5CUk9XU0VSX1RZUEVfQU5EUk9JRDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBBbmRyb2lkIDUrIGRlZmF1bHQgYnJvd3NlclxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzeXMub3NNYWluVmVyc2lvbiAmJiBzeXMub3NNYWluVmVyc2lvbiA+PSA1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zdXBwb3J0V2ViR0wgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2Ugc3lzLkJST1dTRVJfVFlQRV9DSFJPTUU6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hyb21lIG9uIGFuZHJvaWQgc3VwcG9ydHMgV2ViR0wgZnJvbSB2LiAzMFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChicm93c2VyVmVyID49IDMwLjApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3N1cHBvcnRXZWJHTCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3N1cHBvcnRXZWJHTCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2Ugc3lzLkJST1dTRVJfVFlQRV9VQzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYnJvd3NlclZlciA+IDExLjApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3N1cHBvcnRXZWJHTCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3N1cHBvcnRXZWJHTCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2Ugc3lzLkJST1dTRVJfVFlQRV8zNjA6XHJcbiAgICAgICAgICAgICAgICAgICAgX3N1cHBvcnRXZWJHTCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNhcGFiaWxpdGllcyA9IHN5cy5jYXBhYmlsaXRpZXMgPSB7XHJcbiAgICAgICAgY2FudmFzOiBfc3VwcG9ydENhbnZhcyxcclxuICAgICAgICBvcGVuZ2w6IF9zdXBwb3J0V2ViR0wsXHJcbiAgICAgICAgd2VicDogX3N1cHBvcnRXZWJwLFxyXG4gICAgfSBhcyB7IFt4OiBzdHJpbmddOiBhbnk7IH07XHJcbiAgICBpZiAoZG9jRWxlLm9udG91Y2hzdGFydCAhPT0gdW5kZWZpbmVkIHx8IGRvYy5vbnRvdWNoc3RhcnQgIT09IHVuZGVmaW5lZCB8fCBuYXYubXNQb2ludGVyRW5hYmxlZCkge1xyXG4gICAgICAgIGNhcGFiaWxpdGllcy50b3VjaGVzID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGlmIChkb2NFbGUub25tb3VzZXVwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjYXBhYmlsaXRpZXMubW91c2UgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKGRvY0VsZS5vbmtleXVwICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjYXBhYmlsaXRpZXMua2V5Ym9hcmQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgaWYgKHdpbi5EZXZpY2VNb3Rpb25FdmVudCB8fCB3aW4uRGV2aWNlT3JpZW50YXRpb25FdmVudCkge1xyXG4gICAgICAgIGNhcGFiaWxpdGllcy5hY2NlbGVyb21ldGVyID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgX19hdWRpb1N1cHBvcnQ7XHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IERFQlVHID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3QgdmVyc2lvbiA9IHN5cy5icm93c2VyVmVyc2lvbjtcclxuXHJcbiAgICAgICAgLy8gY2hlY2sgaWYgYnJvd3NlciBzdXBwb3J0cyBXZWIgQXVkaW9cclxuICAgICAgICAvLyBjaGVjayBXZWIgQXVkaW8ncyBjb250ZXh0XHJcbiAgICAgICAgY29uc3Qgc3VwcG9ydFdlYkF1ZGlvID0gISEod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0IHx8IHdpbmRvdy5tb3pBdWRpb0NvbnRleHQpO1xyXG5cclxuICAgICAgICBfX2F1ZGlvU3VwcG9ydCA9IHsgT05MWV9PTkU6IGZhbHNlLCBXRUJfQVVESU86IHN1cHBvcnRXZWJBdWRpbywgREVMQVlfQ1JFQVRFX0NUWDogZmFsc2UgfTtcclxuXHJcbiAgICAgICAgaWYgKHN5cy5vcyA9PT0gc3lzLk9TX0lPUykge1xyXG4gICAgICAgICAgICAvLyBJT1Mgbm8gZXZlbnQgdGhhdCB1c2VkIHRvIHBhcnNlIGNvbXBsZXRlZCBjYWxsYmFja1xyXG4gICAgICAgICAgICAvLyB0aGlzIHRpbWUgaXMgbm90IGNvbXBsZXRlLCBjYW4gbm90IHBsYXlcclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuVVNFX0xPQURFUl9FVkVOVCA9ICdsb2FkZWRtZXRhZGF0YSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX0ZJUkVGT1gpIHtcclxuICAgICAgICAgICAgX19hdWRpb1N1cHBvcnQuREVMQVlfQ1JFQVRFX0NUWCA9IHRydWU7XHJcbiAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0LlVTRV9MT0FERVJfRVZFTlQgPSAnY2FucGxheSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoc3lzLm9zID09PSBzeXMuT1NfQU5EUk9JRCkge1xyXG4gICAgICAgICAgICBpZiAoc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX1VDKSB7XHJcbiAgICAgICAgICAgICAgICBfX2F1ZGlvU3VwcG9ydC5PTkVfU09VUkNFID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgbG9nKCdicm93c2UgdHlwZTogJyArIHN5cy5icm93c2VyVHlwZSk7XHJcbiAgICAgICAgICAgICAgICBsb2coJ2Jyb3dzZSB2ZXJzaW9uOiAnICsgdmVyc2lvbik7XHJcbiAgICAgICAgICAgICAgICBsb2coJ01VTFRJX0NIQU5ORUw6ICcgKyBfX2F1ZGlvU3VwcG9ydC5NVUxUSV9DSEFOTkVMKTtcclxuICAgICAgICAgICAgICAgIGxvZygnV0VCX0FVRElPOiAnICsgX19hdWRpb1N1cHBvcnQuV0VCX0FVRElPKTtcclxuICAgICAgICAgICAgICAgIGxvZygnQVVUT1BMQVk6ICcgKyBfX2F1ZGlvU3VwcG9ydC5BVVRPUExBWSk7XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAoX19hdWRpb1N1cHBvcnQuV0VCX0FVRElPKSB7XHJcbiAgICAgICAgICAgIF9fYXVkaW9TdXBwb3J0Ll9jb250ZXh0ID0gbnVsbDtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9fYXVkaW9TdXBwb3J0LCAnY29udGV4dCcsIHtcclxuICAgICAgICAgICAgICAgIGdldCAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NvbnRleHQpIHsgcmV0dXJuIHRoaXMuX2NvbnRleHQ7IH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRleHQgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCB8fCB3aW5kb3cubW96QXVkaW9Db250ZXh0KSgpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBfX2F1ZGlvU3VwcG9ydC5XRUJfQVVESU8gPSBmYWxzZTtcclxuICAgICAgICBsb2dJRCg1MjAxKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgZm9ybWF0U3VwcG9ydDogc3RyaW5nW10gPSBbXTtcclxuICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgYXVkaW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xyXG4gICAgICAgIGlmIChhdWRpby5jYW5QbGF5VHlwZSkge1xyXG4gICAgICAgICAgICBjb25zdCBvZ2cgPSBhdWRpby5jYW5QbGF5VHlwZSgnYXVkaW8vb2dnOyBjb2RlY3M9XCJ2b3JiaXNcIicpO1xyXG4gICAgICAgICAgICBpZiAob2dnKSB7IGZvcm1hdFN1cHBvcnQucHVzaCgnLm9nZycpOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IG1wMyA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby9tcGVnJyk7XHJcbiAgICAgICAgICAgIGlmIChtcDMpIHsgZm9ybWF0U3VwcG9ydC5wdXNoKCcubXAzJyk7IH1cclxuICAgICAgICAgICAgY29uc3Qgd2F2ID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJyk7XHJcbiAgICAgICAgICAgIGlmICh3YXYpIHsgZm9ybWF0U3VwcG9ydC5wdXNoKCcud2F2Jyk7IH1cclxuICAgICAgICAgICAgY29uc3QgbXA0ID0gYXVkaW8uY2FuUGxheVR5cGUoJ2F1ZGlvL21wNCcpO1xyXG4gICAgICAgICAgICBpZiAobXA0KSB7IGZvcm1hdFN1cHBvcnQucHVzaCgnLm1wNCcpOyB9XHJcbiAgICAgICAgICAgIGNvbnN0IG00YSA9IGF1ZGlvLmNhblBsYXlUeXBlKCdhdWRpby94LW00YScpO1xyXG4gICAgICAgICAgICBpZiAobTRhKSB7IGZvcm1hdFN1cHBvcnQucHVzaCgnLm00YScpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuICAgIF9fYXVkaW9TdXBwb3J0LmZvcm1hdCA9IGZvcm1hdFN1cHBvcnQ7XHJcblxyXG4gICAgc3lzLl9fYXVkaW9TdXBwb3J0ID0gX19hdWRpb1N1cHBvcnQ7XHJcblxyXG4gICAgc3lzLl9fdmlkZW9TdXBwb3J0ID0ge1xyXG4gICAgICAgIGZvcm1hdDogW11cclxuICAgIH07XHJcbiAgICAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcclxuICAgICAgICBpZiAodmlkZW8uY2FuUGxheVR5cGUpIHtcclxuICAgICAgICAgICAgY29uc3QgY2FuUGxheVR5cGVzID0gWydtcDQnLCAnd2VibSddO1xyXG4gICAgICAgICAgICBsZXQgZm9ybWF0ID0gc3lzLl9fdmlkZW9TdXBwb3J0LmZvcm1hdDtcclxuICAgICAgICAgICAgY2FuUGxheVR5cGVzLmZvckVhY2goKHR5cGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh2aWRlby5jYW5QbGF5VHlwZShgdmlkZW8vJHt0eXBlfWApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0LnB1c2goYC4ke3R5cGV9YCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBzeXMuX192aWRlb1N1cHBvcnQuZm9ybWF0ID0gZm9ybWF0O1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG59XHJcblxyXG5sZWdhY3lDQy5zeXMgPSBzeXM7XHJcbiJdfQ==