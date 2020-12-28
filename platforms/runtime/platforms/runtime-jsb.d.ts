declare module jsb {
    // Accelerometer
    export function startAccelerometer (cb: Function): void;
    export function stopAccelerometer (cb?: Function): void;
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
    export function onWindowResize (cb: (width: number, height: number) => void): void;

    // Audio
    export module AudioEngine {}

    // Video
    export function createVideo (): any;

    // Fs
    export function getFileSystemManager (): any;
    export function downloadFile (option: any): void;
    export module fsUtils {}

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
    export function getBatteryInfoSync (): number;

    export function onShow (cb: Function): void;
    export function onHide (cb: Function): void;
    export function offShow (cb?: Function): void;
    export function offHide (cb?: Function): void;

    export function createCanvas (): HTMLCanvasElement;
    export function createImage (): HTMLImageElement;
    export function loadSubpackage (name: string, cb: Function): void;
    export let loadImageData: any;  // TODO

    // Font
    export function loadFont (fontUrl: string): string;

    // Keyboard
    export function showKeyboard (res: Record<string, any>): void;
    export function hideKeyboard (): void;

    export function onKeyboardConfirm (cb: Function): void;
    export function onKeyboardComplete (cb: Function): void;
    export function onKeyboardInput (cb: Function): void;
    
    export function offKeyboardInput (cb?: Function | null): void;
    export function offKeyboardConfirm (cb?: Function | null): void;
    export function offKeyboardComplete (cb?: Function | null): void;
}