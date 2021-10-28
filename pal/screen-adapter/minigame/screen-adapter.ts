import { ALIPAY, BAIDU, COCOSPLAY, RUNTIME_BASED, VIVO } from 'internal:constants';
import { minigame } from 'pal/minigame';
import { SafeAreaEdge } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { warnID } from '../../../cocos/core/platform/debug';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { OS } from '../../system-info/enum-type';
import { Orientation } from '../enum-type';

// HACK: In some platform like CocosPlay or Alipay iOS end
// the windowSize need to rotate when init screenAdapter if it's landscape
let rotateLandscape = false;
try {
    if (ALIPAY) {
        if (systemInfo.os === OS.IOS && !minigame.isDevTool) {
            // @ts-expect-error TODO: use pal/fs
            const fs = my.getFileSystemManager();
            const screenOrientation = JSON.parse(fs.readFileSync({
                filePath: 'game.json',
                encoding: 'utf8',
            }).data).screenOrientation;
            rotateLandscape = (screenOrientation === 'landscape');
        }
    } else if (COCOSPLAY) {
        // @ts-expect-error TODO: use pal/fs
        const fs = ral.getFileSystemManager();
        const deviceOrientation = JSON.parse(fs.readFileSync('game.config.json', 'utf8')).deviceOrientation;
        rotateLandscape = (deviceOrientation === 'landscape');
    }
} catch (e) {
    console.error(e);
}

class ScreenAdapter extends EventTarget {
    public isFrameRotated = false;
    public handleResizeEvent = true;

    public get supportFullScreen (): boolean {
        return false;
    }
    public get isFullScreen (): boolean {
        return false;
    }

    public get devicePixelRatio () {
        if (VIVO) {
            // NOTE: wrong DPR on vivo platform
            return 1;
        }
        const sysInfo = minigame.getSystemInfoSync();
        return sysInfo.pixelRatio;
    }

    public get windowSize (): Size {
        const sysInfo = minigame.getSystemInfoSync();
        const dpr = this.devicePixelRatio;
        let screenWidth = sysInfo.screenWidth;
        let screenHeight = sysInfo.screenHeight;
        if ((COCOSPLAY || ALIPAY) && rotateLandscape  && screenWidth < screenHeight) {
            const temp = screenWidth;
            screenWidth = screenHeight;
            screenHeight = temp;
        }
        // NOTE: screen size info on Alipay is in physical pixel. No need to multiply with DPR.
        if (!ALIPAY && systemInfo.os === OS.ANDROID) {
            screenWidth *= dpr;
            screenHeight *= dpr;
        }
        return new Size(screenWidth, screenHeight);
    }
    public set windowSize (size: Size) {
        warnID(1221);
    }

    public get resolution () {
        return this._resolution;
    }
    public get resolutionScale () {
        return this._resolutionScale;
    }
    public set resolutionScale (value: number) {
        if (value === this._resolutionScale) {
            return;
        }
        this._resolutionScale = value;
        this._updateResolution();
    }

    public get orientation (): Orientation {
        return minigame.orientation;
    }
    public set orientation (value: Orientation) {
        console.warn('Setting orientation is not supported yet.');
    }

    public get safeAreaEdge (): SafeAreaEdge {
        const minigameSafeArea = minigame.getSafeArea();
        const windowSize = this.windowSize;
        const dpr = this.devicePixelRatio;
        let topEdge = minigameSafeArea.top * dpr;
        let bottomEdge = windowSize.height - minigameSafeArea.bottom * dpr;
        let leftEdge = minigameSafeArea.left * dpr;
        let rightEdge = windowSize.width - minigameSafeArea.right * dpr;
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

    private _cbToUpdateFrameBuffer?: () => void;
    private _resolution: Size = new Size(0, 0);
    private _resolutionScale = 1;

    constructor () {
        super();
        // TODO: onResize or onOrientationChange is not supported well
    }

    public init (cbToRebuildFrameBuffer: () => void) {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        this._updateResolution();
    }

    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen is not supported on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen is not supported on this platform.'));
    }

    private _updateResolution () {
        const windowSize = this.windowSize;
        // update resolution
        this._resolution.width = windowSize.width * this.resolutionScale;
        this._resolution.height = windowSize.height * this.resolutionScale;
        this._cbToUpdateFrameBuffer?.();
        this.emit('resolution-change');
    }
}

export const screenAdapter = new ScreenAdapter();
