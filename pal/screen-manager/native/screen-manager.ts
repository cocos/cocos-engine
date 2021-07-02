import { SafeAreaEdge } from 'pal/screenManager';
import { systemInfo } from 'pal/systemInfo';
import { EventTarget } from '../../../cocos/core';
import { Size } from '../../../cocos/core/math';
import { ScreenEvent, Orientation } from '../enum-type';

// these value is defined in the native layer
const orientationMap: Record<string, Orientation> = {
    0: Orientation.PORTRAIT,
    '-90': Orientation.LANDSCAPE_LEFT,
    90: Orientation.LANDSCAPE_RIGHT,
    180: Orientation.PORTRAIT_UPSIDE_DOWN,
};

class ScreenManager {
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onResize = (size) => {
            if (size.width === 0 || size.height === 0) return;
            size.width /= systemInfo.pixelRatio;
            size.height /= systemInfo.pixelRatio;

            // TODO: remove this function calling
            window.resize(size.width, size.height);
            this._eventTarget.emit(ScreenEvent.SCREEN_RESIZE);
        };
        jsb.onOrientationChanged = (event) => {
            this._eventTarget.emit(ScreenEvent.ORIENTATION_CHANGE);
        };
    }

    public get supportFullScreen (): boolean {
        return false;
    }
    public get isOnFullScreen (): boolean {
        return false;
    }
    public get screenSize (): Size {
        return new Size(window.innerWidth, window.innerHeight);
    }
    public get orientation (): Orientation {
        return orientationMap[jsb.device.getDeviceOrientation()];
    }
    public get safeAreaEdge (): SafeAreaEdge {
        const nativeSafeArea = jsb.device.getSafeAreaEdge();
        let topEdge = nativeSafeArea.x;
        let bottomEdge = nativeSafeArea.z;
        let leftEdge = nativeSafeArea.y;
        let rightEdge = nativeSafeArea.w;
        const orientation = this.orientation;
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
    public resizeScreen (size: Size): Promise<void> {
        return Promise.reject(new Error('screen resize has not been supported yet on this platform.'));
    }
    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen has not been supported yet on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen has not been supported yet on this platform.'));
    }

    public onFullScreenChange (cb: () => void) {
        this._eventTarget.on(ScreenEvent.FULLSCREEN_CHANGE, cb);
    }
    public onScreenResize (cb: () => void) {
        this._eventTarget.on(ScreenEvent.SCREEN_RESIZE, cb);
    }
    public onOrientationChange (cb: () => void) {
        this._eventTarget.on(ScreenEvent.ORIENTATION_CHANGE, cb);
    }
    public offFullScreenChange (cb?: () => void) {
        this._eventTarget.off(ScreenEvent.FULLSCREEN_CHANGE, cb);
    }
    public offScreenResize (cb?: () => void) {
        this._eventTarget.off(ScreenEvent.SCREEN_RESIZE, cb);
    }
    public offOrientationChange (cb?: () => void) {
        this._eventTarget.off(ScreenEvent.ORIENTATION_CHANGE, cb);
    }
}

export const screenManager = new ScreenManager();
