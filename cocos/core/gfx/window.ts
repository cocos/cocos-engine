/**
 * @category gfx
 */

import { GFXFormat, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXRenderPass } from './render-pass';
import { GFXTexture } from './texture';
import { GFXTextureView } from './texture-view';

/**
 * @zh
 * GFX窗口描述信息。
 */
export interface IGFXWindowInfo {
    title?: string;
    left?: number;
    top?: number;
    width: number;
    height: number;
    colorFmt: GFXFormat;
    depthStencilFmt: GFXFormat;
    isOffscreen?: boolean;
}

/**
 * @zh
 * GFX窗口。
 */
export abstract class GFXWindow extends GFXObject {

    /**
     * @zh
     * 窗口宽度。
     */
    public get width (): number {
        return this._width;
    }

    /**
     * @zh
     * 窗口高度。
     */
    public get height (): number {
        return this._height;
    }

    /**
     * @zh
     * 窗口颜色格式。
     */
    public get colorFormat (): GFXFormat {
        return this._colorFmt;
    }

    /**
     * @zh
     * 窗口深度模板格式。
     */
    public get detphStencilFormat (): GFXFormat {
        return this._depthStencilFmt;
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
     * GFX渲染过程。
     */
    public get renderPass (): GFXRenderPass {
        return this._renderPass!;
    }

    /**
     * @zh
     * 颜色纹理视图。
     */
    public get colorTexView (): GFXTextureView | null {
        return this._colorTexView;
    }

    /**
     * @zh
     * 深度模板纹理视图。
     */
    public get depthStencilTexView (): GFXTextureView | null {
        return this._depthStencilTexView;
    }

    /**
     * @zh
     * GFX帧缓冲。
     */
    public get framebuffer (): GFXFramebuffer {
        return this._framebuffer!;
    }

    protected _device: GFXDevice;
    protected _title: string = '';
    protected _left: number = 0;
    protected _top: number = 0;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _nativeWidth: number = 0;
    protected _nativeHeight: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _isOffscreen: boolean = false;
    protected _renderPass: GFXRenderPass | null = null;
    protected _colorTex: GFXTexture | null = null;
    protected _colorTexView: GFXTextureView | null = null;
    protected _depthStencilTex: GFXTexture | null = null;
    protected _depthStencilTexView: GFXTextureView | null = null;
    protected _framebuffer: GFXFramebuffer | null = null;

    /**
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.WINDOW);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数。
     * @param info GFX窗口描述信息。
     */
    public abstract initialize (info: IGFXWindowInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy ();

    /**
     * @zh
     * 重置窗口大小。
     * @param width 窗口宽度。
     * @param height 窗口高度。
     */
    public abstract resize (width: number, height: number);
}
