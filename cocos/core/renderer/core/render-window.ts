import {
    GFXTextureType,
    GFXTextureUsageBit,
    GFXFormat,
} from '../../gfx/define';
import { GFXRenderPass, GFXTexture, GFXFramebuffer, IGFXRenderPassInfo, GFXDevice } from '../../gfx';
import { Root } from '../../root';
import { RenderWindowHandle, RenderWindowPool, RenderWindowView, FramebufferPool, NULL_HANDLE } from './memory-pools';

export interface IRenderWindowInfo {
    title?: string;
    width: number;
    height: number;
    renderPassInfo: IGFXRenderPassInfo;
    swapchainBufferIndices?: number;
    shouldSyncSizeWithSwapchain?: boolean;
}

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
     * @en Get window frame buffer.
     * @zh GFX帧缓冲。
     */
    get framebuffer (): GFXFramebuffer {
        return FramebufferPool.get(RenderWindowPool.get(this._poolHandle, RenderWindowView.FRAMEBUFFER));
    }

    get shouldSyncSizeWithSwapchain () {
        return this._shouldSyncSizeWithSwapchain;
    }

    get hasOnScreenAttachments () {
        return RenderWindowPool.get(this._poolHandle, RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS) === 1 ? true : false;
    }

    get hasOffScreenAttachments () {
        return RenderWindowPool.get(this._poolHandle, RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS) === 1 ? true : false;
    }

    get handle () : RenderWindowHandle {
        return this._poolHandle;
    }

    public static registerCreateFunc (root: Root) {
        root._createWindowFun = (_root: Root): RenderWindow => new RenderWindow(_root);
    }

    protected _title: string = '';
    protected _width: number = 1;
    protected _height: number = 1;
    protected _nativeWidth: number = 1;
    protected _nativeHeight: number = 1;
    protected _renderPass: GFXRenderPass | null = null;
    protected _colorTextures: (GFXTexture | null)[] = [];
    protected _depthStencilTexture: GFXTexture | null = null;
    protected _swapchainBufferIndices = 0;
    protected _shouldSyncSizeWithSwapchain = false;
    protected _poolHandle: RenderWindowHandle = NULL_HANDLE;

    private constructor (root: Root) {
    }

    public initialize (device: GFXDevice, info: IRenderWindowInfo): boolean {
        this._poolHandle = RenderWindowPool.alloc();
        
        if (info.title !== undefined) {
            this._title = info.title;
        }

        if (info.swapchainBufferIndices !== undefined) {
            this._swapchainBufferIndices = info.swapchainBufferIndices;
        }

        if (info.shouldSyncSizeWithSwapchain !== undefined) {
            this._shouldSyncSizeWithSwapchain = info.shouldSyncSizeWithSwapchain;
        }

        this._width = info.width;
        this._height = info.height;
        this._nativeWidth = this._width;
        this._nativeHeight = this._height;

        const { colorAttachments, depthStencilAttachment } = info.renderPassInfo;
        for (let i = 0; i < colorAttachments.length; i++) {
            if (colorAttachments[i].format === GFXFormat.UNKNOWN) {
                colorAttachments[i].format = device.colorFormat;
            }
        }
        if (depthStencilAttachment && depthStencilAttachment.format === GFXFormat.UNKNOWN) {
            depthStencilAttachment.format = device.depthStencilFormat;
        }

        this._renderPass = device.createRenderPass(info.renderPassInfo);

        for (let i = 0; i < colorAttachments.length; i++) {
            let colorTex: GFXTexture | null = null;
            if (!(this._swapchainBufferIndices & (1 << i))) {
                colorTex = device.createTexture({
                    type: GFXTextureType.TEX2D,
                    usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                    format: colorAttachments[i].format,
                    width: this._width,
                    height: this._height,
                });
                RenderWindowPool.set(this._poolHandle, RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS, 1);
            } else {
                RenderWindowPool.set(this._poolHandle, RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS, 1);
            }
            this._colorTextures.push(colorTex);
        }

        // Use the sign bit to indicate depth attachment
        if (depthStencilAttachment) {
            if (this._swapchainBufferIndices >= 0) {
                this._depthStencilTexture = device.createTexture({
                    type: GFXTextureType.TEX2D,
                    usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                    format: depthStencilAttachment.format,
                    width: this._width,
                    height: this._height,
                });
                RenderWindowPool.set(this._poolHandle, RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS, 1);
            } else {
                RenderWindowPool.set(this._poolHandle, RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS, 1);
            }
        }

        RenderWindowPool.set(this._poolHandle, RenderWindowView.FRAMEBUFFER, FramebufferPool.alloc(device, {
            renderPass: this._renderPass,
            colorTextures: this._colorTextures,
            depthStencilTexture: this._depthStencilTexture,
        }));

        return true;
    }

    public destroy () {
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

        if (this._poolHandle) {
            FramebufferPool.get(RenderWindowPool.get(this._poolHandle, RenderWindowView.FRAMEBUFFER)).destroy();
            this._poolHandle = NULL_HANDLE;
        }
    }

    /**
     * @en Resize window.
     * @zh 重置窗口大小。
     * @param width The new width.
     * @param height The new height.
     */
    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;

        if (width > this._nativeWidth ||
            height > this._nativeHeight) {

            this._nativeWidth = width;
            this._nativeHeight = height;

            let needRebuild = false;

            if (this._depthStencilTexture) {
                this._depthStencilTexture.resize(width, height);
                needRebuild = true;
            }

            for (let i = 0; i < this._colorTextures.length; i++) {
                const colorTex = this._colorTextures[i];
                if (colorTex) {
                    colorTex.resize(width, height);
                    needRebuild = true;
                }
            }

            const framebuffer = FramebufferPool.get(RenderWindowPool.get(this._poolHandle, RenderWindowView.FRAMEBUFFER));
            if (needRebuild && framebuffer) {
                framebuffer.destroy();
                framebuffer.initialize({
                    renderPass: this._renderPass!,
                    colorTextures: this._colorTextures,
                    depthStencilTexture: this._depthStencilTexture,
                });
            }
        }
    }
}
