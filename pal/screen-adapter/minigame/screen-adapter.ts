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

import { ALIPAY, BYTEDANCE, COCOSPLAY, VIVO } from 'internal:constants';
import { minigame } from 'pal/minigame';
import { ConfigOrientation, IScreenOptions, SafeAreaEdge } from 'pal/screen-adapter';
import { systemInfo } from 'pal/system-info';
import { warnID } from '../../../cocos/core/platform/debug';
import { EventTarget } from '../../../cocos/core/event/event-target';
import { Size } from '../../../cocos/core/math';
import { OS } from '../../system-info/enum-type';
import { Orientation } from '../enum-type';
import { checkPalIntegrity, withImpl } from '../../integrity-check';

declare const my: any;

// HACK: In some platform like CocosPlay or Alipay iOS end
// the windowSize need to rotate when init screenAdapter if it's landscape
let rotateLandscape = false;
try {
    if (ALIPAY) {
        if (systemInfo.os === OS.IOS && !minigame.isDevTool) {
            // TODO: use pal/fs
            // issue: https://github.com/cocos/cocos-engine/issues/14647
            const fs = my.getFileSystemManager();
            const screenOrientation = JSON.parse(fs.readFileSync({
                filePath: 'game.json',
                encoding: 'utf8',
            }).data).screenOrientation;
            rotateLandscape = (screenOrientation === 'landscape');
        }
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

    public get devicePixelRatio (): number {
        const sysInfo = minigame.getSystemInfoSync();
        return sysInfo.pixelRatio;
    }

    public get windowSize (): Size {
        const sysInfo = minigame.getSystemInfoSync();
        const dpr = this.devicePixelRatio;
        let screenWidth = sysInfo.windowWidth;
        let screenHeight = sysInfo.windowHeight;
        if (BYTEDANCE) {
            screenWidth = sysInfo.screenWidth;
            screenHeight = sysInfo.screenHeight;
        }
        if (ALIPAY && rotateLandscape  && screenWidth < screenHeight) {
            const temp = screenWidth;
            screenWidth = screenHeight;
            screenHeight = temp;
        }
        return new Size(screenWidth * dpr, screenHeight * dpr);
    }
    public set windowSize (size: Size) {
        warnID(1221);
    }

    public get resolution (): Size {
        const windowSize = this.windowSize;
        const resolutionScale = this.resolutionScale;
        return new Size(windowSize.width * resolutionScale, windowSize.height * resolutionScale);
    }
    public get resolutionScale (): number {
        return this._resolutionScale;
    }
    public set resolutionScale (value: number) {
        if (value === this._resolutionScale) {
            return;
        }
        this._resolutionScale = value;
        this._cbToUpdateFrameBuffer?.();
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
        // NOTE: safe area info on vivo platform is in physical pixel.
        // No need to multiply with DPR.
        const dpr = VIVO ? 1 : this.devicePixelRatio;
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

    public get isProportionalToFrame (): boolean {
        return this._isProportionalToFrame;
    }
    public set isProportionalToFrame (v: boolean) { }

    private _cbToUpdateFrameBuffer?: () => void;
    private _resolutionScale = 1;
    private _isProportionalToFrame = false;

    constructor () {
        super();
        minigame.onWindowResize?.(() => {
            this.emit('window-resize', this.windowSize.width, this.windowSize.height);
        });
    }

    public init (options: IScreenOptions, cbToRebuildFrameBuffer: () => void): void {
        this._cbToUpdateFrameBuffer = cbToRebuildFrameBuffer;
        this._cbToUpdateFrameBuffer();
    }

    public requestFullScreen (): Promise<void> {
        return Promise.reject(new Error('request fullscreen is not supported on this platform.'));
    }
    public exitFullScreen (): Promise<void> {
        return Promise.reject(new Error('exit fullscreen is not supported on this platform.'));
    }
}

export const screenAdapter = new ScreenAdapter();

checkPalIntegrity<typeof import('pal/screen-adapter')>(withImpl<typeof import('./screen-adapter')>());
