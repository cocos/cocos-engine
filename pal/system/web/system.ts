import { DEBUG, EDITOR, TEST } from 'internal:constants';
import { SafeAreaEdge, SupportCapability } from 'pal/system';
import { Size } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { BrowserType, NetworkType, Orientation, OS, Platform, AppEvent, Language } from '../enum-type';
import { screenUtils } from './screen-utils';

class System {
    public readonly networkType: NetworkType;
    public readonly isNative: boolean;
    public readonly isBrowser: boolean;
    public readonly isMobile: boolean;
    public readonly isLittleEndian: boolean;
    public readonly platform: Platform;
    public readonly language: Language;
    public readonly nativeLanguage: string;
    public readonly os: OS;
    public readonly osVersion: string;
    public readonly osMainVersion: number;
    public readonly browserType: BrowserType;
    public readonly browserVersion: string;
    public readonly pixelRatio: number;
    public readonly supportCapability: SupportCapability;

    public get isOnFullScreen (): boolean {
        return screenUtils.isOnFullscreen;
    }

    private _eventTarget: EventTarget = new EventTarget();
    private _battery?: any;

    constructor () {
        const nav = window.navigator;
        const ua = nav.userAgent.toLowerCase();
        // @ts-expect-error getBattery is not totally supported
        nav.getBattery?.().then((battery) => {
            this._battery = battery;
        });

        this.networkType = NetworkType.LAN;  // TODO
        this.isNative = false;
        this.isBrowser = true;

        // init isMobile and platform
        if (EDITOR) {
            this.isMobile = false;
            this.platform = Platform.EDITOR_PAGE;  // TODO
        } else {
            this.isMobile = /mobile|android|iphone|ipad/.test(ua);
            this.platform = this.isMobile ? Platform.MOBILE_BROWSER : Platform.DESKTOP_BROWSER;
        }

        // init isLittleEndian
        this.isLittleEndian = (() => {
            const buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true);
            // Int16Array uses the platform's endianness.
            return new Int16Array(buffer)[0] === 256;
        })();

        // init languageCode and language
        let currLanguage = nav.language;
        this.nativeLanguage = currLanguage.toLowerCase();
        currLanguage = currLanguage || (nav as any).browserLanguage;
        currLanguage = currLanguage ? currLanguage.split('-')[0] : Language.ENGLISH;
        this.language = currLanguage as Language;

        // init os, osVersion and osMainVersion
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

        let osName = OS.UNKNOWN;
        if (nav.appVersion.indexOf('Win') !== -1) {
            osName = OS.WINDOWS;
        } else if (iOS) {
            osName = OS.IOS;
        } else if (nav.appVersion.indexOf('Mac') !== -1) {
            osName = OS.OSX;
        } else if (nav.appVersion.indexOf('X11') !== -1 && nav.appVersion.indexOf('Linux') === -1) {
            osName = OS.LINUX;
        } else if (isAndroid) {
            osName = OS.ANDROID;
        } else if (nav.appVersion.indexOf('Linux') !== -1 || ua.indexOf('ubuntu') !== -1) {
            osName = OS.LINUX;
        }

        this.os = osName;
        this.osVersion = osVersion;
        this.osMainVersion = osMajorVersion;

        // TODO: use dack-type to determine the browserType
        // init browserType and browserVersion
        this.browserType = BrowserType.UNKNOWN;
        const typeReg0 = /wechat|weixin|micromessenger/i;
        const typeReg1 = /mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|ucbs|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|mxbrowser|miuibrowser/i;
        const typeReg2 = /qq|qqbrowser|ucbrowser|ubrowser|edge|HuaweiBrowser/i;
        const typeReg3 = /chrome|safari|firefox|trident|opera|opr\/|oupeng/i;
        const browserTypes = typeReg0.exec(ua) || typeReg1.exec(ua) || typeReg2.exec(ua) || typeReg3.exec(ua);

        let browserType = browserTypes ? browserTypes[0].toLowerCase() : OS.UNKNOWN;
        if (browserType === 'safari' && isAndroid) {
            browserType = BrowserType.ANDROID;
        } else if (browserType === 'qq' && /android.*applewebkit/i.test(ua)) {
            browserType = BrowserType.ANDROID;
        }
        const typeMap = {
            micromessenger: BrowserType.WECHAT,
            wechat: BrowserType.WECHAT,
            weixin: BrowserType.WECHAT,
            trident: BrowserType.IE,
            edge: BrowserType.EDGE,
            '360 aphone': BrowserType.BROWSER_360,
            mxbrowser: BrowserType.MAXTHON,
            'opr/': BrowserType.OPERA,
            ubrowser: BrowserType.UC,
            huaweibrowser: BrowserType.HUAWEI,
        };

        this.browserType = typeMap[browserType] || browserType;

        // init browserVersion
        this.browserVersion = '';
        const versionReg1 = /(mqqbrowser|micromessenger|qqbrowser|sogou|qzone|liebao|maxthon|uc|ucbs|360 aphone|360|baiduboxapp|baidu|maxthon|mxbrowser|miui(?:.hybrid)?)(mobile)?(browser)?\/?([\d.]+)/i;
        const versionReg2 = /(qq|chrome|safari|firefox|trident|opera|opr\/|oupeng)(mobile)?(browser)?\/?([\d.]+)/i;
        let tmp = versionReg1.exec(ua);
        if (!tmp) {
            tmp = versionReg2.exec(ua);
        }
        this.browserVersion = tmp ? tmp[4] : '';

        this.pixelRatio = window.devicePixelRatio || 1;

        // init capability
        const _tmpCanvas1 = document.createElement('canvas');
        const supportCanvas = TEST ? false : !!_tmpCanvas1.getContext('2d');
        let supportWebGL = false;
        if (TEST) {
            supportWebGL = false;
        } else if (window.WebGLRenderingContext) {
            supportWebGL = true;
        }
        let supportWebp;
        try {
            supportWebp = TEST ? false : _tmpCanvas1.toDataURL('image/webp').startsWith('data:image/webp');
        } catch (e) {
            supportWebp  = false;
        }
        let supportImageBitmap = false;
        if (!TEST && typeof createImageBitmap !== 'undefined' && typeof Blob !== 'undefined') {
            _tmpCanvas1.width = _tmpCanvas1.height = 2;
            createImageBitmap(_tmpCanvas1, {}).then((imageBitmap) => {
                supportImageBitmap = true;
                imageBitmap?.close();
            }).catch((err) => {});
        }
        this.supportCapability = {
            webp: supportWebp,
            gl: supportWebGL,
            canvas: supportCanvas,
            imageBitmap: supportImageBitmap,
            fullscreen: screenUtils.supportsFullScreen,
        };
        this._isOnFullScreen = false;

        this._registerEvent();
    }

    private _registerEvent () {
        window.addEventListener('resize', () => {
            this._eventTarget.emit(AppEvent.RESIZE);
        });
        window.addEventListener('orientationchange', () => {
            this._eventTarget.emit(AppEvent.ORIENTATION_CHANGE);
        });
        this._registerVisibilityEvent();
    }

    private _registerVisibilityEvent () {
        let hiddenPropName: string;
        if (typeof document.hidden !== 'undefined') {
            hiddenPropName = 'hidden';
        } else if (typeof document.mozHidden !== 'undefined') {
            hiddenPropName = 'mozHidden';
        } else if (typeof document.msHidden !== 'undefined') {
            hiddenPropName = 'msHidden';
        } else if (typeof document.webkitHidden !== 'undefined') {
            hiddenPropName = 'webkitHidden';
        } else {
            hiddenPropName = 'hidden';
        }

        let hidden = false;
        const onHidden = () => {
            if (!hidden) {
                hidden = true;
                this._eventTarget.emit(AppEvent.HIDE);
            }
        };
        // In order to adapt the most of platforms the onshow API.
        const onShown = (arg0?, arg1?, arg2?, arg3?, arg4?) => {
            if (hidden) {
                hidden = false;
                this._eventTarget.emit(AppEvent.SHOW, arg0, arg1, arg2, arg3, arg4);
            }
        };

        if (hiddenPropName) {
            const changeList = [
                'visibilitychange',
                'mozvisibilitychange',
                'msvisibilitychange',
                'webkitvisibilitychange',
                'qbrowserVisibilityChange',
            ];

            for (let i = 0; i < changeList.length; i++) {
                document.addEventListener(changeList[i], (event) => {
                    let visible = document[hiddenPropName];
                    // @ts-expect-error QQ App need hidden property
                    visible = visible || event.hidden;
                    if (visible) {
                        onHidden();
                    } else {
                        onShown();
                    }
                });
            }
        } else {
            window.addEventListener('blur', onHidden);
            window.addEventListener('focus', onShown);
        }

        if (window.navigator.userAgent.indexOf('MicroMessenger') > -1) {
            window.onfocus = onShown;
        }

        if ('onpageshow' in window && 'onpagehide' in window) {
            window.addEventListener('pagehide', onHidden);
            window.addEventListener('pageshow', onShown);
            // Taobao UIWebKit
            document.addEventListener('pagehide', onHidden);
            document.addEventListener('pageshow', onShown);
        }
    }

    public resizeScreen (size: Size): Promise<void> {
        throw new Error('TODO');
    }
    public requestFullScreen (): Promise<void> {
        return screenUtils.requestFullScreen();
    }
    public exitFullScreen (): Promise<void> {
        return screenUtils.exitFullScreen();
    }
    public getScreenSize (): Size {
        return screenUtils.getScreenSize();
    }
    public getOrientation (): Orientation {
        throw new Error('TODO');
    }
    public getSafeAreaEdge (): SafeAreaEdge {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
    }
    public getBatteryLevel (): number {
        if (this._battery) {
            return this._battery.level as number;
        } else {
            if (DEBUG) {
                console.warn('getBatteryLevel is not supported');
            }
            return 1;
        }
    }
    public triggerGC (): void {
        if (DEBUG) {
            console.warn('triggerGC is not supported.');
        }
    }
    public openURL (url: string): void {
        window.open(url);
    }
    public now (): number {
        if (Date.now) {
            return Date.now();
        }

        return +(new Date());
    }
    public restartJSVM (): void {
        if (DEBUG) {
            console.warn('restartJSVM is not supported.');
        }
    }

    public close () {
        this._eventTarget.emit(AppEvent.CLOSE);
        window.close();
    }

    public onHide (cb: () => void) {
        this._eventTarget.on(AppEvent.HIDE, cb);
    }
    public onShow (cb: () => void) {
        this._eventTarget.on(AppEvent.SHOW, cb);
    }
    public onClose (cb: () => void) {
        this._eventTarget.on(AppEvent.CLOSE, cb);
    }
    public onFullscreenChange (cb: () => void) {
        this._eventTarget.on(AppEvent.FULLSCREEN_CHANGE, cb);
    }
    public onScreenResize (cb: () => void) {
        this._eventTarget.on(AppEvent.RESIZE, cb);
    }
    public onOrientationChange (cb: () => void) {
        this._eventTarget.on(AppEvent.ORIENTATION_CHANGE, cb);
    }

    public offHide (cb?: () => void) {
        this._eventTarget.off(AppEvent.HIDE, cb);
    }
    public offShow (cb?: () => void) {
        this._eventTarget.off(AppEvent.SHOW, cb);
    }
    public offClose (cb?: () => void) {
        this._eventTarget.off(AppEvent.CLOSE, cb);
    }
    public offFullscreenChange (cb?: () => void) {
        this._eventTarget.off(AppEvent.FULLSCREEN_CHANGE, cb);
    }
    public offScreenResize (cb?: () => void) {
        this._eventTarget.off(AppEvent.RESIZE, cb);
    }
    public offOrientationChange (cb?: () => void) {
        this._eventTarget.off(AppEvent.ORIENTATION_CHANGE, cb);
    }
}

export const system = new System();
