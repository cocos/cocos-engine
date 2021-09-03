import { SafeAreaEdge } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { SurfaceTransform } from '../../../cocos/core/gfx';
import { Size } from '../../../cocos/core/math';
import { Root } from '../../../cocos/core/root';
import { Orientation } from '../enum-type';

// these value is defined in the native layer
const orientationMap: Record<string, Orientation> = {
    0: Orientation.PORTRAIT,
    '-90': Orientation.LANDSCAPE_LEFT,
    90: Orientation.LANDSCAPE_RIGHT,
    180: Orientation.PORTRAIT_UPSIDE_DOWN,
};

class ScreenAdapter extends EventTarget {
    constructor () {
        super();
        this._registerEvent();
    }

    private _registerEvent () {
        jsb.onResize = (size) => {
            if (size.width === 0 || size.height === 0) return;
            size.width /= systemInfo.pixelRatio;
            size.height /= systemInfo.pixelRatio;

            // TODO: remove this function calling
            console.log("XLOG: screenAdapter->resize");
            window.resize(size.width, size.height);
            this.emit('window-resize');
        };
        jsb.onOrientationChanged = (event) => {
            
            console.log("XLOG: screenAdapter->orientationChanged");
            switch (event.orientation) {
                case 0:
                    Root.xOrt = SurfaceTransform.IDENTITY
                    break;
                case 90:
                    Root.xOrt = SurfaceTransform.ROTATE_90
                    break;
                case -90:
                    Root.xOrt = SurfaceTransform.ROTATE_270
                    break;
                case 180:
                    Root.xOrt = SurfaceTransform.ROTATE_180
                    break;
            }
            this.emit('orientation-change');
        };
    }

    public get supportFullScreen (): boolean {
        return false;
    }
    public get isFullScreen (): boolean {
        return false;
    }
    public get windowSize (): Size {
        return new Size(window.innerWidth, window.innerHeight);
    }
    public set windowSize (size: Size) {
        console.warn('Setting window size is not supported yet.');
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
    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen has not been supported yet on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen has not been supported yet on this platform.'));
    }
}

export const screenAdapter = new ScreenAdapter();
