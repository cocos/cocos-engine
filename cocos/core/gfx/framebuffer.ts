/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXRenderPass } from './render-pass';
import { GFXTexture } from './texture';

export class GFXFramebufferInfo {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public renderPass: GFXRenderPass,
        public colorTextures: (GFXTexture | null)[] = [], // pass null to use swapchain buffers
        public depthStencilTexture: GFXTexture | null = null,
        public colorMipmapLevels: number[] = [],
        public depStencilMipmapLevel: number = 0,
    ) {}
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

    public abstract initialize (info: GFXFramebufferInfo): boolean;

    public abstract destroy (): void;
}
