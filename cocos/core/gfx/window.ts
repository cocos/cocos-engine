/**
 * @category gfx
 */

import { GFXFormat, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXRenderPass } from './render-pass';
import { GFXTexture } from './texture';

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
 * @en GFX window.
 * @zh GFX 窗口。
 */
export abstract class GFXWindow extends GFXObject {

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
     * @en Get window color format.
     * @zh 窗口颜色格式。
     */
    get colorFormat (): GFXFormat {
        return this._colorFmt;
    }

    /**
     * @en Get window depth stencil format.
     * @zh 窗口深度模板格式。
     */
    get detphStencilFormat (): GFXFormat {
        return this._depthStencilFmt;
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
    get colorTexture (): GFXTexture | null {
        return this._colorTex;
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
    protected _depthStencilTex: GFXTexture | null = null;
    protected _framebuffer: GFXFramebuffer | null = null;

    constructor (device: GFXDevice) {
        super(GFXObjectType.WINDOW);
        this._device = device;
    }

    public abstract initialize (info: IGFXWindowInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Resize window.
     * @zh 重置窗口大小。
     * @param width The new width.
     * @param height The new height.
     */
    public abstract resize (width: number, height: number): void;
}
