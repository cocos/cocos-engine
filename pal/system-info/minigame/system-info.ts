/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ALIPAY, BAIDU, BYTEDANCE, COCOSPLAY, HUAWEI, LINKSURE, HONOR, OPPO, QTT, VIVO, WECHAT, XIAOMI, DEBUG, TEST, TAOBAO, TAOBAO_MINIGAME, WECHAT_MINI_PROGRAM } from 'internal:constants';
import { minigame } from 'pal/minigame';
import { IFeatureMap } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event';
import { BrowserType, NetworkType, OS, Platform, Language, Feature } from '../enum-type';

// NOTE: register minigame platform here
let currentPlatform: Platform;
if (WECHAT) {
    currentPlatform = Platform.WECHAT_GAME;
} else if (WECHAT_MINI_PROGRAM) {
    currentPlatform = Platform.WECHAT_MINI_PROGRAM;
} else if (BAIDU) {
    currentPlatform = Platform.BAIDU_MINI_GAME;
} else if (XIAOMI) {
    currentPlatform = Platform.XIAOMI_QUICK_GAME;
} else if (ALIPAY) {
    currentPlatform = Platform.ALIPAY_MINI_GAME;
} else if (TAOBAO) {
    currentPlatform = Platform.TAOBAO_CREATIVE_APP;
} else if (TAOBAO_MINIGAME) {
    currentPlatform = Platform.TAOBAO_MINI_GAME;
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
} else if (HONOR) {
    currentPlatform = Platform.HONOR_MINI_GAME;
}

class SystemInfo extends EventTarget {
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
    public readonly isXR: boolean;
    private _featureMap: IFeatureMap;
    private _initPromise: Promise<void>[];

    constructor () {
        super();
        const minigameSysInfo = minigame.getSystemInfoSync();
        this.networkType = NetworkType.LAN;  // TODO
        this.isNative = false;
        this.isBrowser = false;

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
        } else if (minigamePlatform === 'windows') {
            this.os = OS.WINDOWS;
        } else {
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

        // init isMobile and platform
        this.platform = currentPlatform;
        this.isMobile = this.os !== OS.WINDOWS;

        // init browserType and browserVersion
        this.browserType = BrowserType.UNKNOWN;
        this.browserVersion = '';

        this.isXR = false;

        const isPCWechat = WECHAT && this.os === OS.WINDOWS && !minigame.isDevTool;
        this._featureMap = {
            [Feature.WEBP]: false,      // Initialize in Promise,
            [Feature.IMAGE_BITMAP]: false,
            [Feature.WEB_VIEW]: false,
            [Feature.VIDEO_PLAYER]: WECHAT || WECHAT_MINI_PROGRAM || OPPO,
            [Feature.SAFE_AREA]: WECHAT || WECHAT_MINI_PROGRAM || BYTEDANCE,

            [Feature.INPUT_TOUCH]: !isPCWechat,
            [Feature.EVENT_KEYBOARD]: isPCWechat,
            [Feature.EVENT_MOUSE]: isPCWechat,
            [Feature.EVENT_TOUCH]: true,
            [Feature.EVENT_ACCELEROMETER]: !isPCWechat,
            [Feature.EVENT_GAMEPAD]: false,
            [Feature.EVENT_HANDLE]: this.isXR,
            [Feature.EVENT_HMD]: this.isXR,
            [Feature.EVENT_HANDHELD]: false,
        };

        this._initPromise = [];
        this._initPromise.push(this._supportsWebpPromise());

        this._registerEvent();
    }

    private _supportsWebpPromise (): Promise<void> {
        if (!TEST) {
            return this._supportsWebp().then((isSupport) => {
                this._setFeature(Feature.WEBP, isSupport);
            });
        }
        return Promise.resolve();
    }

    private _supportsWebp (): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (WECHAT_MINI_PROGRAM) {
                resolve(true);
                return;
            }
            // HACK: webp base64 doesn't support on Wechat Android, which reports some internal error log.
            if (WECHAT && this.os === OS.ANDROID) {
                resolve(false);
                return;
            }
            try {
                const img = document.createElement('img');
                const timer = setTimeout(() => {
                    resolve(false);
                }, 500);
                img.onload = function onload () {
                    clearTimeout(timer);
                    const result = (img.width > 0) && (img.height > 0);
                    resolve(result);
                };
                img.onerror = function onerror (err) {
                    clearTimeout(timer);
                    if (DEBUG) {
                        console.warn('Create Webp image failed, message: '.concat(err.toString()));
                    }
                    resolve(false);
                };
                img.src = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';
            } catch (error) {
                resolve(false);
            }
        });
    }

    private _registerEvent () {
        minigame.onHide(() => {
            this.emit('hide');
        });
        minigame.onShow(() => {
            this.emit('show');
        });
    }

    private _setFeature (feature: Feature, value: boolean) {
        return this._featureMap[feature] = value;
    }

    public init (): Promise<void[]> {
        return Promise.all(this._initPromise);
    }

    public hasFeature (feature: Feature): boolean {
        return this._featureMap[feature];
    }

    public getBatteryLevel (): number {
        return minigame.getBatteryInfoSync().level / 100;
    }
    public triggerGC (): void {
        minigame.triggerGC?.();
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
        minigame.exitMiniProgram?.();
    }
}

export const systemInfo = new SystemInfo();
