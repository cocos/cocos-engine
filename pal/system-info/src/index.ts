// TODO: some interface need to be designed in a module called 'Application' and 'Network'
import { Feature, NetworkType, Platform, Language, OS, BrowserType, PalSystemEvent } from './enum-type';

export * from './enum-type';

declare class SystemInfo {
    public get networkType (): NetworkType;
    public get isNative (): boolean;
    public get isBrowser (): boolean;
    public get isMobile (): boolean;
    public get isLittleEndian (): boolean;
    /**
     * Platform is a spacial field which is related to the build platform you choose on the Builder Panel in Cocos Creator.
     * It may point to an OS like Android or iOS.
     * It may point to a phone brand like vivo or OPPO.
     * Also it may point to an app channel like WeChat or ByteDance.
     */
    public get platform (): Platform;
    /**
     * This is the language code typed as `Language`.
     */
    public get language (): Language;
    /**
     * This is the native value return by platform
     * The valid value can be 'zh-tw','en','en-us','fr','fr-fr','es-es' and so on.
     */
    public get nativeLanguage (): string;
    public get os (): OS;
    public get osVersion (): string;
    public get osMainVersion (): number;
    public get browserType (): BrowserType;
    public get browserVersion (): string;
    public get isXR (): boolean;
    public init (): Promise<void[]> ;
    public hasFeature (feature: Feature): boolean;
    public getBatteryLevel (): number;

    public triggerGC (): void;
    public openURL (url: string): void;
    public now (): number;
    public restartJSVM (): void;
    /*
        * Trigger to exit the game
        */
    public close (): void;
    /*
        * Free the native's resources
        */
    public exit(): void;

    on (event: PalSystemEvent, cb: (...args: any) => void, target?: any): void;
    off (event: PalSystemEvent, cb?: (...args: any) => void, target?: any): void;
    // TODO: support onError
}

export declare const systemInfo: SystemInfo;
