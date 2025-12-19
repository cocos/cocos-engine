/*
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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

import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { checkPalIntegrity, withImpl } from '../../integrity-check';
import { Orientation } from '../enum-type';
import { warn, warnID } from '../../../cocos/core/platform/debug';

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

class ScreenAdapter extends EventTarget {
    public isFrameRotated = false;
    public handleResizeEvent = false;

    public get supportFullScreen (): boolean {
        return false;
    }
    public get isFullScreen (): boolean {
        return false;
    }

    public get devicePixelRatio (): number {
        return 1;
    }

    public get windowSize (): Size {
        // Simulate fake window size
        return new Size(960, 640);
    }

    public set windowSize (size: Size) {
        warn('Setting window size is not supported yet.');
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
    }

    public get orientation (): Orientation {
        return Orientation.PORTRAIT;
    }
    public set orientation (value: Orientation) {
        warnID(1221);
    }

    public get safeAreaEdge (): SafeAreaEdge {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
    }
    public get isProportionalToFrame (): boolean {
        return this._isProportionalToFrame;
    }
    public set isProportionalToFrame (v: boolean) { }

    private _resolutionScale = 1;
    private _isProportionalToFrame = false;

    constructor () {
        super();
    }

    public init (options: IScreenOptions, cbToRebuildFrameBuffer: () => void): void {

    }

    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen has not been supported yet on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen has not been supported yet on this platform.'));
    }

}

export const screenAdapter = new ScreenAdapter();

checkPalIntegrity<typeof import('pal/screen-adapter')>(withImpl<typeof import('./screen-adapter')>());
