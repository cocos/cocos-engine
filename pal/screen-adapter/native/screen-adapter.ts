import { ConfigOrientation, IScreenOptions, SafeAreaEdge } from 'pal/screen-adapter';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { Orientation } from '../enum-type';

// these value is defined in the native layer
const orientationMap: Record<string, Orientation> = {
    0: Orientation.PORTRAIT,
    '-90': Orientation.LANDSCAPE_LEFT,
    90: Orientation.LANDSCAPE_RIGHT,
    180: Orientation.PORTRAIT_UPSIDE_DOWN,
};

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
        return jsb.device.getDevicePixelRatio() || 1;
    }

    public get windowSize (): Size {
        const dpr = this.devicePixelRatio;
        // NOTE: fix precision issue on Metal render end.
        const roundWidth = Math.round(window.innerWidth);
        const roundHeight = Math.round(window.innerHeight);
        return new Size(roundWidth * dpr, roundHeight * dpr);
    }
    public set windowSize (size: Size) {
        console.warn('Setting window size is not supported yet.');
    }

    public get resolution () {
        const windowSize = this.windowSize;
        const resolutionScale = this.resolutionScale;
        return new Size(windowSize.width * resolutionScale, windowSize.height * resolutionScale);
    }
    public get resolutionScale () {
        return this._resolutionScale;
    }
    public set resolutionScale (v: number) {
        if (v === this._resolutionScale) {
            return;
        }
        this._resolutionScale = v;
        this._cbToUpdateFrameBuffer?.();
    }

    public get orientation (): Orientation {
        return orientationMap[jsb.device.getDeviceOrientation()];
    }
    public set orientation (value: Orientation) {
        console.warn('Setting orientation is not supported yet.');
    }

    public get safeAreaEdge (): SafeAreaEdge {
        const nativeSafeArea = jsb.device.getSafeAreaEdge();
        const dpr = this.devicePixelRatio;
        let topEdge = nativeSafeArea.x * dpr;
        let bottomEdge = nativeSafeArea.z * dpr;
        let leftEdge = nativeSafeArea.y * dpr;
        let rightEdge = nativeSafeArea.w * dpr;
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
    public get isProportionalToFrame (): boolean {
        return this._isProportionalToFrame;
    }
    public set isProportionalToFrame (v: boolean) { }

    private _cbToUpdateFrameBuffer?: () => void;
    private _resolutionScale = 1;
    private _isProportionalToFrame = false;

    constructor () {
        super();
        this._registerEvent();
    }

    public init (options: IScreenOptions, cbToRebuildFrameBuffer: () => void) {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        this._cbToUpdateFrameBuffer();
    }

    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen has not been supported yet on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen has not been supported yet on this platform.'));
    }

    private _registerEvent () {
        jsb.onResize = (size) => {
            if (size.width === 0 || size.height === 0) return;
            size.width /= this.devicePixelRatio;
            size.height /= this.devicePixelRatio;

            // TODO: remove this function calling
            window.resize(size.width, size.height);
            this.emit('window-resize');
        };
        jsb.onOrientationChanged = (event) => {
            this.emit('orientation-change');
        };
    }
}

export const screenAdapter = new ScreenAdapter();
