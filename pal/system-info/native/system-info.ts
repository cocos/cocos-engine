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

import { IFeatureMap } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event';
import { BrowserType, NetworkType, OS, Platform, Language, Feature } from '../enum-type';

const networkTypeMap: Record<string, NetworkType> = {
    0: NetworkType.NONE,
    1: NetworkType.LAN,
    2: NetworkType.WWAN,
};
const platformMap: Record<number, Platform> = {
    0: Platform.WIN32,
    // 1 is Linux platform in native engine
    2: Platform.MACOS,
    3: Platform.ANDROID,
    // 4 is IPHONE
    4: Platform.IOS,
    // 5 is IPAD
    5: Platform.IOS,
    6: Platform.OHOS,
};

class SystemInfo extends EventTarget {
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
    // TODO: need to wrap the function __isObjectValid()

    public get networkType (): NetworkType {
        return networkTypeMap[jsb.device.getNetworkType()];
    }

    constructor () {
        super();
        this.isNative = true;
        this.isBrowser = false;

        // @ts-expect-error __getPlatform()
        this.platform = platformMap[__getPlatform()];
        this.isMobile = this.platform === Platform.ANDROID || this.platform === Platform.IOS || this.platform === Platform.OHOS;

        // init isLittleEndian
        this.isLittleEndian = (() => {
            const buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true);
            // Int16Array uses the platform's endianness.
            return new Int16Array(buffer)[0] === 256;
        })();

        // init languageCode and language
        // @ts-expect-error __getCurrentLanguageCode() defined in JSB
        const currLanguage = __getCurrentLanguageCode();
        this.nativeLanguage = currLanguage ? currLanguage.toLowerCase() : Language.UNKNOWN;
        // @ts-expect-error __getCurrentLanguage() defined in JSB
        this.language = __getCurrentLanguage();

        // @ts-expect-error __getOS() defined in JSB
        this.os = __getOS();
        // @ts-expect-error __getOSVersion() defined in JSB
        this.osVersion = __getOSVersion();
        this.osMainVersion = parseInt(this.osVersion);

        // init browserType and browserVersion
        this.browserType = BrowserType.UNKNOWN;
        this.browserVersion = '';

        this.isXR = (typeof xr !== 'undefined' && typeof xr.XrEntry !== 'undefined');

        this._featureMap = {
            [Feature.WEBP]: true,
            [Feature.IMAGE_BITMAP]: false,
            [Feature.WEB_VIEW]: this.isMobile,
            [Feature.VIDEO_PLAYER]: this.isMobile,
            [Feature.SAFE_AREA]: this.isMobile,

            [Feature.INPUT_TOUCH]: this.isMobile,
            [Feature.EVENT_KEYBOARD]: true,
            [Feature.EVENT_MOUSE]: !this.isMobile,
            [Feature.EVENT_TOUCH]: true,
            [Feature.EVENT_ACCELEROMETER]: this.isMobile,
            [Feature.EVENT_GAMEPAD]: true,
            [Feature.EVENT_HANDLE]: this.isXR,
            [Feature.EVENT_HMD]: this.isXR,
            [Feature.EVENT_HANDHELD]: (typeof xr !== 'undefined' && typeof xr.ARModule !== 'undefined'),
        };

        this._initPromise = [];

        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onPause = () => {
            this.emit('hide');
        };
        jsb.onResume = () => {
            this.emit('show');
        };
        jsb.onClose = () => {
            this.emit('close');
        };
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
        return jsb.device.getBatteryLevel();
    }
    public triggerGC (): void {
        jsb.garbageCollect();
    }
    public openURL (url: string): void {
        jsb.openURL(url);
    }
    public now (): number {
        if (Date.now) {
            return Date.now();
        }

        return +(new Date());
    }
    public restartJSVM (): void {
        // @ts-expect-error __restartVM() is defined in JSB
        __restartVM();
    }

    public close () {
        // @ts-expect-error __close() is defined in JSB
        __close();
    }
}

export const systemInfo = new SystemInfo();
