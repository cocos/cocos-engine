import { minigame } from 'pal/minigame';
import { SafeAreaEdge } from 'pal/screen-adapter';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { Orientation } from '../enum-type';

class ScreenAdapter extends EventTarget {
    constructor () {
        super();
        // TODO: onResize or onOrientationChange is not supported well
    }

    public get supportFullScreen (): boolean {
        return false;
    }
    public get isFullScreen (): boolean {
        return false;
    }
    public get windowSize (): Size {
        const sysInfo = minigame.getSystemInfoSync();
        return new Size(sysInfo.screenWidth, sysInfo.screenHeight);
    }
    public set windowSize (size: Size) {
        console.warn('Setting window size is not supported on this platform.');
    }
    public get orientation (): Orientation {
        return minigame.orientation;
    }
    public get safeAreaEdge (): SafeAreaEdge {
        const minigameSafeArea = minigame.getSafeArea();
        const windowSize = this.windowSize;
        let topEdge = minigameSafeArea.top;
        let bottomEdge = windowSize.height - minigameSafeArea.bottom;
        let leftEdge = minigameSafeArea.left;
        let rightEdge = windowSize.width - minigameSafeArea.right;
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
    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen is not supported on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen is not supported on this platform.'));
    }
}

export const screenAdapter = new ScreenAdapter();
