declare module jsb {
    // Accelerometer
    // export module device {
    //     export function setMotionEnabled (enabled: boolean): void;
    //     export function dispatchDeviceMotionEvent (event: any): void;
    //     export function setMotionInterval (interval: number): void;
    // }
    // export function onAccelerometerChange (cb: Function): void;
    // export function offAccelerometerChange (cb?: Function | null): void;
    export function startAccelerometer (cb: Function): void;  // 补充
    export function stopAccelerometer (cb?: Function): void; // 补充
    export function setAccelerometerInterval (interval: number): void;

    // Touch
    export function onTouchStart(cb: Function): void;
    export function onTouchMove(cb: Function): void;
    export function onTouchCancel(cb: Function): void;
    export function onTouchEnd(cb: Function): void;
    
    export function offTouchStart(cb?: Function | null): void;
    export function offTouchMove(cb?: Function): void;
    export function offTouchCancel(cb?: Function | null): void;
    export function offTouchEnd(cb?: Function | null): void;

    // Window
    export function onWindowResize (cb: Function): void;

    // Audio
    export module AudioEngine {}

    // Fs
    export function getFileSystemManager (): any;  // 补充
    export function downloadFile (option: any): void;  // 补充

    // System
    export const env: any;
    export const platform: string;
    export const language: string;
    export const model: string;
    export const system: string;
    export const width: number;
    export const height: number;
    export const pixelRatio: number;
    export function setPreferredFramesPerSecond (fps: number): void;
    export function getBatteryInfoSync (): number;  // 补充

    export function onShow (cb: Function): void;  // 补充
    export function onHide (cb: Function): void;  // 补充
    export function offShow (cb?: Function): void;  // 补充
    export function offHide (cb?: Function): void;  // 补充

    export function createCanvas (): HTMLCanvasElement;
    export function createImage (): HTMLImageElement;
    export function loadImageData (): void;  // TODO: 函数签名不确定
    export function loadSubpackage (name: string, cb: Function): void;

    // Font
    export function loadFont (fontUrl: string): string;

    // Keyboard
    export function showKeyboard (res: Record<string, any>): void;
    export function hideKeyboard (): void;  // 补充

    export function onKeyboardConfirm (cb: Function): void;
    export function onKeyboardComplete (cb: Function): void;
    export function onKeyboardInput (cb: Function): void;
    
    export function offKeyboardInput (cb?: Function | null): void;
    export function offKeyboardConfirm (cb?: Function | null): void;
    export function offKeyboardComplete (cb?: Function | null): void;
}