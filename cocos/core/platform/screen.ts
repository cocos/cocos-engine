/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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

import { IScreenOptions, screenAdapter } from 'pal/screen-adapter';
import { legacyCC } from '../global-exports';
import { Size } from '../math';
import { Settings, settings } from '../settings';
import { error, warn, warnID } from './debug';
import { PalScreenEvent } from '../../../pal/screen-adapter/enum-type';
/**
 * @en The screen API provides an easy way to do some screen managing stuff.
 * @zh screen 单例对象提供简单的方法来做屏幕管理相关的工作。
 */
export class Screen {
    /**
     * @internal
     */
    public init (): void {
        const exactFitScreen = settings.querySettings(Settings.Category.SCREEN, 'exactFitScreen') ?? true;
        const orientation = settings.querySettings(Settings.Category.SCREEN, 'orientation') ?? 'auto';
        const isHeadlessMode = settings.querySettings(Settings.Category.RENDERING, 'renderMode') === 3;
        screenAdapter.init({ exactFitScreen, configOrientation: orientation, isHeadlessMode }, (): void => {
            const director = legacyCC.director;
            if (!director.root?.pipeline) {
                warnID(1220);
                return;
            }
            director.root.pipeline.shadingScale = screenAdapter.resolutionScale;
        });
    }

    /**
     * @en the ratio of the resolution in physical pixels to the resolution in CSS pixels for the current display device
     * NOTE: For performance reasons, the engine will limit the maximum value of DPR on some platforms.
     * This property returns the DPR after the engine limit.
     * @zh 当前显示设备的物理像素分辨率与 CSS 像素分辨率之比。
     * 注意：出于性能考虑，引擎在一些平台会限制 DPR 的最高值，这个属性返回的是引擎限制后的 DPR。
     */
    public get devicePixelRatio (): number {
        return screenAdapter.devicePixelRatio;
    }

    /**
     * @en Get and set the size of current window in physical pixels.
     * NOTE:
     * - Setting window size is only supported on Web platform for now.
     * - On Web platform, if the ContainerStrategy is PROPORTIONAL_TO_FRAME, we set windowSize on game frame,
     *    and get windowSize from the game container after adaptation.
     * @zh 获取和设置当前窗口的物理像素尺寸。
     * 注意
     * - 设置窗口尺寸目前只在 Web 平台上支持。
     * - Web 平台上，如果 ContainerStrategy 为 PROPORTIONAL_TO_FRAME, 则设置 windowSize 作用于 game frame, 而从适配之后 game container 尺寸获取 windowSize.
     */
    public get windowSize (): Size {
        return screenAdapter.windowSize;
    }
    public set windowSize (size: Size) {
        screenAdapter.windowSize = size;
    }

    /**
     * @en Get the current resolution of game.
     * This is a readonly property.
     * @zh 获取当前游戏的分辨率。
     * 这是一个只读属性。
     *
     * @readonly
     */
    public get resolution (): Size {
        return screenAdapter.resolution;
    }

    // /**
    //  * @en Get and set the resolution scale of screen, which will affect the quality of the rendering.
    //  * Note: if this value is set too high, the rendering performance of GPU will be reduced, this value is 1 by default.
    //  * @zh 获取和设置屏幕的分辨率缩放比，这将会影响最终渲染的质量。
    //  * 注意：如果这个值设置的太高，会降低 GPU 的渲染性能，该值默认为 1。
    //  */
    // public get resolutionScale () {
    //     return screenAdapter.resolutionScale;
    // }
    // public set resolutionScale (v: number) {
    //     screenAdapter.resolutionScale = v;
    // }

    /**
     * @en Whether it supports full screen.
     * @zh 是否支持全屏。
     * @returns {Boolean}
     */
    public get supportsFullScreen (): boolean {
        return screenAdapter.supportFullScreen;
    }

    /**
     * @en Return true if it's in full screen state now.
     * @zh 当前是否处在全屏状态下。
     * @returns {boolean}
     */
    public fullScreen (): boolean {
        return screenAdapter.isFullScreen;
    }

    /**
     * @en Request to enter full screen mode with the given element.
     * Many browsers forbid to enter full screen mode without an user intended interaction.
     * If failed to request fullscreen, another attempt will be made to request fullscreen the next time a user interaction occurs.
     * @zh 尝试使当前节点进入全屏模式，很多浏览器不允许程序触发这样的行为，必须在一个用户交互回调中才会生效。
     * 如果进入全屏失败，会在下一次用户发生交互时，再次尝试进入全屏。
     * @param element @zh 请求全屏状态的html元素。 @en The element to request full screen state.
     * @param onFullScreenChange @zh 全屏状态改变的回调函数。 @en callback function when full screen state changed.
     * @param onFullScreenError @zh 全屏错误的回调函数。 @en callback function when full screen error.
     * @return {Promise|undefined}
     * @deprecated since v3.3, please use `screen.requestFullScreen(): Promise<void>` instead.
     */
    public requestFullScreen (element: HTMLElement, onFullScreenChange?: (this: Document, ev: any) => any, onFullScreenError?: (this: Document, ev: any) => any): Promise<any> | undefined;
    /**
     * @en Request to enter full screen mode.
     * Many browsers forbid to enter full screen mode without an user intended interaction.
     * If failed to request fullscreen, another attempt will be made to request fullscreen the next time a user interaction occurs.
     * @zh 尝试使当前屏幕进入全屏模式，很多浏览器不允许程序触发这样的行为，必须在一个用户交互回调中才会生效。
     * 如果进入全屏失败，会在下一次用户发生交互时，再次尝试进入全屏。
     * @param element @zh 请求全屏状态的html元素。 @en The element to request full screen state.
     * @param onFullScreenChange @zh 全屏状态改变的回调函数。 @en callback function when full screen state changed.
     * @param onFullScreenError @zh 全屏错误的回调函数。 @en callback function when full screen error.
     * @return {Promise}
     */
    public requestFullScreen (): Promise<void>;
    public requestFullScreen (element?: HTMLElement, onFullScreenChange?: (this: Document, ev?: any) => any, onFullScreenError?: (this: Document, ev?: any) => any): Promise<any> {
        if (arguments.length > 0) {
            warnID(1400, 'screen.requestFullScreen(element, onFullScreenChange?, onFullScreenError?)', 'screen.requestFullScreen(): Promise');
        }
        return screenAdapter.requestFullScreen().then((): void => {
            onFullScreenChange?.call(document);  // this case is only used on Web platforms, which is deprecated since v3.3.0
        }).catch((err): void => {
            error(err);
            onFullScreenError?.call(document);  // this case is only used on Web platforms, which is deprecated since v3.3.0
        });
    }

    /**
     * @en Exit the full mode.
     * @zh 退出全屏模式。
     * @return {Promise}
     */
    public exitFullScreen (): Promise<any> {
        return screenAdapter.exitFullScreen();
    }

    /**
     * @en Automatically request full screen during the next touch/click event.
     * @zh 自动监听触摸、鼠标事件并在下一次事件触发时尝试进入全屏模式。
     * @param element @zh 请求全屏状态的html元素。 @en The element to request full screen state.
     * @param onFullScreenChange @zh 全屏状态改变的回调函数。 @en callback function when full screen state changed.
     *
     * @deprecated since v3.3, please use screen.requestFullScreen() instead.
     */
    public autoFullScreen (element: HTMLElement, onFullScreenChange: (this: Document, ev: any) => any): void {
        this.requestFullScreen(element, onFullScreenChange)?.catch((e): void => { warn(e); });
    }

    /**
     * @param element
     * @deprecated since v3.3
     */
    public disableAutoFullScreen (element): void {
        // DO NOTHING
    }

    // TODO: to support registering fullscreen change
    /**
     * @en
     * Register screen event callback.
     * @zh
     * 注册screen事件回调。
     */
    public on (type: PalScreenEvent, callback: (...args: any) => void, target?: any): void {
        screenAdapter.on(type, callback, target);
    }

    /**
     * @en
     * Register a callback of a specific screen event type once.
     * @zh
     * 注册单次的screen事件回调。
     */
    public once (type: PalScreenEvent, callback: (...args: any) => void, target?: any): void {
        screenAdapter.once(type, callback, target);
    }

    /**
     * @en
     * Unregister screen event callback.
     * @zh
     * 取消注册screen事件回调。
     */
    public off (type: PalScreenEvent, callback?: (...args: any) => void, target?: any): void {
        screenAdapter.off(type, callback, target);
    }
}

const screen = new Screen();

legacyCC.screen = screen;

export { screen };
