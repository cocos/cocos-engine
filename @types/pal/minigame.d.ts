declare module 'pal/minigame' {
    export const minigame: IMiniGame;
    export interface IMiniGame {
        // platform related
        wx?: WeChatAPI;
        tt?: ByteDanceAPI;

        // system
        isDevTool: boolean;
        isLandscape: boolean;
        orientation: import('pal/screen-adapter/enum-type').Orientation;
        getSystemInfoSync(): SystemInfo;
        onShow(callback: () => void): void;
        offShow(callback: () => void): void;
        onHide(callback: () => void): void;
        offHide(callback: () => void): void;
        /**
         * This method returns the standardized SafeArea based on the screen coordinate system,
         * which is not affected by the orientation of the screen.
         * @returns {SafeArea} An interface displaying the data of safe area, including 'top', 'bottom', 'left', 'right', 'width' and 'height'.
         */
        getSafeArea(): SafeArea;
        triggerGC(): void;
        getBatteryInfoSync(): BatteryInfo;

        // render
        getSharedCanvas(): any;
        getOpenDataContext(): any;

        // file system
        getFileSystemManager(): FileSystemManager;

        // input
        onTouchStart: IEventManager<TouchEvent>;
        onTouchMove: IEventManager<TouchEvent>;
        onTouchEnd: IEventManager<TouchEvent>;
        onTouchCancel: IEventManager<TouchEvent>;

        // audio
        createInnerAudioContext(): InnerAudioContext;
        onAudioInterruptionBegin(callback: () => void): any;
        offAudioInterruptionBegin(callback: () => void): any;
        onAudioInterruptionEnd(callback: () => void): any;
        offAudioInterruptionEnd(callback: () => void): any;

        // font
        loadFont(url: string): string;

        // device
        onAccelerometerChange(cb: AccelerometerChangeCallback);
        offAccelerometerChange(cb?: AccelerometerChangeCallback);
        startAccelerometer(obj: AccelerometerStartParameter);
        stopAccelerometer(obj: AccelerometerStopParameter);
    }

    interface WeChatAPI {
        onKeyDown?: (cb: (res: KeyboardEventData) => void) => void;
        onKeyUp?: (cb: (res: KeyboardEventData) => void) => void;

        onMouseDown?: (cb: (res: MouseEventData) => void) => void;
        onMouseMove?: (cb: (res: MouseEventData) => void) => void;
        onMouseUp?: (cb: (res: MouseEventData) => void) => void;
        onWheel?: (cb: (res: MouseWheelEventData) => void) => void;
    }

    export interface KeyboardEventData {
        key: string;
        code: string;
        timeStamp: number;
    }

    export interface MouseEventData {
        x: number;
        y: number;
        button: number;
        timeStamp: number;
    }

    export interface MouseWheelEventData extends MouseEventData {
        deltaX: number;
        deltaY: number;
        deltaZ: number;
    }
    interface ByteDanceAPI {
        getAudioContext?: () => AudioContext;
    }

    export type AccelerometerIntervalMode = 'game' | 'ui' | 'normal';

    export interface AccelerometerStartParameter {
        interval: AccelerometerIntervalMode,
        success?: () => void,
        fail?: (err: any) => void,
        complete?: () => void,
    }
    export interface AccelerometerStopParameter {
        success?: () => void,
        fail?: (err: any) => void,
        complete?: () => void,
    }

    export interface SystemInfo {
        brand: string;
        model: string;
        pixelRatio: number;
        screenWidth: number;
        screenHeight: number;
        windowWidth: number;
        windowHeight: number;
        statusBarHeight: number;
        language: string;
        version: string;
        system: string;
        platform: string;
        fontSizeSetting: number;
        SDKVersion: string;
        benchmarkLevel: number;
        albumAuthorized: boolean;
        cameraAuthorized: boolean;
        locationAuthorized: boolean;
        microphoneAuthorized: boolean;
        notificationAuthorized: boolean;
        notificationAlertAuthorized: boolean;
        notificationBadgeAuthorized: boolean;
        notificationSoundAuthorized: boolean;
        bluetoothEnabled: boolean;
        locationEnabled: boolean;
        wifiEnabled: boolean;
        safeArea: SafeArea;
        locationReducedAccuracy: boolean;
        theme: string;
        deviceOrientation?: 'portrait' | 'landscape';
    }

}

declare interface BatteryInfo {
    level: number;  // ranged from 1-100
    isCharging: boolean;
}

type AccelerometerChangeCallback = (res: AccelerometerData) => void;
declare interface AccelerometerData {
    x: number,
    y: number,
    z: number,
}

declare interface IEventManager<Event> {
    (listener: (event: Event) => void): void;
}

declare class FileSystemManager {
    access(obj: any);
    accessSync(path: string): boolean;
    appendFile(obj: any);
    appendFileSync(filePath: string, data: string|ArrayBuffer, encoding: string);
    copyFile(obj: any);
    copyFileSync(srcPath: string, destPath: string);
    getFileInfo(obj: any);
    getSavedFileList(obj: any);
    mkdir(obj: any);
    mkdirSync();
    readdir(obj: any);
    readdirSync();
    readFile(obj: any);
    readFileSync();
    removeSavedFile(obj: any);
    rename(obj: any);
    renameSync();
    rmdir(obj: any);
    rmdirSync();
    saveFile(obj: any);
    saveFileSync();
    stat(obj: any);
    statSync();
    unlink(obj: any);
    unlinkSync();
    unzip(obj: any);
    writeFile(obj: any);
    writeFileSync();
}
declare interface SafeArea {
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number;
}

declare class InnerAudioContext {
    src: string;
    startTime: number;
    autoplay: boolean;
    loop: boolean;
    obeyMuteSwitch: boolean;
    volume: number;
    duration: number;
    currentTime: number;
    paused: boolean;
    buffered: number;

    destroy(): any;
    offCanplay(callback: () => void): any;
    offEnded(callback: () => void): any;
    offError(callback: (err: any) => void): any;
    offPause(callback: () => void): any;
    offPlay(callback: () => void): any;
    offSeeked(callback: () => void): any;
    offSeeking(callback: () => void): any;
    offStop(callback: () => void): any;
    offTimeUpdate(callback: () => void): any;
    offWaiting(callback: () => void): any;
    onCanplay(callback: () => void): any;
    onEnded(callback: () => void): any;
    onError(callback: (err: any) => void): any;
    onPause(callback: () => void): any;
    onPlay(callback: () => void): any;
    onSeeked(callback: () => void): any;
    onSeeking(callback: () => void): any;
    onStop(callback: () => void): any;
    onTimeUpdate(callback: () => void): any;
    onWaiting(callback: () => void): any;
    pause(): any;
    play(): any;
    seek(position:number): any;
    stop(): any;
}
