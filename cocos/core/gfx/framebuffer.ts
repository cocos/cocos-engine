/**
 * @category gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXRenderPass } from './render-pass';
import { GFXTextureView } from './texture-view';

export interface IGFXFramebufferInfo {
    renderPass: GFXRenderPass;
    colorViews: GFXTextureView[];
    depthStencilView: GFXTextureView | null;
    isOffscreen?: boolean;
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
    public get renderPass (): GFXRenderPass | null {
        return this._renderPass;
    }

    /**
     * @en Get current color views.
     * @zh 颜色纹理视图数组。
     */
    public get colorViews (): GFXTextureView[] {
        return this._colorViews;
    }

    /**
     * @en Get current depth stencil views.
     * @zh 深度模板纹理视图。
     */
    public get depthStencilView (): GFXTextureView | null {
        return this._depthStencilView;
    }

    /**
     * @en Is this frame buffer offscreen?
     * @zh 是否是离屏的。
     */
    public get isOffscreen (): boolean {
        return this._isOffscreen;
    }

    protected _device: GFXDevice;

    protected _renderPass: GFXRenderPass | null = null;

    protected _colorViews: GFXTextureView[] = [];

    protected _depthStencilView: GFXTextureView | null = null;

    protected _isOffscreen: boolean = true;

    constructor (device: GFXDevice) {
        super(GFXObjectType.FRAMEBUFFER);
        this._device = device;
    }

    public abstract initialize (info: IGFXFramebufferInfo): boolean;

    public abstract destroy (): void;
}
