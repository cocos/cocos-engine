/**
 * @category gfx
 */

import { GFXFormat, GFXObject, GFXObjectType, GFXStatus } from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXRenderPass } from './render-pass';
import { GFXTexture } from './texture';
import { GFXTextureView } from './texture-view';

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
    public get width (): number {
        return this._width;
    }

    /**
     * @en Get window height.
     * @zh 窗口高度。
     */
    public get height (): number {
        return this._height;
    }

    /**
     * @en Get window color format.
     * @zh 窗口颜色格式。
     */
    public get colorFormat (): GFXFormat {
        return this._colorFmt;
    }

    /**
     * @en Get window depth stencil format.
     * @zh 窗口深度模板格式。
     */
    public get detphStencilFormat (): GFXFormat {
        return this._depthStencilFmt;
    }

    /**
     * @en Is this window offscreen?
     * @zh 是否是离屏的。
     */
    public get isOffscreen (): boolean {
        return this._isOffscreen;
    }

    /**
     * @en Get the render pass of this window.
     * @zh GFX 渲染过程。
     */
    public get renderPass (): GFXRenderPass {
        return this._renderPass!;
    }

    /**
     * @en Get color texture view of this window.
     * @zh 颜色纹理视图。
     */
    public get colorTexView (): GFXTextureView | null {
        return this._colorTexView;
    }

    /**
     * @en Get depth stencil texture view of this window.
     * @zh 深度模板纹理视图。
     */
    public get depthStencilTexView (): GFXTextureView | null {
        return this._depthStencilTexView;
    }

    /**
     * @en Get window frame buffer.
     * @zh GFX帧缓冲。
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

    constructor (device: GFXDevice) {
        super(GFXObjectType.WINDOW);
        this._device = device;
    }

    public initialize (info: IGFXWindowInfo) {
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
        this._colorFmt = info.colorFmt;
        this._depthStencilFmt = info.depthStencilFmt;

        if (this._initialize(info)) { this._status = GFXStatus.SUCCESS; return true; }
        else { this._status = GFXStatus.FAILED; return false; }
    }

    public destroy () {
        if (this._status !== GFXStatus.SUCCESS) { return; }
        this._destroy();
        this._status = GFXStatus.UNREADY;
    }

    public resize (width: number, height: number) {
        this._width = width;
        this._height = height;
        this._resize(width, height);
        if (width > this._nativeWidth ||
            height > this._nativeHeight) {
            this._nativeWidth = width;
            this._nativeHeight = height;
        }
    }

    protected abstract _initialize (info: IGFXWindowInfo): boolean;

    protected abstract _destroy (): void;

    /**
     * @en Resize window.
     * @zh 重置窗口大小。
     * @param width The new width.
     * @param height The new height.
     */
    protected abstract _resize (width: number, height: number): void;
}
