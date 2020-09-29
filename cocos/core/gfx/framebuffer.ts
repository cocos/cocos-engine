/**
 * @category gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXRenderPass } from './render-pass';
import { GFXTexture } from './texture';

export interface IGFXFramebufferInfo {
    renderPass: GFXRenderPass;
    colorTextures: (GFXTexture | null)[]; // pass null to use swapchain buffers
    depthStencilTexture: GFXTexture | null;
    colorMipmapLevels?: number[];
    depStencilMipmapLevel?: number;
}

/**
 * @en GFX frame buffer.
 * @zh GFX 帧缓冲。
 */
export abstract class GFXFramebuffer extends GFXObject {

    /**
     * @en Get current render pass.
     * @zh GFX 渲染过程。
     */
    public get renderPass (): GFXRenderPass {
        return this._renderPass!;
    }

    /**
     * @en Get current color views.
     * @zh 颜色纹理视图数组。
     */
    public get colorTextures (): (GFXTexture | null)[] {
        return this._colorTextures;
    }

    /**
     * @en Get current depth stencil views.
     * @zh 深度模板纹理视图。
     */
    public get depthStencilTexture (): GFXTexture | null {
        return this._depthStencilTexture;
    }

    protected _device: GFXDevice;

    protected _renderPass: GFXRenderPass | null = null;

    protected _colorTextures: (GFXTexture | null)[] = [];

    protected _depthStencilTexture: GFXTexture | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.FRAMEBUFFER);
        this._device = device;
    }

    public abstract initialize (info: IGFXFramebufferInfo): boolean;

    public abstract destroy (): void;
}
