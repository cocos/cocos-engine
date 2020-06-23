import {
    GFXFormat,
    GFXTextureFlagBit,
    GFXTextureType,
    GFXTextureUsageBit,
} from '../gfx/define';
import { GFXRenderPass, GFXTexture, GFXFramebuffer, IGFXRenderPassInfo } from '../gfx';
import { Root } from '../root';

export interface IRenderWindowInfo {
    title?: string;
    left?: number;
    top?: number;
    width: number;
    height: number;
    renderPassInfo: IGFXRenderPassInfo;
    isOffscreen?: boolean;
    renderPass?: GFXRenderPass; // will use this reference instead if specified
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
     * @en Is this window offscreen?
     * @zh 是否是离屏的。
     */
    get isOffscreen (): boolean {
        return this._isOffscreen;
    }

    /**
     * @en Get the render pass of this window.
     * @zh GFX 渲染过程。
     */
    get renderPass (): GFXRenderPass {
        return this._renderPass!;
    }

    /**
     * @en Get color texture of this window.
     * @zh 颜色纹理。
     */
    get colorTextures (): GFXTexture[] {
        return this._colorTexs;
    }

    /**
     * @en Get depth stencil texture of this window.
     * @zh 深度模板纹理。
     */
    get depthStencilTexture (): GFXTexture | null {
        return this._depthStencilTex;
    }

    /**
     * @en Get window frame buffer.
     * @zh GFX帧缓冲。
     */
    get framebuffer (): GFXFramebuffer {
        return this._framebuffer!;
    }

    public static registerCreateFunc (root: Root) {
        root._createWindowFun = (_root: Root): RenderWindow => new RenderWindow(_root);
    }

    protected _root: Root;
    protected _title: string = '';
    protected _left: number = 0;
    protected _top: number = 0;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _nativeWidth: number = 0;
    protected _nativeHeight: number = 0;
    protected _isOffscreen: boolean = false;
    protected _renderPass: GFXRenderPass | null = null;
    protected _colorTexs: GFXTexture[] = [];
    protected _depthStencilTex: GFXTexture | null = null;
    protected _framebuffer: GFXFramebuffer | null = null;

    private constructor (root: Root) {
        this._root = root;
    }

    public initialize (info: IRenderWindowInfo): boolean {

        if (info.title !== undefined) {
            this._title = info.title;
        }

        if (info.left !== undefined) {
            this._left = info.left;
        }

        if (info.top !== undefined) {
            this._top = info.top;
        }

        if (info.isOffscreen !== undefined) {
            this._isOffscreen = info.isOffscreen;
        }

        this._width = info.width;
        this._height = info.height;
        this._nativeWidth = this._width;
        this._nativeHeight = this._height;

        let colorAttachments = info.renderPassInfo.colorAttachments;
        let depthStencilAttachment = info.renderPassInfo.depthStencilAttachment;

        if (info.renderPass) {
            this._renderPass = info.renderPass;
            colorAttachments = info.renderPass.colorAttachments;
            depthStencilAttachment = info.renderPass.depthStencilAttachment;
        } else {
            for (let i = 0; i < colorAttachments.length; i++) {
                const attachment = colorAttachments[i];
                if (attachment.format === GFXFormat.UNKNOWN) {
                    attachment.format = this._root.device.colorFormat;
                }
            }
            if (depthStencilAttachment) {
                const attachment = depthStencilAttachment;
                if (attachment.format === GFXFormat.UNKNOWN) {
                    attachment.format = this._root.device.depthStencilFormat;
                }
            }
            this._renderPass = this._root.device.createRenderPass(info.renderPassInfo);
        }

        let colorTexturesToCreate = colorAttachments.length;
        if (!this._isOffscreen) { colorTexturesToCreate--; } // -1 for swapchain image
        for (let i = 0; i < colorTexturesToCreate; i++) {
            const format = colorAttachments[i].format;
            const colorTex = this._root.device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format,
                width: this._width,
                height: this._height,
                depth: 1,
                arrayLayer: 1,
                mipLevel: 1,
                flags: GFXTextureFlagBit.NONE,
            });
            this._colorTexs.push(colorTex);
        }
        if (this._isOffscreen && depthStencilAttachment) {
            const format = depthStencilAttachment.format;
            this._depthStencilTex = this._root.device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format,
                width: this._width,
                height: this._height,
                depth: 1,
                arrayLayer: 1,
                mipLevel: 1,
                flags: GFXTextureFlagBit.NONE,
            });
        }

        this._framebuffer = this._root.device.createFramebuffer({
            renderPass: this._renderPass,
            colorTextures: this._colorTexs,
            depthStencilTexture: this._depthStencilTex,
            isOffscreen: this._isOffscreen,
        });

        return true;
    }

    public destroy () {
        if (this._depthStencilTex) {
            this._depthStencilTex.destroy();
            this._depthStencilTex = null;
        }

        for (let i = 0; i < this._colorTexs.length; i++) {
            if (this._colorTexs[i]) {
                this._colorTexs[i].destroy();
            }
        }
        this._colorTexs.length = 0;

        if (this._framebuffer) {
            this._framebuffer.destroy();
            this._framebuffer = null;
        }

        if (this._renderPass) {
            this._renderPass.destroy();
            this._renderPass = null;
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

            if (this._depthStencilTex) {
                this._depthStencilTex.resize(width, height);
            }

            for (let i = 0; i < this._colorTexs.length; i++) {
                if (this._colorTexs[i]) {
                    this._colorTexs[i].resize(width, height);
                }
            }

            if (this._framebuffer && this._framebuffer.isOffscreen) {
                this._framebuffer.destroy();
                this._framebuffer.initialize({
                    renderPass: this._renderPass!,
                    colorTextures: this._colorTexs,
                    depthStencilTexture: this._depthStencilTex!,
                });
            }
        }
    }
}
