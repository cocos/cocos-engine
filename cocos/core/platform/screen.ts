/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

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
/**
 * @packageDocumentation
 * @module core
 */

import { screenAdapter } from 'pal/screen-adapter';
import { legacyCC } from '../global-exports';
import { Size, Vec2 } from '../math';
import { warnID } from './debug';

/**
 * @en The screen API provides an easy way to do some screen managing stuff.
 * @zh screen 单例对象提供简单的方法来做屏幕管理相关的工作。
 */
class Screen {
    private _init () {
        screenAdapter.init(() => {
            const director = legacyCC.director;
            if (!director.root?.pipeline) {
                warnID(1220);
                return;
            }
            director.root.pipeline.pipelineSceneData.shadingScale = screenAdapter.resolutionScale;
        });
    }

    /**
     * @en Get and set the size of current window in physical pixels.
     * NOTE: Setting window size is only supported on Web platform for now.
     * @zh 获取和设置当前窗口的物理像素尺寸。
     * 注意：设置窗口尺寸目前只在 Web 平台上支持。
     */
    public get windowSize (): Size {
        return screenAdapter.windowSize;
    }
    public set windowSize (size: Size) {
        screenAdapter.windowSize = size;
    }

    /**
     * @en Get the current resolution of game.
     * This is a readonly property, you can change the value by setting screen.resolutionScale.
     * @zh 获取当前游戏的分辨率。
     * 这是一个只读属性，你可以通过设置 screen.resolutionScale 来改变这个值。
     *
     * @readonly
     */
    public get resolution () {
        return screenAdapter.resolution;
    }

    /**
     * @en Get and set the resolution scale of screen, which will affect the quality of the rendering.
     * Note: if this value is set too high, the rendering performance of GPU will be reduced, this value is 1 by default.
     * @zh 获取和设置屏幕的分辨率缩放比，这将会影响最终渲染的质量。
     * 注意：如果这个值设置的太高，会降低 GPU 的渲染性能，该值默认为 1。
     */
    public get resolutionScale () {
        return screenAdapter.resolutionScale;
    }
    public set resolutionScale (v: number) {
        screenAdapter.resolutionScale = v;
    }

    /**
     * @en Whether it supports full screen？
     * @zh 是否支持全屏？
     * @returns {Boolean}
     */
    public get supportsFullScreen (): boolean {
        return screenAdapter.supportFullScreen;
    }

    /**
     * @en Return true if it's in full screen state now.
     * @zh 当前是否处在全屏状态下
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
     * @param element The element to request full screen state
     * @param onFullScreenChange callback function when full screen state changed
     * @param onFullScreenError callback function when full screen error
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
     * @return {Promise}
     */
    public requestFullScreen (): Promise<void>;
    public requestFullScreen (element?: HTMLElement, onFullScreenChange?: (this: Document, ev: any) => any, onFullScreenError?: (this: Document, ev: any) => any): Promise<any> {
        if (arguments.length > 0) {
            warnID(1400, 'screen.requestFullScreen(element, onFullScreenChange?, onFullScreenError?)', 'screen.requestFullScreen(): Promise');
        }
        return screenAdapter.requestFullScreen().then(() => {
            // @ts-expect-error no parameter passed
            onFullScreenChange?.();
        }).catch((err) => {
            console.error(err);
            // @ts-expect-error no parameter passed
            onFullScreenError?.();
        });
    }

    /**
     * @en Exit the full mode.
     * @zh 退出全屏模式
     * @return {Promise}
     */
    public exitFullScreen (): Promise<any> {
        return screenAdapter.exitFullScreen();
    }

    /**
     * @en Automatically request full screen during the next touch/click event
     * @zh 自动监听触摸、鼠标事件并在下一次事件触发时尝试进入全屏模式
     * @param element The element to request full screen state
     * @param onFullScreenChange callback function when full screen state changed
     *
     * @deprecated since v3.3, please use screen.requestFullScreen() instead.
     */
    public autoFullScreen (element: HTMLElement, onFullScreenChange: (this: Document, ev: any) => any) {
        this.requestFullScreen(element, onFullScreenChange)?.catch((e) => {});
    }

    /**
     * @param element
     * @deprecated since v3.3
     */
    public disableAutoFullScreen (element) {
        // DO NOTHING
    }

    // TODO: to support registering fullscreen change
    // TODO: to support screen resize
}

const screen = new Screen();

legacyCC.screen = screen;

export { screen };
