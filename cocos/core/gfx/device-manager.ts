/*
 Copyright (c) 2022 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import { JSB } from 'internal:constants';
import { legacyCC } from '../global-exports';
import { error, getError } from '../platform/debug';
import { sys } from '../platform/sys';
import { BindingMappingInfo, DeviceInfo, SwapchainInfo } from './base/define';
import { Device } from './base/device';
import { Swapchain } from './base/swapchain';
import { BrowserType } from '../../../pal/system-info/enum-type';
import { screen } from '../platform/screen';
import { Settings, settings } from '../settings';

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

    public get gfxDevice () {
        return this._gfxDevice;
    }

    public get swapchain () {
        return this._swapchain;
    }

    public init (canvas: HTMLCanvasElement | null, bindingMappingInfo: BindingMappingInfo) {
        // Avoid setup to be called twice.
        if (this.initialized) { return; }
        const renderMode = settings.querySettings(Settings.Category.RENDERING, 'renderMode');
        this._canvas = canvas;

        this._renderType = this._determineRenderType(renderMode);

        // WebGL context created successfully
        if (this._renderType === RenderType.WEBGL) {
            const deviceInfo = new DeviceInfo(bindingMappingInfo);

            if (JSB && window.gfx) {
                this._gfxDevice = gfx.DeviceManager.create(deviceInfo);
            } else {
                let useWebGL2 = (!!window.WebGL2RenderingContext);
                const userAgent = window.navigator.userAgent.toLowerCase();
                if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1
                    || sys.browserType === BrowserType.UC // UC browser implementation doesn't conform to WebGL2 standard
                ) {
                    useWebGL2 = false;
                }

                const deviceCtors: Constructor<Device>[] = [];
                if (useWebGL2 && legacyCC.WebGL2Device) {
                    deviceCtors.push(legacyCC.WebGL2Device);
                }
                if (legacyCC.WebGLDevice) {
                    deviceCtors.push(legacyCC.WebGLDevice);
                }
                if (legacyCC.EmptyDevice) {
                    deviceCtors.push(legacyCC.EmptyDevice);
                }

                Device.canvas = canvas!;
                for (let i = 0; i < deviceCtors.length; i++) {
                    this._gfxDevice = new deviceCtors[i]();
                    if (this._gfxDevice.initialize(deviceInfo)) { break; }
                }
            }
        } else if (this._renderType === RenderType.HEADLESS && legacyCC.EmptyDevice) {
            this._gfxDevice = new legacyCC.EmptyDevice();
            this._gfxDevice.initialize(new DeviceInfo(bindingMappingInfo));
        }

        if (!this._gfxDevice) {
            // todo fix here for wechat game
            error('can not support canvas rendering in 3D');
            this._renderType = RenderType.UNKNOWN;
            return;
        }

        const swapchainInfo = new SwapchainInfo(this._canvas!);
        const windowSize = screen.windowSize;
        swapchainInfo.width = windowSize.width;
        swapchainInfo.height = windowSize.height;
        this._swapchain = this._gfxDevice.createSwapchain(swapchainInfo);

        if (this._canvas) { this._canvas.oncontextmenu = () => false; }
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
