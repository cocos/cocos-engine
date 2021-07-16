import { SupportCapability } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { BrowserType, NetworkType, OS, Platform, Language } from '../enum-type';

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
    public readonly pixelRatio: number;
    public readonly supportCapability: SupportCapability;
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

        this.pixelRatio = jsb.device.getDevicePixelRatio() || 1;

        // init capability
        this.supportCapability = {
            webp: true,
            gl: true,
            canvas: true,
            imageBitmap: false,
        };

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
