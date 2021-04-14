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
    private _viewSize: Size = Size.ZERO;
    private _orientation: Orientation = Orientation.LANDSCAPE_LEFT;

    public get networkType (): NetworkType {
        return networkTypeMap[jsb.device.getNetworkType()];
    }

    constructor () {
        this.isNative = true;
        this.isBrowser = false;

        // @ts-expect-error __getPlatform()
        const platform = __getPlatform();  // TODO: need a platform map
        this.isMobile = false;  // TODO
        this.platform = Platform.MAC; // TODO

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
            webp: false,
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
            this._viewSize.width = size.width;
            this._viewSize.height = size.height;

            // TODO: remove this function calling
            window.resize(size.width, size.height);
            this._eventTarget.emit(AppEvent.RESIZE);
        };
        jsb.onOrientationChanged = (event) => {
            this._orientation = orientationMap[event.orientation.toString()];
            this._eventTarget.emit(AppEvent.ORIENTATION_CHANGE);
        };
        jsb.onPause = () => {
            this._eventTarget.emit(AppEvent.HIDE);
        };
        jsb.onResume = () => {
            this._eventTarget.emit(AppEvent.SHOW);
        };
    }

    public getViewSize (): Size {
        return this._viewSize.clone();
    }
    public getOrientation (): Orientation {
        return this._orientation;
    }
    public getSafeAreaEdge (): SafeAreaEdge {
        // jsb.device.getSafeAreaEdge()
        throw new Error('TODO');
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

    public onHide (cb: () => void) {
        this._eventTarget.on(AppEvent.HIDE, cb);
    }
    public onShow (cb: () => void) {
        this._eventTarget.on(AppEvent.SHOW, cb);
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
    public offViewResize (cb?: () => void) {
        this._eventTarget.off(AppEvent.RESIZE, cb);
    }
    public offOrientationChange (cb?: () => void) {
        this._eventTarget.off(AppEvent.ORIENTATION_CHANGE, cb);
    }
}

export const system = new System();
