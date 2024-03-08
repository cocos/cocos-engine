/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { EDITOR } from 'internal:constants';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { checkPalIntegrity, withImpl } from '../../integrity-check';
import { Orientation } from '../enum-type';

export interface SafeAreaEdge {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export type ConfigOrientation = 'auto' | 'landscape' | 'portrait';

export interface IScreenOptions {
    /**
     * Orientation options from editor builder.
     */
    configOrientation: ConfigOrientation;
    /**
     * Determine whether the game frame exact fits the screen.
     * Now it only works on Web platform.
     */
    exactFitScreen: boolean,
    /**
     * Determine whether use headless renderer, which means do not support some screen operations.
     */
    isHeadlessMode: boolean;
}

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

    public get devicePixelRatio (): number {
        return jsb.device.getDevicePixelRatio() || 1;
    }

    public get windowSize (): Size {
        const dpr = this.devicePixelRatio;
        // NOTE: fix precision issue on Metal render end.
        const width = jsb.window.innerWidth;
        const height = jsb.window.innerHeight;
        // NOTE: fix precision issue on Metal render end.
        const roundWidth = Math.round(width);
        const roundHeight = Math.round(height);
        return new Size(roundWidth * dpr, roundHeight * dpr);
    }
    public set windowSize (size: Size) {
        console.warn('Setting window size is not supported yet.');
    }

    public get resolution (): Size {
        const windowSize = this.windowSize;
        const resolutionScale = this.resolutionScale;
        return new Size(windowSize.width * resolutionScale, windowSize.height * resolutionScale);
    }
    public get resolutionScale (): number {
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

    public init (options: IScreenOptions, cbToRebuildFrameBuffer: () => void): void {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        if (!EDITOR) {
            this._cbToUpdateFrameBuffer();
        }
    }

    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen has not been supported yet on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen has not been supported yet on this platform.'));
    }

    private _registerEvent (): void {
        jsb.onResize = (event: jsb.WindowEvent): void => {
            if (event.width === 0 || event.height === 0) return;
            // TODO: remove this function calling
            window.resize(event.width / this.devicePixelRatio, event.height / this.devicePixelRatio);
            this.emit('window-resize', event.width, event.height, event.windowId);
        };
        jsb.onOrientationChanged = (event): void => {
            this.emit('orientation-change', this.orientation);
        };
    }
}

export const screenAdapter = new ScreenAdapter();

checkPalIntegrity<typeof import('pal/screen-adapter')>(withImpl<typeof import('./screen-adapter')>());
