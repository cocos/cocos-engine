/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module core
 */
import { system } from 'pal/system';
import { legacyCC } from '../global-exports';
import { Rect } from '../math/rect';
import { warnID, log } from './debug';
import { NetworkType, Language, OS, Platform, BrowserType } from '../../../pal/system/enum-type';

const viewSize = system.getViewSize();
const pixelRatio = system.pixelRatio;

/**
 * @en A set of system related variables
 * @zh 一系列系统相关环境变量
 * @main
 */
export const sys: Record<string, any> = {
    /**
     * @en
     * Network type enumeration
     * @zh
     * 网络类型枚举
     */
    NetworkType,

    /**
     * @en
     * LanguageCode type enumeration
     * @zh
     * 语言码类型枚举
     */
    Language,

    /**
     * @en
     * OS type enumeration
     * @zh
     * 操作系统类型枚举
     */
    OS,

    /**
     * @en
     * Platform type enumeration
     * @zh
     * 平台类型枚举
     */
    Platform,

    /**
     * @en
     * Browser type enumeration
     * @zh
     * 浏览器类型枚举
     */
    BrowserType,

    /**
     * @en Whether the running platform is native app
     * @zh 指示运行平台是否是原生平台
     */
    isNative: system.isNative,

    /**
     * @en Whether the running platform is browser
     * @zh 指示运行平台是否是浏览器
     */
    isBrowser: system.isBrowser,

    /**
     * @en Indicate whether the current running context is a mobile system
     * @zh 指示当前运行平台是否是移动端平台
     */
    isMobile: system.isMobile,

    /**
     * @en Whether the endianness of current platform is little endian
     * @zh 当前平台字节顺序是否是小端序
     */
    isLittleEndian: system.isLittleEndian,

    /**
     * @en The running platform
     * @zh 当前运行平台或环境
     */
    platform: system.platform,

    /**
     * @en Indicate the current language of the running system
     * @zh 指示当前运行环境的语言
     */
    language: system.language,

    /**
     * @en
     * Get current language iso 639-1 code.
     * Examples of valid language codes include "zh-tw", "en", "en-us", "fr", "fr-fr", "es-es", etc.
     * The actual value totally depends on results provided by destination platform.
     * @zh
     * 指示当前运行环境的语言
     * 获取当前的语言iso 639-1代码。
     * 有效的语言代码包括 "zh-tw"、"en"、"en-us"、"fr"、"fr-fr"、"es-es "等。
     * 实际值完全取决于目的地平台提供的结果。
     */
    languageCode: system.nativeLanguage,

    /**
     * @en Indicate the running os name
     * @zh 指示当前运行系统
     */
    os: system.os,

    /**
     * @en Indicate the running os version string
     * @zh 指示当前运行系统版本字符串
     */
    osVersion: system.osVersion,

    /**
     * @en Indicate the running os main version
     * @zh 指示当前系统主版本
     */
    osMainVersion: system.osMainVersion,

    /**
     * @en Indicate the running browser type
     * @zh 指示当前运行的浏览器类型
     */
    browserType: system.browserType,

    /**
     * @en Indicate the running browser version
     * @zh 指示当前运行的浏览器版本
     */
    browserVersion: system.browserVersion,

    /**
     * @en Indicate the real pixel resolution of the whole game window
     * @zh 指示游戏窗口的像素分辨率
     */
    windowPixelResolution: {
        width: viewSize.width * pixelRatio,
        height: viewSize.height * pixelRatio,
    },

    /**
     * @en The capabilities of the current platform
     * @zh 当前平台的功能可用性
     */
    capabilities: {
        canvas: system.supportCapability.canvas,
        opengl: system.supportCapability.gl,
        webp: system.supportCapability.webp,
        imageBitmap: system.supportCapability.imageBitmap,
        // TODO: move into pal/input
        touches: false,
        mouse: false,
        keyboard: false,
        accelerometer: false,
    },

    /**
     * @en It is a local storage component based on HTML5 localStorage API, on web platform, it's equal to window.localStorage
     * @zh HTML5 标准中的 localStorage 的本地存储功能，在 Web 端等价于 window.localStorage
     */
    localStorage: null,

    /**
     * @en Get the network type of current device, return `sys.NetworkType.LAN` if failure.
     * @zh 获取当前设备的网络类型, 如果网络类型无法获取，默认将返回 `sys.NetworkType.LAN`
     */
    getNetworkType (): NetworkType {
        return system.networkType;
    },

    /**
     * @en Get the battery level of current device, return 1.0 if failure.
     * @zh 获取当前设备的电池电量，如果电量无法获取，默认将返回 1
     * @return - 0.0 ~ 1.0
     */
    getBatteryLevel (): number {
        return system.getBatteryLevel();
    },

    /**
     * @en Forces the garbage collection, only available in native platforms
     * @zh 强制进行 JS 内存垃圾回收，尽在原生平台有效
     */
    garbageCollect () {
        system.triggerGC();
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

        return true;
    },

    /**
     * @en Dump system informations
     * @zh 在控制台打印当前的主要系统信息
     */
    dump () {
        let str = '';
        str += `isMobile : ${this.isMobile}\r\n`;
        str += `language : ${this.language}\r\n`;
        str += `browserType : ${this.browserType}\r\n`;
        str += `browserVersion : ${this.browserVersion}\r\n`;
        str += `capabilities : ${JSON.stringify(this.capabilities)}\r\n`;
        str += `os : ${this.os}\r\n`;
        str += `osVersion : ${this.osVersion}\r\n`;
        str += `platform : ${this.platform}\r\n`;
        str += `Using ${legacyCC.game.renderType === legacyCC.game.RENDER_TYPE_WEBGL ? 'WEBGL' : 'CANVAS'} renderer.\r\n`;
        log(str);
    },

    /**
     * @en Try to open a url in browser, may not work in some platforms
     * @zh 尝试打开一个 web 页面，并非在所有平台都有效
     */
    openURL (url) {
        system.openURL(url);
    },

    /**
     * @en Get the current time in milliseconds
     * @zh 获取当前时间（毫秒为单位）
     */
    now () {
        return system.now();
    },

    /**
     * Restart the JS VM, only available in native platforms
     * @private
     */
    restartVM () {
        system.restartJSVM();
    },

    /**
     * @en
     * Returns the safe area of the screen (in design resolution). If the screen is not notched, the visibleRect will be returned by default.
     * Currently supports Android, iOS and WeChat Mini Game platform.
     * @zh
     * 返回手机屏幕安全区域（设计分辨率为单位），如果不是异形屏将默认返回 visibleRect。目前支持安卓、iOS 原生平台和微信小游戏平台。
     * @method getSafeAreaRect
     * @return {Rect}
     */
    getSafeAreaRect () {
        const visibleSize = legacyCC.view.getVisibleSize();
        return legacyCC.rect(0, 0, visibleSize.width, visibleSize.height) as Rect;
    },

    __init () {
        // browser or runtime
        const win = window; const nav = win.navigator; const doc = document; const docEle = doc.documentElement;
        const ua = nav.userAgent.toLowerCase();

        if (EDITOR) {
            sys.isMobile = false;
            sys.platform = sys.EDITOR_PAGE;
        } else {
            sys.isMobile = /mobile|android|iphone|ipad/.test(ua);
            sys.platform = sys.isMobile ? sys.MOBILE_BROWSER : sys.DESKTOP_BROWSER;
        }

        let currLanguage = nav.language;
        sys.languageCode = currLanguage.toLowerCase();
        currLanguage = currLanguage || (nav as any).browserLanguage;
        currLanguage = currLanguage ? currLanguage.split('-')[0] : sys.LANGUAGE_ENGLISH;
        sys.language = currLanguage;

        // Get the os of system
        let isAndroid = false; let iOS = false; let osVersion = ''; let osMajorVersion = 0;
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
            // refer to https://github.com/cocos-creator/engine/pull/5542 , thanks for contribition from @krapnikkk
            // ipad OS 13 safari identifies itself as "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 (KHTML, like Gecko)"
            // so use maxTouchPoints to check whether it's desktop safari or not.
            // reference: https://stackoverflow.com/questions/58019463/how-to-detect-device-name-in-safari-on-ios-13-while-it-doesnt-show-the-correct
            // FIXME: should remove it when touch-enabled mac are available
            // TODO: due to compatibility issues, it is still determined to be ios, and a new operating system type ipados may be added later？
        } else if (/(iPhone|iPad|iPod)/.exec(nav.platform) || (nav.platform === 'MacIntel' && nav.maxTouchPoints && nav.maxTouchPoints > 1)) {
            iOS = true;
            osVersion = '';
            osMajorVersion = 0;
        }

        let osName = sys.OS_UNKNOWN;
        if (nav.appVersion.indexOf('Win') !== -1) { osName = sys.OS_WINDOWS; } else if (iOS) { osName = sys.OS_IOS; } else if (nav.appVersion.indexOf('Mac') !== -1) { osName = sys.OS_OSX; } else if (nav.appVersion.indexOf('X11') !== -1 && nav.appVersion.indexOf('Linux') === -1) { osName = sys.OS_UNIX; } else if (isAndroid) { osName = sys.OS_ANDROID; } else if (nav.appVersion.indexOf('Linux') !== -1 || ua.indexOf('ubuntu') !== -1) { osName = sys.OS_LINUX; }

        sys.os = osName;
        sys.osVersion = osVersion;
        sys.osMainVersion = osMajorVersion;

        sys.browserType = sys.BROWSER_TYPE_UNKNOWN;
        /* Determine the browser type */
        (function () {
            const typeReg0 = /wechat|weixin|micromessenger/i;
            const typeReg1 = /mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
            const typeReg2 = /qq|qqbrowser|ucbrowser|ubrowser|edge|HuaweiBrowser/i;
            const typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
            const browserTypes = typeReg0.exec(ua) || typeReg1.exec(ua) || typeReg2.exec(ua) || typeReg3.exec(ua);

            let browserType = browserTypes ? browserTypes[0].toLowerCase() : sys.BROWSER_TYPE_UNKNOWN;
            if (browserType === 'safari' && isAndroid) {
                browserType = sys.BROWSER_TYPE_ANDROID;
            } else if (browserType === 'qq' && /android.*applewebkit/i.test(ua)) {
                browserType = sys.BROWSER_TYPE_ANDROID;
            }
            const typeMap = {
                micromessenger: sys.BROWSER_TYPE_WECHAT,
                wechat: sys.BROWSER_TYPE_WECHAT,
                weixin: sys.BROWSER_TYPE_WECHAT,
                trident: sys.BROWSER_TYPE_IE,
                edge: sys.BROWSER_TYPE_EDGE,
                '360 aphone': sys.BROWSER_TYPE_360,
                mxbrowser: sys.BROWSER_TYPE_MAXTHON,
                'opr/': sys.BROWSER_TYPE_OPERA,
                ubrowser: sys.BROWSER_TYPE_UC,
                huaweibrowser: sys.BROWSER_TYPE_HUAWEI,
            };

            sys.browserType = typeMap[browserType] || browserType;
        }());

        sys.browserVersion = '';
        /* Determine the browser version number */
        (function () {
            const versionReg1 = /(mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|uc|ucbs|360 aphone|360|baiduboxapp|baidu|maxthon|mxbrowser|miui(?:.hybrid)?)(mobile)?(browser)?\/?([\d.]+)/i;
            const versionReg2 = /(qq|chrome|safari|firefox|trident|opera|opr\/|oupeng)(mobile)?(browser)?\/?([\d.]+)/i;
            let tmp = versionReg1.exec(ua);
            if (!tmp) { tmp = versionReg2.exec(ua); }
            sys.browserVersion = tmp ? tmp[4] : '';
        }());

        const w = window.innerWidth || document.documentElement.clientWidth;
        const h = window.innerHeight || document.documentElement.clientHeight;
        const ratio = window.devicePixelRatio || 1;

        sys.windowPixelResolution = {
            width: ratio * w,
            height: ratio * h,
        };

        const _tmpCanvas1 = document.createElement('canvas');

        const create3DContext = function (canvas: HTMLCanvasElement, opt_attribs, opt_contextType): RenderingContext | null {
            if (opt_contextType) {
                try {
                    return canvas.getContext(opt_contextType, opt_attribs);
                } catch (e) {
                    return null;
                }
            } else {
                return create3DContext(canvas, opt_attribs, 'webgl')
                    || create3DContext(canvas, opt_attribs, 'experimental-webgl')
                    || create3DContext(canvas, opt_attribs, 'webkit-3d')
                    || create3DContext(canvas, opt_attribs, 'moz-webgl')
                    || null;
            }
        };

        try {
            let localStorage: Storage | null = sys.localStorage = window.localStorage;
            localStorage.setItem('storage', '');
            localStorage.removeItem('storage');
            localStorage = null;
        } catch (e) {
            const warn = function () {
                warnID(5200);
            };
            sys.localStorage = {
                getItem: warn,
                setItem: warn,
                removeItem: warn,
                clear: warn,
            };
        }

        // TODO: move into pal/input
        const win = window; const nav = win.navigator; const doc = document; const docEle = doc.documentElement;
        const capabilities = sys.capabilities;
        if (docEle.ontouchstart !== undefined || doc.ontouchstart !== undefined || nav.msPointerEnabled) {
            capabilities.touches = true;
        }
        if (docEle.onmouseup !== undefined) {
            capabilities.mouse = true;
        }
        if (docEle.onkeyup !== undefined) {
            capabilities.keyboard = true;
        }
        if (win.DeviceMotionEvent || win.DeviceOrientationEvent) {
            capabilities.accelerometer = true;
        }

        // HACK: this private property only needed on web
        sys.__isWebIOS14OrIPadOS14Env = (sys.os === OS.IOS || sys.os === OS.OSX) && system.isBrowser
            && /(OS 1[4-9])|(Version\/1[4-9])/.test(window.navigator.userAgent);

        system.onViewResize(() => {
            const viewSize = system.getViewSize();
            sys.windowPixelResolution = {
                width: viewSize.width * pixelRatio,
                height: viewSize.height * pixelRatio,
            };
        });
    },
};

sys.__init();

legacyCC.sys = sys;
