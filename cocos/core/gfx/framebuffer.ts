/**
 * @packageDocumentation
 * @module gfx
 */

import { Device } from './device';
import { RenderPass } from './render-pass';
import { Texture } from './texture';
import { Obj, ObjectType } from './define';

export class FramebufferInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public renderPass: RenderPass,
        public colorTextures: (Texture | null)[] = [], // pass null to use swapchain buffers
        public depthStencilTexture: Texture | null = null,
        public colorMipmapLevels: number[] = [],
        public depStencilMipmapLevel: number = 0,
    ) {}
}

/**
 * @en GFX frame buffer.
 * @zh GFX 帧缓冲。
 */
export abstract class Framebuffer extends Obj {

    /**
     * @en Get current render pass.
     * @zh GFX 渲染过程。
     */
    public get renderPass (): RenderPass {
        return this._renderPass!;
    }

    /**
     * @en Get current color views.
     * @zh 颜色纹理视图数组。
     */
    public get colorTextures (): (Texture | null)[] {
        return this._colorTextures;
    }

    /**
     * @en Get current depth stencil views.
     * @zh 深度模板纹理视图。
     */
    public get depthStencilTexture (): Texture | null {
        return this._depthStencilTexture;
    }

    protected _device: Device;

    protected _renderPass: RenderPass | null = null;

    protected _colorTextures: (Texture | null)[] = [];

    protected _depthStencilTexture: Texture | null = null;

    constructor (device: Device) {
        super(ObjectType.FRAMEBUFFER);
        this._device = device;
    }

    public abstract initialize (info: FramebufferInfo): boolean;

    public abstract destroy (): void;
}
