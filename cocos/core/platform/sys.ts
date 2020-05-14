/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
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
 * @category core
 */

import { EDITOR, TEST, WECHAT, ALIPAY, XIAOMI, BAIDU, COCOSPLAY, JSB, MINIGAME } from 'internal:constants';
import { legacyCC } from '../global-exports';

// tslint:disable

// @ts-ignore
const _global = typeof window === 'undefined' ? global : window;

enum NetworkType {
    /**
     * @en Network is unreachable.
     * @zh 网络不通
     */
    NONE,
    /**
     * @en Network is reachable via WiFi or cable.
     * @zh 通过无线或者有线本地网络连接因特网
     */
    LAN,
    /**
     * @en Network is reachable via Wireless Wide Area Network
     * @zh 通过蜂窝移动网络连接因特网
     */
    WWAN
};

/**
 * @en A set of system related variables
 * @zh 一系列系统相关环境变量
 * @main
 */
export const sys: { [x: string]: any; } = {
    /**
     * @en
     * Network type enumeration
     * @zh
     * 网络类型枚举
     */
    NetworkType,

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
     * @en Browser Type - WeChat Mini Game
     * @zh 浏览器类型 - 微信小游戏
     * @default "wechatgame"
     */
    BROWSER_TYPE_WECHAT_GAME: 'wechatgame',
    /**
     * @en Browser Type - Alipay Mini Game
     * @zh 浏览器类型 - 支付宝小游戏
     * @default "alipaygame"
     */
    BROWSER_TYPE_ALIPAY_GAME: 'alipaygame',
    /**
     * @en Browser Type - MI Quick Game
     * @zh 浏览器类型 - 小米快游戏
     * @default "xiaomiquickgame"
     */
    BROWSER_TYPE_XIAOMI_GAME: 'xiaomiquickgame',
    /**
     * @en Browser Type - Baidu Mini Game
     * @zh 浏览器类型 - 百度小游戏
     * @default "baidugame"
     */
    BROWSER_TYPE_BAIDU_GAME: 'baidugame',
    /**
     * @en Browser Type - Cocos Play Game
     * @zh 浏览器类型 - Cocos Play 游戏
     * @default "cocosplay"
     */
    BROWSER_TYPE_COCOSPLAY: 'cocosplay',
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
    isNative: JSB,
    
    /**
     * @en Whether the running platform is browser
     * @zh 指示运行平台是否是浏览器
     */
    isBrowser: typeof window === 'object' && typeof document === 'object' && !MINIGAME && !JSB,

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
    isLittleEndian: (() => {
        const buffer = new ArrayBuffer(2);
        new DataView(buffer).setInt16(0, 256, true);
        // Int16Array uses the platform's endianness.
        return new Int16Array(buffer)[0] === 256;
    })(),

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
     * @en Get the network type of current device, return cc.sys.NetworkType.LAN if failure.
     * @zh 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 cc.sys.NetworkType.LAN
     */
    getNetworkType (): NetworkType {
        // TODO: need to implement this for mobile phones.
        return NetworkType.LAN;
    },

    /**
     * @en Get the battery level of current device, return 1.0 if failure.
     * @zh 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
     * @return - 0.0 ~ 1.0
     */
    getBatteryLevel (): number {
        // TODO: need to implement this for mobile phones.
        return 1.0;
    },

    /**
     * @en Forces the garbage collection, only available in native platforms
     * @zh 强制进行 JS 内存垃圾回收，尽在原生平台有效
     */
    garbageCollect () {
        // N/A in web
    },

    /**
     * @en Check whether an object is valid,
     * In web engine, it will return true if the object exist
     * In native engine, it will return true if the JS object and the correspond native object are both valid
     * @zh 检查一个对象是否非空或在原生平台有效，
     * 在 Web 平台，只要对象非空或非 Undefined 就会返回 true，在原生平台，我们会检查当前 JS 对象和其绑定的原生对象是否都有效
     * @param obj The object to be checked
     */
    isObjectValid (obj: any): boolean {
        if (obj === null || obj === undefined) {
            return false;
        }
        else {
            return true;
        }
    },

    /**
     * @en Dump system informations
     * @zh 在控制台打印当前的主要系统信息
     */
    dump () {
        let str = '';
        str += 'isMobile : ' + this.isMobile + '\r\n';
        str += 'language : ' + this.language + '\r\n';
        str += 'browserType : ' + this.browserType + '\r\n';
        str += 'browserVersion : ' + this.browserVersion + '\r\n';
        str += 'capabilities : ' + JSON.stringify(this.capabilities) + '\r\n';
        str += 'os : ' + this.os + '\r\n';
        str += 'osVersion : ' + this.osVersion + '\r\n';
        str += 'platform : ' + this.platform + '\r\n';
        str += 'Using ' + (legacyCC.game.renderType === legacyCC.game.RENDER_TYPE_WEBGL ? 'WEBGL' : 'CANVAS') + ' renderer.' + '\r\n';
        legacyCC.log(str);
    },

    /**
     * @en Try to open a url in browser, may not work in some platforms
     * @zh 尝试打开一个 web 页面，并非在所有平台都有效
     */
    openURL (url) {
        if (JSB) {
            // @ts-ignore
            jsb.openURL(url);
        }
        else {
            window.open(url);
        }
    },

    /**
     * @en Get the current time in milliseconds
     * @zh 获取当前时间（毫秒为单位）
     */
    now () {
        if (Date.now) {
            return Date.now();
        }
        else {
            return +(new Date);
        }
    },

    /**
     * Dumps rooted objects, only available in native platforms
     * @private
     */
    dumpRoot () {
        // N/A in web
    },

    /**
     * Restart the JS VM, only available in native platforms
     * @private
     */
    restartVM () {
        // N/A in web
    },

    /**
     * Clean a script in the JS VM, only available in native platforms
     * @private
     */
    cleanScript (jsfile) {
        // N/A in web
    },
};

// ============= Platform Adaptation ==============

if (_global.__globalAdapter && _global.__globalAdapter.adaptSys) {
    // init sys info in adapter
    _global.__globalAdapter.adaptSys(sys);
}
// TODO: main process flag
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
else if (JSB) {
    // @ts-ignore
    const platform = sys.platform = __getPlatform();
    sys.isMobile = (platform === sys.ANDROID ||
        platform === sys.IPAD ||
        platform === sys.IPHONE ||
        platform === sys.WP8 ||
        platform === sys.TIZEN ||
        platform === sys.BLACKBERRY);

    // @ts-ignore
    sys.os = __getOS();
    // @ts-ignore
    sys.language = __getCurrentLanguage();
    // @ts-ignore
    sys.osVersion = __getOSVersion();
    sys.osMainVersion = parseInt(sys.osVersion);
    sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
    sys.browserVersion = '';

    const w = window.innerWidth;
    const h = window.innerHeight;
    const ratio = window.devicePixelRatio || 1;
    sys.windowPixelResolution = {
        width: ratio * w,
        height: ratio * h,
    };

    sys.localStorage = window.localStorage;

    let capabilities;
    capabilities = sys.capabilities = {
        canvas: false,
        opengl: true,
        webp: true,
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
        format: ['.mp3'],
    };
}
else {
    // browser or runtime
    const win = window, nav = win.navigator, doc = document, docEle = doc.documentElement;
    const ua = nav.userAgent.toLowerCase();

    if (EDITOR) {
        sys.isMobile = false;
        sys.platform = sys.EDITOR_PAGE;
    }
    else {
        sys.isMobile = /mobile|android|iphone|ipad/.test(ua);
        sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
    }

    let currLanguage = nav.language;
    // @ts-ignore
    currLanguage = currLanguage ? currLanguage : nav.browserLanguage;
    currLanguage = currLanguage ? currLanguage.split('-')[0] : sys.LANGUAGE_ENGLISH;
    sys.language = currLanguage;

    // Get the os of system
    let isAndroid = false, iOS = false, osVersion = '', osMajorVersion = 0;
    let uaResult = /android\s*(\d+(?:\.\d+)*)/i.exec(ua) || /android\s*(\d+(?:\.\d+)*)/i.exec(nav.platform);
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
    }
    // refer to https://github.com/cocos-creator/engine/pull/5542 , thanks for contribition from @krapnikkk
    // ipad OS 13 safari identifies itself as "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)"
    // so use maxTouchPoints to check whether it's desktop safari or not.
    // reference: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
    // FIXME: should remove it when touch-enabled mac are available
    // TODO: due to compatibility issues, it is still determined to be ios, and a new operating system type ipados may be added later？
    else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || (nav.platform === 'MacIntel' && nav.maxTouchPoints && nav.maxTouchPoints > 1)) {
        iOS = true;
        osVersion = '';
        osMajorVersion = 0;
    }

    let osName = sys.OS_UNKNOWN;
    if (nav.appVersion.indexOf('Win') !== -1) { osName = sys.OS_WINDOWS; }
    else if (iOS) { osName = sys.OS_IOS; }
    else if (nav.appVersion.indexOf('Mac') !== -1) { osName = sys.OS_OSX; }
    else if (nav.appVersion.indexOf('X11') !== -1 && nav.appVersion.indexOf('Linux') === -1) { osName = sys.OS_UNIX; }
    else if (isAndroid) { osName = sys.OS_ANDROID; }
    else if (nav.appVersion.indexOf('Linux') !== -1 || ua.indexOf('ubuntu') !== -1) { osName = sys.OS_LINUX; }

    sys.os = osName;
    sys.osVersion = osVersion;
    sys.osMainVersion = osMajorVersion;

    sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
    /* Determine the browser type */
    (function () {
        const typeReg1 = /mqqbrowser|micromessenger|qq|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
        const typeReg2 = /qqbrowser|ucbrowser/i;
        const typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
        let browserTypes = typeReg1.exec(ua);
        if (!browserTypes) { browserTypes = typeReg2.exec(ua); }
        if (!browserTypes) { browserTypes = typeReg3.exec(ua); }

        let browserType = browserTypes ? browserTypes[0].toLowerCase() : sys.BROWSER_TYPE_UNKNOWN;
        if (WECHAT) {
            browserType = sys.BROWSER_TYPE_WECHAT_GAME;
        }
        else if(ALIPAY) {
            browserType = sys.BROWSER_TYPE_ALIPAY_GAME;
        }
        else if(XIAOMI) {
            browserType = sys.BROWSER_TYPE_XIAOMI_GAME;
        }
        else if(BAIDU) {
            browserType = sys.BROWSER_TYPE_BAIDU_GAME;
        }
        else if(COCOSPLAY) {
            browserType = sys.BROWSER_TYPE_COCOSPLAY;
        }
        else if (browserType === 'micromessenger') {
            browserType = sys.BROWSER_TYPE_WECHAT;
        }
        else if (browserType === 'safari' && isAndroid) {
            browserType = sys.BROWSER_TYPE_ANDROID;
        }
        else if (browserType === 'qq' && ua.match(/android.*applewebkit/i)) {
            browserType = sys.BROWSER_TYPE_ANDROID;
        }
        else if (browserType === 'trident') {
            browserType = sys.BROWSER_TYPE_IE;
        }
        else if (browserType === '360 aphone') {
            browserType = sys.BROWSER_TYPE_360;
        }
        else if (browserType === 'mxbrowser') {
            browserType = sys.BROWSER_TYPE_MAXTHON;
        }
        else if (browserType === 'opr/') {
            browserType = sys.BROWSER_TYPE_OPERA;
        }

        sys.browserType = browserType;
    })();

    sys.browserVersion = '';
    /* Determine the browser version number */
    (function () {
        const versionReg1 = /(mqqbrowser|micromessenger|qq|sogou|qzone|liebao|maxthon|uc|ucbs|360 aphone|360|baiduboxapp|baidu|maxthon|mxbrowser|miui)(mobile)?(browser)?\/?([\d.]+)/i;
        const versionReg2 = /(qqbrowser|chrome|safari|firefox|trident|opera|opr\/|oupeng)(mobile)?(browser)?\/?([\d.]+)/i;
        let tmp = ua.match(versionReg1);
        if (!tmp) { tmp = ua.match(versionReg2); }
        sys.browserVersion = tmp ? tmp[4] : '';
    })();

    const w = window.innerWidth || document.documentElement.clientWidth;
    const h = window.innerHeight || document.documentElement.clientHeight;
    const ratio = window.devicePixelRatio || 1;

    sys.windowPixelResolution = {
        width: ratio * w,
        height: ratio * h,
    };

    const _tmpCanvas1 = document.createElement('canvas');

    const create3DContext = function (canvas, opt_attribs, opt_contextType) {
        if (opt_contextType) {
            try {
                return canvas.getContext(opt_contextType, opt_attribs);
            } catch (e) {
                return null;
            }
        }
        else {
            return create3DContext(canvas, opt_attribs, 'webgl') ||
                create3DContext(canvas, opt_attribs, 'experimental-webgl') ||
                create3DContext(canvas, opt_attribs, 'webkit-3d') ||
                create3DContext(canvas, opt_attribs, 'moz-webgl') ||
                null;
        }
    };

    try {
        let localStorage: Storage | null = sys.localStorage = win.localStorage;
        localStorage.setItem('storage', '');
        localStorage.removeItem('storage');
        localStorage = null;
    } catch (e) {
        const warn = function () {
            legacyCC.warnID(5200);
        };
        sys.localStorage = {
            getItem: warn,
            setItem: warn,
            removeItem: warn,
            clear: warn,
        };
    }

    const _supportWebp = TEST ? false : _tmpCanvas1.toDataURL('image/webp').startsWith('data:image/webp');
    const _supportCanvas = TEST ? false : !!_tmpCanvas1.getContext('2d');
    let _supportWebGL = false;
    if (TEST) {
        _supportWebGL = false;
    }
    else if (sys.browserType === sys.BROWSER_TYPE_WECHAT_GAME) {
        _supportWebGL = true;
    }
    else if (win.WebGLRenderingContext) {
        // @ts-ignore
        if (create3DContext(document.createElement('CANVAS'))) {
            _supportWebGL = true;
        }
        if (_supportWebGL && sys.os === sys.OS_ANDROID) {
            const browserVer = parseFloat(sys.browserVersion);
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

    const capabilities = sys.capabilities = {
        canvas: _supportCanvas,
        opengl: _supportWebGL,
        webp: _supportWebp,
    } as { [x: string]: any; };
    if (docEle.ontouchstart !== undefined || doc.ontouchstart !== undefined || nav.msPointerEnabled) {
        capabilities.touches = true;
    }
    if (docEle.onmouseup !== undefined) {
        capabilities.mouse = true;
    }
    if (docEle.onkeyup !== undefined) {
        capabilities.keyboard = true;
    }
    // @ts-ignore
    if (win.DeviceMotionEvent || win.DeviceOrientationEvent) {
        capabilities.accelerometer = true;
    }

    let __audioSupport;
    (function () {
        const DEBUG = false;
        const version = sys.browserVersion;

        // check if browser supports Web Audio
        // check Web Audio's context
        const supportWebAudio = sys.browserType !== sys.BROWSER_TYPE_WECHAT_GAME &&
            // @ts-ignore
            !!(window.AudioContext || window.webkitAudioContext || window.mozAudioContext);

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

        if (DEBUG) {
            setTimeout(function () {
                legacyCC.log('browse type: ' + sys.browserType);
                legacyCC.log('browse version: ' + version);
                legacyCC.log('MULTI_CHANNEL: ' + __audioSupport.MULTI_CHANNEL);
                legacyCC.log('WEB_AUDIO: ' + __audioSupport.WEB_AUDIO);
                legacyCC.log('AUTOPLAY: ' + __audioSupport.AUTOPLAY);
            }, 0);
        }
    })();

    try {
        if (__audioSupport.WEB_AUDIO) {
            __audioSupport._context = null;
            Object.defineProperty(__audioSupport, 'context', {
                get () {
                    if (this._context) { return this._context; }
                    // @ts-ignore
                    return this._context = new (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)();
                },
            });
        }
    } catch (error) {
        __audioSupport.WEB_AUDIO = false;
        legacyCC.logID(5201);
    }

    const formatSupport: string[] = [];
    (function () {
        const audio = document.createElement('audio');
        if (audio.canPlayType) {
            const ogg = audio.canPlayType('audio/ogg; codecs="vorbis"');
            if (ogg) { formatSupport.push('.ogg'); }
            const mp3 = audio.canPlayType('audio/mpeg');
            if (mp3) { formatSupport.push('.mp3'); }
            const wav = audio.canPlayType('audio/wav; codecs="1"');
            if (wav) { formatSupport.push('.wav'); }
            const mp4 = audio.canPlayType('audio/mp4');
            if (mp4) { formatSupport.push('.mp4'); }
            const m4a = audio.canPlayType('audio/x-m4a');
            if (m4a) { formatSupport.push('.m4a'); }
        }
    })();
    __audioSupport.format = formatSupport;

    sys.__audioSupport = __audioSupport;
}

legacyCC.sys = sys;
