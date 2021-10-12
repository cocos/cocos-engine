import { SafeAreaEdge } from 'pal/screen-adapter';
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
    private _cbToUpdateFrameBuffer?: () => void;
    public isFrameRotated = false;
    public handleResizeEvent = true;

    constructor () {
        super();
        this._registerEvent();
    }

    public init (cbToRebuildFrameBuffer: () => void) {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        this._updateResolution();
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
        return new Size(window.innerWidth * dpr, window.innerHeight * dpr);
    }
    public set windowSize (size: Size) {
        console.warn('Setting window size is not supported yet.');
    }

    private _resolution: Size = new Size(1, 1);  // NOTE: crash when init device if resolution is Size.ZERO on native platform.
    public get resolution () {
        return this._resolution;
    }
    private _updateResolution () {
        const windowSize = this.windowSize;
        // update resolution
        this._resolution.width = windowSize.width * this.resolutionScale;
        this._resolution.height = windowSize.height * this.resolutionScale;
        this._cbToUpdateFrameBuffer?.();
        this.emit('resolution-change');
    }

    private _resolutionScale = 1;
    public get resolutionScale () {
        return this._resolutionScale;
    }
    public set resolutionScale (v: number) {
        if (v === this._resolutionScale) {
            return;
        }
        this._resolutionScale = v;
        this._updateResolution();
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
    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen has not been supported yet on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen has not been supported yet on this platform.'));
    }
}

export const screenAdapter = new ScreenAdapter();
