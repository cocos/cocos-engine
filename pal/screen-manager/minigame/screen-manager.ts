import { minigame } from 'pal/minigame';
import { SafeAreaEdge } from 'pal/screenManager';
import { EventTarget } from '../../../cocos/core';
import { Size } from '../../../cocos/core/math';
import { ScreenEvent, Orientation } from '../enum-type';

class ScreenManager {
    private _eventTarget: EventTarget = new EventTarget();

    constructor () {
        // TODO: onResize or onOrientationChange is not supported well
    }

    public get supportFullScreen (): boolean {
        return false;
    }
    public get isOnFullScreen (): boolean {
        return false;
    }
    public get screenSize (): Size {
        const sysInfo = minigame.getSystemInfoSync();
        return new Size(sysInfo.screenWidth, sysInfo.screenHeight);
    }
    public get orientation (): Orientation {
        return minigame.orientation;
    }
    public get safeAreaEdge (): SafeAreaEdge {
        const minigameSafeArea = minigame.getSafeArea();
        const screenSize = this.screenSize;
        let topEdge = minigameSafeArea.top;
        let bottomEdge = screenSize.height - minigameSafeArea.bottom;
        let leftEdge = minigameSafeArea.left;
        let rightEdge = screenSize.width - minigameSafeArea.right;
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
        return Promise.reject(new Error('screen resize is not supported on this platform.'));
    }
    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen is not supported on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen is not supported on this platform.'));
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
