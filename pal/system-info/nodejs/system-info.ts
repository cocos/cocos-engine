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
import { DEBUG } from 'internal:constants';
import { IFeatureMap } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event';
import { checkPalIntegrity, withImpl } from '../../integrity-check';
import { BrowserType, NetworkType, OS, Platform, Language, Feature } from '../enum-type';
import { warn } from '../../../cocos/core/platform/debug';

class SystemInfo extends EventTarget {
    public declare readonly networkType: NetworkType;
    public declare readonly isNative: boolean;
    public declare readonly isBrowser: boolean;
    public declare readonly isMobile: boolean;
    public declare readonly isLittleEndian: boolean;
    public declare readonly platform: Platform;
    public declare readonly language: Language;
    public declare readonly nativeLanguage: string;
    public declare readonly os: OS;
    public declare readonly osVersion: string;
    public declare readonly osMainVersion: number;
    public declare readonly browserType: BrowserType;
    public declare readonly browserVersion: string;
    public declare readonly isXR: boolean;
    private declare _featureMap: IFeatureMap;
    private _initPromise: Promise<void>[] = [];

    constructor () {
        super();

        this.networkType = NetworkType.LAN;  // TODO
        this.isNative = false;
        this.isBrowser = false;

        this.isMobile = false;
        this.platform = Platform.NODEJS_PAGE;  // TODO
  
        this.browserType = BrowserType.UNKNOWN;
        this.browserVersion = '';

        const osInfo = globalThis.nodeEnv.require('os');
        let osName = OS.UNKNOWN;
        if (osInfo.type().indexOf('wiWindows_NTn') !== -1) {
            osName = OS.WINDOWS;
        } else if (osInfo.type().indexOf('Darwin') !== -1) {
            osName = OS.OSX;
        } else if (osInfo.type().indexOf('Linux') !== -1) {
            osName = OS.LINUX;
        }
        this.os = osName;
        this.osVersion = osInfo.release();
        this.osMainVersion = parseInt(this.osVersion);

        // init isLittleEndian
        this.isLittleEndian = ((): boolean => {
            const buffer = new ArrayBuffer(2);
            new DataView(buffer).setInt16(0, 256, true);
            // Int16Array uses the platform's endianness.
            return new Int16Array(buffer)[0] === 256;
        })();

        // init languageCode and language
        let currLanguage = globalThis.nodeEnv.systemLanguage;
        this.nativeLanguage = currLanguage.toLowerCase();
        currLanguage = currLanguage ? currLanguage.split('-')[0] : Language.ENGLISH;
        this.language = currLanguage as Language;

        this.isXR = false;
        this._featureMap = {
            [Feature.WEBP]: true,
            [Feature.IMAGE_BITMAP]: false,
            [Feature.WEB_VIEW]: false,
            [Feature.VIDEO_PLAYER]: false,
            [Feature.SAFE_AREA]: false,
            [Feature.HPE]: false,

            [Feature.INPUT_TOUCH]: false,
            [Feature.EVENT_KEYBOARD]: false,
            [Feature.EVENT_MOUSE]: false,
            [Feature.EVENT_TOUCH]: false,
            [Feature.EVENT_ACCELEROMETER]: false,
            // NOTE: webkitGetGamepads is not standard web interface
            [Feature.EVENT_GAMEPAD]: false,
            [Feature.EVENT_HANDLE]: false,
            [Feature.EVENT_HMD]: false,
            [Feature.EVENT_HANDHELD]: false,
            [Feature.WASM]: true,
        };

    }

    public init (): Promise<void[]> {
        return Promise.all(this._initPromise);
    }

    public hasFeature (feature: Feature): boolean {
        return this._featureMap[feature];
    }

    public getBatteryLevel (): number {
        if (DEBUG) {
            warn("getBatteryLevel is not supported.");
        }
        return 1;
    }

    public triggerGC (): void {
        if (global.gc) {
            global.gc();
        }
    }

    public openURL (url: string): void {
        var open = globalThis.nodeEnv.require('open');
        open(url);
    }

    public now (): number {
        if (Date.now) {
            return Date.now();
        }

        return +(new Date());
    }
    
    public restartJSVM (): void {
        if (DEBUG) {
            warn('restartJSVM is not supported.');
        }
    }

    public exit (): void {
        globalThis.nodeEnv.process.exit();
    }

    public close (): void {
        this.emit('close');
    }
}

export const systemInfo = new SystemInfo();

checkPalIntegrity<typeof import('pal/system-info')>(withImpl<typeof import('./system-info')>());
