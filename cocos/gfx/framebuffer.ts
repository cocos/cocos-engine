/**
 * @category gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXRenderPass } from './render-pass';
import { GFXTextureView } from './texture-view';

/**
 * @zh
 * GFX帧缓冲描述信息。
 */
export interface IGFXFramebufferInfo {
    renderPass: GFXRenderPass;
    colorViews: GFXTextureView[];
    depthStencilView: GFXTextureView | null;
    isOffscreen?: boolean;
}

/**
 * @zh
 * GFX帧缓冲。
 */
export abstract class GFXFramebuffer extends GFXObject {

    /**
     * @zh
     * GFX渲染过程。
     */
    public get renderPass (): GFXRenderPass | null {
        return this._renderPass;
    }

    /**
     * @zh
     * 颜色纹理视图数组。
     */
    public get colorViews (): GFXTextureView[] {
        return this._colorViews;
    }

    /**
     * @zh
     * 深度模板纹理视图。
     */
    public get depthStencilView (): GFXTextureView | null {
        return this._depthStencilView;
    }

    /**
     * @zh
     * 是否是离屏的。
     */
    public get isOffscreen (): boolean {
        return this._isOffscreen;
    }

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * GFX渲染过程。
     */
    protected _renderPass: GFXRenderPass | null = null;

    /**
     * @zh
     * 颜色纹理视图数组。
     */
    protected _colorViews: GFXTextureView[] = [];

    /**
     * @zh
     * 深度模板纹理视图。
     */
    protected _depthStencilView: GFXTextureView | null = null;

    /**
     * @zh
     * 是否是离屏的。
     */
    protected _isOffscreen: boolean = true;

    /**
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.FRAMEBUFFER);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX帧缓冲描述信息。
     */
    public abstract initialize (info: IGFXFramebufferInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy (): void;
}
