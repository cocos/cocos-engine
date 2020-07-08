import {
    GFXTextureType,
    GFXTextureUsageBit,
    GFXFormat,
} from '../gfx/define';
import { GFXRenderPass, GFXTexture, GFXFramebuffer, IGFXRenderPassInfo } from '../gfx';
import { Root } from '../root';
import { PipelineGlobal } from './global';
import { RenderPassStage } from './define';

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
        return this._framebuffer!;
    }

    get shouldSyncSizeWithSwapchain () {
        return this._shouldSyncSizeWithSwapchain;
    }

    get hasOnScreenAttachments () {
        return this._hasOnScreenAttachments;
    }

    get hasOffScreenAttachments () {
        return this._hasOffScreenAttachments;
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
    protected _framebuffer: GFXFramebuffer | null = null;
    protected _swapchainBufferIndices = 0;
    protected _shouldSyncSizeWithSwapchain = false;
    protected _hasOnScreenAttachments = false;
    protected _hasOffScreenAttachments = false;

    private constructor (root: Root) {
    }

    public initialize (info: IRenderWindowInfo): boolean {
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

        const device = PipelineGlobal.device;
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
                this._hasOffScreenAttachments = true;
            } else {
                this._hasOnScreenAttachments = true;
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
                this._hasOffScreenAttachments = true;
            } else {
                this._hasOnScreenAttachments = true;
            }
        }

        this._framebuffer = device.createFramebuffer({
            renderPass: this._renderPass,
            colorTextures: this._colorTextures,
            depthStencilTexture: this._depthStencilTexture,
        });

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

        if (this._framebuffer) {
            this._framebuffer.destroy();
            this._framebuffer = null;
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

            if (needRebuild && this._framebuffer) {
                this._framebuffer.destroy();
                this._framebuffer.initialize({
                    renderPass: this._renderPass!,
                    colorTextures: this._colorTextures,
                    depthStencilTexture: this._depthStencilTexture,
                });
            }
        }
    }
}
