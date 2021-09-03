/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
import { ScreenAdapter } from 'pal/screen-adapter';
import {
    TextureType, TextureUsageBit, Format, RenderPass, Texture, Framebuffer,
    RenderPassInfo, Device, TextureInfo, FramebufferInfo, Swapchain, TextureFlagBit,
} from '../../gfx';
import { Root } from '../../root';
import { Camera, NativeRenderWindow } from '../scene';

export interface IRenderWindowInfo {
    title?: string;
    width: number;
    height: number;
    renderPassInfo: RenderPassInfo;
    swapchain?: Swapchain;
}

/**
 * @en The render window represents the render target, it could be an off screen frame buffer or the on screen buffer.
 * @zh 渲染窗口代表了一个渲染目标，可以是离屏的帧缓冲，也可以是屏幕缓冲
 */
export class RenderWindow {
    /**
     * @en Get window width.
     * @zh 窗口宽度。
     */
    get width (): number {
        return this._width;
    }

    /**
     * @en Get window height.
     * @zh 窗口高度。
     */
    get height (): number {
        return this._height;
    }

    /**
     * @en Get the swapchain for this window, if there is one
     * @zh 如果存在的话，获取此窗口的交换链
     */
    get swapchain () {
        return this._swapchain;
    }

    /**
     * @en Get window frame buffer.
     * @zh 帧缓冲对象。
     */
    get framebuffer (): Framebuffer {
        return this._framebuffer!;
    }

    get cameras () {
        return this._cameras;
    }

    /**
     * @private
     */
    public static registerCreateFunc (root: Root) {
        root._createWindowFun = (_root: Root): RenderWindow => new RenderWindow(_root);
    }

    protected _title = '';
    protected _width = 1;
    protected _height = 1;
    protected _swapchain: Swapchain = null!;
    protected _renderPass: RenderPass | null = null;
    protected _colorTextures: Texture[] = [];
    protected _depthStencilTexture: Texture | null = null;
    protected _cameras: Camera[] = [];
    protected _hasOnScreenAttachments = false;
    protected _hasOffScreenAttachments = false;
    protected _framebuffer: Framebuffer | null = null;
    private declare _nativeObj: NativeRenderWindow | null;

    get native () {
        return this._nativeObj;
    }

    private constructor (root: Root) {}

    public initialize (device: Device, info: IRenderWindowInfo): boolean {
        this._init();

        if (info.title !== undefined) {
            this._title = info.title;
        }

        if (info.swapchain !== undefined) {
            this._swapchain = info.swapchain;
        }

        this._width = info.width;
        this._height = info.height;
        this._renderPass = device.createRenderPass(info.renderPassInfo);

        if (info.swapchain) {
            this._setSwapchain(info.swapchain);
            this._colorTextures.push(info.swapchain.colorTexture);
            this._depthStencilTexture = info.swapchain.depthStencilTexture;
        } else {
            for (let i = 0; i < info.renderPassInfo.colorAttachments.length; i++) {
                this._colorTextures.push(device.createTexture(new TextureInfo(
                    TextureType.TEX2D,
                    TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                    info.renderPassInfo.colorAttachments[i].format,
                    this._width,
                    this._height,
                )));
            }
            if (info.renderPassInfo.depthStencilAttachment.format !== Format.UNKNOWN) {
                this._depthStencilTexture = device.createTexture(new TextureInfo(
                    TextureType.TEX2D,
                    TextureUsageBit.DEPTH_STENCIL_ATTACHMENT | TextureUsageBit.SAMPLED,
                    info.renderPassInfo.depthStencilAttachment.format,
                    this._width,
                    this._height,
                ));
            }
        }

        this._setFrameBuffer(device.createFramebuffer(new FramebufferInfo(
            this._renderPass,
            this._colorTextures,
            this._depthStencilTexture,
        )));

        return true;
    }

    public destroy () {
        this.clearCameras();

        if (this._framebuffer) {
            this._framebuffer.destroy();
            this._framebuffer = null;
        }

        if (this._depthStencilTexture) {
            this._depthStencilTexture.destroy();
            this._depthStencilTexture = null;
        }

        for (let i = 0; i < this._colorTextures.length; i++) {
            const colorTexture = this._colorTextures[i];
            if (colorTexture) {
                colorTexture.destroy();
            }
        }
        this._colorTextures.length = 0;

        this._destroy();
    }

    /**
     * @en Resize window.
     * @zh 重置窗口大小。
     * @param width The new width.
     * @param height The new height.
     */
    public resize (width: number, height: number, ort ?:number|null) {
        this._width = width;
        this._height = height;
        
        console.log("XLOG: renderwindow->resize with ort?"+ ort);
        if (this._swapchain) {
            
            this._swapchain.resize(width, height, Root.xOrt);
            
        } else {
            if (this._depthStencilTexture) {
                this._depthStencilTexture.destroy();
                this._depthStencilTexture.initialize(new TextureInfo(
                    TextureType.TEX2D,
                    TextureUsageBit.DEPTH_STENCIL_ATTACHMENT | TextureUsageBit.SAMPLED,
                    this._renderPass!.depthStencilAttachment!.format,
                    this._width,
                    this._height,
                ));
            }

            for (let i = 0; i < this._colorTextures.length; i++) {
                const colorTex = this._colorTextures[i];
                if (colorTex) {
                    colorTex.destroy();
                    colorTex.initialize(new TextureInfo(
                        TextureType.TEX2D,
                        TextureUsageBit.COLOR_ATTACHMENT | TextureUsageBit.SAMPLED,
                        this._renderPass!.colorAttachments[i].format,
                        this._width,
                        this._height,
                    ));
                }
            }
        }

        if (this.framebuffer) {
            this.framebuffer.destroy();
            this.framebuffer.initialize(new FramebufferInfo(
                this._renderPass!,
                this._colorTextures,
                this._depthStencilTexture,
            ));
        }

        for (const camera of this._cameras) {
            if (camera.isWindowSize) {
                camera.resize(width, height);
            }
        }
    }

    public extractRenderCameras (cameras: Camera[]) {
        for (let j = 0; j < this._cameras.length; j++) {
            const camera = this._cameras[j];
            if (camera.enabled) {
                camera.update();
                cameras.push(camera);
            }
        }
    }

    /**
     * @zh
     * 添加渲染相机
     * @param camera 渲染相机
     */
    public attachCamera (camera: Camera) {
        for (let i = 0; i < this._cameras.length; i++) {
            if (this._cameras[i] === camera) {
                return;
            }
        }
        this._cameras.push(camera);
        this.sortCameras();
    }

    /**
     * @zh
     * 移除渲染相机
     * @param camera 相机
     */
    public detachCamera (camera: Camera) {
        for (let i = 0; i < this._cameras.length; ++i) {
            if (this._cameras[i] === camera) {
                this._cameras.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @zh
     * 销毁全部渲染相机
     */
    public clearCameras () {
        this._cameras.length = 0;
    }

    public sortCameras () {
        this._cameras.sort((a: Camera, b: Camera) => a.priority - b.priority);
    }

    // ====================== Native Specific ====================== //

    private _init () {
        if (JSB) {
            this._nativeObj = new NativeRenderWindow();
        }
    }

    private _destroy () {
        if (JSB) {
            this._nativeObj = null;
        }
    }

    private _setSwapchain (val: Swapchain) {
        this._swapchain = val;
        if (JSB) {
            this._nativeObj!.swapchain = val;
        }
    }

    private _setFrameBuffer (val: Framebuffer) {
        this._framebuffer = val;
        if (JSB) {
            this._nativeObj!.frameBuffer = val;
        }
    }
}
