import { ALIPAY, BAIDU, COCOSPLAY, RUNTIME_BASED } from 'internal:constants';
import { minigame } from 'pal/minigame';
import { SafeAreaEdge } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { OS } from '../../system-info/enum-type';
import { Orientation } from '../enum-type';

class ScreenAdapter extends EventTarget {
    private _cbToUpdateFrameBuffer?: () => void;
    public isFrameRotated = false;
    public handleResizeEvent = true;

    constructor () {
        super();
        // TODO: onResize or onOrientationChange is not supported well
    }

    public init (cbToRebuildFrameBuffer: () => void) {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        // HACK: In some platform like CocosPlay or Alipay iOS end
        // the windowSize need to rotate when init screenAdapter.
        let rotateWindowSize = false;
        try {
            if (ALIPAY) {
                if (systemInfo.os === OS.IOS && !minigame.isDevTool) {
                    // @ts-expect-error TODO: use pal/fs
                    const fs = my.getFileSystemManager();
                    const screenOrientation = JSON.parse(fs.readFileSync({
                        filePath: 'game.json',
                        encoding: 'utf8',
                    }).data).screenOrientation;
                    rotateWindowSize = (screenOrientation === 'landscape');
                }
            } else if (COCOSPLAY) {
                // @ts-expect-error TODO: use pal/fs
                const fs = ral.getFileSystemManager();
                const deviceOrientation = JSON.parse(fs.readFileSync('game.config.json', 'utf8')).deviceOrientation;
                rotateWindowSize = (deviceOrientation === 'landscape');
            }
        } catch (e) {
            console.error(e);
        }
        this._updateResolution(rotateWindowSize);
    }

    public get supportFullScreen (): boolean {
        return false;
    }
    public get isFullScreen (): boolean {
        return false;
    }
    public get devicePixelRatio () {
        const sysInfo = minigame.getSystemInfoSync();
        return sysInfo.pixelRatio;
    }
    public get windowSize (): Size {
        const sysInfo = minigame.getSystemInfoSync();
        const dpr = this.devicePixelRatio;
        return new Size(sysInfo.screenWidth * dpr, sysInfo.screenHeight * dpr);
    }
    public set windowSize (size: Size) {
        console.warn('Setting window size is not supported on this platform.');
    }

    private _resolution: Size = new Size(0, 0);
    public get resolution () {
        return this._resolution;
    }
    private _updateResolution (rotateWindowSize = false) {
        const windowSize = this.windowSize;
        // update resolution
        this._resolution.width = rotateWindowSize ? windowSize.height : windowSize.width;
        this._resolution.height = rotateWindowSize ? windowSize.width : windowSize.height;
        // NOTE: on Alipay iOS end, the resolution size need forcing to be screenSize * dpr.
        if (ALIPAY && systemInfo.os === OS.IOS) {
            this._resolution.width *= this.devicePixelRatio;
            this._resolution.height *= this.devicePixelRatio;
        } else {
            this._resolution.width *= this.resolutionScale;
            this._resolution.height *= this.resolutionScale;
        }
        this._cbToUpdateFrameBuffer?.();
        this.emit('resolution-change');
    }

    private _resolutionScale = 1;
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
    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen is not supported on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen is not supported on this platform.'));
    }
}

export const screenAdapter = new ScreenAdapter();
