/* eslint-disable max-len */
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

import { JSB, WEBGPU } from 'internal:constants';
import { cclegacy, error, getError, sys, screen, Settings, settings } from '../core';
import { BindingMappingInfo, DeviceInfo, SwapchainInfo } from './base/define';
import { Device } from './base/device';
import { Swapchain } from './base/swapchain';
import { BrowserType } from '../../pal/system-info/enum-type';

/**
 * @en
 * Sets the renderer type, only useful on web
 *
 * @zh
 * 渲染模式。
 * 设置渲染器类型，仅适用于 web 端
 * @internal
 */
export enum LegacyRenderMode {
    /**
     * @en
     * Automatically chosen by engine.
     * @zh
     * 通过引擎自动选择。
     */
    AUTO = 0,
    /**
     * @en
     * Forced to use canvas renderer.
     * @zh
     * 强制使用 canvas 渲染。
     */
    CANVAS = 1,
    /**
     * @en
     * Forced to use WebGL renderer, but this will be ignored on mobile browsers.
     * @zh
     * 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。
     */
    WEBGL = 2,
    /**
     * @en
     * Use Headless Renderer, which is useful in test or server env, only for internal use by cocos team for now
     * @zh
     * 使用空渲染器，可以用于测试和服务器端环境，目前暂时用于 Cocos 内部测试使用。
     */
    HEADLESS = 3
}

/**
 * @internal
 */
export enum RenderType {
    UNKNOWN = -1,
    CANVAS = 0,
    WEBGL = 1,
    OPENGL = 2,
    HEADLESS = 3,
}

/**
 * @internal
 */

export class DeviceManager {
    private initialized = false;
    private _gfxDevice!: Device;
    private _canvas: HTMLCanvasElement | null = null;
    private _swapchain!: Swapchain;
    private _renderType: RenderType = RenderType.UNKNOWN;

    public get gfxDevice (): Device {
        return this._gfxDevice;
    }

    public get swapchain (): Swapchain {
        return this._swapchain;
    }

    public init (canvas: HTMLCanvasElement | null, bindingMappingInfo: BindingMappingInfo): void {
        // Avoid setup to be called twice.
        if (this.initialized) { return; }
        const renderMode = settings.querySettings(Settings.Category.RENDERING, 'renderMode');
        this._canvas = canvas;

        this._renderType = this._determineRenderType(renderMode);

        // WebGL context created successfully
        if (this._renderType === RenderType.WEBGL) {
            const deviceInfo = new DeviceInfo(bindingMappingInfo);

            if (JSB && (globalThis as any).gfx) {
                this._gfxDevice = gfx.DeviceManager.create(deviceInfo);
            } else {
                let useWebGL2 = (!!globalThis.WebGL2RenderingContext);
                const userAgent = globalThis.navigator.userAgent.toLowerCase();
                // UC browser implementation doesn't conform to WebGL2 standard
                if (sys.browserType === BrowserType.UC) {
                    useWebGL2 = false;
                }

                const deviceCtors: Constructor<Device>[] = [];
                if (WEBGPU) {
                    deviceCtors.push(cclegacy.WebGPUDevice);
                }
                if (useWebGL2 && cclegacy.WebGL2Device) {
                    deviceCtors.push(cclegacy.WebGL2Device);
                }
                if (cclegacy.WebGLDevice) {
                    deviceCtors.push(cclegacy.WebGLDevice);
                }
                if (cclegacy.EmptyDevice) {
                    deviceCtors.push(cclegacy.EmptyDevice);
                }

                Device.canvas = canvas!;
                for (let i = 0; i < deviceCtors.length; i++) {
                    this._gfxDevice = new deviceCtors[i]();
                    if (this._gfxDevice.initialize(deviceInfo)) { break; }
                }
                this._initSwapchain();
            }
        } else if (this._renderType === RenderType.HEADLESS && cclegacy.EmptyDevice) {
            this._gfxDevice = new cclegacy.EmptyDevice();
            this._gfxDevice.initialize(new DeviceInfo(bindingMappingInfo));
            this._initSwapchain();
        }

        if (!this._gfxDevice) {
            // todo fix here for wechat game
            error('can not support canvas rendering in 3D');
            this._renderType = RenderType.UNKNOWN;
            return;
        }

        if (this._canvas) { this._canvas.oncontextmenu = (): boolean => false; }
    }

    private _initSwapchain (): void {
        const swapchainInfo = new SwapchainInfo(1, this._canvas!);
        const windowSize = screen.windowSize;
        swapchainInfo.width = windowSize.width;
        swapchainInfo.height = windowSize.height;
        this._swapchain = this._gfxDevice.createSwapchain(swapchainInfo);
    }

    private _determineRenderType (renderMode: LegacyRenderMode): RenderType {
        if (typeof renderMode !== 'number' || renderMode > RenderType.HEADLESS || renderMode < LegacyRenderMode.AUTO) {
            renderMode = LegacyRenderMode.AUTO;
        }
        // Determine RenderType
        let renderType = RenderType.CANVAS;
        let supportRender = false;

        if (renderMode === LegacyRenderMode.CANVAS) {
            renderType = RenderType.CANVAS;
            supportRender = true;
        } else if (renderMode === LegacyRenderMode.AUTO || renderMode === LegacyRenderMode.WEBGL) {
            renderType = RenderType.WEBGL;
            supportRender = true;
        } else if (renderMode === LegacyRenderMode.HEADLESS) {
            renderType = RenderType.HEADLESS;
            supportRender = true;
        }

        if (!supportRender) {
            throw new Error(getError(3820, renderMode));
        }
        return renderType;
    }
}

/**
 * @internal
 */
export const deviceManager = new DeviceManager();
