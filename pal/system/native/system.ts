import { SafeAreaEdge, SupportCapability } from 'pal/system';
import { Size } from '../../../cocos/core/math';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { BrowserType, NetworkType, Orientation, OS, Platform, AppEvent, Language } from '../enum-type';

// these value is defined in the native layer
const orientationMap: Record<string, Orientation> = {
    0: Orientation.PORTRAIT,
    '-90': Orientation.LANDSCAPE_LEFT,
    90: Orientation.LANDSCAPE_RIGHT,
    180: Orientation.PORTRAIT_UPSIDE_DOWN,
};
const networkTypeMap: Record<string, NetworkType> = {
    // TODO
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
};

class System {
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

    private _eventTarget: EventTarget = new EventTarget();

    public get networkType (): NetworkType {
        return networkTypeMap[jsb.device.getNetworkType()];
    }

    constructor () {
        this.isNative = true;
        this.isBrowser = false;

        // @ts-expect-error __getPlatform()
        this.platform = platformMap[__getPlatform()];
        this.isMobile = this.platform === Platform.ANDROID || this.platform === Platform.IOS;

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
        jsb.onResize = (size) => {
            if (size.width === 0 || size.height === 0) return;
            size.width /= this.pixelRatio;
            size.height /= this.pixelRatio;

            // TODO: remove this function calling
            window.resize(size.width, size.height);
            this._eventTarget.emit(AppEvent.RESIZE);
        };
        jsb.onOrientationChanged = (event) => {
            this._eventTarget.emit(AppEvent.ORIENTATION_CHANGE);
        };
        jsb.onPause = () => {
            this._eventTarget.emit(AppEvent.HIDE);
        };
        jsb.onResume = () => {
            this._eventTarget.emit(AppEvent.SHOW);
        };
        jsb.onClose = () => {
            this._eventTarget.emit(AppEvent.CLOSE);
        };
    }

    public getViewSize (): Size {
        return new Size(window.innerWidth, window.innerHeight);
    }
    public getOrientation (): Orientation {
        return orientationMap[jsb.device.getDeviceOrientation()];
    }
    public getSafeAreaEdge (): SafeAreaEdge {
        const nativeSafeArea = jsb.device.getSafeAreaEdge();
        let topEdge = nativeSafeArea.x;
        let bottomEdge = nativeSafeArea.z;
        let leftEdge = nativeSafeArea.y;
        let rightEdge = nativeSafeArea.w;
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
