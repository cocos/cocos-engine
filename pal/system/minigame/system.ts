import { ALIPAY, BAIDU, BYTEDANCE, COCOSPLAY, HUAWEI, LINKSURE, OPPO, QTT, VIVO, WECHAT, XIAOMI, DEBUG, EDITOR, TEST } from 'internal:constants';
import { SafeAreaEdge, SupportCapability } from 'pal/system';
import { minigame } from 'pal/minigame';
import { Size } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { BrowserType, NetworkType, Orientation, OS, Platform, AppEvent, Language } from '../enum-type';

// NOTE: register minigame platform here
let currentPlatform: Platform;
if (WECHAT) {
    currentPlatform = Platform.WECHAT_GAME;
} else if (BAIDU) {
    currentPlatform = Platform.BAIDU_MINI_GAME;
} else if (XIAOMI) {
    currentPlatform = Platform.XIAOMI_QUICK_GAME;
} else if (ALIPAY) {
    currentPlatform = Platform.ALIPAY_MINI_GAME;
} else if (BYTEDANCE) {
    currentPlatform = Platform.BYTEDANCE_MINI_GAME;
} else if (OPPO) {
    currentPlatform = Platform.OPPO_MINI_GAME;
} else if (VIVO) {
    currentPlatform = Platform.VIVO_MINI_GAME;
} else if (HUAWEI) {
    currentPlatform = Platform.HUAWEI_QUICK_GAME;
} else if (COCOSPLAY) {
    currentPlatform = Platform.COCOSPLAY;
} else if (LINKSURE) {
    currentPlatform = Platform.LINKSURE_MINI_GAME;
} else if (QTT) {
    currentPlatform = Platform.QTT_MINI_GAME;
}

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

    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        const minigameSysInfo = minigame.getSystemInfoSync();
        this.networkType = NetworkType.LAN;  // TODO
        this.isNative = false;
        this.isBrowser = false;

        // init isMobile and platform
        this.platform = currentPlatform;
        this.isMobile = !minigame.isDevTool;  // TODO: pc-game ?

        // init isLittleEndian
        this.isLittleEndian = (() => {
            const buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true);
            // Int16Array uses the platform's endianness.
            return new Int16Array(buffer)[0] === 256;
        })();

        // init languageCode and language
        this.nativeLanguage = minigameSysInfo.language;
        this.language = minigameSysInfo.language.substr(0, 2) as Language;

        // init os, osVersion and osMainVersion
        const minigamePlatform = minigameSysInfo.platform.toLocaleLowerCase();
        if (minigamePlatform === 'android') {
            this.os = OS.ANDROID;
        } else if (minigamePlatform === 'ios') {
            this.os = OS.IOS;
        } else {
            // TODO: pc-game ?
            this.os = OS.UNKNOWN;
        }
        let minigameSystem = minigameSysInfo.system.toLowerCase();
        // Adaptation to Android P
        if (minigameSystem === 'android p') {
            minigameSystem = 'android p 9.0';
        }
        const version = /[\d.]+/.exec(minigameSystem);
        this.osVersion = version ? version[0] : minigameSystem;
        this.osMainVersion = parseInt(this.osVersion);

        // init browserType and browserVersion
        this.browserType = BrowserType.UNKNOWN;
        this.browserVersion = '';

        this.pixelRatio = minigameSysInfo.pixelRatio;

        // init capability
        const _tmpCanvas1 = document.createElement('canvas');  // TODO: remove this
        let supportWebp;
        try {
            supportWebp = TEST ? false : _tmpCanvas1.toDataURL('image/webp').startsWith('data:image/webp');
        } catch (e) {
            supportWebp  = false;
        }
        this.supportCapability = {
            webp: supportWebp,  // TODO
            gl: true,
            canvas: true,
            imageBitmap: false,
        };

        this._registerEvent();
    }

    private _registerEvent () {
        // TODO: onResize or onOrientationChange is not supported well
        minigame.onHide(() => {
            this._eventTarget.emit(AppEvent.HIDE);
        });
        minigame.onShow(() => {
            this._eventTarget.emit(AppEvent.SHOW);
        });
    }

    public getViewSize (): Size {
        const sysInfo = minigame.getSystemInfoSync();
        return new Size(sysInfo.screenWidth, sysInfo.screenHeight);
    }
    public getOrientation (): Orientation {
        return minigame.orientation;
    }
    public getSafeAreaEdge (): SafeAreaEdge {
        const minigameSafeArea = minigame.getSafeArea();
        const viewSize = this.getViewSize();
        let topEdge = minigameSafeArea.top;
        let bottomEdge = viewSize.height - minigameSafeArea.bottom;
        let leftEdge = minigameSafeArea.left;
        let rightEdge = viewSize.width - minigameSafeArea.right;
        const orientation = this.getOrientation();
        // Make it symmetrical.
        if (orientation === Orientation.PORTRAIT) {
            if (topEdge < bottomEdge) {
                topEdge = bottomEdge;
            } else {
                bottomEdge = topEdge;
            }
        } else if (leftEdge < rightEdge) {
            leftEdge = rightEdge;
        } else {
            rightEdge = leftEdge;
        }
        return {
            top: topEdge,
            bottom: bottomEdge,
            left: leftEdge,
            right: rightEdge,
        };
    }
    public getBatteryLevel (): number {
        return minigame.getBatteryInfoSync().level / 100;
    }
    public triggerGC (): void {
        minigame.triggerGC();
    }
    public openURL (url: string): void {
        if (DEBUG) {
            console.warn('openURL is not supported');
        }
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
        // TODO: minigame.exitMiniProgram() not implemented.
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
    public onViewResize (cb: () => void) {
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
    public offViewResize (cb?: () => void) {
        this._eventTarget.off(AppEvent.RESIZE, cb);
    }
    public offOrientationChange (cb?: () => void) {
        this._eventTarget.off(AppEvent.ORIENTATION_CHANGE, cb);
    }
}

export const system = new System();
