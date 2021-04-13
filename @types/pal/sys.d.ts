declare module 'pal/sys' {
    export interface SupportCapability {
        readonly webp: boolean;
        readonly gl: boolean;
        readonly canvas: boolean;
        readonly imageBitmap: boolean;
    }

    class System {
        public readonly networkType: import('pal/sys/enum-type/network-type').NetworkType;
        public readonly isNative: boolean;
        public readonly isBrowser: boolean;
        public readonly isMobile: boolean;
        public readonly isLittleEndian: boolean;
        /**
         * Platform is a spacial field which is related to the build platform you choose on the Builder Panel in Cocos Creator.
         * It may point to an OS like Android or iOS.
         * It may point to a phone brand like vivo or OPPO.
         * Also it may point to an app channel like WeChat or ByteDance.
         */
        public readonly platform: import('pal/sys/enum-type').Platform;
        /**
         * This is the language code typed as `LanguageCode`.
         */
        public readonly languageCode: import('pal/sys/enum-type').LanguageCode;
        /**
         * This is the native value return by platform
         * The valid value can be 'zh-tw','en','en-us','fr','fr-fr','es-es' and so on.
         */
        public readonly nativeLanguageCode: string;
        public readonly os: import('pal/sys/enum-type').OS;
        public readonly osVersion: string;
        public readonly osMainVersion: number;
        public readonly browserType: import('pal/sys/enum-type').BrowserType;
        public readonly browserVersion: string;
        public readonly pixelRatio: number;
        public readonly supportCapability: SupportCapability;

        public getViewSize (): import('cocos/core/math').Size;
        public getOrientation (): import('pal/sys/enum-type').Orientation;
        public getSafeAreaRect (): import('cocos/core/math').Rect;
        public getBatteryLevel (): number;

        public triggerGC (): void;
        public openURL (url: string): void;
        public now (): number;
        public restartJSVM (): void;

        public onHide (cb: () => void);
        public onShow (cb: () => void);
        public onViewResize (cb: () => void);
        public onOrientationChange (cb: () => void);

        public offHide (cb?: () => void);
        public offShow (cb?: () => void);
        public offViewResize (cb?: () => void);
        public offOrientationChange (cb?: () => void);
    }

    export const system: System;
}