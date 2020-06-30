import {
    GFXTextureFlagBit,
    GFXTextureType,
    GFXTextureUsageBit,
} from '../gfx/define';
import { GFXRenderPass, GFXTexture, GFXFramebuffer } from '../gfx';
import { Root } from '../root';
import { PipelineGlobal } from './global';
import { RenderPassStage } from './define';

export interface IRenderWindowInfo {
    title?: string;
    width: number;
    height: number;
    swapchainBufferIndices?: number;
}

interface IFramebufferResources {
    renderPass: GFXRenderPass;
    colorTextures: (GFXTexture | null)[];
    depthStencilTexture: GFXTexture | null;
    framebuffer: GFXFramebuffer;
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
        const renderPass = PipelineGlobal.root.pipeline.getRenderPass(RenderPassStage.DEFAULT)!;
        return this.getFramebuffer(renderPass);
    }

    public static registerCreateFunc (root: Root) {
        root._createWindowFun = (_root: Root): RenderWindow => new RenderWindow(_root);
    }

    protected _title: string = '';
    protected _width: number = 1;
    protected _height: number = 1;
    protected _nativeWidth: number = 1;
    protected _nativeHeight: number = 1;
    protected _framebuffers = new Map<number, IFramebufferResources>();
    protected _swapchainBufferIndices = 0;

    private constructor (root: Root) {
    }

    public initialize (info: IRenderWindowInfo): boolean {
        if (info.title !== undefined) {
            this._title = info.title;
        }

        if (info.swapchainBufferIndices !== undefined) {
            this._swapchainBufferIndices = info.swapchainBufferIndices;
        }

        this._width = info.width;
        this._height = info.height;
        this._nativeWidth = this._width;
        this._nativeHeight = this._height;

        return true;
    }

    public destroy () {
        const it = this._framebuffers.values();
        let res = it.next();
        while (!res.done) {
            const fbResources = res.value;

            if (fbResources.depthStencilTexture) {
                fbResources.depthStencilTexture.destroy();
            }

            for (let i = 0; i < fbResources.colorTextures.length; i++) {
                const colorTexture = fbResources.colorTextures[i];
                if (colorTexture) {
                    colorTexture.destroy();
                }
            }

            if (fbResources.framebuffer) {
                fbResources.framebuffer.destroy();
            }

            res = it.next();
        }
        this._framebuffers.clear();
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

            const it = this._framebuffers.values();
            let res = it.next();
            while (!res.done) {
                const fbResources = res.value;
                let needRebuild = false;

                if (fbResources.depthStencilTexture) {
                    fbResources.depthStencilTexture.resize(width, height);
                    needRebuild = true;
                }

                for (let i = 0; i < fbResources.colorTextures.length; i++) {
                    const colorTex = fbResources.colorTextures[i];
                    if (colorTex) {
                        colorTex.resize(width, height);
                        needRebuild = true;
                    }
                }

                if (needRebuild) {
                    fbResources.framebuffer.destroy();
                    fbResources.framebuffer.initialize({
                        renderPass: fbResources.renderPass,
                        colorTextures: fbResources.colorTextures,
                        depthStencilTexture: fbResources.depthStencilTexture,
                    });
                }

                res = it.next();
            }
        }
    }

    /**
     * Get the framebuffer for specified render pass
     * @param renderPass Target render pass
     * @param swapchainBufferIndices Bitwise mask specifying which attachment would use swapchain buffer.
     */
    public getFramebuffer (renderPass: GFXRenderPass, swapchainBufferIndices?: number) {
        if (swapchainBufferIndices === undefined) { swapchainBufferIndices = this._swapchainBufferIndices; }

        const hash = renderPass.hash ^ swapchainBufferIndices;
        let res = this._framebuffers.get(hash);
        if (res) { return res.framebuffer; }

        const colorAttachmentCount = renderPass.colorAttachments.length;
        const device = PipelineGlobal.root.device;
        res = {
            renderPass,
            colorTextures: [],
            depthStencilTexture: null,
            framebuffer: null!
        };

        for (let i = 0; i < colorAttachmentCount; i++) {
            let colorTex: GFXTexture | null = null;
            if (!(swapchainBufferIndices & (1 << i))) {
                colorTex = device.createTexture({
                    type: GFXTextureType.TEX2D,
                    usage: GFXTextureUsageBit.COLOR_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                    format: renderPass.colorAttachments[i].format || device.colorFormat,
                    width: this._width,
                    height: this._height,
                    depth: 1,
                    arrayLayer: 1,
                    mipLevel: 1,
                    flags: GFXTextureFlagBit.NONE,
                });
            }
            res.colorTextures.push(colorTex);
        }

        // Use the sign bit to indicate depth attachment
        if (renderPass.depthStencilAttachment && swapchainBufferIndices >= 0) {
            res.depthStencilTexture = device.createTexture({
                type: GFXTextureType.TEX2D,
                usage: GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT | GFXTextureUsageBit.SAMPLED,
                format: renderPass.depthStencilAttachment.format || device.depthStencilFormat,
                width: this._width,
                height: this._height,
                depth: 1,
                arrayLayer: 1,
                mipLevel: 1,
                flags: GFXTextureFlagBit.NONE,
            });
        }

        res.framebuffer = device.createFramebuffer({
            renderPass,
            colorTextures: res.colorTextures,
            depthStencilTexture: res.depthStencilTexture,
        });

        this._framebuffers.set(hash, res);
        return res.framebuffer;
    }
}
